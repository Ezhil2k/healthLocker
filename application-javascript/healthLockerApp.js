/*
* Copyright IBM Corp. All Rights Reserved.
*
* SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
const { buildCCP,buildWallet } = require('../../test-application/javascript/AppUtil.js');
const { 
  userProperties1,
  userProperties2,

  healthLockerproperties,
  
  healthRecordProperties1,
  healthRecordProperties2,
  healthRecordProperties3,
  healthRecordProperties4,
  healthRecordProperties5,
  healthRecordProperties6,
  updatedHealthRecordProperties,
  
  shareTokenProperties,
  updatedShareTokenProperties,} = require('./healthLockerdata.js');

const myChannel = 'mychannel';
const myChaincodeName = 'healthLocker';

const org2privateCollection = 'Org2MSPPDC';
const org1privateCollection = 'Org1MSPPDC';
const lockerCollection = 'LockerPDC' ; 

async function initContractFromIdentity(clientName, msp,org,department) {
    console.log(`\n--> Fabric client user & Gateway init: Using ${clientName} identity to ${msp} Peer  and department ${department}`);
    
    
    const ccp = buildCCP(org);
    const caClient = buildCAClient(FabricCAServices, ccp, `ca.${org}.example.com`);

    const walletPath = path.join(__dirname, `wallet/${org}`);
    const wallet = await buildWallet(Wallets, walletPath);

    await enrollAdmin(caClient, wallet, msp);
    await registerAndEnrollUser(caClient, wallet, msp, clientName, `${org}.${department}`);

    try {   
        const gateway = new Gateway();
        gateway.department = department;
        await gateway.connect(ccp, { wallet, identity: clientName.toLowerCase(), discovery: { enabled: true, asLocalhost: true } });
        
        return gateway;
    } catch (error) {
        console.error(`Error in connecting to gateway: ${error}`);
        process.exit(1);
    }
}

function prettyJSONString(inputString) {
    if (inputString) {
      return JSON.stringify(JSON.parse(inputString), null, 2);
    } 
    else {
      return inputString;
    }
}

async function createUser(gateway,orgategClient,userData) {
    try {
      console.log(`\n--> Submit Transaction:  createUser ${userData.id}`);
      
      const userId = gateway.getOptions().identity;
      console.log(gateway.department);
      console.log(`user with id ${userId} is creating user`);

      let statefulTxn = orgClient.createTransaction('createUser');
      let tmapData = Buffer.from(JSON.stringify(userData));
      statefulTxn.setTransient({
          user_properties: tmapData
      });
     let result = await statefulTxn.submit();
     console.log(`<-- result: ${(result.toString())}`);
     console.log('***********Success *************');
     //return(`<-- result: ${prettyJSONString(result.toString())}`);
    } catch (error) {
      console.log(`Error while creating user by authorized org: ${error}`);
    }
}

async function deleteUser(gateway,orgClient,id) {
    try {
      console.log(`\n--> Submit Transaction:  deleteUser ${id}`);
      
      const userId = gateway.getOptions().identity;
      console.log(gateway.department);
      console.log(`user with id ${userId} is creating user`);
      let statefulTxn = orgClient.createTransaction('deleteUser');
      
     let result = await statefulTxn.submit(id);
     console.log(`<-- result: ${(result.toString())}`);
     console.log('***********Success *************');
     //return(`<-- result: ${prettyJSONString(result.toString())}`);
    } catch (error) {
      console.log(`Error while creating user by authorized org: ${error}`);
    }
} 

async function createHealthLocker(gateway,orgClient,lockerData) {
    try {
      console.log(`\n--> Submit Transaction:  createHealthLocker ${lockerData.id}`);
      
      const userId = gateway.getOptions().identity;
      console.log(gateway.department);
      console.log(`user with id ${userId} is creating healthLocker`);

      let statefulTxn = orgClient.createTransaction('createHealthLocker');
      let tmapData = Buffer.from(JSON.stringify(lockerData));
      statefulTxn.setTransient({
        healthLocker_properties: tmapData
      });
     let result = await statefulTxn.submit();
     console.log(`<-- result: ${(result.toString())}`);
     console.log('***********Success *************');
     //return(`<-- result: ${prettyJSONString(result.toString())}`);
    } catch (error) {
      console.log(`Error while creating healthLocker by authorized org: ${error}`);
    }
}

async function deleteHealthLocker(gateway,orgClient,id) {
    try {
      console.log(`\n--> Submit Transaction:  deleteHealthLocker ${id}`);
      
      const userId = gateway.getOptions().identity;
      console.log(gateway.department);
      console.log(`user with id ${userId} is deleting healthLocker`);
      let statefulTxn = orgClient.createTransaction('deleteHealthLocker');
      
     let result = await statefulTxn.submit(id);
     console.log(`<-- result: ${(result.toString())}`);
     console.log('***********Success *************');
     //return(`<-- result: ${prettyJSONString(result.toString())}`);
    } catch (error) {
      console.log(`Error while deleting healthLocker by authorized org: ${error}`);
    }
}

async function createHealthRecord(gateway,orgClient,recordData) {
  try {
    console.log(`\n--> Submit Transaction:  createHealthRecord ${recordData.id}`);
    
    const userId = gateway.getOptions().identity;
    console.log(gateway.department);
    console.log(`user with id ${userId} is creating healthRecord`);

    let statefulTxn = orgClient.createTransaction('createHealthRecord');
    let tmapData = Buffer.from(JSON.stringify(recordData));
    statefulTxn.setTransient({
      healthRecord_properties: tmapData
    });
   let result = await statefulTxn.submit();
   console.log(`<-- result: ${(result.toString())}`);
   console.log('***********Success *************');
   //return(`<-- result: ${prettyJSONString(result.toString())}`);
  } catch (error) {
    console.log(`Error while creating healthRecord by authorized org: ${error}`);
  }
}

async function getHealthRecord(gateway,orgClient,id) {
  try {
    console.log(`\n--> Submit Transaction: getHealthRecord for - ${id}`);
     const userId = gateway.getOptions().identity;
    const userdep = gateway.department;
    console.log(`user with id ${userId}  of department ${userdep} is getting the health record`);
   
    let statefulTxn = orgClient.createTransaction('getHealthRecord');
    let result = await statefulTxn.submit(id);
    console.log(`*** Result: ${prettyJSONString(result.toString())}`);
    console.log('***********Success *************');
  } catch (error) {
    console.log(`Error while getting the health Record by authorized org: ${error}`);
  }
}

async function updateHealthRecord(gateway,orgClient,updatedHealthRecordProperties) {
  try {
    console.log(`\n--> Submit Transaction:  updateHealthRecord `);
    
    const userId = gateway.getOptions().identity;
    console.log(gateway.department);
    console.log(`user with id ${userId} is updating the health record`);
    let statefulTxn = orgClient.createTransaction('updateHealthRecord');
    let tmapData = Buffer.from(JSON.stringify(updatedHealthRecordProperties));
    statefulTxn.setTransient({
      recordUpdate_properties: tmapData
    }); 
   let result = await statefulTxn.submit();
   console.log(`<-- result: ${(result.toString())}`);
   console.log('***********Success *************');
   //return(`<-- result: ${prettyJSONString(result.toString())}`);
  } catch (error) {
    console.log(`Error while updating the health Record by authorized org: ${error}`);
  }
}

async function deleteHealthRecord(gateway,orgClient,id) {
  try {
    console.log(`\n--> Submit Transaction:  deleteHealthRecord ${id}`);
    
    const userId = gateway.getOptions().identity;
    console.log(gateway.department);
    console.log(`user with id ${userId} is deleting healthRecord`);
    let statefulTxn = orgClient.createTransaction('deleteHealthRecord');
    
   let result = await statefulTxn.submit(id);
   console.log(`<-- result: ${(result.toString())}`);
   console.log('***********Success *************');
   //return(`<-- result: ${prettyJSONString(result.toString())}`);
  } catch (error) {
    console.log(`Error while deleting healthRecord by authorized org: ${error}`);
  }
}

async function getAllHealthRecord(gateway,orgClient) {

  await getHealthRecordByRange(gateway,orgClient,"","");
  
}

async function queryHealthRecord(gateway, orgClient,parameterName,parameterValue) {
  try {
    console.log(`\n--> Evaluate Transaction: queryHealthRecord (${parameterName}: ${parameterValue})`);
    const userId = gateway.getOptions().identity;
    const userdep = gateway.department;
    console.log(`user with id ${userId}  of department ${userdep} is reading patientCollection`);
     
    let result = await orgClient.evaluateTransaction('queryHealthRecord',parameterName,parameterValue);
    console.log(`<-- result: ${prettyJSONString(result.toString())}`);
  
    } catch (error) { 
      console.error(`Error querying health record: ${error}`); 
    }
}

async function getHealthRecordByRange(gateway,orgClient,startKey,endKey){

  console.log(`\n--> evaluate Transaction: getHealthRecordByRange`);
  const userId = gateway.getOptions().identity;
  const userdep = gateway.department;
  console.log(`user with id ${userId}  of department ${userdep} is reading health records within range`);
  
  let result = await orgClient.evaluateTransaction('getHealthRecordByRange', startKey, endKey);
console.log(`*** Result: ${prettyJSONString(result.toString())}`);
}

async function createShareToken(gateway,orgClient,tokenData) {
  try {
    console.log(`\n--> Submit Transaction:  createShareToken for - ${tokenData.userId} and ${tokenData.recipientId}`);
    
    const userId = gateway.getOptions().identity;
    console.log(gateway.department);
    console.log(`user with id ${userId} is creating shareToken`);
    let statefulTxn = orgClient.createTransaction('createShareToken');
    let tmapData = Buffer.from(JSON.stringify(tokenData));
    statefulTxn.setTransient({
      shareToken_properties: tmapData
    });
   let result = await statefulTxn.submit();
   console.log(`<-- result: ${(result.toString())}`);
   console.log('***********Success *************');
   //return(`<-- result: ${prettyJSONString(result.toString())}`);
  } catch (error) {
    console.log(`Error while creating share token by authorized org: ${error}`);
  }
} 

async function getShareToken(gateway,orgClient,id1,id2,salt) {
  try {
    console.log(`\n--> Submit Transaction: getShareToken for - ${id1} and ${id2}`);
     const userId = gateway.getOptions().identity;
    const userdep = gateway.department;
    console.log(`user with id ${userId}  of department ${userdep} is getting the share token`);
   
    let statefulTxn = orgClient.createTransaction('getShareToken');
    let result = await statefulTxn.submit(id1,id2,salt);
    console.log(`*** Result: ${prettyJSONString(result.toString())}`);
    console.log('***********Success *************');
  } catch (error) {
    console.log(`Error while getting the share token by authorized org: ${error}`);
  }
}

async function updateShareToken(gateway,orgClient,updatedShareTokenProperties) {
  try {
    console.log(`\n--> Submit Transaction:  updateShareToken `);
    
    const userId = gateway.getOptions().identity;
    console.log(gateway.department);
    console.log(`user with id ${userId} is updating the share token`);
    let statefulTxn = orgClient.createTransaction('updateShareToken');
    let tmapData = Buffer.from(JSON.stringify(updatedShareTokenProperties));
    statefulTxn.setTransient({
      shareToken_update_properties: tmapData
    }); 
   let result = await statefulTxn.submit();
   console.log(`<-- result: ${(result.toString())}`);
   console.log('***********Success *************');
   //return(`<-- result: ${prettyJSONString(result.toString())}`);
  } catch (error) {
    console.log(`Error while updating the share token by authorized org: ${error}`);
  }
}

async function deleteShareToken(gateway,orgClient,id1,id2,salt) {
  try {
    console.log(`\n--> Submit Transaction:  deleteShareToken for - ${id1} and ${id2}`);
    
    const userId = gateway.getOptions().identity;
    console.log(gateway.department);
    console.log(`user with id ${userId} is deleting shareToken`);
    let statefulTxn = orgClient.createTransaction('deleteShareToken');
    
   let result = await statefulTxn.submit(id1,id2,salt);
   console.log(`<-- result: ${(result.toString())}`);
   console.log('***********Success *************');
   //return(`<-- result: ${prettyJSONString(result.toString())}`);
  } catch (error) {
    console.log(`Error while deleting healthRecord by authorized org: ${error}`);
  }
}

async function readRecord(gateway,orgClient,id1,id2,salt) {
  try {
    console.log(`\n--> Submit Transaction: readRecord for - ${id1} and ${id2}`);
     const userId = gateway.getOptions().identity;
    const userdep = gateway.department;
    console.log(`user with id ${userId}  of department ${userdep} is reading the health record`);
   
    let statefulTxn = orgClient.createTransaction('readRecord');
    let result = await statefulTxn.submit(id1,id2,salt);
    console.log(`*** Result: ${prettyJSONString(result.toString())}`);
    console.log('***********Success *************');
  } catch (error) {
    console.log(`Error while reading the record by authorized org: ${error}`);
  }
}

async function main() {
  try {           
    const gatewayOrg1 = await initContractFromIdentity('client111','Org1MSP','org1','department1'); 
    const networkOrg1 = await gatewayOrg1.getNetwork(myChannel);
    const contractOrg1 = networkOrg1.getContract(myChaincodeName);
    contractOrg1.addDiscoveryInterest({ name: myChaincodeName, collectionNames: [lockerCollection,org1privateCollection] });
    
    const gatewayOrg2 = await initContractFromIdentity('client222','Org2MSP','org2','department1');
    const networkOrg2 = await gatewayOrg2.getNetwork(myChannel);
    const contractOrg2 = networkOrg2.getContract(myChaincodeName);
    contractOrg2.addDiscoveryInterest({ name: myChaincodeName, collectionNames: [lockerCollection,org2privateCollection] });

    await createUser(gatewayOrg1,contractOrg1,userProperties1); 
    await createUser(gatewayOrg1,contractOrg1,userProperties2);
    await deleteUser(gatewayOrg1,contractOrg1,"2");

    await createHealthLocker(gatewayOrg1,contractOrg1,healthLockerproperties);
    //await deleteHealthLocker(gatewayOrg1,contractOrg1,"101");

    await createHealthRecord(gatewayOrg1,contractOrg1,healthRecordProperties1);
    await createHealthRecord(gatewayOrg1,contractOrg1,healthRecordProperties2);
    await createHealthRecord(gatewayOrg1,contractOrg1,healthRecordProperties3);
    await createHealthRecord(gatewayOrg1,contractOrg1,healthRecordProperties4);
    await createHealthRecord(gatewayOrg1,contractOrg1,healthRecordProperties5);
    await createHealthRecord(gatewayOrg1,contractOrg1,healthRecordProperties6);
    await getAllHealthRecord(gatewayOrg1,contractOrg1);
    await getHealthRecordByRange(gatewayOrg1,contractOrg1,"202","205");
    await queryHealthRecord(gatewayOrg1,contractOrg1,"hospital","Community Health Clinic");
    await getHealthRecord(gatewayOrg1,contractOrg1,"202");
    await updateHealthRecord(gatewayOrg1,contractOrg1,updatedHealthRecordProperties);
    await getHealthRecord(gatewayOrg1,contractOrg1,"202");
    await getAllHealthRecord(gatewayOrg1,contractOrg1);
    await deleteHealthRecord(gatewayOrg1,contractOrg1,"206");
    await getAllHealthRecord(gatewayOrg1,contractOrg1);

    const userId = "1";
    const recepientId = "2";
    await createShareToken(gatewayOrg1,contractOrg1,shareTokenProperties);
    await getShareToken(gatewayOrg1,contractOrg1,userId,recepientId,"xG2&fP5%mC");
    await updateShareToken(gatewayOrg1,contractOrg1,updatedShareTokenProperties);
    await getShareToken(gatewayOrg1,contractOrg1,userId,recepientId,"xG2&fP5%mC");

    await readRecord(gatewayOrg2,contractOrg2,userId,recepientId,"xG2&fP5%mC");

    await deleteShareToken(gatewayOrg1,contractOrg1,userId,recepientId,"xG2&fP5%mC");
    await getShareToken(gatewayOrg1,contractOrg1,userId,recepientId,"xG2&fP5%mC");

    gatewayOrg2.disconnect();
    gatewayOrg1.disconnect();

  } catch (error) {
    console.error(`Error in transaction: ${error}`);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  } finally { 
    console.log('**************Successfully Ran All Chaincode *************'); 
  }
}
main();


