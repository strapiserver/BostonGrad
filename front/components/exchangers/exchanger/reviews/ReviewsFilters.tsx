import React from "react";
import { Box, HStack, Button, Tooltip, Icon } from "@chakra-ui/react";
import { IDotColors } from "../../../../types/exchanger";
import { MdFilterAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";
import {
  MdOutlineSentimentNeutral,
  MdSentimentSatisfiedAlt,
  MdSentimentVeryDissatisfied,
} from "react-icons/md";
const tooltipLabels: Record<IDotColors, string> = {
  green: "Показать только позитивные",
  gray: "Показать нейтральные",
  red: "Показать только негативные",
  orange: "",
};

export default function ReviewsFilters({
  toggleFilter,
  activeFilter,
}: {
  toggleFilter: (color: IDotColors | null) => void;
  activeFilter: IDotColors | null;
}) {
  const colors: IDotColors[] = ["green", "gray", "red"];
  const sentimentIcons: Record<IDotColors, React.ComponentType> = {
    green: MdSentimentSatisfiedAlt,
    gray: MdOutlineSentimentNeutral,
    red: MdSentimentVeryDissatisfied,
    orange: MdOutlineSentimentNeutral,
  };
  return (
    <HStack borderWidth="2px" borderRadius="xl" borderColor="bg.500">
      <Box
        display={{ base: "none", lg: "flex" }}
        color={activeFilter ? "violet.600" : "bg.300"}
        mx="4"
        cursor="pointer"
        onClick={() => toggleFilter(null)}
      >
        {activeFilter ? (
          <MdFilterAltOff size="1.5rem" />
        ) : (
          <MdFilterAlt size="1.5rem" />
        )}
      </Box>

      {colors.map((color) => (
        <Tooltip
          key={color}
          label={tooltipLabels[color]}
          hasArrow
          placement="top"
          isDisabled={!tooltipLabels[color]}
        >
          <Button
            onClick={() => toggleFilter(color)}
            bgColor={activeFilter === color ? "bg.700" : "transparent"}
            px="3"
            py="2"
            minW="auto"
          >
            <Icon
              as={sentimentIcons[color]}
              w="6"
              h="6"
              color={`${color}.300`}
            />
          </Button>
        </Tooltip>
      ))}
    </HStack>
  );
}
