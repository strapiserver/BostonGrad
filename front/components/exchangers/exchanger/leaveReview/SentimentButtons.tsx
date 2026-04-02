import { HStack, Button } from "@chakra-ui/react";
import React from "react";
import {
  MdOutlineSentimentNeutral,
  MdSentimentSatisfiedAlt,
  MdSentimentVeryDissatisfied,
} from "react-icons/md";
import {
  SentimentValue,
  setReviewSentiment,
} from "../../../../redux/leaveFeedbackSlice";
import { useAppDispatch } from "../../../../redux/hooks";
import { useExchangerId } from "../ExchangerContext";

type SentimentOption = {
  value: Exclude<SentimentValue, null>;
  label: string;
  icon: typeof MdSentimentSatisfiedAlt;
  iconColor: string;
};

const sentimentOptions: SentimentOption[] = [
  {
    value: "positive",
    label: "Positive",
    icon: MdSentimentSatisfiedAlt,
    iconColor: "green.300",
  },
  {
    value: "neutral",
    label: "Neutral",
    icon: MdOutlineSentimentNeutral,
    iconColor: "gray.300",
  },
  {
    value: "negative",
    label: "Negative",
    icon: MdSentimentVeryDissatisfied,
    iconColor: "red.300",
  },
];

type SentimentButtonsProps = {
  sentiment: SentimentValue;
  isDisabled?: boolean;
};

export default function SentimentButtons({
  sentiment,
  isDisabled,
}: SentimentButtonsProps) {
  const exchangerId = useExchangerId();
  const dispatch = useAppDispatch();
  const onSelect = (value: SentimentOption["value"]) =>
    dispatch(setReviewSentiment({ exchangerId, sentiment: value }));

  return (
    <HStack spacing="2">
      {sentimentOptions.map((option) => (
        <Button
          key={option.value}
          size="sm"
          variant="ghost"
          borderWidth="2px"
          borderRadius="xl"
          borderColor={sentiment === option.value ? "bg.500" : "transparent"}
          bgColor={sentiment === option.value ? "bg.800" : "transparent"}
          color={option.iconColor}
          onClick={() => onSelect(option.value)}
          isDisabled={isDisabled}
          _hover={{
            bgColor: sentiment === option.value ? "bg.700" : "bg.900",
          }}
        >
          <option.icon size="1.5rem" color={option.iconColor} />
        </Button>
      ))}
    </HStack>
  );
}
