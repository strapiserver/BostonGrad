import React from "react";
import { IP2PAd } from "../../../../types/p2p";
import { Box, Divider, Grid, Text } from "@chakra-ui/react";
import { Box3D, ResponsiveText } from "../../../../styles/theme/custom";
import CustomImage from "../../../shared/CustomImage";

export default function Ad({ ad }: { ad: IP2PAd }) {
  return (
    <Box3D
      flex="0 0 auto"
      minW={{ base: "250px", lg: "800px" }}
      maxW={{ base: "250px", lg: "800px" }}
      h="100%"
      p="0"
      pb="4"
      variant="no_contrast"
    >
      <Grid gridTemplateColumns="1fr auto 1fr" gap="2">
        <CustomImage h="auto" img={ad.image} w="100%" />
        <Divider
          orientation="vertical"
          h="calc(100% - 10px)"
          mt="auto"
          mr="2"
        />
        <Box p="4">
          <ResponsiveText size="lg">{ad.title}</ResponsiveText>
          <Text mt="4" whiteSpace="preserve-breaks">
            {ad.description}
          </Text>
        </Box>
      </Grid>
    </Box3D>
  );
}
