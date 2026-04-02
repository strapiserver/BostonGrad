import { Box, HStack, Tooltip, useToken } from "@chakra-ui/react";
import React from "react";
import { IMaker, IMakerTag } from "../../../../types/p2p";
import { resolveColorToken } from "../../../shared/CircularIcon";

export default function MakerTags({ tags }: { tags?: IMakerTag[] | null }) {
  if (!tags || !tags.length) return <></>;
  const colorTokens = tags.map((tag) => resolveColorToken(tag.color));
  const colorHexes = useToken("colors", colorTokens);
  return (
    <HStack mr="auto">
      {tags.map((tag, index) => {
        const color = colorTokens[index];
        const colorHex = colorHexes[index];
        const tagBg =
          colorHex && colorHex.startsWith("#") && colorHex.length >= 7
            ? `rgba(${parseInt(colorHex.slice(1, 3), 16)}, ${parseInt(
                colorHex.slice(3, 5),
                16,
              )}, ${parseInt(colorHex.slice(5, 7), 16)}, 0.2)`
            : "rgba(0,0,0,0.1)";
        return (
          <Tooltip
            key={tag.id}
            openDelay={500}
            hasArrow
            label={tag.description}
          >
            <Box
              borderRadius="md"
              py="0.5"
              px="1"
              my="1"
              bg={tagBg}
              color={color}
              boxShadow="lg"
              fontSize="xs"
              cursor="pointer"
              fontFamily="Montserrat, sans-serif"
              fontWeight="bold"
            >
              {tag.name && tag.name.toUpperCase()}
            </Box>
          </Tooltip>
        );
      })}
    </HStack>
  );
}
