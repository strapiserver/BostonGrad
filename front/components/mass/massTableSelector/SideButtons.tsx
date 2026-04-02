import { HStack, Button } from "@chakra-ui/react";
import React, { useContext } from "react";
import MassSideContext from "../sideContext";

import NextLink from "next/link";

function SideButtons() {
  const { isSell, slug } = useContext(MassSideContext);
  return (
    <HStack
      gap="0"
      borderRadius="xl"
      border="1px solid"
      borderColor="bg.500"
      p="0 !important"
    >
      <NextLink href={`/buy/${slug}`} passHref>
        <Button
          w="100%"
          justifyContent="start"
          variant={isSell ? "ghost" : "outline"}
          size="md"
          colorScheme="green"
        >
          {"Купить"}
        </Button>
      </NextLink>
      <NextLink href={`/sell/${slug}`} passHref>
        <Button
          w="100%"
          justifyContent="start"
          variant={isSell ? "outline" : "ghost"}
          size="md"
          colorScheme="pink"
        >
          {"Продать"}
        </Button>
      </NextLink>
    </HStack>
  );
}
export default SideButtons;
