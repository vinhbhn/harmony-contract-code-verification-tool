import { Harmony } from '@harmony-js/core';
import { ChainID, ChainType } from '@harmony-js/utils';

const rpcUrl = {
  testnet: 'https://api.s0.b.hmny.io/',
  mainnet: 'https://api.s0.t.hmny.io/',
};

const testnet = new Harmony(rpcUrl.testnet, {
  chainType: ChainType.Harmony,
  chainId: ChainID.HmyTestnet,
});

const mainnet = new Harmony(rpcUrl.mainnet, {
  chainType: ChainType.Harmony,
  chainId: ChainID.HmyMainnet,
});

export const getSmartContractCode = async (chain: string, address: string) => {
  const hmy = chain === 'mainnet' ? mainnet : testnet;
  const response = await hmy.blockchain.getCode({
    address,
    blockNumber: 'latest',
  });

  return response.result;
};
