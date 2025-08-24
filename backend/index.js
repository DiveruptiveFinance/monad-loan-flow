require("dotenv").config();
const express = require("express");
const { ethers } = require("ethers");
const contractAbiFile = require("./abi/LoanadLendingMarket.json");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
// Smart Contract: LoanadLendingMarket
// Address: 0x7F5653D022E2084CD227b74920f88a407a40feA5
// Function Selectors:
// - 0xd117fc99 -> getVerifiedUser(address)
// - 0x753008b1 -> assignMaximumAmountForLoan(address)  
// - 0x4d813120 -> verifyUser(address)
const contract = new ethers.Contract("0x7F5653D022E2084CD227b74920f88a407a40feA5", contractAbiFile.abi, signer);

/**
 * Endpoint para verificar si un usuario ya está verificado
 * Function selector: 0xd117fc99 -> getVerifiedUser(address)
 */
app.post("/api/check-verification", async (req, res) => {
  const { userAddress } = req.body;

  if (!ethers.isAddress(userAddress)) {
    return res.status(400).json({ error: "Dirección inválida" });
  }

  try {
    console.log(`Checking verification for user: ${userAddress}`);
    console.log(`Calling getVerifiedUser with selector: 0xd117fc99`);
    
    const isVerified = await contract.getVerifiedUser(userAddress);
    console.log(`User ${userAddress} verification status:`, isVerified);
    
    res.json({ 
      success: true, 
      isVerified: isVerified 
    });
  } catch (error) {
    console.error('Error checking verification:', error);
    res.status(500).json({ error: "Error al verificar usuario" });
  }
});

/**
 * Endpoint para inicializar préstamo para un nuevo usuario
 * Este endpoint llama a assignMaximumAmountForLoan usando la cuenta del owner
 * Function selector: 0x753008b1 -> assignMaximumAmountForLoan(address)
 * Nota: La función del contrato ya hardcodea 10 ETH y llama a verifyUser internamente
 */
app.post("/api/init-loan", async (req, res) => {
  const { userAddress } = req.body;

  if (!ethers.isAddress(userAddress)) {
    return res.status(400).json({ 
      success: false, 
      error: "Dirección inválida" 
    });
  }

  try {
    console.log(`\n=== INIT LOAN PROCESS STARTED ===`);
    console.log(`Target user: ${userAddress}`);
    console.log(`Owner calling from: ${signer.address}`);
    console.log(`Contract address: 0x7F5653D022E2084CD227b74920f88a407a40feA5`);

    // Call assignMaximumAmountForLoan - this function already:
    // 1. Assigns 10 ETH to the user (hardcoded in contract)
    // 2. Calls verifyUser internally
    console.log(`\nCalling assignMaximumAmountForLoan with selector: 0x753008b1`);
    console.log(`This will assign 10 ETH and verify the user automatically`);
    
    const assignTx = await contract.assignMaximumAmountForLoan(userAddress);
    console.log(`Transaction sent: ${assignTx.hash}`);
    
    const assignReceipt = await assignTx.wait();
    console.log(`Transaction confirmed in block: ${assignReceipt.blockNumber}`);

    console.log(`\n=== INIT LOAN PROCESS COMPLETED ===`);
    console.log(`User ${userAddress} now has 10 ETH assigned and is verified`);

    res.json({ 
      success: true, 
      txHash: assignTx.hash,
      message: "10 ETH asignados y usuario verificado exitosamente",
      details: "La función assignMaximumAmountForLoan asignó 10 ETH y verificó al usuario automáticamente"
    });
  } catch (error) {
    console.error('\n=== ERROR IN LOAN INITIALIZATION ===');
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    
    res.status(500).json({ 
      success: false,
      error: "Error al inicializar préstamo",
      details: error.message 
    });
  }
});

/**
 * Endpoint para obtener el monto máximo de préstamo para un usuario
 * Function selector: 0xe3fede90 -> getMaximumAmountForLoan(address)
 */
app.post("/api/get-max-amount", async (req, res) => {
  const { userAddress } = req.body;

  if (!ethers.isAddress(userAddress)) {
    return res.status(400).json({ error: "Dirección inválida" });
  }

  try {
    console.log(`Getting max amount for user: ${userAddress}`);
    console.log(`Calling getMaximumAmountForLoan with selector: 0xe3fede90`);
    
    const maxAmount = await contract.getMaximumAmountForLoan(userAddress);
    console.log(`User ${userAddress} max amount:`, maxAmount.toString());
    
    res.json({ 
      success: true, 
      maxAmount: maxAmount.toString()
    });
  } catch (error) {
    console.error('Error getting max amount:', error);
    res.status(500).json({ error: "Error al obtener monto máximo" });
  }
});

/**
 * Endpoint para obtener el total de préstamos
 * Function selector: 0x833be5d5 -> getTotalLoans()
 */
app.get("/api/get-total-loans", async (req, res) => {
  try {
    console.log(`Getting total loans`);
    console.log(`Calling getTotalLoans with selector: 0x833be5d5`);
    
    const totalLoans = await contract.getTotalLoans();
    console.log(`Total loans:`, totalLoans.toString());
    
    res.json({ 
      success: true, 
      totalLoans: totalLoans.toString()
    });
  } catch (error) {
    console.error('Error getting total loans:', error);
    res.status(500).json({ error: "Error al obtener total de préstamos" });
  }
});

