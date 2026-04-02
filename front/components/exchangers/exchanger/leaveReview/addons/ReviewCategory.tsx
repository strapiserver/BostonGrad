import React from "react";
import { IReviewCategory } from "../../../../../types/exchanger";
import { HStack, filter, useColorModeValue } from "@chakra-ui/react";
import { IoInformation } from "react-icons/io5";
import CustomImage from "../../../../shared/CustomImage";
import MyTooltip from "../../../../shared/MyTooltip";
import { ResponsiveText } from "../../../../../styles/theme/custom";

export default function ReviewCategory({
  category,
  isExtended = true,
  isSelected = false,
  onToggle,
}: {
  category?: IReviewCategory | null;
  isExtended?: boolean;
  isSelected?: boolean;
  onToggle?: (id?: string) => void;
}) {
  if (!category) return <></>;

  const { description, image, isNegative, title, id } = category;
  const rotationColor = isNegative ? 290 : 50;

  const filter = `invert(60%) sepia(97%) ${useColorModeValue(
    "saturate(550%)",
    "saturate(150%)"
  )} hue-rotate(${rotationColor}deg)`;
  const activeStyles = isSelected
    ? {}
    : {
        filter: "brightness(0.8)",
      };

  return (
    <MyTooltip key={id} label={description || ""} placement="bottom">
      <HStack
        zIndex="4"
        filter={filter}
        w="fit-content"
        gap="1"
        position="relative"
        px={["1", "2"]}
        py={["0.5", "1"]}
        justifyContent="center"
        cursor="pointer"
        borderRadius="2xl"
        border="1px solid"
        borderColor={`white`}
        color={`white`}
        _hover={{ filter: " brightness(1.1)" }}
        _before={{
          content: "''",
          bgColor: `white`,
          filter: "opacity(0.1)",
          boxShadow: `0 0 10px 5px white`,
          left: "0",
          position: "absolute",
          borderRadius: "inherit",
          w: "100%",
          h: "100%",
        }}
        onClick={() => onToggle?.(id)}
        {...activeStyles}
      >
        {image ? (
          <CustomImage w="6" h="6" img={image[0]} />
        ) : (
          <IoInformation size="1rem" />
        )}
        {isExtended && title && (
          <ResponsiveText size="sm" fontWeight="bold">
            {title}
          </ResponsiveText>
        )}
      </HStack>
    </MyTooltip>
  );
}
