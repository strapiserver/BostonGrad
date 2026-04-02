import { Fade, Box, Text, HStack } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { addSpaces, R } from "../../../../redux/amountsHelper";

import { useAppSelector } from "../../../../redux/hooks";
import { ILimit } from "../../../../types/rates";
import SideContext from "../../../shared/contexts/SideContext";

const renderHint = (leftPart: string, amount?: number, currency?: string) => {
  if (!amount) return;
  return `${leftPart || ""} ${addSpaces(String(R(amount, 1)))} ${
    currency || ""
  }`;
};

const Fiat = ({
  value,
  min,
  max,
}: {
  value: number;
  min?: ILimit;
  max?: ILimit;
}) => {
  const side = useContext(SideContext) as "give" | "get";
  const toUsd = useAppSelector((state) => state.main.ccRates?.[`${side}ToUSD`]);
  const ccPair = useAppSelector((state) => state.main.ccRatesPair);
  const giveCur = useAppSelector((state) =>
    state.main.givePm?.currency?.code?.toUpperCase()
  );
  const getCur = useAppSelector((state) =>
    state.main.getPm?.currency?.code?.toUpperCase()
  );
  const sideCurrencyCode = useAppSelector((state) =>
    state.main[`${side}Pm`]?.currency.code.toUpperCase()
  );
  const isEdited = useAppSelector((state) => !!state.main.amountInput);

  const Min = min?.[side] || 0;
  const Max = max?.[side] || 0;
  const expectedPair = giveCur && getCur ? `${giveCur}_${getCur}` : undefined;
  const hasFreshRates = !!expectedPair && expectedPair === ccPair;
  const toUSD =
    sideCurrencyCode === "USD"
      ? value
      : hasFreshRates && toUsd
      ? (1 / toUsd) * value
      : undefined;

  return (
    <HStack
      fontSize="sm"
      color="bg.800"
      justifySelf="end"
      position="absolute"
      bottom={{ base: "1", lg: "2" }}
      right="4"
      fontFamily="'Mozilla Text', monospace"
    >
      {isEdited && Min > 0 && value < Min - Min * 0.01 ? (
        <Text color="red.500">
          {renderHint("min: ", Min, sideCurrencyCode)}
        </Text>
      ) : isEdited && Max > 0 && value > Max + Max * 0.01 ? (
        <Text color="red.500">
          {renderHint("max: ", Max, sideCurrencyCode)}
        </Text>
      ) : (
        <Text>{renderHint("~ $", toUSD)}</Text>
      )}
    </HStack>
  );
};

export default Fiat;
