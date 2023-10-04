const { Gateway, Wallets } = require('fabric-network');
const path = require('path');

const { buildCCP, buildWallet } = require('../utils/AppUtil.js');

const myChannel = 'mychannel';
const myChaincodeName = 'healthLocker';

const lockerCollection = 'LockerPDC';

function prettyJSONString(inputString) {
  if (inputString) {
    return JSON.stringify(JSON.parse(inputString), null, 2);
  }
  else {
    return inputString;
  }
}
async function initContract(clientName, org, msp, department) {
  console.log(`\n--> Fabric client user & Gateway init: Using ${clientName} identity to ${msp} Peer and department ${department}`);

  const ccp = buildCCP(org);

  const walletPath = path.join(__dirname, `wallet/${org}`);
  const wallet = await buildWallet(Wallets, walletPath);

  const gateway = new Gateway();
  gateway.department = department;
  await gateway.connect(ccp, { wallet, identity: clientName.toLowerCase(), discovery: { enabled: true, asLocalhost: true } });

  const network = await gateway.getNetwork(myChannel);
  contract = network.getContract(myChaincodeName);
  contract.addDiscoveryInterest({ name: myChaincodeName, collectionNames: [lockerCollection] });
  // contract.setEndorsingOrganizations(msp);
  return { contract, wallet };

}

async function createUser(clientName, org, msp, department, arg) {
  try {
    console.log(`\n--> Submit Transaction:  createUser - ${arg.id}`);
    const { contract, wallet } = await initContract(clientName, org, msp, department);

    const identity = await wallet.get(clientName);
    if (!identity) {
      console.log(`Identity '${clientName}' not found in the wallet.`);
      return;
    }
    let statefulTxn = contract.createTransaction('createUser');
    statefulTxn.setEndorsingOrganizations(msp);
    let tmapData = Buffer.from(JSON.stringify(arg));
    statefulTxn.setTransient({
      user_properties: tmapData
    });
    let result = await statefulTxn.submit();
    if (result.errors && result.errors.length > 0) {
      throw new Error(result.errors[0].message);
    }
    console.log(`<-- result: ${(result.toString())}`);
    console.log('***********Success *************');
    return result.toString();
  } catch (error) {
    console.error(`Failed to invoke chaincode  ${error}`);
    const errorMessage = error.message || 'An error occurred while processing your request';
    throw new Error(errorMessage);
  }
}

async function deleteUser(clientName, org, msp, department, id) {
  try {

    console.log(`\n--> Submit Transaction:  deleteUser - ${id}`);
    const { contract, wallet } = await initContract(clientName, org, msp, department);
    const identity = await wallet.get(clientName);
    if (!identity) {
      console.log(`Identity '${clientName}' not found in the wallet.`);
      return;
    }
    let statefulTxn = contract.createTransaction('deleteUser');
    statefulTxn.setEndorsingOrganizations(msp);
    let result = await statefulTxn.submit(id);
    console.log(`<-- result: ${(result.toString())}`);
    console.log('***********Success *************');
    return result.toString();
    //return(`<-- result: ${prettyJSONString(result.toString())}`);
  } catch (error) {
    console.error(`Failed to invoke chaincode  ${error}`);
    const errorMessage = error.message || 'An error occurred while processing your request';
    throw new Error(errorMessage);
  }
}

async function createHealthLocker(clientName, org, msp, department, arg) {
  try {
    console.log(`\n--> Submit Transaction:  createHealthLocker - ${arg.id}`);
    const { contract, wallet } = await initContract(clientName, org, msp, department);

    const identity = await wallet.get(clientName);
    if (!identity) {
      console.log(`Identity '${clientName}' not found in the wallet.`);
      return;
    }
    let statefulTxn = contract.createTransaction('createHealthLocker');
    statefulTxn.setEndorsingOrganizations(msp);
    let tmapData = Buffer.from(JSON.stringify(arg));
    statefulTxn.setTransient({
      healthLocker_properties: tmapData
    });
    let result = await statefulTxn.submit();
    if (result.errors && result.errors.length > 0) {
      throw new Error(result.errors[0].message);
    }
    console.log(`<-- result: ${(result.toString())}`);
    console.log('***********Success *************');
    return result.toString();
  } catch (error) {
    console.error(`Failed to invoke chaincode  ${error}`);
    const errorMessage = error.message || 'An error occurred while processing your request';
    throw new Error(errorMessage);
  }
}