/**
 * Endpoint para obtener los IDs de préstamos activos
 * Function selector: 0xcb476b6b -> getActiveLoanIds()
 */
app.get("/api/get-active-loan-ids", async (req, res) => {
  try {
    console.log(`Getting active loan IDs`);
    console.log(`Calling getActiveLoanIds with selector: 0xcb476b6b`);
    
    const activeLoanIds = await contract.getActiveLoanIds();
    console.log(`Active loan IDs:`, activeLoanIds.map(id => id.toString()));
    
    res.json({ 
      success: true, 
      activeLoanIds: activeLoanIds.map(id => id.toString())
    });
  } catch (error) {
    console.error('Error getting active loan IDs:', error);
    res.status(500).json({ error: "Error al obtener IDs de préstamos activos" });
  }
});

/**
 * Endpoint para obtener el prestatario de un préstamo
 * Function selector: 0x3ef0a2f7 -> getLoanBorrower(uint256)
 */
app.post("/api/get-loan-borrower", async (req, res) => {
  const { loanId } = req.body;

  if (!loanId || isNaN(parseInt(loanId))) {
    return res.status(400).json({ error: "ID de préstamo inválido" });
  }

  try {
    console.log(`Getting borrower for loan: ${loanId}`);
    console.log(`Calling getLoanBorrower with selector: 0x3ef0a2f7`);
    
    const borrower = await contract.getLoanBorrower(loanId);
    console.log(`Loan ${loanId} borrower:`, borrower);
    
    res.json({ 
      success: true, 
      borrower: borrower
    });
  } catch (error) {
    console.error('Error getting loan borrower:', error);
    res.status(500).json({ error: "Error al obtener prestatario del préstamo" });
  }
});

/**
 * Endpoint para obtener el colateral de un préstamo
 * Function selector: 0x010d5730 -> getLoanCollateral(uint256)
 */
app.post("/api/get-loan-collateral", async (req, res) => {
  const { loanId } = req.body;

  if (!loanId || isNaN(parseInt(loanId))) {
    return res.status(400).json({ error: "ID de préstamo inválido" });
  }

  try {
    console.log(`Getting collateral for loan: ${loanId}`);
    console.log(`Calling getLoanCollateral with selector: 0x010d5730`);
    
    const collateral = await contract.getLoanCollateral(loanId);
    console.log(`Loan ${loanId} collateral:`, collateral.toString());
    
    res.json({ 
      success: true, 
      collateral: collateral.toString()
    });
  } catch (error) {
    console.error('Error getting loan collateral:', error);
    res.status(500).json({ error: "Error al obtener colateral del préstamo" });
  }
});

/**
 * Endpoint para retirar colateral de un préstamo
 * Function selector: 0x1e7b5766 -> withdrawForCrowfundedLoan(uint256,uint256)
 */
app.post("/api/withdraw-collateral", async (req, res) => {
  const { userAddress, amount, loanId } = req.body;

  if (!ethers.isAddress(userAddress)) {
    return res.status(400).json({ error: "Dirección de usuario inválida" });
  }

  if (!amount || isNaN(parseInt(amount))) {
    return res.status(400).json({ error: "Monto inválido" });
  }

  if (!loanId || isNaN(parseInt(loanId))) {
    return res.status(400).json({ error: "ID de préstamo inválido" });
  }

  try {
    console.log(`Withdrawing collateral for user: ${userAddress}`);
    console.log(`Amount: ${amount}, Loan ID: ${loanId}`);
    console.log(`Calling withdrawForCrowfundedLoan with selector: 0x1e7b5766`);
    
    const withdrawTx = await contract.withdrawForCrowfundedLoan(amount, loanId);
    console.log(`Withdraw transaction sent: ${withdrawTx.hash}`);
    
    const withdrawReceipt = await withdrawTx.wait();
    console.log(`Withdraw transaction confirmed in block: ${withdrawReceipt.blockNumber}`);
    
    res.json({ 
      success: true, 
      txHash: withdrawTx.hash,
      message: "Colateral retirado exitosamente"
    });
  } catch (error) {
    console.error('Error withdrawing collateral:', error);
    res.status(500).json({ error: "Error al retirar colateral", details: error.message });
  }
});

/**
 * Endpoint para pagar MON y reducir deuda
 * Function selector: 0x3d263c33 -> repayMON()
 */
app.post("/api/repay-mon", async (req, res) => {
  const { userAddress } = req.body;

  if (!ethers.isAddress(userAddress)) {
    return res.status(400).json({ error: "Dirección de usuario inválida" });
  }

  try {
    console.log(`Repaying MON for user: ${userAddress}`);
    console.log(`Calling repayMON with selector: 0x3d263c33`);
    
    const repayTx = await contract.repayMON();
    console.log(`Repay transaction sent: ${repayTx.hash}`);
    
    const repayReceipt = await repayTx.wait();
    console.log(`Repay transaction confirmed in block: ${repayReceipt.blockNumber}`);
    
    res.json({ 
      success: true, 
      txHash: repayTx.hash,
      message: "MON pagado exitosamente"
    });
  } catch (error) {
    console.error('Error repaying MON:', error);
    res.status(500).json({ error: "Error al pagar MON", details: error.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Backend corriendo en http://localhost:${PORT}`));
