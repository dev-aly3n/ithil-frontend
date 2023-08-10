// Generated by @wagmi/cli@1.3.0 on 8/10/2023 at 3:55:35 PM
import {
  UseContractEventConfig,
  UseContractReadConfig,
  UseContractWriteConfig,
  UsePrepareContractWriteConfig,
  useContractEvent,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import {
  PrepareWriteContractResult,
  ReadContractResult,
  WriteContractMode,
} from "wagmi/actions";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Manager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const managerABI = [
  {
    type: "error",
    inputs: [{ name: "exposure", internalType: "uint256", type: "uint256" }],
    name: "AbsoluteCapExceeded",
  },
  {
    type: "error",
    inputs: [
      { name: "investedPortion", internalType: "uint256", type: "uint256" },
    ],
    name: "InvestmentCapExceeded",
  },
  { type: "error", inputs: [], name: "MaxAmountExceeded" },
  { type: "error", inputs: [], name: "RestrictedToOwner" },
  { type: "error", inputs: [], name: "RestrictedToWhitelisted" },
  { type: "error", inputs: [], name: "VaultMissing" },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "service",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "token",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "percentageCap",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      {
        name: "absoluteCap",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "CapWasUpdated",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "previousOwner",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "newOwner",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "OwnershipTransferred",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "service",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "token",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "spread",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "SpreadWasUpdated",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "service",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "token",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "TokenWasRemovedFromService",
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "token", internalType: "address", type: "address" },
      { name: "amount", internalType: "uint256", type: "uint256" },
      { name: "loan", internalType: "uint256", type: "uint256" },
      { name: "receiver", internalType: "address", type: "address" },
    ],
    name: "borrow",
    outputs: [
      { name: "", internalType: "uint256", type: "uint256" },
      { name: "", internalType: "uint256", type: "uint256" },
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "", internalType: "address", type: "address" },
      { name: "", internalType: "address", type: "address" },
    ],
    name: "caps",
    outputs: [
      { name: "percentageCap", internalType: "uint256", type: "uint256" },
      { name: "absoluteCap", internalType: "uint256", type: "uint256" },
      { name: "exposure", internalType: "uint256", type: "uint256" },
    ],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [{ name: "token", internalType: "address", type: "address" }],
    name: "create",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "owner",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "token", internalType: "address", type: "address" },
      { name: "amount", internalType: "uint256", type: "uint256" },
      { name: "debt", internalType: "uint256", type: "uint256" },
      { name: "repayer", internalType: "address", type: "address" },
    ],
    name: "repay",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "salt",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "service", internalType: "address", type: "address" },
      { name: "token", internalType: "address", type: "address" },
      { name: "percentageCap", internalType: "uint256", type: "uint256" },
      { name: "absoluteCap", internalType: "uint256", type: "uint256" },
    ],
    name: "setCap",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "token", internalType: "address", type: "address" },
      { name: "feeUnlockTime", internalType: "uint256", type: "uint256" },
    ],
    name: "setFeeUnlockTime",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "vaultToken", internalType: "address", type: "address" },
      { name: "spuriousToken", internalType: "address", type: "address" },
      { name: "to", internalType: "address", type: "address" },
    ],
    name: "sweep",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [{ name: "vaultToken", internalType: "address", type: "address" }],
    name: "toggleVaultLock",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [{ name: "newOwner", internalType: "address", type: "address" }],
    name: "transferOwnership",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "", internalType: "address", type: "address" }],
    name: "vaults",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
] as const;

export const managerAddress =
  "0x9136D8C2d303D47e927e269134eC3fB39576dB3E" as const;

export const managerConfig = {
  address: managerAddress,
  abi: managerABI,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link managerABI}__.
 */
export function useManagerRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof managerABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof managerABI, TFunctionName, TSelectData>,
    "abi" | "address"
  > = {} as any
) {
  return useContractRead({
    abi: managerABI,
    address: managerAddress,
    ...config,
  } as UseContractReadConfig<typeof managerABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link managerABI}__ and `functionName` set to `"caps"`.
 */
export function useManagerCaps<
  TFunctionName extends "caps",
  TSelectData = ReadContractResult<typeof managerABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof managerABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: managerABI,
    address: managerAddress,
    functionName: "caps",
    ...config,
  } as UseContractReadConfig<typeof managerABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link managerABI}__ and `functionName` set to `"owner"`.
 */