async function deleteHealthLocker(clientName, org, msp, department, id) {
  try {

    console.log(`\n--> Submit Transaction:  deleteHealthLocker - ${id}`);
    const { contract, wallet } = await initContract(clientName, org, msp, department);
    const identity = await wallet.get(clientName);
    if (!identity) {
      console.log(`Identity '${clientName}' not found in the wallet.`);
      return;
    }
    let statefulTxn = contract.createTransaction('deleteHealthLocker');
    statefulTxn.setEndorsingOrganizations(msp);
    let result = await statefulTxn.submit(id);
    console.log(`<-- result: ${(result.toString())}`);
    console.log('***********Success *************');
    return result.toString();
    //return(`<-- result: ${prettyJSONString(result.toString())}`);
  } catch (error) {
    console.error(`Failed to invoke chaincode  ${error}`);
    const errorMessage = error.message || 'An error occurred while processing your request';
    throw new Error(errorMessage);
  }
}

async function createHealthRecord(clientName, org, msp, department, arg) {
  try {
    console.log(`\n--> Submit Transaction:  createHealthRecord - ${arg.id}`);
    const { contract, wallet } = await initContract(clientName, org, msp, department);

    const identity = await wallet.get(clientName);
    if (!identity) {
      console.log(`Identity '${clientName}' not found in the wallet.`);
      return;
    }
    let statefulTxn = contract.createTransaction('createHealthRecord');
    statefulTxn.setEndorsingOrganizations(msp);
    let tmapData = Buffer.from(JSON.stringify(arg));
    statefulTxn.setTransient({
      healthRecord_properties: tmapData
    });
    let result = await statefulTxn.submit();
    if (result.errors && result.errors.length > 0) {
      throw new Error(result.errors[0].message);
    }
    console.log(`<-- result: ${(result.toString())}`);
    console.log('***********Success *************');
    return result.toString();
  } catch (error) {
    console.error(`Failed to invoke chaincode  ${error}`);
    const errorMessage = error.message || 'An error occurred while processing your request';
    throw new Error(errorMessage);
  }
}

async function deleteHealthRecord(clientName, org, msp, department, id) {
  try {

    console.log(`\n--> Submit Transaction:  deleteHealthRecord - ${id}`);
    const { contract, wallet } = await initContract(clientName, org, msp, department);
    const identity = await wallet.get(clientName);
    if (!identity) {
      console.log(`Identity '${clientName}' not found in the wallet.`);
      return;
    }
    let statefulTxn = contract.createTransaction('deleteHealthRecord');
    statefulTxn.setEndorsingOrganizations(msp);
    let result = await statefulTxn.submit(id);
    console.log(`<-- result: ${(result.toString())}`);
    console.log('***********Success *************');
    return result.toString();
    //return(`<-- result: ${prettyJSONString(result.toString())}`);
  } catch (error) {
    console.error(`Failed to invoke chaincode  ${error}`);
    const errorMessage = error.message || 'An error occurred while processing your request';
    throw new Error(errorMessage);
  }
}

async function getHealthRecord(clientName, org, msp, department, id) {
  try {
    console.log(`\n--> Submit Transaction:  getHealthRecord - ${id}`);
    const { contract, wallet } = await initContract(clientName, org, msp, department);
    const identity = await wallet.get(clientName);
    if (!identity) {
      console.log(`Identity '${clientName}' not found in the wallet.`);
      return;
    }
    let statefulTxn = contract.createTransaction('getHealthRecord');
    statefulTxn.setEndorsingOrganizations(msp);
    let result = await statefulTxn.submit(id);
    console.log(`*** Result: ${prettyJSONString(result.toString())}`);
    console.log('***********Success *************');
    return result.toString();
  } catch (error) {
    console.error(`Failed to invoke chaincode  ${error}`);
    const errorMessage = error.message || 'An error occurred while processing your request';
    throw new Error(errorMessage);
  }
}

