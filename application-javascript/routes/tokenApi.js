//routes for healthLocker create and delete
const express = require('express');
const router = express.Router();

const { createShareToken, deleteShareToken, getShareToken, updateShareToken } = require('./helperFunctions.js')

router.post('/:userId/:lockerId/:recordId/createToken', async (req, res) => {
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

        const result = await createShareToken(clientName, org, msp, department, arg);

        let response = result.toString();
        res.status(200).json({ response: response });
    } catch (error) {
        console.error(`Failed to invoke chaincode createHealthRecord function: ${error}`);
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:userId/:lockerId/:recordId/deleteToken/:recipientId/:salt', async (req, res) => {
    try {
        const id1 = req.params.userId;
        const id2 = req.params.recipientId;
        const salt = req.params.salt;
        /*
           const { encryptedData } = req.params.userId;
           const privateKey = process.env.PRIVATE_KEY;
           const decryptedData = decryptWithPrivateKey(encryptedData, privateKey);
           const { userId} = JSON.parse(decryptedData);
         */
        let { clientName, org, msp, department } = req.user;
        if (clientName !== id1) {
            return res.status(403).json({ error: 'Access forbidden' });
        }
        const result = await deleteShareToken(clientName, org, msp, department, id1, id2, salt);
        let response = result.toString();
        res.status(200).json({ response: response });
    } catch (error) {
        console.error(`Failed to invoke chaincode deleteHealthRecord function: ${error}`);
        res.status(500).json({ error: error.message });
    }
});

router.patch('/:userId/:lockerId/:recordId/updateToken/:recipientId', async (req, res) => {
    try {
        const arg = req.body.arg || [];
        /*
        const { encryptedData } = req.body.arg;
        const privateKey = process.env.PRIVATE_KEY;
        const decryptedData = decryptWithPrivateKey(encryptedData, privateKey);
        const { arg} = JSON.parse(decryptedData);
       */
        let { clientName, org, msp, department } = req.user;

        if (clientName !== arg.userId) {
            return res.status(403).json({ error: 'Access forbidden' });
        }

        const result = await updateShareToken(clientName, org, msp, department, arg);
        let response = result.toString();
        res.status(200).json({ response: response });
    } catch (error) {
        console.error(`Failed to update user data: ${error}`);
        res.status(500).json({ error: error.message });
    }
});

router.get('/:userId/:lockerId/:recordId/getToken/:recipientId/:salt', async (req, res) => {
    try {
        const id1 = req.params.userId;
        const id2 = req.params.recipientId;
        const salt = req.params.salt;
        /*
            const { encryptedData } = req.params.userId;
            const privateKey = process.env.PRIVATE_KEY;
            const decryptedData = decryptWithPrivateKey(encryptedData, privateKey);
            const { userId} = JSON.parse(decryptedData);
        */
        let { clientName, org, msp, department } = req.user;
        const result = await getShareToken(clientName, org, msp, department, id1, id2, salt);
        // const encryptedData = encryptWithPrivateKey(result, privateKey);
        // let response = encryptedData.toString();
        if (clientName !== id1) {
            return res.status(403).json({ error: 'Access forbidden' });
        }
        
        let response = result.toString();
        res.status(200).json({ response: response });
    } catch (error) {
        console.error(`Failed to invoke chaincode getHealthRecord function: ${error}`);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;