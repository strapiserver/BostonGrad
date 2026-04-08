import { Box, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { IMainBenefit } from "../../../types/pages";
import { IImage } from "../../../types/selector";
import Benefits from "./Benefits";
import Forms from "../form";

type SocialNetworkItem = {
  name: string;
  icon: IImage | null;
};

export default function OverlayContent({
  title,
  subtitle,
  benefits,
  contentOffsetTop,
  countries,
  socialNetworks,
}: {
  title?: string;
  subtitle?: string;
  benefits?: IMainBenefit[];
  contentOffsetTop?: { base: number; md: string; lg: string };
  countries?: string[];
  socialNetworks?: SocialNetworkItem[];
}) {
  return (
    <Box
      position="absolute"
      top={20}
      bottom={0}
      left={0}
      w="50vw"
      pr="100px"
      minW="600px"
      zIndex="3"
      bg="rgba(61, 17, 17, 0.8)"
      clipPath="polygon(0 0, 100% 0, 88% 100%, 0 100%)"
      color="white"
      fontSize={{ base: "lg", md: "2xl" }}
      fontWeight="bold"
      textTransform="uppercase"
      letterSpacing="widest"
      pointerEvents="auto"
      px="6"
      py="8"
      pt={contentOffsetTop}
      overflowY="auto"
    >
      <Box w="88%">
        <VStack align="stretch" spacing="6">
          <Text
            textAlign="left"
            color="white"
            fontSize={{ base: "2xl", md: "3xl", lg: "5xl" }}
            fontWeight="700"
            lineHeight="1.15"
            textShadow="0 2px 10px rgba(0,0,0,0.5)"
          >
            {title || ""}
          </Text>
          <Text
            textAlign="left"
            whiteSpace="normal"
            color="white"
            fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
            fontWeight="500"
            textShadow="0 1px 8px rgba(0,0,0,0.5)"
          >
            {subtitle || ""}
          </Text>
          <Benefits benefits={benefits} />
          <Forms
            countries={countries || []}
            socialNetworks={socialNetworks || []}
          />
        </VStack>
      </Box>
    </Box>
  );
}
