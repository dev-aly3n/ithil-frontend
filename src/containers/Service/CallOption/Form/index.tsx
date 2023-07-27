import { FormLabel, HStack, Text } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { waitForTransaction } from "@wagmi/core";
import { addMonths } from "date-fns";
import { Decimal } from "decimal.js";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Address, formatUnits } from "viem";
import { encodeAbiParameters, parseAbiParameters } from "viem";
import { useAccount, useBalance, useChainId, useContractWrite } from "wagmi";

import { callOptionABI } from "@/abi";
import PrivateButton from "@/components/PrivateButton";
import Slider from "@/components/Slider";
import { EstimatedValue } from "@/components/estimated-value";
import { Loading } from "@/components/loading";
import { appConfig } from "@/config";
import { useNotificationDialog } from "@/contexts/NotificationDialog";
import { aaveAddress } from "@/hooks/generated/aave";
import {
  callOptionAddress,
  useCallOptionCurrentPrice,
  useCallOptionTotalAllocation,
} from "@/hooks/generated/callOption";
import { useAllowance } from "@/hooks/useAllowance";
import { useIsMounted } from "@/hooks/useIsMounted";
import { usePrepareCreditOrder } from "@/hooks/usePrepareOrder";
import { AaveAsset } from "@/types/onchain.types";
import { toFullDate } from "@/utils";
import { abbreviateBigNumber } from "@/utils/input.utils";

// import AdvancedFormLabel from "./AdvancedFormLabel";
import FormInfo from "../../FormInfo";
import SingleAssetAmount from "../../SingleAssetAmount";

// import DepositForm from "./DepositForm"

const Form = ({ asset }: { asset: AaveAsset }) => {
  const {
    query: { asset: token },
  } = useRouter();
  const { address: accountAddress } = useAccount();
  const chainId = useChainId() as 98745;
  const [inputAmount, setInputAmount] = useState("");
  const [slippage, setSlippage] = useState(appConfig.DEFAULT_SLIPPAGE);
  const [month, setMonth] = useState(1);
  const notificationDialog = useNotificationDialog();

  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address: accountAddress,
    token: asset?.tokenAddress,
    cacheTime: 5_000,
    watch: true,
  });

  const { data: currentPrice, isLoading: isCurrentPriceLoading } =
    useCallOptionCurrentPrice();
  const { data: allocation, isLoading: isAllocationLoading } =
    useCallOptionTotalAllocation();

  const isInfoLoading = isCurrentPriceLoading || isAllocationLoading;

  const inputDecimal = new Decimal(inputAmount || 0),
    monthDecimal = new Decimal(month);

  let allocationDecimal = new Decimal(0),
    currentPriceDecimal = new Decimal(0),
    virtualAmount = new Decimal(0),
    finalPrice = new Decimal(0),
    finalAmount = new Decimal(0),
    redeem = new Decimal(0);

  currentPriceDecimal = new Decimal(formatUnits(currentPrice || 0n, 18));
  allocationDecimal = new Decimal(formatUnits(allocation || 0n, 18));
  virtualAmount = inputDecimal
    .mul(new Decimal(2).pow(monthDecimal.div(12)))
    .div(currentPriceDecimal);

  finalPrice = currentPriceDecimal
    .mul(allocationDecimal)
    .div(allocationDecimal.minus(virtualAmount));

  finalAmount = inputDecimal
    .mul(new Decimal(2).pow(monthDecimal.div(12)))
    .div(finalPrice);

  redeem = inputDecimal.div(finalAmount);

  console.log(
    "decimal result",
    allocationDecimal.toString(),
    currentPriceDecimal.toString(),
    virtualAmount.toString(),
    finalPrice.toString(),
    finalAmount.toString(),
    redeem.toString()
  );

  const {
    isApproved,
    isLoading: isApproveLoading,
    write: approve,
  } = useAllowance({
    amount: inputAmount,
    spender: aaveAddress[chainId],
    token: asset,
  });

  const extraData = encodeAbiParameters(parseAbiParameters("uint256"), [
    BigInt(month),
  ]);

  console.log("extraData33", extraData);

  const { order, isLoading } = usePrepareCreditOrder({
    token: asset,
    amount: inputAmount,
    extraData,
    monthsLocked: month,
    slippage,
  });

  const {
    data: openData,
    isLoading: isOpenLoading,
    write: openPosition,
  } = useContractWrite({
    abi: callOptionABI,
    address: callOptionAddress[98745],
    functionName: "open",
    args: [order],
    account: accountAddress as Address,
    onMutate: async () => {
      notificationDialog.openDialog({
        title: isApproved ? "Opening position" : "Approving",
        status: "loading",
        duration: 0,
      });
    },
    onSuccess: async ({ hash }) => {
      try {
        await waitForTransaction({
          hash,
        });
        notificationDialog.openDialog({
          title: isApproved
            ? "Positions opened successfully"
            : "Approved successfully",
          status: "success",
          isClosable: true,
          duration: 0,
        });
        setInputAmount("");
      } catch (err) {
        notificationDialog.openDialog({
          title: "Failed",
          description: "Something went wrong",
          status: "error",
          isClosable: true,
          duration: 0,
        });
      }
    },
    onError: () => {
      notificationDialog.openDialog({
        title: "Failed",
        description: "Something went wrong",
        status: "error",
        isClosable: true,
        duration: 0,
      });
    },
  });

  // computed properties
  const isButtonLoading = isLoading;
  const isButtonDisabled = +inputAmount === 0;
  const isMaxDisabled = inputAmount === balance?.value.toString();

  const onMaxClick = () => {
    setInputAmount(balance?.formatted ?? "");
  };

  const isMounted = useIsMounted();

  const [isAdvancedOptionsOpen, setIsAdvancedOptionsOpen] = useState(false);

  const formInfoItems = [
    {
      label: " ITHIL obtained:",
      value: finalAmount.toString(),
      isLoading: isInfoLoading,
    },
    {
      label: "redeem price:",
      value: redeem.toString(),
      extension: "$",
      isLoading: isInfoLoading,
    },
    {
      label: "maturity date:",
      value: toFullDate(addMonths(new Date(), month)),
    },
  ];

  console.log("order99", order);

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
          switchableAsset={false}
        />

        <Box width="full" gap="30px">
          <FormLabel marginTop={4}>Lock time in months</FormLabel>
          <Box margin="10px 10px 50px">
            <Slider value={month} onChange={setMonth} />
          </Box>
          <FormInfo items={formInfoItems} />

          {/* <AdvanceSection
            isAdvancedOptionsOpen={isAdvancedOptionsOpen}
            setIsAdvancedOptionsOpen={setIsAdvancedOptionsOpen}
            leverage={leverage}
            setLeverage={setLeverage}
            setSlippage={setSlippage}
            slippage={slippage}
          /> */}
        </Box>
      </div>

      <PrivateButton
        approve={approve}
        assetName={asset.name}
        isApproved={isApproved}
        isDisabled={isButtonDisabled}
        isLoading={isButtonLoading}
        openPosition={openPosition}
      />
    </div>
  );
};

export default Form;
