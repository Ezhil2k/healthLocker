/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Import required Fabric libraries
const { Contract } = require('fabric-contract-api');
const crypto = require('crypto');

const lockerCollection = "LockerPDC";

class healthLocker extends Contract {

  async verifyClientOrgMatchesPeerOrg1(ctx) {
    const clientMSPID = ctx.clientIdentity.getMSPID();
    const peerMSPID = ctx.stub.getMspID();

    // Check if the client's organization is org1
    if (clientMSPID !== 'Org1MSP') {
      throw new Error('Only org1 is authorized to access this function');
    }

    if (clientMSPID !== peerMSPID) {
      throw new Error(`Client from org ${clientMSPID} is not authorized to read or write private data from an org ${peerMSPID} peer`);
    }
    return clientMSPID;
  }

  async createUser(ctx) {

    await this.verifyClientOrgMatchesPeerOrg1(ctx);

    const transientMap = await ctx.stub.getTransient();
    const transientuserJSON = transientMap.get('user_properties');
    if (!transientuserJSON) {
      throw new Error('User details not found in transient map');
    }


    const userInput = JSON.parse(transientuserJSON.toString());
    if (!userInput.id || !userInput.name || !userInput.gender || !userInput.dob || !userInput.address
      || !userInput.contact) {
      throw new Error('Invalid user input');
    }


    const UserExists = await ctx.stub.getPrivateData(lockerCollection, userInput.id);
    if (UserExists.length !== 0) {
      throw new Error(`User with ID ${userInput.id} already exists`);
    }

    const user = {
      docType: 'user',
      id: userInput.id,
      name: userInput.name,
      gender: userInput.gender,
      dob: userInput.dob,
      address: userInput.address,
      contact: userInput.contact,
    };

    await ctx.stub.putPrivateData(lockerCollection, userInput.id, Buffer.from(JSON.stringify(user)));

    return `User created with Id ${userInput.id}`;
  }

  async deleteUser(ctx, id) {
    await this.verifyClientOrgMatchesPeerOrg1(ctx);

    const userExists = await ctx.stub.getPrivateData(lockerCollection, id);
    if (!userExists || userExists.length === 0) {
      throw new Error(`user with ID ${id} does not exist`);
    }

    await ctx.stub.deletePrivateData(lockerCollection, id);

    return `User with ID ${id} has been deleted`;
  }

  async createHealthLocker(ctx) {

    await this.verifyClientOrgMatchesPeerOrg1(ctx);

    const transientMap = await ctx.stub.getTransient();
    const transientHealthLockerJSON = transientMap.get('healthLocker_properties');
    if (!transientHealthLockerJSON) {
      throw new Error('healthLocker details not found in transient map');
    }


    const healthLockerInput = JSON.parse(transientHealthLockerJSON.toString());
    if (!healthLockerInput.id || !healthLockerInput.userId || !healthLockerInput.storageSize || !healthLockerInput.usedStorage) {
      throw new Error('Invalid healthLocker input');
    }


    const UserExists = await ctx.stub.getPrivateData(lockerCollection, healthLockerInput.id);
    if (UserExists.length !== 0) {
      throw new Error(`healthLocker with Id ${healthLockerInput.id} already exists`);
    }

    const healthLocker = {
      docType: 'health Locker',
      id: healthLockerInput.id,
      userId: healthLockerInput.userId,
      storageSize: healthLockerInput.storageSize,
      usedStorage: healthLockerInput.usedStorage,
      availableStorage: healthLockerInput.availableStorage,
    };

    await ctx.stub.putPrivateData(lockerCollection, healthLockerInput.id, Buffer.from(JSON.stringify(healthLocker)));

    return `healthLocker created with Id ${healthLockerInput.id}`;
  }

  async deleteHealthLocker(ctx, id) {
    await this.verifyClientOrgMatchesPeerOrg1(ctx);

    const healthLockerExists = await ctx.stub.getPrivateData(lockerCollection, id);
    if (!healthLockerExists || healthLockerExists.length === 0) {
      throw new Error(`healthLocker with ID ${id} does not exist`);
    }

    await ctx.stub.deletePrivateData(lockerCollection, id);

    return `healthLocker with ID ${id} has been deleted`;
  }

