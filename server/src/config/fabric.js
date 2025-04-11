import { Gateway, Wallets } from 'fabric-network';
import fs from 'fs';
import path from 'path';

const buildCCP = () => {
  const ccpPath = path.resolve(process.env.FABRIC_CCP_PATH);
  return JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
};

const buildWallet = async () => {
  const walletPath = path.join(process.cwd(), 'wallet');
  return await Wallets.newFileSystemWallet(walletPath);
};

export const connectFabric = async (userIdentity) => {
  const ccp = buildCCP();
  const wallet = await buildWallet();
  
  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: userIdentity,
    discovery: { enabled: true, asLocalhost: true }
  });

  return {
    network: await gateway.getNetwork(process.env.CHANNEL_NAME),
    gateway
  };
};