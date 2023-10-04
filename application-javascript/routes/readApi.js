//routes for healthLocker create and delete
const express = require('express');
const router = express.Router();
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, GetObjectCommand} = require('@aws-sdk/client-s3')


const { readRecord } = require('./helperFunctions.js')

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  
  const myBucket = process.env.AWS_BUCKET_NAME;

router.get('/:recipientId/readRecord/:userId/:salt', async (req, res) => {
    try {
        const id1 = req.params.userId;
        const id2 = req.params.recipientId;
        const salt = req.params.salt;

        let { clientName, org, msp, department } = req.user;
        const result = await readRecord(clientName, org, msp, department, id1, id2, salt);
        if (clientName !== id2) {
            return res.status(403).json({ error: 'Access forbidden' });
        }

        let response = JSON.parse(result);

        const command = new GetObjectCommand({
            Bucket: myBucket,
            Key: response.key,
        })
        const url = await getSignedUrl(s3, command);

        response.url = url;
        res.status(200).json({ response: response });
    } catch (error) {
        console.error(`Failed to invoke chaincode getHealthRecord function: ${error}`);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;