  async createHealthRecord(ctx) {

    await this.verifyClientOrgMatchesPeerOrg1(ctx);

    const transientMap = await ctx.stub.getTransient();
    const transientHealthRecordJSON = transientMap.get('healthRecord_properties');
    if (!transientHealthRecordJSON) {
      throw new Error('healthRecord details not found in transient map');
    }


    const healthRecordInput = JSON.parse(transientHealthRecordJSON.toString());
    if (!healthRecordInput.id || !healthRecordInput.userId || !healthRecordInput.lockerId ||
      !healthRecordInput.createdAt || !healthRecordInput.title || !healthRecordInput.hospital ||
      !healthRecordInput.visitPurpose || !healthRecordInput.typeTag || !healthRecordInput.key) {
      throw new Error('Invalid healthRecord input');
    }


    const healthRecordExists = await ctx.stub.getPrivateData(lockerCollection, healthRecordInput.id);
    if (healthRecordExists.length !== 0) {
      throw new Error(`healthRecord with ID ${healthRecordInput.id} already exists`);
    }

    const healthRecord = {
      docType: 'health Record',
      id: healthRecordInput.id,
      userId: healthRecordInput.userId,
      lockerId: healthRecordInput.lockerId,
      createdAt: healthRecordInput.createdAt,
      title: healthRecordInput.title,
      hospital: healthRecordInput.hospital,
      visitPurpose: healthRecordInput.visitPurpose,
      description: healthRecordInput.description,
      typeTag: healthRecordInput.typeTag,
      key: healthRecordInput.key,
    };

    await ctx.stub.putPrivateData(lockerCollection, healthRecordInput.id, Buffer.from(JSON.stringify(healthRecord)));

    return `healthRecord created with Id ${healthRecordInput.id}`;
  }

  async updateHealthRecord(ctx) {
    await this.verifyClientOrgMatchesPeerOrg1(ctx);

    const transientMap = await ctx.stub.getTransient();
    const transientHealthRecordJSON = transientMap.get('recordUpdate_properties');
    if (!transientHealthRecordJSON) {
      throw new Error('healthRecord details not found in transient map');
    }


    const healthRecordInput = JSON.parse(transientHealthRecordJSON.toString());


    const healthRecordBytes = await ctx.stub.getPrivateData(lockerCollection, healthRecordInput.id);
    if (healthRecordBytes.length === 0) {
      throw new Error(`healthRecord with Id ${healthRecordInput.id} not found`);
    }


    const existingHealthRecord = JSON.parse(healthRecordBytes.toString());

    if (healthRecordInput.id) {
      existingHealthRecord.id = healthRecordInput.id;
    }
    if (healthRecordInput.userId) {
      existingHealthRecord.userId = healthRecordInput.userId;
    }
    if (healthRecordInput.lockerId) {
      existingHealthRecord.lockerId = healthRecordInput.lockerId;
    }
    if (healthRecordInput.createdAt) {
      existingHealthRecord.createdAt = healthRecordInput.createdAt;
    }
    if (healthRecordInput.title) {
      existingHealthRecord.title = healthRecordInput.title;
    }
    if (healthRecordInput.hospital) {
      existingHealthRecord.hospital = healthRecordInput.hospital;
    }
    if (healthRecordInput.visitPurpose) {
      existingHealthRecord.visitPurpose = healthRecordInput.visitPurpose;
    }
    if (healthRecordInput.description) {
      existingHealthRecord.description = healthRecordInput.description;
    }
    if (healthRecordInput.typeTag) {
      existingHealthRecord.typeTag = healthRecordInput.typeTag;
    }
    if (healthRecordInput.key) {
      existingHealthRecord.key = healthRecordInput.key;
    }

    await ctx.stub.putPrivateData(lockerCollection, healthRecordInput.id, Buffer.from(JSON.stringify(existingHealthRecord)));

    return `healthRecord with Id ${healthRecordInput.id} has been updated successfully.`;

  }

  async getHealthRecord(ctx, id) {
    await this.verifyClientOrgMatchesPeerOrg1(ctx);

    const healthRecordBytes = await ctx.stub.getPrivateData(lockerCollection, id);
    if (healthRecordBytes.length === 0) {
      throw new Error(`healthRecord with ID ${id} not found`);
    }

    const healthRecord = JSON.parse(healthRecordBytes.toString());
    return healthRecord;
  }

