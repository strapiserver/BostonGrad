import { Box } from "@chakra-ui/react";
import React from "react";

export default function BackgroundImage({
  imageUrl,
}: {
  imageUrl: string;
}) {
  return (
    <Box
      position="absolute"
      inset={0}
      bgImage={`url("${imageUrl}")`}
      bgSize="contain"
      bgRepeat="no-repeat"
      bgPosition="center top"
    />
  );
}
