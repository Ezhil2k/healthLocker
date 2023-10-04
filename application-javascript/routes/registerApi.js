/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
const express = require('express');
//const crypto = require('crypto');
//const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const router = express.Router();
require('dotenv').config();

const { buildCAClient, registerAndEnrollUser ,enrollAdmin,} = require('../utils/CAUtil');
const { buildCCP,buildWallet } = require('../utils/AppUtil.js');

const app = express();

app.use(cors()); 
app.use(bodyParser.json()); 

router.post('/admin', async (req, res) => {
    
    try{ 
       /*
          const { encryptedData } = req.body;
          const decryptedData = decryptWithPrivateKey(encryptedData, privateKey);
          const { org, msp } = JSON.parse(decryptedData);
       */
        const {org,msp} = req.body;  
        console.log(`\n--> Fabric client Admin  init: for ${org} `);
        const ccp = buildCCP(org);
        const caClient = buildCAClient(FabricCAServices, ccp, `ca.${org}.example.com`);
        
        const walletPath = path.join(__dirname, `wallet/${org}`);
        const wallet = await buildWallet(Wallets, walletPath);
        await enrollAdmin(caClient, wallet, msp);
        
        console.log('Successfully enrolled Admin');

        res.status(200).json({ message: 'Admin registered successfully' });
    } catch (error) {
        console.error(`Failed to register user: ${error}`);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

router.post('/client', async (req, res) => {
    
    try{
         /*
            const { encryptedData } = req.body;
            const decryptedData = decryptWithPrivateKey(encryptedData, privateKey);
            const { org,msp,userName,department,role} = JSON.parse(decryptedData);
        */
        const {org,msp,userName,department,role} = req.body;
    
        console.log(`\n--> Fabric client Us  init: for ${org} `);
        const ccp = buildCCP(org);
        const caClient = buildCAClient(FabricCAServices, ccp, `ca.${org}.example.com`);

        const walletPath = path.join(__dirname, `wallet/${org}`);
        const wallet = await buildWallet(Wallets, walletPath,role);
        
        const identity = await wallet.get(userName);
        if(identity){
        throw new Error(`User Already Registered`);
        }
        await registerAndEnrollUser(caClient, wallet, msp, userName, `${org}.${department}`,role);
        
        const user = await wallet.get(userName);
        //IN FUTURE WE WILL PUT GLOBAL ID CONEPT AND THEN MAKE ROLE HARDCODED .
        user.credentials.role  = role;
        console.log('Successfully enrolled userName',user);
    
        res.status(200).json({ message: 'User registered successfully' });
     
    } catch (error) {
        console.error(`Failed to register user: ${error}`);
        const errorMessage = error.message || 'An error occurred while processing your request';
        res.status(500).json({ error: errorMessage });
    }
});

module.exports = router;