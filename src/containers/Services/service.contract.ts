import { toHex } from "viem";
import { type Address } from "wagmi";

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

export const prepareOrder = (
  token: Address,
  aToken: Address,
  amount: bigint,
  leverage: number
) => {
  const amountInLeverage = leverageConverter(amount, leverage);

  const collateral: ServiceCollateral = {
    itemType: 0,
    token: aToken,
    identifier: BigInt(0),
    amount: amount + amountInLeverage,
  };
  const loan: ServiceLoan = {
    token,
    amount: amountInLeverage,
    margin: amount,
    interestAndSpread: BigInt(0),
  };
  const agreement: ServiceAgreement = {
    loans: [loan],
    collaterals: [collateral],
    createdAt: BigInt(0),
    status: 0,
  };

  const order: IServiceOrder = {
    agreement,
    // @ts-ignore
    data: toHex([]), //[] as `0x${string}`,
  };

  return order;
};
