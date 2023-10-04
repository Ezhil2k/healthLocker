
/home/dewstar/web3/fabric-samples/test-network/network.sh down

/home/dewstar/web3/fabric-samples/test-network/network.sh up createChannel -ca -s couchdb

/home/dewstar/web3/fabric-samples/test-network/network.sh deployCC -ccn healthLocker -ccp ../healthLocker/chaincode-javascript/ -ccl javascript  -ccep "OR('Org1MSP.peer','Org2MSP.peer')" -cccg ../healthLocker/chaincode-javascript/collections_config.json 

