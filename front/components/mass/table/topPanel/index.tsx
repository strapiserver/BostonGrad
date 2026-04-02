import { Box, HStack, VStack } from "@chakra-ui/react";
import MultiSelectMenu from "./MultiSelectMenu";
import AmountInput from "./AmountInput";
import MassSortButtons from "./MassSortButtons";
import { useState } from "react";
import { IPm } from "../../../../types/selector";
import { IMassDirTextId } from "../../../../types/mass";

export type Option = { value: string; label: string };

const TopPanel = ({
  fiatPms,
  massDirTextId,
}: {
  fiatPms: Record<string, IPm>;
  massDirTextId: IMassDirTextId;
}) => {
  return (
    <>
      <VStack
        display={{ base: "flex", md: "none" }}
        spacing="3"
        align="stretch"
        w="100%"
        py="2"
        px="4"
      >
        <HStack gap="4" align="stretch" w="100%">
          <MultiSelectMenu fiatPms={fiatPms} />
          <AmountInput massDirTextId={massDirTextId} />
        </HStack>
        <MassSortButtons />
      </VStack>

      <HStack
        display={{ base: "none", md: "flex" }}
        gap="4"
        align="stretch"
        w="100%"
      >
        <MultiSelectMenu fiatPms={fiatPms} />
        <AmountInput massDirTextId={massDirTextId} />
        <MassSortButtons />
      </HStack>
    </>
  );
};

export default TopPanel;
