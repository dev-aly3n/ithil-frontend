import { HStack, Text, useDisclosure } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { waitForTransaction } from "@wagmi/core";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Address, encodeAbiParameters, formatUnits, parseAbiParameters } from "viem";
import { useAccount, useBalance, useContractWrite } from "wagmi";

import { aaveABI } from "@/abi";
import PrivateButton from "@/components/PrivateButton";
import { EstimatedValue } from "@/components/estimated-value";
import { Loading } from "@/components/loading";
import { appConfig } from "@/config";
import { useNotificationDialog } from "@/contexts/NotificationDialog";
import { PositionModal } from "@/contexts/PositionModal";
import {
  aaveAddress,
  useAaveHalvingTime,
  useAaveLatestAndBase,
  useAaveRiskSpreads,
} from "@/hooks/generated/aave";
import { useVaultFreeLiquidity, useVaultNetLoans } from "@/hooks/generated/vault";
import { useManagerCaps } from "@/hooks/generated/manager";
import { useAllowance } from "@/hooks/useAllowance";
import { useBaseApy } from "@/hooks/useBaseApy";
import { useBestLeverage } from "@/hooks/useBestLeverage";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useMinMarginLimit } from "@/hooks/useMinMarginLimit";
import { usePrepareDebitOrder } from "@/hooks/usePrepareOrder";
import { useRateAndSpread } from "@/hooks/useRateAndSpread";
import { Asset } from "@/types";
import {
  cutoffDecimals,
  getAssetByName,
  getSingleQueryParam,
  normalizeInputValue,
} from "@/utils";
import { abbreviateBigNumber } from "@/utils/input.utils";

import AdvanceSection from "../../AdvanceSection";
// import AdvancedFormLabel from "./AdvancedFormLabel";
import FormInfo from "../../FormInfo";
import ServiceError from "../../ServiceError";
import SingleAssetAmount from "../../SingleAssetAmount";

