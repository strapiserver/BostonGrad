import { Box, HStack, Text, useColorModeValue } from "@chakra-ui/react";
import { kFormatter, R } from "../../../redux/amountsHelper";
import { CgSync } from "react-icons/cg";

const Limit = ({
  label,
  value,
  pmCurrencyName,
  needMargin,
  changeSide,
}: {
  label: "min" | "max";
  value: number;
  pmCurrencyName: string;
  needMargin?: boolean;
  changeSide: Function;
}) => {
  const ml = needMargin
    ? label === "max"
      ? "20"
      : "-20"
    : label === "max"
    ? "-10"
    : "10";

  return (
    <HStack
      pointerEvents="all"
      mb="-12"
      onClick={() => changeSide()}
      bgColor={useColorModeValue("bg.100", "bg.800")}
      borderRadius="lg"
      ml={ml}
      fontSize="xs"
      px="1"
    >
      <Text
        whiteSpace="nowrap"
        color={useColorModeValue("bg.800", "bg.100")}
      >{`${label.toUpperCase()}: ${kFormatter(R(value, 2))}`}</Text>
      <Text
        mx="2px !important"
        color={useColorModeValue("violet.700", "violet.600")}
      >
        {pmCurrencyName}
      </Text>
      <Box
        mx="0 !important"
        color={useColorModeValue("violet.700", "violet.600")}
      >
        <CgSync size="0.8rem" />
      </Box>
    </HStack>
  );
};

export default Limit;
