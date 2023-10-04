/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const healthLocker = require('./lib/healthLockerCC')

module.exports.healthLocker = healthLocker;

module.exports.contracts = [healthLocker];
