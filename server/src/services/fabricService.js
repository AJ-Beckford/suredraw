import { connectFabric } from '../config/fabric.js';

export const invokeChaincode = async (userIdentity, transactionName, ...args) => {
  try {
    const { network, gateway } = await connectFabric(userIdentity);
    const contract = network.getContract(process.env.CHAINCODE_NAME);
    
    const result = await contract.submitTransaction(transactionName, ...args);
    await gateway.disconnect();
    
    return JSON.parse(result.toString());
  } catch (error) {
    throw new Error(`Fabric transaction failed: ${error.message}`);
  }
};

export const queryChaincode = async (userIdentity, transactionName, ...args) => {
  try {
    const { network, gateway } = await connectFabric(userIdentity);
    const contract = network.getContract(process.env.CHAINCODE_NAME);
    
    const result = await contract.evaluateTransaction(transactionName, ...args);
    await gateway.disconnect();
    
    return JSON.parse(result.toString());
  } catch (error) {
    throw new Error(`Fabric query failed: ${error.message}`);
  }
};