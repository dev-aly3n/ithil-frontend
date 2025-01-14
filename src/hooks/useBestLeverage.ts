import { Decimal } from "decimal.js";
import { useCallOptionHalvingTime } from "./generated/callOption";

interface IBestLeverage {
  baseApy?: number;
  latestAndBase?: bigint;
  riskSpreads?: bigint;
  halvingTime?: bigint;
  freeLiquidity? : bigint;
  bigintAmount? : bigint;
  netLoans? : bigint;
  caps? : readonly [bigint, bigint, bigint];
}

export const useBestLeverage = ({
  baseApy,
  latestAndBase,
  riskSpreads,
  halvingTime,
  freeLiquidity,
  bigintAmount,
  netLoans,
  caps
}: IBestLeverage) => {
  const isLoading = !baseApy || !latestAndBase || !riskSpreads || !halvingTime || !freeLiquidity || !netLoans || !caps;
  const currentTime = Math.floor(Date.now() / 1000)
  if (isLoading)
    return {
      bestLeverage: 0,
      isLoading: true,
    };
  const margin = !bigintAmount ? BigInt(0) : bigintAmount
  const latest = latestAndBase / BigInt(2 ** 128)
  const base = latestAndBase - latest * BigInt(2 ** 128)
  const timeFactor =
     BigInt(currentTime) < BigInt(2) * halvingTime + latest ?
      BigInt(2) * halvingTime + latest - BigInt(currentTime) : BigInt(0)
  const numerator = freeLiquidity * (BigInt(2 * Math.floor(baseApy * 10 ** 16)) * halvingTime - base * timeFactor)
  const denominator =
    BigInt(4) * halvingTime * (freeLiquidity + margin) * riskSpreads
    + BigInt(2) * base * margin * timeFactor

  const bestLeverageFree = Number(numerator) / Number(denominator)

  const bestLeverageAbsCap = Number(caps[1] - caps[2]) / Number(margin)

  const bestLeveragePercentageCap = Number(caps[0] * (freeLiquidity + netLoans) / BigInt(10 ** 18) - caps[2]) / Number(margin)

  const bestLeverage = Math.min(bestLeverageFree, bestLeverageAbsCap, bestLeveragePercentageCap)

  return {
    bestLeverage: bestLeverage.toFixed(1),
    isLoading: false,
  };
};
