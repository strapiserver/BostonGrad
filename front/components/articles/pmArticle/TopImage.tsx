import { Center, Box } from "@chakra-ui/react";
import React from "react";
import CircularIcon from "../../shared/CircularIcon";
import { IPm } from "../../../types/selector";

export default function TopImage({ pm }: { pm: IPm }) {
  return (
    <Center w="100%" gap="2" mb="6">
      <Box
        border="1px solid"
        bgColor="bg.700"
        borderColor="bg.600"
        borderRadius="50%"
        w="3"
        h="3"
      />
      <Box
        border="1.5px solid"
        bgColor="bg.600"
        borderColor="bg.500"
        borderRadius="50%"
        w="4"
        h="4"
      />
      <Box
        border="2px solid"
        bgColor="bg.500"
        borderColor="bg.400"
        borderRadius="50%"
        w="5"
        h="5"
      />
      <CircularIcon
        iconAlt={pm.en_name}
        icon={pm.icon}
        color={pm.color || "gray"}
        size="lg"
      />
      <Box
        border="2px solid"
        bgColor="bg.500"
        borderColor="bg.400"
        borderRadius="50%"
        w="5"
        h="5"
      />
      <Box
        border="1.5px solid"
        bgColor="bg.600"
        borderColor="bg.500"
        borderRadius="50%"
        w="4"
        h="4"
      />
      <Box
        border="1px solid"
        bgColor="bg.700"
        borderColor="bg.600"
        borderRadius="50%"
        w="3"
        h="3"
      />
    </Center>
  );
}
