//routes for user create and delete
const express = require('express');
const router = express.Router();

const {createUser, deleteUser} = require('./helperFunctions.js')

router.post('/createUser', async (req, res) => {
    try {
    /*
    const { encryptedData } = req.body;
    const privateKey = process.env.PRIVATE_KEY;
    const decryptedData = decryptWithPrivateKey(encryptedData, privateKey);
    const { arg} = JSON.parse(decryptedData);
    */
      const arg = req.body.arg || [];
      let { clientName, org, msp, department } = req.user;// what is this user
  
      if (clientName !== arg.id) {
        return res.status(403).json({ error: 'Access forbidden' });
      }
  
      const result = await createUser(clientName, org, msp, department, arg);

      let response = result.toString();
      res.status(200).json({ response: response });
    } catch (error) {
      console.error(`Failed to invoke chaincode createUser function: ${error}`);
      res.status(500).json({ error: error.message });
    }
});

router.delete('/deleteUser/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
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
    const result = await deleteUser(clientName, org, msp, department, userId);
    let response = result.toString();
    res.status(200).json({ response: response });
  } catch (error) {
    console.error(`Failed to invoke chaincode deleteUser function: ${error}`);
    res.status(500).json({ error: error.message });
  }
}); 

module.exports = router;