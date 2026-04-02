import { Box, HStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { ResponsiveText } from "../../styles/theme/custom";

export default function ContentPreview({
  refChapters,
}: {
  refChapters: {
    ref: React.RefObject<HTMLDivElement>;
    title: string;
    text: string;
  }[];
}) {
  const [highlited, setHighlited] =
    useState<React.RefObject<HTMLElement> | null>(null);
  const executeScroll = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setHighlited(ref);
  };

  return (
    <Box>
      {refChapters.map((chapter, idx) => {
        const isActive = chapter.ref === highlited;
        return (
          <HStack
            key={"chapterHeader:" + idx}
            cursor="pointer"
            align="center"
            spacing="3"
            py="2"
            onClick={() => executeScroll(chapter.ref)}
          >
            <Box
              w="6px"
              h="6px"
              borderRadius="full"
              bg={isActive ? "violet.600" : "bg.500"}
              flex="0 0 auto"
            />
            <ResponsiveText
              fontWeight="bold"
              size="md"
              color={isActive ? "violet.600" : "violet.500"}
              _hover={{
                color: "violet.400",
              }}
              whiteSpace="normal"
            >
              {chapter.title}
            </ResponsiveText>
          </HStack>
        );
      })}
    </Box>
  );
}