export function useManagerOwner<
  TFunctionName extends "owner",
  TSelectData = ReadContractResult<typeof managerABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof managerABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: managerABI,
    address: managerAddress,
    functionName: "owner",
    ...config,
  } as UseContractReadConfig<typeof managerABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link managerABI}__ and `functionName` set to `"salt"`.
 */
export function useManagerSalt<
  TFunctionName extends "salt",
  TSelectData = ReadContractResult<typeof managerABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof managerABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: managerABI,
    address: managerAddress,
    functionName: "salt",
    ...config,
  } as UseContractReadConfig<typeof managerABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link managerABI}__ and `functionName` set to `"vaults"`.
 */
export function useManagerVaults<
  TFunctionName extends "vaults",
  TSelectData = ReadContractResult<typeof managerABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof managerABI, TFunctionName, TSelectData>,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: managerABI,
    address: managerAddress,
    functionName: "vaults",
    ...config,
  } as UseContractReadConfig<typeof managerABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link managerABI}__.
 */
export function useManagerWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof managerABI, string>["request"]["abi"],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof managerABI, TFunctionName, TMode> & {
        abi?: never;
      } = {} as any
) {
  return useContractWrite<typeof managerABI, TFunctionName, TMode>({
    abi: managerABI,
    address: managerAddress,
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link managerABI}__ and `functionName` set to `"borrow"`.
 */
export function useManagerBorrow<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof managerABI,
          "borrow"
        >["request"]["abi"],
        "borrow",
        TMode
      > & { functionName?: "borrow" }
    : UseContractWriteConfig<typeof managerABI, "borrow", TMode> & {
        abi?: never;
        functionName?: "borrow";
      } = {} as any
) {
  return useContractWrite<typeof managerABI, "borrow", TMode>({
    abi: managerABI,
    address: managerAddress,
    functionName: "borrow",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link managerABI}__ and `functionName` set to `"create"`.
 */
export function useManagerCreate<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof managerABI,
          "create"
        >["request"]["abi"],
        "create",
        TMode
      > & { functionName?: "create" }
    : UseContractWriteConfig<typeof managerABI, "create", TMode> & {
        abi?: never;
        functionName?: "create";
      } = {} as any
) {
  return useContractWrite<typeof managerABI, "create", TMode>({
    abi: managerABI,
    address: managerAddress,
    functionName: "create",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link managerABI}__ and `functionName` set to `"renounceOwnership"`.
 */
export function useManagerRenounceOwnership<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof managerABI,
          "renounceOwnership"
        >["request"]["abi"],
        "renounceOwnership",
        TMode
      > & { functionName?: "renounceOwnership" }
    : UseContractWriteConfig<typeof managerABI, "renounceOwnership", TMode> & {
        abi?: never;
        functionName?: "renounceOwnership";
      } = {} as any
) {
  return useContractWrite<typeof managerABI, "renounceOwnership", TMode>({
    abi: managerABI,
    address: managerAddress,
    functionName: "renounceOwnership",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link managerABI}__ and `functionName` set to `"repay"`.
 */
export function useManagerRepay<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof managerABI,
          "repay"
        >["request"]["abi"],
        "repay",
        TMode
      > & { functionName?: "repay" }
    : UseContractWriteConfig<typeof managerABI, "repay", TMode> & {
        abi?: never;
        functionName?: "repay";
      } = {} as any
) {
  return useContractWrite<typeof managerABI, "repay", TMode>({
    abi: managerABI,
    address: managerAddress,
    functionName: "repay",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link managerABI}__ and `functionName` set to `"setCap"`.
 */
export function useManagerSetCap<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof managerABI,
          "setCap"
        >["request"]["abi"],
        "setCap",
        TMode
      > & { functionName?: "setCap" }
    : UseContractWriteConfig<typeof managerABI, "setCap", TMode> & {
        abi?: never;
        functionName?: "setCap";
      } = {} as any
) {
  return useContractWrite<typeof managerABI, "setCap", TMode>({
    abi: managerABI,
    address: managerAddress,
    functionName: "setCap",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link managerABI}__ and `functionName` set to `"setFeeUnlockTime"`.
 */
export function useManagerSetFeeUnlockTime<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof managerABI,
          "setFeeUnlockTime"
        >["request"]["abi"],
        "setFeeUnlockTime",
        TMode
      > & { functionName?: "setFeeUnlockTime" }
    : UseContractWriteConfig<typeof managerABI, "setFeeUnlockTime", TMode> & {
        abi?: never;
        functionName?: "setFeeUnlockTime";
      } = {} as any
) {
  return useContractWrite<typeof managerABI, "setFeeUnlockTime", TMode>({
    abi: managerABI,
    address: managerAddress,
    functionName: "setFeeUnlockTime",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link managerABI}__ and `functionName` set to `"sweep"`.
 */
export function useManagerSweep<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof managerABI,
          "sweep"
        >["request"]["abi"],
        "sweep",
        TMode
      > & { functionName?: "sweep" }
    : UseContractWriteConfig<typeof managerABI, "sweep", TMode> & {
        abi?: never;
        functionName?: "sweep";
      } = {} as any
) {
  return useContractWrite<typeof managerABI, "sweep", TMode>({
    abi: managerABI,
    address: managerAddress,
    functionName: "sweep",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link managerABI}__ and `functionName` set to `"toggleVaultLock"`.
 */
export function useManagerToggleVaultLock<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof managerABI,
          "toggleVaultLock"
        >["request"]["abi"],
        "toggleVaultLock",
        TMode
      > & { functionName?: "toggleVaultLock" }
    : UseContractWriteConfig<typeof managerABI, "toggleVaultLock", TMode> & {
        abi?: never;
        functionName?: "toggleVaultLock";
      } = {} as any
) {
  return useContractWrite<typeof managerABI, "toggleVaultLock", TMode>({
    abi: managerABI,
    address: managerAddress,
    functionName: "toggleVaultLock",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link managerABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function useManagerTransferOwnership<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof managerABI,
          "transferOwnership"
        >["request"]["abi"],
        "transferOwnership",
        TMode
      > & { functionName?: "transferOwnership" }
    : UseContractWriteConfig<typeof managerABI, "transferOwnership", TMode> & {
        abi?: never;
        functionName?: "transferOwnership";
      } = {} as any
) {
  return useContractWrite<typeof managerABI, "transferOwnership", TMode>({
    abi: managerABI,
    address: managerAddress,
    functionName: "transferOwnership",
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link managerABI}__.
 */
export function usePrepareManagerWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof managerABI, TFunctionName>,
    "abi" | "address"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: managerABI,
    address: managerAddress,
    ...config,
  } as UsePrepareContractWriteConfig<typeof managerABI, TFunctionName>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link managerABI}__ and `functionName` set to `"borrow"`.
 */
export function usePrepareManagerBorrow(
  config: Omit<
    UsePrepareContractWriteConfig<typeof managerABI, "borrow">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: managerABI,
    address: managerAddress,
    functionName: "borrow",
    ...config,
  } as UsePrepareContractWriteConfig<typeof managerABI, "borrow">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link managerABI}__ and `functionName` set to `"create"`.
 */
export function usePrepareManagerCreate(
  config: Omit<
    UsePrepareContractWriteConfig<typeof managerABI, "create">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: managerABI,
    address: managerAddress,
    functionName: "create",
    ...config,
  } as UsePrepareContractWriteConfig<typeof managerABI, "create">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link managerABI}__ and `functionName` set to `"renounceOwnership"`.
 */
export function usePrepareManagerRenounceOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof managerABI, "renounceOwnership">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: managerABI,
    address: managerAddress,
    functionName: "renounceOwnership",
    ...config,
  } as UsePrepareContractWriteConfig<typeof managerABI, "renounceOwnership">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link managerABI}__ and `functionName` set to `"repay"`.
 */
export function usePrepareManagerRepay(
  config: Omit<
    UsePrepareContractWriteConfig<typeof managerABI, "repay">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: managerABI,
    address: managerAddress,
    functionName: "repay",
    ...config,
  } as UsePrepareContractWriteConfig<typeof managerABI, "repay">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link managerABI}__ and `functionName` set to `"setCap"`.
 */
export function usePrepareManagerSetCap(
  config: Omit<
    UsePrepareContractWriteConfig<typeof managerABI, "setCap">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: managerABI,
    address: managerAddress,
    functionName: "setCap",
    ...config,
  } as UsePrepareContractWriteConfig<typeof managerABI, "setCap">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link managerABI}__ and `functionName` set to `"setFeeUnlockTime"`.
 */
export function usePrepareManagerSetFeeUnlockTime(
  config: Omit<
    UsePrepareContractWriteConfig<typeof managerABI, "setFeeUnlockTime">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: managerABI,
    address: managerAddress,
    functionName: "setFeeUnlockTime",
    ...config,
  } as UsePrepareContractWriteConfig<typeof managerABI, "setFeeUnlockTime">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link managerABI}__ and `functionName` set to `"sweep"`.
 */
export function usePrepareManagerSweep(
  config: Omit<
    UsePrepareContractWriteConfig<typeof managerABI, "sweep">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: managerABI,
    address: managerAddress,
    functionName: "sweep",
    ...config,
  } as UsePrepareContractWriteConfig<typeof managerABI, "sweep">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link managerABI}__ and `functionName` set to `"toggleVaultLock"`.
 */
export function usePrepareManagerToggleVaultLock(
  config: Omit<
    UsePrepareContractWriteConfig<typeof managerABI, "toggleVaultLock">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: managerABI,
    address: managerAddress,
    functionName: "toggleVaultLock",
    ...config,
  } as UsePrepareContractWriteConfig<typeof managerABI, "toggleVaultLock">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link managerABI}__ and `functionName` set to `"transferOwnership"`.
 */
export function usePrepareManagerTransferOwnership(
  config: Omit<
    UsePrepareContractWriteConfig<typeof managerABI, "transferOwnership">,
    "abi" | "address" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: managerABI,
    address: managerAddress,
    functionName: "transferOwnership",
    ...config,
  } as UsePrepareContractWriteConfig<typeof managerABI, "transferOwnership">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link managerABI}__.
 */
