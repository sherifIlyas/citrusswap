import { ethers } from 'ethers';

const SONIC_BLAZE_TESTNET = {
  chainId: 57054,
  name: 'Sonic Blaze Testnet',
  currencySymbol: 'S',
  rpcUrls: ['https://rpc.blaze.soniclabs.com'],
  blockExplorerUrls: ['https://testnet.sonicscan.org']
};

export const sonicBlazeProvider = new ethers.providers.JsonRpcProvider(SONIC_BLAZE_TESTNET.rpcUrls[0], {
  chainId: SONIC_BLAZE_TESTNET.chainId,
  name: SONIC_BLAZE_TESTNET.name
});

export const getSonicBlazeSigner = (privateKey: string) => {
  return new ethers.Wallet(privateKey, sonicBlazeProvider);
};