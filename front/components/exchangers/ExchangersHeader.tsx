import { Flex, HStack } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { ResponsiveText } from "../../styles/theme/custom";
import { IExchanger, IParserExchanger } from "../../types/exchanger";
import { getStatus } from "./helper";
import Dot from "./Dot";

export default function ExchangersHeader({
  exchangers,
}: {
  exchangers: IExchanger[];
}) {
  const statusCounts = useMemo(() => {
    const counts = { green: 0, orange: 0, red: 0 };
    exchangers?.forEach((exchanger) => {
      const status = getStatus(exchanger);
      if (status === "green") counts.green++;
      if (status === "orange") counts.orange++;
    });
    return counts;
  }, [exchangers]);
  return (
    <Flex
      flexDir={{ base: "column", lg: "row" }}
      justifyContent={"space-between"}
      px="4"
      py="2"
    >
      <ResponsiveText
        fontWeight="bold"
        fontSize="2xl"
        variant="primary"
        as="h1"
      >
        Обменники
      </ResponsiveText>
      <HStack gap={{ base: "4", lg: "8" }} color="bg.500" mx="2">
        <HStack>
          <Dot />
          <ResponsiveText size="sm" variant="no_contrast">{`Всего: ${
            exchangers?.length || "-"
          }`}</ResponsiveText>
        </HStack>

        <HStack>
          <Dot color="green" />
          <ResponsiveText size="sm" variant="no_contrast">{`Активные: ${
            statusCounts.green || "-"
          }`}</ResponsiveText>
        </HStack>

        <HStack>
          <Dot color="orange" />
          <ResponsiveText size="sm" variant="no_contrast">{`Неактивные: ${
            statusCounts.orange || "-"
          }`}</ResponsiveText>
        </HStack>
      </HStack>
    </Flex>
  );
}
