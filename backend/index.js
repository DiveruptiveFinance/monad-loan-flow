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
// Address: 0xdf45Ed5D1921980D24713043028FE1e004c54A42
// Function Selectors:
// - 0xd117fc99 -> getVerifiedUser(address)
// - 0xe1c8b0cb -> assignMaximumAmountForLoan(address,uint256)  
// - 0x4d813120 -> verifyUser(address)
const contract = new ethers.Contract("0xdf45Ed5D1921980D24713043028FE1e004c54A42", contractAbiFile.abi, signer);

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
 * Este endpoint llama a assignMaximumAmountForLoan y luego verifyUser usando la cuenta del owner
 * Function selectors:
 * - 0xe1c8b0cb -> assignMaximumAmountForLoan(address,uint256)
 * - 0x4d813120 -> verifyUser(address)
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
    console.log(`Contract address: 0xdf45Ed5D1921980D24713043028FE1e004c54A42`);

    // Step 1: Assign maximum amount for loan (10 ETH) FIRST
    const amountToAssign = ethers.parseEther("10"); // 10 ETH
    console.log(`\n1. Assigning ${ethers.formatEther(amountToAssign)} ETH to user: ${userAddress}`);
    console.log(`Calling assignMaximumAmountForLoan with selector: 0xe1c8b0cb`);
    
    const assignTx = await contract.assignMaximumAmountForLoan(userAddress, amountToAssign);
    console.log(`Assignment transaction sent: ${assignTx.hash}`);
    
    const assignReceipt = await assignTx.wait();
    console.log(`Assignment transaction confirmed in block: ${assignReceipt.blockNumber}`);

    // Step 2: THEN verify the user using owner's account
    console.log(`\n2. Verifying user: ${userAddress}`);
    console.log(`Calling verifyUser with selector: 0x4d813120`);
    const verifyTx = await contract.verifyUser(userAddress);
    console.log(`Verify transaction sent: ${verifyTx.hash}`);
    
    const verifyReceipt = await verifyTx.wait();
    console.log(`Verify transaction confirmed in block: ${verifyReceipt.blockNumber}`);

    console.log(`\n=== INIT LOAN PROCESS COMPLETED ===`);
    console.log(`User ${userAddress} now has 10 ETH assigned and is verified`);

    res.json({ 
      success: true, 
      txHash: verifyTx.hash,
      message: "10 ETH asignados y usuario verificado exitosamente",
      assignTxHash: assignTx.hash,
      verifyTxHash: verifyTx.hash
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Backend corriendo en http://localhost:${PORT}`));
