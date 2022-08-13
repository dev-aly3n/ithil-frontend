/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { FC, useMemo } from 'react';

import { ITableRow } from '@/components/based/table/DataTable';
import Txt from '@/components/based/Txt';
import { PositionOpenType } from '@/global/types';
import usePositionDetails from '@/hooks/usePositions';
import { formatAmount } from '@/global/utils';
import { usePositons } from '@/hooks/useMarginTradingStrategy';

type IDashboardTableRow = ITableRow;

const DashboardTableRow: FC<IDashboardTableRow> = ({
  head,
  row,
  hoverable,
  onClick,
}) => {
  const position = JSON.parse(row['position_info'] as string);
  const status: PositionOpenType = row['position_status'] as PositionOpenType;

  const activePosition = usePositons(Number(position.id));

  const { collateralToken, collateralValue, pnlText, pnlValue, positionValue } =
    usePositionDetails(
      status === 'active' ? activePosition || position : position
    );

  const collateralText = useMemo(() => {
    if (!collateralToken) return 'N/A';
    return (
      <Txt.TokenText symbol={collateralToken.symbol}>{`${formatAmount(
        collateralValue,
        collateralToken.decimals
      )} ${collateralToken.symbol}`}</Txt.TokenText>
    );
  }, [collateralToken, collateralValue]);

  return (
    <>
      <tr
        css={[
          tw`cursor-pointer bg-primary-100 transition-all transition-duration[300ms] border-b-1 border-b-primary-300 last:border-b-0`,
          hoverable && tw`hover:bg-primary-200`,
        ]}
        onClick={() => {
          status === 'active' && onClick && onClick();
        }}
      >
        {head.map((headCell) => {
          switch (headCell.id) {
            case 'position':
              return (
                <td key={headCell.id} css={tw`py-4 cursor-pointer`}>
                  <Txt.Body2Regular>{positionValue}</Txt.Body2Regular>
                </td>
              );
            case 'collateral':
              return (
                <td key={headCell.id} css={tw`py-4 cursor-pointer`}>
                  <Txt.Body2Regular>{collateralText}</Txt.Body2Regular>
                </td>
              );
            case 'profit':
              return (
                <td key={headCell.id} css={tw`py-4 cursor-pointer`}>
                  <Txt.Body2Bold
                    css={[
                      tw`text-secondary ml-2`,
                      !pnlValue.isLessThan(0) &&
                        status !== 'liquidated' &&
                        tw`text-success`,
                      (pnlValue.isLessThan(0) || status === 'liquidated') &&
                        tw`text-error`,
                    ]}
                  >
                    {status === 'liquidated'
                      ? `${collateralToken?.symbol} -${formatAmount(
                          collateralValue,
                          collateralToken?.decimals
                        )} (-100%)`
                      : pnlText}
                  </Txt.Body2Bold>
                </td>
              );
            case 'action':
              return (
                <td key={headCell.id} css={tw`py-4 cursor-pointer pr-4`}>
                  {status === 'active' ? (
                    row[headCell.id]
                  ) : (
                    <Txt.Body2Regular tw="capitalize">
                      {status}
                    </Txt.Body2Regular>
                  )}
                </td>
              );
            default:
              return (
                <td
                  key={headCell.id}
                  css={[
                    tw`py-4 cursor-pointer`,
                    headCell.id === 'token_pair' && tw`pl-4`,
                  ]}
                >
                  {row[headCell.id]}
                </td>
              );
          }
        })}
      </tr>
    </>
  );
};

export default DashboardTableRow;
