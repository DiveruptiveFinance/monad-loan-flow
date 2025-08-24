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
// - 0x753008b1 -> assignMaximumAmountForLoan(address)  
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
    console.log(`Contract address: 0xdf45Ed5D1921980D24713043028FE1e004c54A42`);

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Backend corriendo en http://localhost:${PORT}`));