async function updateHealthRecord(clientName, org, msp, department, arg) {
  try {
    console.log(`\n--> Submit Transaction:  updateHealthRecord - ${arg.id}`);
    const { contract, wallet } = await initContract(clientName, org, msp, department);
    const identity = await wallet.get(clientName);
    if (!identity) {
      console.log(`Identity '${clientName}' not found in the wallet.`);
      return;
    }
    //contract.setEndorsingOrganizations(msp);
    let statefulTxn = contract.createTransaction('updateHealthRecord');
    statefulTxn.setEndorsingOrganizations(msp);
    let tmapData = Buffer.from(JSON.stringify(arg));
    statefulTxn.setTransient({
      recordUpdate_properties: tmapData
    });
    let result = await statefulTxn.submit();
    console.log(`<-- result: ${(result.toString())}`);
    console.log('***********Success *************');
    return result.toString();

  } catch (error) {
    console.error(`Failed to invoke chaincode  ${error}`);
    const errorMessage = error.message || 'An error occurred while processing your request';
    throw new Error(errorMessage);
  }
}

async function getHealthRecordByRange(clientName, org, msp, department, startKey, endKey) {
  try {
    const { contract, wallet } = await initContract(clientName, org, msp, department);
    const identity = await wallet.get(clientName);
    if (!identity) {
      console.log(`Identity '${clientName}' not found in the wallet.`);
      return;
    }
    console.log(`user with id ${clientName}  is reading the Health Record`);

    let result = await contract.evaluateTransaction('getHealthRecordByRange', startKey, endKey);
    console.log(`*** Result: ${prettyJSONString(result.toString())}`);
    return prettyJSONString(result.toString());
  } catch (error) {
    console.error(`Failed to invoke chaincode getHealthRecordByRange function: ${error}`);
    const errorMessage = error.message || 'An error occurred while processing your request';
    throw new Error(errorMessage);
  }
}

async function queryHealthRecord(clientName, org, msp, department,parameterName,parameterValue) {
  try {
    const { contract, wallet } = await initContract(clientName, org, msp, department);
    const identity = await wallet.get(clientName);
    if (!identity) {
      console.log(`Identity '${clientName}' not found in the wallet.`);
      return;
    }
    console.log(`user with id ${clientName} is querying Health Records`);

    let result = await contract.evaluateTransaction('queryHealthRecord', parameterName, parameterValue);
    console.log(`*** Result: ${prettyJSONString(result.toString())}`);
    return prettyJSONString(result.toString());
  } catch (error) {
    console.error(`Failed to invoke chaincode queryHealthRecord function: ${error}`);
    const errorMessage = error.message || 'An error occurred while processing your request';
    throw new Error(errorMessage);
  }
}

async function getAllHealthRecord(clientName, org, msp, department) {
  try {
    const { contract, wallet } = await initContract(clientName, org, msp, department);
    const identity = await wallet.get(clientName);
    if (!identity) {
      console.log(`Identity '${clientName}' not found in the wallet.`);
      return;
    }
    console.log(`user with id ${clientName} is fetching all Health Records`);

    let result = await contract.evaluateTransaction('getAllHealthRecord');
    console.log(`*** Result: ${prettyJSONString(result.toString())}`);
    return prettyJSONString(result.toString());
  } catch (error) {
    console.error(`Failed to invoke chaincode getAllHealthRecord function: ${error}`);
    const errorMessage = error.message || 'An error occurred while processing your request';
    throw new Error(errorMessage);
  }
}

async function createShareToken(clientName, org, msp, department, arg) {
  try {
    console.log(`\n--> Submit Transaction:  createShareToken `);
    const { contract, wallet } = await initContract(clientName, org, msp, department);

    const identity = await wallet.get(clientName);
    if (!identity) {
      console.log(`Identity '${clientName}' not found in the wallet.`);
      return;
    }
    let statefulTxn = contract.createTransaction('createShareToken');
    statefulTxn.setEndorsingOrganizations(msp);
    let tmapData = Buffer.from(JSON.stringify(arg));
    statefulTxn.setTransient({
      shareToken_properties: tmapData
    });
    let result = await statefulTxn.submit();
    if (result.errors && result.errors.length > 0) {
      throw new Error(result.errors[0].message);
    }
    console.log(`<-- result: ${(result.toString())}`);
    console.log('***********Success *************');
    return result.toString();
  } catch (error) {
    console.error(`Failed to invoke chaincode  ${error}`);
    const errorMessage = error.message || 'An error occurred while processing your request';
    throw new Error(errorMessage);
  }
}

