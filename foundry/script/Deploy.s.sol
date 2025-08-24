// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {LoanadLendingMarket} from "../contracts/LoanadLendingMarket.sol";

contract DeployLoanadLendingMarket is Script {
    function run() external {
        vm.startBroadcast();
        
        LoanadLendingMarket loanadLendingMarket = new LoanadLendingMarket{value: 1 ether}();
        console.log("LoanadLendingMarket deployed to: ", address(loanadLendingMarket));
        
        vm.stopBroadcast();
    }
}
