import { Box, VStack } from "@chakra-ui/react";
import React from "react";
import { ResponsiveText } from "../../../../styles/theme/custom";

export default function ExchangerReviewsHeader({ title }: { title: string }) {
  return (
    <VStack my="20" w="100%">
      <ResponsiveText whiteSpace="unset" size="3xl" textAlign="center">
        {title}
      </ResponsiveText>
      <ResponsiveText
        whiteSpace="unset"
        size="xl"
        variant="no_contrast"
        textAlign="center"
      >
        Оставьте отзыв, он поможет другим пользователям принять решение!
      </ResponsiveText>
    </VStack>
  );
}
