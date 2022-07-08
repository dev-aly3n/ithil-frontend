import { ChainId, Config, Goerli, Mainnet } from '@usedapp/core';

import { infuraUrl, pollingIntervalProvider } from '@/global/utils';

export const POLLING_INTERVAL = 100_000;

export const DAPP_CONFIG: Config = {
  readOnlyChainId: ChainId.Mainnet,
  networks: [Mainnet, Goerli],
  readOnlyUrls: {
    [Mainnet.chainId]: pollingIntervalProvider(
      infuraUrl(Mainnet.chainId),
      POLLING_INTERVAL
    ),
    [Goerli.chainId]: pollingIntervalProvider(
      infuraUrl(Goerli.chainId),
      POLLING_INTERVAL
    ),
  },
  pollingInterval: POLLING_INTERVAL,
  multicallVersion: 2,
};
