import React from "react";
import fallbackImage from "../../../public/fallback.png";
import { HStack, VStack, Text, Image, Box } from "@chakra-ui/react";

export default function WebsiteData() {
  return (
    <HStack mt="8">
      <Image
        w="40px"
        h="40px"
        src={fallbackImage.src || ""}
        alt={`${process.env.NEXT_PUBLIC_NAME}.com`}
      />
      <HStack gap="2" alignItems="center">
        <Text fontSize="xl" color="bg.700">
          {process.env.NEXT_PUBLIC_NAME}.com
        </Text>
        <Text fontSize="sm" color="bg.800" mt="1">
          • 2026
        </Text>
      </HStack>
    </HStack>
  );
}