async function deleteShareToken(clientName, org, msp, department, id1,id2,salt) {
  try {

    console.log(`\n--> Submit Transaction:  deleteShareToken `);
    const { contract, wallet } = await initContract(clientName, org, msp, department);
    const identity = await wallet.get(clientName);
    if (!identity) {
      console.log(`Identity '${clientName}' not found in the wallet.`);
      return;
    }
    let statefulTxn = contract.createTransaction('deleteShareToken');
    statefulTxn.setEndorsingOrganizations(msp);
    let result = await statefulTxn.submit(id1,id2,salt);
    console.log(`<-- result: ${(result.toString())}`);
    console.log('***********Success *************');
    return result.toString();
    //return(`<-- result: ${prettyJSONString(result.toString())}`);
  } catch (error) {
    console.error(`Failed to invoke chaincode  ${error}`);
    const errorMessage = error.message || 'An error occurred while processing your request';
    throw new Error(errorMessage);
  }
}

async function getShareToken(clientName, org, msp, department, id1,id2,salt) {
  try {
    console.log(`\n--> Submit Transaction:  getShareToken - `);
    const { contract, wallet } = await initContract(clientName, org, msp, department);
    const identity = await wallet.get(clientName);
    if (!identity) {
      console.log(`Identity '${clientName}' not found in the wallet.`);
      return;
    }
    let statefulTxn = contract.createTransaction('getShareToken');
    statefulTxn.setEndorsingOrganizations(msp);
    let result = await statefulTxn.submit(id1,id2,salt);
    console.log(`*** Result: ${prettyJSONString(result.toString())}`);
    console.log('***********Success *************');
    return result.toString();
  } catch (error) {
    console.error(`Failed to invoke chaincode  ${error}`);
    const errorMessage = error.message || 'An error occurred while processing your request';
    throw new Error(errorMessage);
  }
}

async function updateShareToken(clientName, org, msp, department, arg) {
  try {
    console.log(`\n--> Submit Transaction:  updateShareToken `);
    const { contract, wallet } = await initContract(clientName, org, msp, department);
    const identity = await wallet.get(clientName);
    if (!identity) {
      console.log(`Identity '${clientName}' not found in the wallet.`);
      return;
    }
    //contract.setEndorsingOrganizations(msp);
    let statefulTxn = contract.createTransaction('updateShareToken');
    statefulTxn.setEndorsingOrganizations(msp);
    let tmapData = Buffer.from(JSON.stringify(arg));
    statefulTxn.setTransient({
      shareToken_update_properties: tmapData
    });
    let result = await statefulTxn.submit();
    console.log(`<-- result: ${(result.toString())}`);
    console.log('***********Success *************');
    return result.toString();

  } catch (error) {
    console.error(`Failed to invoke chaincode  ${error}`);
    const errorMessage = error.message || 'An error occurred while processing your request';
    throw new Error(errorMessage);
  }
}

async function readRecord(clientName, org, msp, department, id1,id2,salt) {
  try {
    console.log(`\n--> Submit Transaction:  readRecord - `);
    const { contract, wallet } = await initContract(clientName, org, msp, department);
    const identity = await wallet.get(clientName);
    if (!identity) {
      console.log(`Identity '${clientName}' not found in the wallet.`);
      return;
    }
    let statefulTxn = contract.createTransaction('readRecord');
    statefulTxn.setEndorsingOrganizations(msp);
    let result = await statefulTxn.submit(id1,id2,salt);
    console.log(`*** Result: ${prettyJSONString(result.toString())}`);
    console.log('***********Success *************');
    return result.toString();
  } catch (error) {
    console.error(`Failed to invoke chaincode  ${error}`);
    const errorMessage = error.message || 'An error occurred while processing your request';
    throw new Error(errorMessage);
  }
}


module.exports = {
  createUser,
  deleteUser,
  createHealthLocker,
  deleteHealthLocker,
  createHealthRecord,
  deleteHealthRecord,
  getHealthRecord,
  updateHealthRecord,
  getHealthRecordByRange,
  queryHealthRecord,
  getAllHealthRecord,
  createShareToken,
  deleteShareToken,
  getShareToken,
  updateShareToken,
  readRecord
};
