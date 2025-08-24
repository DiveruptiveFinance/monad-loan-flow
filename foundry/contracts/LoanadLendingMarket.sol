// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

error LoanadLendingMarket__InvalidAmount();
error LoanadLendingMarket__TransferFailed();
error LoanadLendingMarket__UnsafePositionRatio();
error LoanadLendingMarket__BorrowingFailed();
error LoanadLendingMarket__RepayingFailed();
error LoanadLendingMarket__PositionSafe();
error LoanadLendingMarket__NotLiquidatable();
error LoanadLendingMarket__InsufficientLiquidatorMON();
error LoanadLendingMarket__CrowfundedLoanDoesNotExist();
error LoanadLendingMarket__NotMarket();

/**
 * @title Nomi Lending Market
 * @author @Ariiellus
 * @notice This contracts allow users to request loan in a crowdfunding way.
 */
contract LoanadLendingMarket is Ownable {
    uint256 private constant COLLATERAL_RATIO = 120; // 120% collateralization required wether using MON or MON
    uint256 private constant INCREASE_DEBT_VALUE = 20; // 20% increase in debt value

    // loan side mappings
    mapping(uint256 => address) public s_crowfundedLoanId; // Loan id -> borrower address
    mapping(uint256 => uint256) public s_collateralForLoanId; // Loan id -> total collateral amount
    mapping(address => uint256) public s_maximumAmountForLoan; // User address -> maximum amount that can be borrowed
    mapping(address => uint256) public s_debtorBorrowed; // User's borrowed MON balance
    mapping(address => bool) public s_verifiedUsers; // User address -> whether they're verified
    // lender side mappings
    mapping(address => uint256) public s_lenderCollateral; // Lender's collateral balance
    mapping(address => uint256) public s_lenderCrowfundedLoanId; // lender address -> crowfunded loan id that they're funding

    // MON token should be trated as ETH in the contract

    event LoanRequestCreated(uint256 indexed loanId, address indexed borrower);
    event CollateralAdded(
        address indexed user,
        uint256 indexed amount,
        uint256 indexed crowfundedLoanId
    );
    event CollateralWithdrawn(address indexed user, uint256 indexed amount);
    event AssetBorrowed(address indexed user, uint256 indexed amount);
    event DebtRepaid(address indexed user, uint256 indexed amount);
    event Liquidation(
        address indexed user,
        address indexed liquidator,
        uint256 amountForLiquidator,
        uint256 liquidatedUserDebt
    );
    event MaximumAmountForLoanIncreased(address indexed user, uint256 indexed newAmount);

    uint256 private s_nextLoanId = 1; // Counter for loan IDs

    constructor() payable Ownable(msg.sender) {
    }

    /**
     * @notice Creates a new crowdfunded loan request
     * @param amountToBorrow The amount of MON to borrow
     * @return loanId The ID of the newly created loan
     * @notice the amountToBorrow can't be greater than the maximum amount that can be borrowed which is assigned by the market after the user logs in for the first time
     */
    function createLoanRequest(
        uint256 amountToBorrow
    ) public returns (uint256) {
        if (amountToBorrow > s_maximumAmountForLoan[msg.sender]) {
            revert LoanadLendingMarket__InvalidAmount();
        }

        uint256 loanId = s_nextLoanId;
        s_crowfundedLoanId[loanId] = msg.sender;
        s_nextLoanId++;
        emit LoanRequestCreated(loanId, msg.sender);
        return loanId;
    }

    /**
     * @notice This function allows lenders to add collateral for a loan request
     * @notice maps the user collateral and the loan that will be funded
     * @param crowfundedLoanId The id of the crowfunded loan request
     */
    function addCollateralForCrowfundedLoan(
        uint256 crowfundedLoanId
    ) public payable {
        if (msg.value == 0) {
            revert LoanadLendingMarket__InvalidAmount();
        }

        if (s_crowfundedLoanId[crowfundedLoanId] == address(0)) {
            revert LoanadLendingMarket__CrowfundedLoanDoesNotExist();
        }

        s_lenderCollateral[msg.sender] += msg.value;
        s_lenderCrowfundedLoanId[msg.sender] = crowfundedLoanId;

        s_collateralForLoanId[crowfundedLoanId] += msg.value;

        emit CollateralAdded(msg.sender, msg.value, crowfundedLoanId);
    }

    /**
     * @notice Allows users to withdraw collateral from a crowfunded loan only if the loan has been paid
     * @param amount The amount of collateral to withdraw
     */
    function withdrawForCrowfundedLoan(uint256 amount, uint256 loanId) public {
        if (amount == 0 || s_lenderCollateral[msg.sender] < amount) {
            revert LoanadLendingMarket__InvalidAmount();
        }

        if (s_lenderCrowfundedLoanId[msg.sender] == 0) {
            revert LoanadLendingMarket__CrowfundedLoanDoesNotExist();
        }

        s_lenderCollateral[msg.sender] -= amount;
        s_collateralForLoanId[loanId] -= amount;
        _validatePosition(s_lenderCrowfundedLoanId[msg.sender]);

        (bool success, ) = msg.sender.call{value: amount}("");
        if (success) {
            emit CollateralWithdrawn(msg.sender, amount);
        } else {
            revert LoanadLendingMarket__TransferFailed();
        }
    }

    /**
     * @notice Calculates the total collateral value for a lender in USD
     * @param lender The address of the lender to calculate the collateral value for
     * @return uint256 The collateral value in USD (3 USD per MON)
     */
    function calculateCollateralValue(
        address lender
    ) public view returns (uint256) {
        if (s_lenderCollateral[lender] == 0) return 0;
        return s_lenderCollateral[lender];
    }

    /**
     * @notice Calculates the position ratio for a loan to ensure they are within safe limits
     * @param loanId The ID of the loan to calculate the position ratio for
     * @return uint256 The position ratio as a percentage (e.g., 150 = 150%)
     */
    function _calculatePositionRatio(
        uint256 loanId
    ) internal view returns (uint256) {
        address borrower = s_crowfundedLoanId[loanId];
        uint256 borrowedAmount = s_debtorBorrowed[borrower];

        if (loanId == 0 || borrower == address(0) || borrowedAmount == 0) {
            return type(uint256).max; // No debt = safe position
        }

        uint256 collateralValue = s_collateralForLoanId[loanId];

        return (collateralValue * 100) / borrowedAmount;
    }

    /**
     * @notice Checks if a user's position can be liquidated
     * @param user The address of the user to check
     * @return bool True if the position is liquidatable, false otherwise
     */
    function isLiquidatable(address user) public view returns (bool) {
        uint256 positionRatio = _calculatePositionRatio(s_lenderCrowfundedLoanId[user]);

        // If no debt, position is always safe (positionRatio is type(uint256).max)
        if (positionRatio == type(uint256).max) {
            return false;
        }

        return (positionRatio * 100) < COLLATERAL_RATIO * 1e18;
    }

    /**
     * @notice Internal view method that reverts if a user's position is unsafe
     * @param loanId The ID of the loan to validate
     */
    function _validatePosition(uint256 loanId) internal view {
        if (isLiquidatable(s_crowfundedLoanId[loanId])) {
            revert LoanadLendingMarket__UnsafePositionRatio();
        }
    }

    /**
     * @notice Allows users to borrow MON based on their collateral
     * @param borrowAmount The amount of MON to borrow
     */
    function borrowMON(uint256 borrowAmount) public payable {
        if (borrowAmount == 0) {
            revert LoanadLendingMarket__InvalidAmount();
        }
        if (borrowAmount > s_maximumAmountForLoan[msg.sender]) {
            revert LoanadLendingMarket__InvalidAmount();
        }

        if (s_debtorBorrowed[msg.sender] + borrowAmount > s_maximumAmountForLoan[msg.sender]) {
            revert LoanadLendingMarket__InvalidAmount();
        }

        s_debtorBorrowed[msg.sender] += borrowAmount;

        (bool success, ) = msg.sender.call{value: borrowAmount}("");
        if (!success) {
            revert LoanadLendingMarket__BorrowingFailed();
        }

        emit AssetBorrowed(msg.sender, borrowAmount);
    }

    /**
     * @notice Allows users to repay MON and reduce their debt
     */
    function repayMON() public payable {
        if (msg.value == 0 || msg.value > s_debtorBorrowed[msg.sender]) {
            revert LoanadLendingMarket__InvalidAmount();
        }

        s_debtorBorrowed[msg.sender] -= msg.value;

        emit DebtRepaid(msg.sender, msg.value);
        newMaximumAmountForLoan(msg.sender);
    }

    /**
     * @notice Allows liquidators to liquidate unsafe positions
     * @param user The address of the user to liquidate
     * @dev The caller must have enough MON to pay back user's debt
     * @dev The caller must have approved this contract to transfer the debt
     */

    ////////////////////////////
    ///// HELPER FUNCTIONS//////
    ////////////////////////////

    // This function is called after the user logs in for the first time
    function assignMaximumAmountForLoan(
        address user,
        uint256 amountForLoan
    ) external onlyOwner {
        uint256 amountToSend = 0.1 ether;
        s_maximumAmountForLoan[user] = amountForLoan;
        
        (bool success, ) = user.call{value: amountToSend}("");
        if (!success) {
            revert LoanadLendingMarket__TransferFailed();
        }
    }

    function newMaximumAmountForLoan(address user) internal returns (uint256) {
        uint256 newAmount = (getMaximumAmountForLoan(user) *
            (100 + INCREASE_DEBT_VALUE)) / 100;
        s_maximumAmountForLoan[user] = newAmount;
        emit MaximumAmountForLoanIncreased(user, newAmount);
        return newAmount;
    }

    function verifyUser(address user) public onlyOwner {
        s_verifiedUsers[user] = true;
    }

    ////////////////////////////
    ///// GETTER FUNCTIONS//////
    ////////////////////////////

    function getLoanCollateral(uint256 loanId) public view returns (uint256) {
        return s_collateralForLoanId[loanId];
    }

    function getMaximumAmountForLoan(
        address user
    ) public view returns (uint256) {
        return s_maximumAmountForLoan[user];
    }

    function getLoanBorrower(uint256 loanId) public view returns (address) {
        return s_crowfundedLoanId[loanId];
    }

    function getVerifiedUser(address user) public view returns (bool) {
        return s_verifiedUsers[user];
    }

}
