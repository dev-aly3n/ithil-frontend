import { useQuery } from "@tanstack/react-query";
import { multicall } from "@wagmi/core";
import Decimal from "decimal.js";
import { useAccount } from "wagmi";

import { assets } from "@/data/assets";
import contracts from "@/deploy/contracts.json";
import { vaultABI } from "@/hooks/generated/vault";
import { Vaults } from "@/types";
import { ErrorCause } from "@/utils/error-cause";
import { multiplyBigNumbers, oneUnitWithDecimals } from "@/utils/input.utils";

const VaultAbi = [...vaultABI];

const getVaultData = async (address?: string) => {
  const totalAssetsCalls = assets.map((token) => ({
    address: token.vaultAddress,
    abi: VaultAbi,
    functionName: "totalAssets",
  }));
  const freeLiquidityCalls = assets.map((token) => ({
    address: token.vaultAddress,
    abi: VaultAbi,
    functionName: "freeLiquidity",
  }));

  const balanceOfCalls =
    address != null
      ? assets.map((token) => ({
          address: token.vaultAddress,
          abi: VaultAbi,
          functionName: "balanceOf",
          args: [address],
        }))
      : [];

  const convertToAssetCalls = assets.map((token) => ({
    address: token.vaultAddress,
    abi: VaultAbi,
    functionName: "convertToAssets",
    args: [oneUnitWithDecimals(token.decimals)],
  }));
  const netLoans = assets.map((token) => ({
    address: token.vaultAddress,
    abi: VaultAbi,
    functionName: "netLoans",
  }));

  const creationTime = assets.map((token) => ({
    address: token.vaultAddress,
    abi: VaultAbi,
    functionName: "creationTime",
  }));

  const callOptionBalances = assets.map((asset) => ({
    address: asset.vaultAddress,
    abi: VaultAbi,
    functionName: "balanceOf",
    args: [asset.callOptionAddress],
  }));

  const fixedYieldBalance = assets.map((asset) => ({
    address: asset.vaultAddress,
    abi: VaultAbi,
    functionName: "balanceOf",
    args: [contracts.fixedYieldService],
  }));

  const currentProfits = assets.map((asset) => ({
    address: asset.vaultAddress,
    abi: VaultAbi,
    functionName: "currentProfits",
  }));

  const totalSupply = assets.map((asset) => ({
    address: asset.vaultAddress,
    abi: VaultAbi,
    functionName: "totalSupply",
  }));

  const multicallData = await multicall({
    contracts: [
      ...totalAssetsCalls,
      ...freeLiquidityCalls,
      ...balanceOfCalls,
      ...convertToAssetCalls,
      ...netLoans,
      ...creationTime,
      ...callOptionBalances,
      ...fixedYieldBalance,
      ...currentProfits,
      ...totalSupply,
    ],
  });

  if (multicallData.some((data) => data == null)) {
    throw new Error("Error fetching vault data", {
      cause: new ErrorCause(
        "In localhost a wallet has to be connected for the UI to function"
      ),
    });
  }

  const length = assets.length;

  const data: Vaults = assets.map((asset, idx) => {
    // tvl informations are available at index 0...length
    const tvl = multicallData[idx].result as bigint;
    // freeLiquidity informations are available at index length...length*2

    // const freeLiquidity = multicallData[length + idx].result as bigint;

    // deposited informations are available at index length*2...length*3
    const depositedShares =
      address != null
        ? (multicallData[length * 2 + idx].result as bigint)
        : BigInt(0);
    // sharesToAsset informations are available at index length*3...length*4
    const sharesToAsset = multicallData[length * 3 + idx].result as bigint;
    const depositedAssets = multiplyBigNumbers(
      depositedShares,
      sharesToAsset,
      asset.decimals
    );

    const borrowed = multicallData[length * 4 + idx].result as bigint;
    const creationTime = multicallData[length * 5 + idx].result as bigint;
    const callOptionBalances = multicallData[length * 6 + idx].result as bigint;
    const fixedYieldBalance = multicallData[length * 7 + idx].result as bigint;
    const currentProfits = multicallData[length * 8 + idx].result as bigint;
    const totalSupply = multicallData[length * 9 + idx].result as bigint;

    const vaultTotalAssetsDecimal = new Decimal(tvl.toString());
    const vaultCurrentProfitsDecimal = new Decimal(currentProfits.toString());
    const vaultTotalSupplyDecimal = new Decimal(totalSupply.toString());
    const fixedYieldServiceBalance = new Decimal(fixedYieldBalance.toString());
    const callOptionBalanceDecimal = new Decimal(callOptionBalances.toString());
    const creationTimeDecimal = new Decimal(creationTime.toString());

    const numerator = vaultTotalAssetsDecimal.plus(vaultCurrentProfitsDecimal);
    const denominator = vaultTotalSupplyDecimal
      .minus(fixedYieldServiceBalance)
      .minus(callOptionBalanceDecimal);

    const currentTimeInSeconds = new Decimal(
      Math.floor(new Date().getTime() / 1000)
    ); // Convert current time to seconds
    const timeDifference = currentTimeInSeconds.minus(creationTimeDecimal);

    const apy = numerator
      .div(denominator)
      .minus(1)
      .mul(365 * 86400)
      .mul(100)
      .div(timeDifference);
    // const apy = new Decimal(
    //   new Decimal(sharesToAsset.toString())
    //     .div(10 ** asset.decimals)
    //     .minus(1)
    //     .toString()
    // )
    //   .mul(365 * 86400)
    //   .mul(100)
    //   .div(
    //     new Date().getTime() / 1000 -
    //       Number(multicallData[length * 5 + idx].result)
    //   );

    return {
      token: asset,
      tvl,
      borrowed,
      deposited: depositedAssets,
      apy: apy.toString(),
    };
  });
  return data;
};

export const useVaults = () => {
  const { address } = useAccount();

  return useQuery({
    queryKey: ["vaults", address],
    queryFn: async () => await getVaultData(address),
    keepPreviousData: true,
    placeholderData: assets.map((asset) => ({ token: asset })),

    retry: (failureCount, error: Error): boolean => {
      // avoid retrying if the error is handled
      if (ErrorCause.isErrorCause(error.cause)) return false;
      return true;
    },

    // FIXME: handle errors with chakra-ui/toast
    // onError: (error: Error) => {}
  });
};
