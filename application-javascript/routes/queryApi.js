//routes for healthLocker create and delete
const express = require('express');
const router = express.Router();
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3')

const { getHealthRecordByRange, queryHealthRecord, getAllHealthRecord } = require('./helperFunctions.js')

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const myBucket = process.env.AWS_BUCKET_NAME;

router.get('/:userId/:lockerId/recordByRange', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { startKey, endKey } = req.body.arg || [];
    let { clientName, org, msp, department } = req.user;

    if (clientName !== userId) {
      return res.status(403).json({ error: 'Access forbidden' });
    }

    const result = await getHealthRecordByRange(clientName, org, msp, department, startKey, endKey);

    let response = JSON.parse(result);

    for (let i = 0; i < response.length; i++) {
      const command = new GetObjectCommand({
        Bucket: myBucket,
        Key: response[i].key,
      });

      const signedurl = await getSignedUrl(s3, command);
      response[i].url = signedurl;
    }

    res.status(200).json({ response: response });
  } catch (error) {
    console.log(`Error while creating user by authorized org: ${error}`);
    res.status(500).json({ error: 'Failed to invoke chaincode function getHealthRecordByRange ' });
  }
});


router.get('/:userId/:lockerId/queryRecord', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { parameterName, parameterValue } = req.body.arg || [];
    let { clientName, org, msp, department } = req.user;

    if (clientName !== userId) {
      return res.status(403).json({ error: 'Access forbidden' });
    }

    const result = await queryHealthRecord(clientName, org, msp, department, parameterName, parameterValue);
    let response = JSON.parse(result);

    const command = new GetObjectCommand({
      Bucket: myBucket,
      Key: response.key,
    })
    const url = await getSignedUrl(s3, command);

    response.url = url;

    res.status(200).json({ response: response });
  } catch (error) {
    console.log(`Error while creating user by authorized org: ${error}`);
    res.status(500).json({ error: 'Failed to invoke chaincode function queryHealthRecord ' });
  }
});

router.get('/:userId/:lockerId/allRecord', async (req, res) => {
  try {
    const userId = req.params.userId;
    let { clientName, org, msp, department } = req.user;

    if (clientName !== userId) {
      return res.status(403).json({ error: 'Access forbidden' });
    }

    const result = await getAllHealthRecord(clientName, org, msp, department);
    let response = JSON.parse(result);

    for (let i = 0; i < response.length; i++) {
      const command = new GetObjectCommand({
        Bucket: myBucket,
        Key: response[i].key,
      });

      const signedurl = await getSignedUrl(s3, command);
      response[i].url = signedurl;
    }
        res.status(200).json({ response: response });
  } catch (error) {
    console.log(`Error while creating user by authorized org: ${error}`);
    res.status(500).json({ error: 'Failed to invoke chaincode function getAllHealthRecord ' });
  }
});


module.exports = router;