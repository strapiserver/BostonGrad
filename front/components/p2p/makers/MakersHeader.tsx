import { Flex, HStack } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { ResponsiveText } from "../../../styles/theme/custom";
import Dot from "../../exchangers/Dot";
import { IMakerPreview } from "../../../types/p2p";
import { getMakerStatusColor } from "./helper";

export default function MakersHeader({ makers }: { makers: IMakerPreview[] }) {
  const statusCounts = useMemo(() => {
    const counts = { green: 0, orange: 0 };
    makers?.forEach((maker) => {
      const status = getMakerStatusColor(maker);
      if (status === "green") counts.green++;
      if (status === "orange") counts.orange++;
    });
    return counts;
  }, [makers]);

  return (
    <Flex
      flexDir={{ base: "column", lg: "row" }}
      justifyContent="space-between"
      px="4"
      py="2"
    >
      <ResponsiveText
        fontWeight="bold"
        fontSize="2xl"
        variant="primary"
        as="h1"
      >
        P2P мейкеры
      </ResponsiveText>
      <HStack gap={{ base: "4", lg: "8" }} color="bg.500" mx="2">
        <HStack>
          <Dot />
          <ResponsiveText size="sm" variant="no_contrast">{`Всего: ${
            makers?.length || "-"
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
