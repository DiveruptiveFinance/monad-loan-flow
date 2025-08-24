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
const contract = new ethers.Contract("0x50c08D341E546463E8A3A86A29Ae3879c9d8e580", contractAbiFile.abi, signer);

/**
 * Endpoint para verificar si un usuario ya está verificado
 */
app.post("/api/check-verification", async (req, res) => {
  const { userAddress } = req.body;

  if (!ethers.isAddress(userAddress)) {
    return res.status(400).json({ error: "Dirección inválida" });
  }

  try {
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
 */
app.post("/api/init-loan", async (req, res) => {
  const { userAddress } = req.body;

  if (!ethers.isAddress(userAddress)) {
    return res.status(400).json({ error: "Dirección inválida" });
  }

  try {
    // First, verify the user
    console.log(`Verifying user: ${userAddress}`);
    const verifyTx = await contract.verifyUser(userAddress);
    await verifyTx.wait();
    console.log(`User ${userAddress} verified successfully`);

    // Then, assign maximum amount for loan
    const amountToAssign = ethers.parseEther("10"); // 10 ether for new users
    console.log(`Assigning ${ethers.formatEther(amountToAssign)} ether to user ${userAddress}`);
    const loanTx = await contract.assignMaximumAmountForLoan(userAddress, amountToAssign);
    await loanTx.wait();
    console.log(`Loan amount assigned successfully`);

    res.json({ success: true, txHash: loanTx.hash });
  } catch (error) {
    console.error('Error in loan initialization:', error);
    res.status(500).json({ error: "Error al inicializar préstamo" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Backend corriendo en http://localhost:${PORT}`));
