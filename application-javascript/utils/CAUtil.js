/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const adminUserId = 'admin';
const adminUserPasswd = 'adminpw';

/**  
 *
 * @param {*} FabricCAServices
 * @param {*} ccp
 */
exports.buildCAClient = (FabricCAServices, ccp, caHostName) => {
	// Create a new CA client for interacting with the CA.
	const caInfo = ccp.certificateAuthorities[caHostName]; //lookup CA details from config
	const caTLSCACerts = caInfo.tlsCACerts.pem;
	const caClient = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

	console.log(`Built a CA Client named ${caInfo.caName}`);
	return caClient;
};

exports.enrollAdmin = async (caClient, wallet, orgMspId) => {
	try {
		// Check to see if we've already enrolled the admin user.
		const identity = await wallet.get(adminUserId);
		if (identity) {
			console.log('An identity for the admin user already exists in the wallet');
			return;
		}

		// Enroll the admin user, and import the new identity into the wallet.
		const enrollment = await caClient.enroll({ enrollmentID: adminUserId, enrollmentSecret: adminUserPasswd });
		//When a user is enrolled with a CA, they are issued a certificate and a private key that are used to authenticate the user
		const x509Identity = {
			credentials: {
				certificate: enrollment.certificate, 
				privateKey: enrollment.key.toBytes(),  //storing privateKey as bytes.
			},
			mspId: orgMspId,
			type: 'X.509',
		};
		await wallet.put(adminUserId, x509Identity);
		console.log('Successfully enrolled admin user and imported it into the wallet');
	} catch (error) {
		console.error(`Failed to enroll admin user : ${error}`);
	}
};

exports.registerAndEnrollUser = async (caClient, wallet, orgMspId, userId, affiliation) => {
	try {
		// Check to see if we've already enrolled the user
		const userIdentity = await wallet.get(userId);
		if (userIdentity) {
			console.log(`An identity for the user ${userId} already exists in the wallet`);
			return;
		}

		// Must use an admin to register a new user
		const adminIdentity = await wallet.get(adminUserId);
		if (!adminIdentity) {
			console.log('An identity for the admin user does not exist in the wallet');
			console.log('Enroll the admin user before retrying');
			return;
		}

		// build a user object for authenticating with the CA
		const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
		const adminUser = await provider.getUserContext(adminIdentity, adminUserId);

		// Register the user, enroll the user, and import the new identity into the wallet.
		// if affiliation is specified by client, the affiliation value must be configured in CA
		const secret = await caClient.register({
			affiliation: affiliation,
			enrollmentID: userId,
			role: 'client'
		}, adminUser);
		const enrollment = await caClient.enroll({
			enrollmentID: userId,
			enrollmentSecret: secret
		});
		//
		const x509Identity = {
			credentials: {
				certificate: enrollment.certificate,
				privateKey: enrollment.key.toBytes(),
			},
			mspId: orgMspId,
			type: 'X.509',
		};
		await wallet.put(userId, x509Identity);
		console.log(`Successfully registered and enrolled user ${userId} and imported it into the wallet`);
	} catch (error) {
		console.error(`Failed to register user : ${error}`);
	}
};
exports.updateUser = async (caClient, wallet, userId, affiliation) => {
    try {
        // Must use an admin to update a user's affiliation
        const adminIdentity = await wallet.get(adminUserId);
        if (!adminIdentity) {
            console.log('An identity for the admin user does not exist in the wallet');
            console.log('Enroll the admin user before retrying');
            return;
        }

        // Fetch user's identity from the wallet
        const userIdentity = await wallet.get(userId);
        if (!userIdentity) {
            console.log(`No identity exists for the user ${userId} in the wallet`);
            return;
        }

        // build a user object for authenticating with the CA
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, adminUserId);

        // Update user's affiliation
        await caClient.reenroll({
            enrollmentID: userId,
            role: 'client',
            affiliation: affiliation,
            enrollmentSecret: userIdentity.credentials.privateKey.toString('hex'),
        }, adminUser);

        console.log(`Successfully updated user ${userId}'s affiliation`);
    } catch (error) {
        console.error(`Failed to update user: ${error}`);
    }
};


exports.deactivateUser = async (caClient, wallet, userId) => {
    try {
        // Must use an admin to revoke or suspend a user's certificate
        const adminIdentity = await wallet.get(adminUserId);
        if (!adminIdentity) {
            console.log('An identity for the admin user does not exist in the wallet');
            console.log('Enroll the admin user before retrying');
            return;
        }

        // Fetch user's identity from the wallet
        const userIdentity = await wallet.get(userId);
        if (!userIdentity) {
            console.log(`No identity exists for the user ${userId} in the wallet`);
            return;
        }

        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, adminUserId);

        await caClient.revoke({
            enrollmentID: userId,
            reason: 'Deactivated', 
        }, adminUser);

        console.log(`Successfully deactivated user ${userId}`);
    } catch (error) {
        console.error(`Failed to deactivate user: ${error}`);
    }
};



/**
 * exports.deleteUser = async (wallet, userId) => {
    try {
        // Fetch user's identity from the wallet
        const userIdentity = await wallet.get(userId);
        if (!userIdentity) {
            console.log(`No identity exists for the user ${userId} in the wallet`);
            return;
        }

        // Remove user's identity from the wallet
        await wallet.remove(userId);

        console.log(`Successfully deleted user ${userId}'s identity from the wallet`);
    } catch (error) {
        console.error(`Failed to delete user: ${error}`);
    }
};
 */