const Form = ({ asset }: { asset: Asset }) => {
  const { address: accountAddress } = useAccount();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [inputAmount, setInputAmount] = useState("");
  const [leverage, setLeverage] = useState("0");
  const [slippage, setSlippage] = useState(appConfig.DEFAULT_SLIPPAGE);

  const [isAdvancedOptionsOpen, setIsAdvancedOptionsOpen] = useState(false);
  const notificationDialog = useNotificationDialog();
  const normalizeLeverage = normalizeInputValue(leverage);

  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address: accountAddress,
    token: asset?.tokenAddress,
    cacheTime: 5_000,
    watch: true,
  });

  const {
    isApproved,
    write: approve,
    isAllowanceRefetching,
  } = useAllowance({
    amount: inputAmount,
    spender: aaveAddress,
    token: asset,
  });

  const { isLessThanMinimumMarginError, isMinMarginLoading, bigintAmount } =
    useMinMarginLimit({
      abi: aaveABI,
      asset,
      inputAmount,
      serviceAddress: aaveAddress,
    });

  const { baseApy, isLoading: apyLoading } = useBaseApy(asset.name);

  const { data: latestAndBase } = useAaveLatestAndBase({
    args: [asset.tokenAddress],
  });

  const { data: riskSpreads } = useAaveRiskSpreads({
    args: [asset.tokenAddress],
  });

  const { data: halvingTime } = useAaveHalvingTime({
    args: [asset.tokenAddress],
  });

  const { data : freeLiquidity } = useVaultFreeLiquidity({
    address: asset?.vaultAddress as Address,
    enabled: !!asset,
  })

  const { data : netLoans } = useVaultNetLoans({
    address: asset?.vaultAddress as Address,
    enabled: !!asset,
  })

  const { data : caps } = useManagerCaps({
    args: [aaveAddress, asset.tokenAddress]
  })

  const { bestLeverage, isLoading: isBestLeverageLoading } = useBestLeverage({
    baseApy,
    latestAndBase,
    riskSpreads,
    halvingTime,
    freeLiquidity,
    bigintAmount,
    netLoans,
    caps
  });

  useEffect(() => {
    if (bestLeverage) setLeverage(bestLeverage.toString());
  }, [bestLeverage]);

  const finalLeverage = (
    isAdvancedOptionsOpen ? +normalizeLeverage - 1 : +bestLeverage - 1
  ).toString();

  const {
    interestAndSpread,
    displayInterestAndSpreadInPercent,
    isInterestAndSpreadLoading,
    isInterestError,
    isFreeLiquidityError,
  } = useRateAndSpread({
    token: asset,
    leverage: finalLeverage,
    margin: inputAmount,
    slippage,
    serviceAddress: aaveAddress,
  });
  const extraData = encodeAbiParameters(parseAbiParameters("uint256"), [0n]);

  const { order } = usePrepareDebitOrder({
    token: asset,
    collateralToken: asset.aaveCollateralTokenAddress,
    leverage: finalLeverage,
    amount: inputAmount,
    interestAndSpread,
    extraData,
    slippage,
  });

  const { write: openPosition } = useContractWrite({
    abi: aaveABI,
    address: aaveAddress,
    functionName: "open",
    args: [order],
    account: accountAddress,
    onMutate: async () => {
      notificationDialog.openLoading(
        isApproved ? "Opening position" : "Approving"
      );
    },
    onSuccess: async ({ hash }) => {
      try {
        await waitForTransaction({
          hash,
        });
        notificationDialog.openSuccess(
          isApproved ? "Position successfully opened" : "Approved successfully"
        );
        setInputAmount("");
      } catch (error) {
        notificationDialog.openError("Failed", error);
      }
    },
    onError: (error) => notificationDialog.openError("Failed", error),
  });

  console.log("isAllowanceRefetching", isAllowanceRefetching);

  // computed properties
  const isButtonLoading =
    isInterestAndSpreadLoading || isMinMarginLoading || isAllowanceRefetching;
  const isButtonDisabled =
    +inputAmount === 0 ||
    isInterestError ||
    isFreeLiquidityError ||
    isLessThanMinimumMarginError;
  const isMaxDisabled = inputAmount === balance?.value.toString();

  const onMaxClick = () => {
    setInputAmount(balance?.formatted ?? "");
  };

  const {
    query: { asset: token },
  } = useRouter();

  const isMounted = useIsMounted();

  const finalApy = baseApy
    ? +baseApy * +leverage - (+leverage - 1) * displayInterestAndSpreadInPercent
    : 0;

  const formInfoItems = [
    {
      label: "Base APY:",
      value: baseApy?.toFixed(2),
      extension: "%",
      isLoading: apyLoading,
    },
    {
      label: "Best Leverage:",
      value: bestLeverage,
      extension: "x",
      isLoading: isBestLeverageLoading,
    },
    {
      label: "Borrow Interest:",
      value: displayInterestAndSpreadInPercent,
      extension: "%",
      isLoading: isInterestAndSpreadLoading,
    },
    {
      label: "Final APY:",
      value: cutoffDecimals(finalApy, 2),
      extension: "%",
      isLoading: isInterestAndSpreadLoading,
    },
  ];

  if (!isMounted) return null;

  return (
    <div className="flex flex-col gap-2 p-3 bg-primary-100 rounded-xl">
      <div className="flex flex-row justify-between w-full">
        <Text textStyle="lg">Open Position</Text>
        <div className="flex flex-row items-center justify-end gap-2">
          {isBalanceLoading ? (
            <>
              <Loading />
            </>
          ) : (
            <>
              <Text textStyle="slender-sm2">
                {abbreviateBigNumber(
                  balance?.value ?? BigInt(0),
                  asset.decimals
                )}
              </Text>
              <HStack textStyle="slender-sm2">
                <EstimatedValue
                  value={balance?.value ?? BigInt(0)}
                  token={asset!}
                />
              </HStack>
            </>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
        }}
      >
        <SingleAssetAmount
          asset={asset}
          onMaxClick={onMaxClick}
          isMaxDisabled={isMaxDisabled}
          value={inputAmount}
          onChange={setInputAmount}
          switchableAsset
        />

        <Box width="full" gap="30px">
          <FormInfo items={formInfoItems} />

          <AdvanceSection
            isAdvancedOptionsOpen={isAdvancedOptionsOpen}
            setIsAdvancedOptionsOpen={setIsAdvancedOptionsOpen}
            leverage={leverage}
            setLeverage={setLeverage}
            setSlippage={setSlippage}
            slippage={slippage}
          />
        </Box>
      </div>

      {inputAmount !== "" && (
        <ServiceError
          isFreeLiquidityError={isFreeLiquidityError}
          isInterestError={isInterestError}
          isLessThanMinimumMarginError={isLessThanMinimumMarginError}
        />
      )}

      <PrivateButton
        onClick={() => (isApproved ? onOpen() : approve?.())}
        isDisabled={isButtonDisabled}
        loadingText="Waiting"
        isLoading={isButtonLoading}
      >
        {!asset.name
          ? "Loading..."
          : isApproved
          ? "Invest"
          : `Approve ${asset.label}`}
      </PrivateButton>

      <PositionModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={openPosition}
        submitText="Invest"
        title="Open Position"
        canShowSlippageSlider={false}
        canShowPercentageSlider={false}
        data={{
          margin: inputAmount,
          leverage,
          position: "aave",
          slippage: (+slippage * 100).toString(),
          assetName: getSingleQueryParam(token),
          assetLabel: getAssetByName(getSingleQueryParam(token))?.label,
          aCollateral: formatUnits(
            order.agreement.collaterals[0].amount,
            asset.decimals
          ),
        }}
      />
    </div>
  );
};

export default Form;