  async getAllHealthRecord(ctx) {
    return await this.getHealthRecordByRange(ctx, '', '')
  }

  async deleteHealthRecord(ctx, id) {
    await this.verifyClientOrgMatchesPeerOrg1(ctx);

    const healthRecordExists = await ctx.stub.getPrivateData(lockerCollection, id);
    if (!healthRecordExists || healthRecordExists.length === 0) {
      throw new Error(`healthRecord with ID ${id} does not exist`);
    }

    await ctx.stub.deletePrivateData(lockerCollection, id);

    return `Health record with ID ${id} has been deleted`;
  }

  async getHealthRecordByRange(ctx, startKey, endKey) {
    await this.verifyClientOrgMatchesPeerOrg1(ctx);

    const resultsIterator = ctx.stub.getPrivateDataByRange(lockerCollection, startKey, endKey);
    const results = [];
    let totalCount = 0;

    for await (const res of resultsIterator) {


      const resBytesToString = String.fromCharCode(...res.value);
      const jsonFromString = JSON.parse(resBytesToString);

      if (jsonFromString.docType === 'health Record') {
        totalCount++;
        results.push({
          docType: jsonFromString.docType,
          id: jsonFromString.id,
          userId: jsonFromString.userId,
          lockerId: jsonFromString.lockerId,
          createdAt: jsonFromString.createdAt,
          title: jsonFromString.title,
          hospital: jsonFromString.hospital,
          visitPurpose: jsonFromString.visitPurpose,
          description: jsonFromString.description,
          typeTag: jsonFromString.typeTag,
          key: jsonFromString.key
        });
      }
    }

    return results;

    // return {
    //   totalCount: totalCount,
    //   results: results,
    // };
  }

  async getQueryResultForQueryStringHealthRecord(ctx, queryString) {
    const resultsIterator = ctx.stub.getPrivateDataQueryResult(lockerCollection, queryString);
    const results = [];
    for await (const res of resultsIterator) {
      const jsonFromString = JSON.parse(res.value.toString('utf8'));
      results.push({
        docType: 'health Record',
        id: jsonFromString.id,
        userId: jsonFromString.userId,
        lockerId: jsonFromString.lockerId,
        createdAt: jsonFromString.createdAt,
        title: jsonFromString.title,
        hospital: jsonFromString.hospital,
        visitPurpose: jsonFromString.visitPurpose,
        description: jsonFromString.description,
        typeTag: jsonFromString.typeTag,
        key: jsonFromString.key
      });
    }
    return results;
  }

  async queryHealthRecord(ctx, parameterName, parameterValue) {
    await this.verifyClientOrgMatchesPeerOrg1(ctx);
    let queryString = {
      selector: {
        docType: 'health Record',
        [parameterName]: parameterValue,
      },
    };
    return await this.getQueryResultForQueryStringHealthRecord(ctx, JSON.stringify(queryString));
  }

  //the user creates a token which gives access to other users for limited time with the help of composite key
  async createShareToken(ctx) {
    await this.verifyClientOrgMatchesPeerOrg1(ctx);
    const transientMap = await ctx.stub.getTransient();
    const transientuserJSON = transientMap.get('shareToken_properties');
    if (!transientuserJSON) {
      throw new Error('shareToken details not found in transient map');
    }
    const shareTokenInput = JSON.parse(transientuserJSON.toString());

    if (!shareTokenInput.recordId || !shareTokenInput.userId
      || !shareTokenInput.recipientId || !shareTokenInput.createdAt
      || !shareTokenInput.expiryAt || !shareTokenInput.accessType || !shareTokenInput.salt) {
      throw new Error('Invalid user shareTokenInput');
    }

    const shareToken = {
      docType: 'shareToken',
      recordId: shareTokenInput.recordId,
      userId: shareTokenInput.userId,
      recipientId: shareTokenInput.recipientId,
      createdAt: shareTokenInput.createdAt,
      expiryAt: shareTokenInput.expiryAt,
      accessType: shareTokenInput.accessType,
    }

    const indexName = 'shareToken-sharing';
    const compositKey = ctx.stub.createCompositeKey(indexName, [shareToken.userId, shareToken.recipientId, shareTokenInput.salt]);
    if (!compositKey) {
      throw new Error(`shareToken not Confirmed for ${shareTokenInput.userId}`);
    }

    const existingShareTokenBytes = await ctx.stub.getPrivateData(lockerCollection, compositKey);
    if (existingShareTokenBytes.length !== 0) {
      throw new Error('shareToken already exists for the given user and recipient');
    }
    const bufferData = Buffer.from(JSON.stringify(shareToken));
    await ctx.stub.putPrivateData(lockerCollection, compositKey, bufferData);
    return `shareToken initiated by user ${shareTokenInput.userId}`;
  }

