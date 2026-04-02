import { Button, HStack, VStack } from "@chakra-ui/react";
import React from "react";
import { useAppDispatch } from "../../../../../redux/hooks";
import { triggerModal } from "../../../../../redux/mainReducer";
import { ResponsiveText } from "../../../../../styles/theme/custom";
import { IReviewCategory } from "../../../../../types/exchanger";
import useSWR from "swr";
import { initCMSFetcher } from "../../../../../services/fetchers";
import { exchangerReviewCategoriesQuery } from "../../../../../services/queries";
import ErrorWrapper from "../../../../shared/ErrorWrapper";
import ReviewCategory from "./ReviewCategory";
import ReviewCategories from "./ReviewCategories";

type ReviewAddonsProps = {
  onClose?: () => void;
  sentiment: "positive" | "neutral" | "negative" | null;
  selectedCategoryIds: string[];
  onToggleCategory: (id?: string) => void;
  onSentimentSelect: (value: "positive" | "neutral" | "negative") => void;
  isExchangeDone: boolean | null;
  gossip: string;
  onToggleExchangeDone: (value: boolean) => void;
  onChangeGossip: (value: string) => void;
};

export default function ReviewAddons({
  onClose,
  sentiment,
  selectedCategoryIds,
  onToggleCategory,
  onSentimentSelect,
  isExchangeDone,
  gossip,
  onToggleExchangeDone,
  onChangeGossip,
}: ReviewAddonsProps) {
  const fetcher = initCMSFetcher();

  const { data, error } = useSWR(exchangerReviewCategoriesQuery, fetcher) as {
    data: IReviewCategory[];
    error: any;
  };

  const dispatch = useAppDispatch();
  const handleClose = () => {
    onClose?.();
    dispatch(triggerModal(undefined));
  };

  return (
    <VStack
      align="stretch"
      spacing="4"
      px={["3", "6"]}
      py="4"
      color="bg.500"
      fontSize="sm"
    >
      <VStack align="stretch" spacing="2" minH="300">
        <ErrorWrapper isLoading={!data} isError={!!error}>
          <ReviewCategories
            categories={data}
            sentiment={sentiment}
            selectedIds={selectedCategoryIds}
            onToggle={onToggleCategory}
            onSentimentSelect={onSentimentSelect}
            isExchangeDone={isExchangeDone}
            gossip={gossip}
            onToggleExchangeDone={onToggleExchangeDone}
            onChangeGossip={onChangeGossip}
          />
        </ErrorWrapper>
      </VStack>

      <HStack w="100%" justifyContent={"end"}>
        <Button
          alignSelf="flex-end"
          variant="no_contrast"
          onClick={handleClose}
        >
          Пропустить
        </Button>
        <Button alignSelf="flex-end" variant="primary" onClick={handleClose}>
          Готово
        </Button>
      </HStack>
    </VStack>
  );
}
