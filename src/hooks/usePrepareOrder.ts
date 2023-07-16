import { encodeAbiParameters, parseAbiParameters, toHex } from "viem";
import { type Address } from "wagmi";

import {
  useAaveRateAndSpread,
  useGmxRateAndSpread,
} from "@/hooks/useRateAndSpread";

interface ServiceLoan {
  token: Address;
  amount: bigint;
  margin: bigint;
  interestAndSpread: bigint;
}

interface ServiceCollateral {
  itemType: number;
  token: Address;
  identifier: bigint;
  amount: bigint;
}

export interface ServiceAgreement {
  loans: ServiceLoan[];
  collaterals: ServiceCollateral[];
  createdAt: bigint;
  status: number;
}

interface IServiceOrder {
  agreement: ServiceAgreement;
  data: Address;
}

const leverageConverter = (amount: bigint, leverage: number) => {
  const bigLeverage = BigInt(leverage * 100);
  const result = amount * bigLeverage;
  return result / BigInt(100);
};

export const usePrepareOrder = (
  token: Address,
  collateralToken: Address,
  amount: bigint,
  leverage: number
) => {
  const amountInLeverage = leverageConverter(amount, leverage);
  const {
    interestAndSpread,
    displayInterestAndSpreadInPercent,
    isInterestAndSpreadLoading,
  } = useAaveRateAndSpread({
    tokenAddress: token,
    loan: amountInLeverage,
    margin: amount,
  });

  const collateral: ServiceCollateral = {
    itemType: 0,
    token: collateralToken,
    identifier: BigInt(0),
    amount: amount + amountInLeverage,
  };
  const loan: ServiceLoan = {
    token,
    amount: amountInLeverage,
    margin: amount,
    interestAndSpread,
  };
  const agreement: ServiceAgreement = {
    loans: [loan],
    collaterals: [collateral],
    createdAt: BigInt(0),
    status: 0,
  };

  const order: IServiceOrder = {
    agreement,
    data: toHex(""),
  };

  console.log("ii", order);

  return {
    order,
    displayInterestAndSpreadInPercent,
    isInterestAndSpreadLoading,
  };
};

export const useGmxPrepareOrder = (
  token: Address,
  collateralToken: Address,
  amount: bigint,
  leverage: number
) => {
  const amountInLeverage = leverageConverter(amount, leverage);
  const {
    interestAndSpread,
    displayInterestAndSpreadInPercent,
    isInterestAndSpreadLoading,
  } = useGmxRateAndSpread({
    tokenAddress: token,
    loan: amountInLeverage,
    margin: amount,
  });

  const collateral: ServiceCollateral = {
    itemType: 0,
    token: collateralToken,
    identifier: BigInt(0),
    amount: amount + amountInLeverage,
  };
  const loan: ServiceLoan = {
    token,
    amount: amountInLeverage,
    margin: amount,
    interestAndSpread,
  };
  const agreement: ServiceAgreement = {
    loans: [loan],
    collaterals: [collateral],
    createdAt: BigInt(0),
    status: 0,
  };

  const order: IServiceOrder = {
    agreement,
    data: encodeAbiParameters(parseAbiParameters("uint256"), [0n]),
  };

  return {
    order,
    displayInterestAndSpreadInPercent,
    isInterestAndSpreadLoading,
  };
};