  async getShareToken(ctx, userid, recipientid, salt) {
    await this.verifyClientOrgMatchesPeerOrg1(ctx);

    const indexName = 'shareToken-sharing';
    const compositeKey = ctx.stub.createCompositeKey(indexName, [userid, recipientid, salt]);
    const existingShareTokenBytes = await ctx.stub.getPrivateData(lockerCollection, compositeKey);

    if (existingShareTokenBytes.length === 0) {
      throw new Error('ShareToken not found');
    }

    const existingShareToken = JSON.parse(existingShareTokenBytes.toString());
    return existingShareToken;
  }

  async updateShareToken(ctx) {
    await this.verifyClientOrgMatchesPeerOrg1(ctx);

    const transientMap = await ctx.stub.getTransient();
    const transientShareTokenJSON = transientMap.get('shareToken_update_properties');
    if (!transientShareTokenJSON) {
      throw new Error('ShareToken details not found in transient map');
    }

    const shareTokenInput = JSON.parse(transientShareTokenJSON.toString());

    const indexName = 'shareToken-sharing'
    const compositeKey = ctx.stub.createCompositeKey(indexName, [
      shareTokenInput.userId,
      shareTokenInput.recipientId,
      shareTokenInput.salt,
    ]);

    const existingShareTokenBytes = await ctx.stub.getPrivateData(lockerCollection, compositeKey);
    if (existingShareTokenBytes.length === 0) {
      throw new Error('shareTokenInput not found');
    }

    const existingShareToken = JSON.parse(existingShareTokenBytes.toString());

    if (shareTokenInput.userId) {
      existingShareToken.userId = shareTokenInput.userId;
    }
    if (shareTokenInput.recordId) {
      existingShareToken.recordId = shareTokenInput.recordId;
    }
    if (shareTokenInput.recipientId) {
      existingShareToken.recipientId = shareTokenInput.recipientId;
    }
    if (shareTokenInput.createdAt) {
      existingShareToken.createdAt = shareTokenInput.createdAt;
    }
    if (shareTokenInput.expiryAt) {
      existingShareToken.expiryAt = shareTokenInput.expiryAt;
    }
    if (shareTokenInput.AccessType) {
      existingShareToken.AccessType = shareTokenInput.AccessType;
    }

    await ctx.stub.putPrivateData(lockerCollection, compositeKey, Buffer.from(JSON.stringify(existingShareToken)));

    return `ShareToken with composite key ${compositeKey} has been updated successfully`;
  }

  async deleteShareToken(ctx, userid, recipientid, salt) {
    await this.verifyClientOrgMatchesPeerOrg1(ctx);
    const indexName = 'shareToken-sharing';

    const compositeKey = ctx.stub.createCompositeKey(indexName, [userid, recipientid, salt]);

    const existingShareTokenBytes = await ctx.stub.getPrivateData(lockerCollection, compositeKey);
    if (existingShareTokenBytes.length === 0) {
      throw new Error('shareToken not found');
    }

    // Delete the encounter
    await ctx.stub.deletePrivateData(lockerCollection, compositeKey);

    return `shareToken with composite key ${compositeKey} has been deleted successfully`;
  }

  //this function should be called by the recepient and should create the composite key to fetch the share token and pull the record corresponding to it
  async readRecord(ctx, userid, recipientid, salt) {

    await this.verifyClientOrgMatchesPeerOrg1(ctx);

    const shareToken = await this.getShareToken(ctx, userid, recipientid, salt);

    //checck if the time of expiry is more than current time
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const expirationTime = shareToken.expiryAt;
    if (currentTimestamp > expirationTime) {
      throw new Error('shareToken has expired');
    }

    const recordId = shareToken.recordId;
    const _healthRecord = await this.getHealthRecord(ctx, recordId);

    return _healthRecord;
  }
}

module.exports = healthLocker;
