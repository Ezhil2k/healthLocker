//routes for healthLocker create and delete
const express = require('express');
const router = express.Router();

const {createHealthLocker, deleteHealthLocker} = require('./helperFunctions.js')

router.post('/:userId/createLocker/:lockerId', async (req, res) => {
    try {
    /*
    const { encryptedData } = req.body;
    const privateKey = process.env.PRIVATE_KEY;
    const decryptedData = decryptWithPrivateKey(encryptedData, privateKey);
    const { arg} = JSON.parse(decryptedData);
    */
      const arg = req.body.arg || [];
      let { clientName, org, msp, department } = req.user;
  
      if (clientName !== arg.userId) {
        return res.status(403).json({ error: 'Access forbidden' });
      }
  
      const result = await createHealthLocker(clientName, org, msp, department, arg);

      let response = result.toString();
      res.status(200).json({ response: response });
    } catch (error) {
      console.error(`Failed to invoke chaincode createUser function: ${error}`);
      res.status(500).json({ error: error.message });
    }
});

router.delete('/:userId/deleteLocker/:lockerId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const lockerId = req.params.lockerId;
     /*
        const { encryptedData } = req.params.userId;
        const privateKey = process.env.PRIVATE_KEY;
        const decryptedData = decryptWithPrivateKey(encryptedData, privateKey);
        const { userId} = JSON.parse(decryptedData);
      */
    let { clientName, org, msp, department } = req.user;
    if (clientName !== userId) {
      return res.status(403).json({ error: 'Access forbidden' });
    }
    const result = await deleteHealthLocker(clientName, org, msp, department, lockerId);
    let response = result.toString();
    res.status(200).json({ response: response });
  } catch (error) {
    console.error(`Failed to invoke chaincode deleteUser function: ${error}`);
    res.status(500).json({ error: error.message });
  }
}); 

module.exports = router;