export function useManagerEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof managerABI, TEventName>,
    "abi" | "address"
  > = {} as any
) {
  return useContractEvent({
    abi: managerABI,
    address: managerAddress,
    ...config,
  } as UseContractEventConfig<typeof managerABI, TEventName>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link managerABI}__ and `eventName` set to `"CapWasUpdated"`.
 */
export function useManagerCapWasUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof managerABI, "CapWasUpdated">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: managerABI,
    address: managerAddress,
    eventName: "CapWasUpdated",
    ...config,
  } as UseContractEventConfig<typeof managerABI, "CapWasUpdated">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link managerABI}__ and `eventName` set to `"OwnershipTransferred"`.
 */
export function useManagerOwnershipTransferredEvent(
  config: Omit<
    UseContractEventConfig<typeof managerABI, "OwnershipTransferred">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: managerABI,
    address: managerAddress,
    eventName: "OwnershipTransferred",
    ...config,
  } as UseContractEventConfig<typeof managerABI, "OwnershipTransferred">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link managerABI}__ and `eventName` set to `"SpreadWasUpdated"`.
 */
export function useManagerSpreadWasUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof managerABI, "SpreadWasUpdated">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: managerABI,
    address: managerAddress,
    eventName: "SpreadWasUpdated",
    ...config,
  } as UseContractEventConfig<typeof managerABI, "SpreadWasUpdated">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link managerABI}__ and `eventName` set to `"TokenWasRemovedFromService"`.
 */
export function useManagerTokenWasRemovedFromServiceEvent(
  config: Omit<
    UseContractEventConfig<typeof managerABI, "TokenWasRemovedFromService">,
    "abi" | "address" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: managerABI,
    address: managerAddress,
    eventName: "TokenWasRemovedFromService",
    ...config,
  } as UseContractEventConfig<typeof managerABI, "TokenWasRemovedFromService">);
}
