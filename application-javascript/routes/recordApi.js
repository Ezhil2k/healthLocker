//routes for healthLocker create and delete
const express = require('express');
const router = express.Router();
require("dotenv").config();
const multer = require("multer");
const multerS3 = require('multer-s3')
const { S3Client, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const {createHealthRecord, deleteHealthRecord, getHealthRecord, updateHealthRecord} = require('./helperFunctions.js')

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const myBucket = process.env.AWS_BUCKET_NAME;

const fileFilter = (req, file, cb) => {
  if(file.mimetype.split("/")[0] != 'image') {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: `${myBucket}`,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    contentDisposition: 'inline',
    key: function (req, file, cb) {
      cb(null,`records/${file.originalname}`)
    }
  }),
  fileFilter
})

router.post('/:userId/:lockerId/createRecord', upload.single("file"), async (req, res) => {
  try {

    const arg = {};
    const requestData = req.body;
    Object.assign(arg, requestData);
    arg.key = req.file.key;

    let { clientName, org, msp, department } = req.user;

    if (clientName !== arg.userId) {
      return res.status(403).json({ error: 'Access forbidden' });
    }

    const result = await createHealthRecord(clientName, org, msp, department, arg);

    let response = result.toString();
    res.status(200).json({ response: response });
  } catch (error) {
    console.error(`Failed to invoke chaincode createHealthRecord function: ${error}`);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:userId/:lockerId/deleteRecord/:recordId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const recordId = req.params.recordId;

    let { clientName, org, msp, department } = req.user;
    if (clientName !== userId) {
      return res.status(403).json({ error: 'Access forbidden' });
    }

    const obj = await getHealthRecord(clientName, org, msp, department, recordId);

    const deleteParams = {
      Bucket: myBucket,
      Key: JSON.parse(obj).key,
    }
  
    s3.send(new DeleteObjectCommand(deleteParams))

    const result = await deleteHealthRecord(clientName, org, msp, department, recordId);
    let response = result.toString();
    res.status(200).json({ response: response });
  } catch (error) {
    console.error(`Failed to invoke chaincode deleteHealthRecord function: ${error}`);
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:userId/:lockerId/updateRecord', upload.single("file"), async (req, res) => {
  try {
    const arg = req.body;
    if(req.file) {
      arg.key = req.file.key;
    }

    let { clientName, org, msp, department } = req.user;

    if (clientName !== arg.userId) {
      return res.status(403).json({ error: 'Access forbidden' });
    }

    const result = await updateHealthRecord(clientName, org, msp, department, arg);
    let response = result.toString();
    res.status(200).json({ response: response });
  } catch (error) {
    console.error(`Failed to update user data: ${error}`);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:userId/:lockerId/getRecord/:recordId', async (req, res) => {
  try {
    
    const userId = req.params.userId;
    const recordId = req.params.recordId;
  
    let { clientName, org, msp, department } = req.user;
    if (clientName !== userId) {
      return res.status(403).json({ error: 'Access forbidden' });
    }
    const result = await getHealthRecord(clientName, org, msp, department, recordId);

    let response = JSON.parse(result);

    const command = new GetObjectCommand({
      Bucket: myBucket,
      Key: response.key,
    })
    const url = await getSignedUrl (s3,command);

    response.url = url; 

    res.status(200).json({ response: response });
  } catch (error) {
    console.error(`Failed to invoke chaincode getHealthRecord function: ${error}`);
    res.status(500).json({ error: error.message });
  }
});

router.use((error, req, res, next) => {
  if(error instanceof multer.MulterError) {
      if(error.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
              message: "file is too large",
          });
      };
      if(error.code === "LIMIT_FILE_COUNT") {
          return res.status(400).json({
              message: "filelimit reached",
          });
      };

      if(error.code === "LIMIT_UNEXPECTED_FILE") {
          return res.status(400).json({
              message: "file must be an image",
          });
      };

  }
})

module.exports = router;