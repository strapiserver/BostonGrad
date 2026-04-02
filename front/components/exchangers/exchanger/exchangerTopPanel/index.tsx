import React from "react";
import { Box, Divider, Flex, HStack } from "@chakra-ui/react";
import { IExchanger } from "../../../../types/exchanger";
import Header from "./Header";
import Actions from "./Actions";
import { ExchangerTopButtons } from "./ExchangerTopButtons";
import TagBadges from "./TagBadges";

const ExchangerTopPanel = ({ exchanger }: { exchanger: IExchanger }) => {
  const displayName = exchanger.display_name || exchanger.name;

  return (
    <>
      <Box w="100%">
        <HStack justifyContent="space-between" gap="2" position="relative">
          <Header exchanger={exchanger} />
          <Box mr="auto">
            <TagBadges tags={exchanger.exchanger_tags} />
          </Box>
          <Actions displayName={displayName} id={exchanger.id} />
          <Box display={{ base: "none", lg: "flex" }} flexDir="row" gap="2">
            <ExchangerTopButtons ref_link={exchanger.ref_link} />
          </Box>
        </HStack>
      </Box>
    </>
  );
};

export default ExchangerTopPanel;
