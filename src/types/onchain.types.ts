import { type BigNumber } from "@ethersproject/bignumber";
import { type Address } from "wagmi";

// the minimal intersection of LendingToken and ServiceAsset
export interface MinimalToken {
  name: string;
  coingeckoId: string;
  iconName: string;
  decimals: number;
  tokenAddress: Address;
}

// used in Lend page
export interface LendingToken extends MinimalToken {
  vaultAddress: Address;
}
export type LendingTokenList = LendingToken[];
export type Vaults = Array<{
  key: string;
  token: LendingTokenList[number];
  tvl?: BigNumber;
  borrowed?: BigNumber;
  deposited?: BigNumber;
}>;

// used in services page
export interface AaveAsset {
  name: string;
  coingeckoId: string;
  iconName: string;
  decimals: number;
  tokenAddress: Address;
  aTokenAddress: Address;
}
export type AaveAssetHash = Record<Lowercase<string>, AaveAsset>;

// JSON source data is in this format
export interface AaveJson {
  name: string;
  description: string;
  assets: AaveAsset[];
}
// will get converted in this (more convenient) format
export interface AaveService extends Omit<AaveJson, "assets"> {
  assets: AaveAssetHash;
  address: Address;
}

export interface Services {
  aave: AaveService;
  [key: Lowercase<string>]: unknown;
}

// add 'gmx' here
type ServicesAvailable = "aave";
export type SupportedServiceName = Lowercase<ServicesAvailable>;
