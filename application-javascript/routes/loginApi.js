/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Wallets } = require('fabric-network');
const path = require('path');
const { Router } = require('express');
require('dotenv').config();
const { buildWallet } = require('../utils/AppUtil.js')

const app = express();
app.use(cors());
app.use(bodyParser.json());

const router = Router();

router.post('/:userName', async (req, res) => {
  try {
    /*
      const { encryptedData } = req.body;
      const decryptedData = decryptWithPrivateKey(encryptedData, privateKey);
      const { org, msp, userName, department, role } = JSON.parse(decryptedData);
    */

    const userName = req.params.userName;
    const { org, department } = req.body;

    console.log(`\n--> Fabric client Us  init: for ${org}`);

    const walletPath = path.join(__dirname, `wallet/${org}`);
    const wallet = await buildWallet(Wallets, walletPath);

    const identity = await wallet.get(userName);

    if (!identity) {
      throw new Error(`User Needs to get Registered first`);
    }

    console.log(identity);

    const msp = identity.mspId;
    const role = identity.credentials.role;

    console.log(role);

    const token = jwt.sign({ userName, org, department, msp, role }, "some secreat.");

    res.status(200).json({ message: 'User logged in successfully', token });
  } catch (error) {
    console.error(`Failed to register user: ${error}`);
    const errorMessage = error.message || 'An error occurred while processing your request';
    res.status(500).json({ error: errorMessage });
  }
});

module.exports = router;
