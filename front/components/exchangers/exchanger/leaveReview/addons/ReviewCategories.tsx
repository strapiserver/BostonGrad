import React from "react";
import { IReviewCategory } from "../../../../../types/exchanger";
import {
  Button,
  Collapse,
  HStack,
  Input,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { Box3D, ResponsiveText } from "../../../../../styles/theme/custom";
import SentimentButtons from "../SentimentButtons";
import ReviewCategory from "./ReviewCategory";

export default function ReviewCategories({
  categories,
  sentiment,
  selectedIds,
  onToggle,
  onSentimentSelect,
  isExchangeDone,
  gossip,
  onToggleExchangeDone,
  onChangeGossip,
}: {
  categories?: IReviewCategory[] | null;
  sentiment: "positive" | "neutral" | "negative" | null;
  selectedIds: string[];
  onToggle: (id?: string) => void;
  onSentimentSelect: (value: "positive" | "neutral" | "negative") => void;
  isExchangeDone: boolean | null;
  gossip: string;
  onToggleExchangeDone: (value: boolean) => void;
  onChangeGossip: (value: string) => void;
}) {
  if (!categories || !categories?.length) return <></>;

  const negativeCategories = categories.filter((c) => !!c.isNegative);
  const positiveCategories = categories.filter((c) => !c.isNegative);

  return (
    <VStack
      gap="4"
      flexDirection={sentiment == "negative" ? "column-reverse" : "column"}
    >
      <Box3D variant="extra_contrast" p="4" w="100%">
        <HStack justifyContent="space-between" alignItems="center">
          <ResponsiveText>Ваш опыт:</ResponsiveText>
          <SentimentButtons sentiment={sentiment} isDisabled={false} />
        </HStack>
      </Box3D>
      <Box3D variant="extra_contrast" p="4" w="100%">
        <HStack justifyContent="space-between" alignItems="center">
          <ResponsiveText>Вы совершили обмен?</ResponsiveText>
          <HStack spacing="2">
            {[
              { label: "Да", value: true },
              { label: "Нет", value: false },
            ].map((option) => {
              const isActive = isExchangeDone === option.value;
              return (
                <Button
                  key={option.label}
                  size="sm"
                  variant="ghost"
                  borderWidth="2px"
                  borderRadius="xl"
                  borderColor={isActive ? "bg.500" : "transparent"}
                  bgColor={isActive ? "bg.800" : "transparent"}
                  color={isActive ? "bg.100" : "bg.300"}
                  onClick={() => onToggleExchangeDone(option.value)}
                  _hover={{
                    bgColor: isActive ? "bg.700" : "bg.900",
                  }}
                >
                  {option.label}
                </Button>
              );
            })}
          </HStack>
        </HStack>
        <Collapse in={isExchangeDone === true} animateOpacity>
          <Input
            mt="4"
            placeholder="Направление, номер заявки, сумма"
            value={gossip}
            onChange={(e) => onChangeGossip(e.target.value)}
            borderWidth="2px"
            borderRadius="xl"
            borderColor="violet.800"
            focusBorderColor="violet.500"
          />
        </Collapse>
      </Box3D>
      <Box3D variant="extra_contrast" p="4" w="100%">
        <ResponsiveText mb="4">Чем порадовал обменник?</ResponsiveText>
        <Wrap gap="4">
          {positiveCategories.map((category) => (
            <ReviewCategory
              category={category}
              isSelected={selectedIds.includes(category.id || "")}
              onToggle={onToggle}
            />
          ))}
        </Wrap>
      </Box3D>

      <Box3D variant="extra_contrast" p="4" w="100%">
        <ResponsiveText mb="4">Чем огорчил обменник?</ResponsiveText>
        <Wrap gap="4">
          {negativeCategories.map((category) => (
            <ReviewCategory
              category={category}
              isSelected={selectedIds.includes(category.id || "")}
              onToggle={onToggle}
            />
          ))}
        </Wrap>
      </Box3D>
    </VStack>
  );
}
