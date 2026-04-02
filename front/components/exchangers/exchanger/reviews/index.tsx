import React, { useCallback, useMemo, useState } from "react";
import { PiChatsFill } from "react-icons/pi";
import ExchangerRootReview from "./ExchangerRootReview";
import { IExchangerReview, IDotColors } from "../../../../types/exchanger";
import { ResponsiveText } from "../../../../styles/theme/custom";
import { Divider, HStack } from "@chakra-ui/react";

import ReviewsFilters from "./ReviewsFilters";
import { BoxWrapper, CustomHeader } from "../../../shared/BoxWrapper";

const filterTypeMap: Record<IDotColors, IExchangerReview["type"] | null> = {
  green: "positive",
  gray: "neutral",
  red: "negative",
  orange: null,
};

export default function ExchangerReviews({
  reviews,
}: {
  reviews?: IExchangerReview[] | null;
}) {
  const [activeFilter, setActiveFilter] = useState<IDotColors | null>(null);

  const handleToggleFilter = useCallback((color: IDotColors | null) => {
    setActiveFilter((current) => (current === color ? null : color));
  }, []);

  const sortedReviews = useMemo(() => {
    if (!reviews) return null;
    return [...reviews].sort((a, b) => {
      const dateA = new Date(a.updatedAt ?? 0).getTime();
      const dateB = new Date(b.updatedAt ?? 0).getTime();
      return dateB - dateA;
    });
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    if (!sortedReviews) return null;
    if (!activeFilter) return sortedReviews;
    const targetType = filterTypeMap[activeFilter];
    if (!targetType) return sortedReviews;
    return sortedReviews.filter((review) => review.type === targetType);
  }, [sortedReviews, activeFilter]);

  const reviewsCount = filteredReviews?.length ?? reviews?.length ?? 0;
  const hasAnyReviews = !!(reviews && reviews.length);
  return (
    <BoxWrapper variant="contrast">
      <HStack justifyContent="space-between">
        <CustomHeader text={`Отзывы (${reviewsCount})`} Icon={PiChatsFill} />
        <ReviewsFilters
          toggleFilter={handleToggleFilter}
          activeFilter={activeFilter}
        />
      </HStack>
      <Divider my="4" />
      {!hasAnyReviews ? (
        <ResponsiveText>Пока нет отзывов, оставьте отзыв первым</ResponsiveText>
      ) : filteredReviews && filteredReviews.length > 0 ? (
        filteredReviews.map((review, idx) => (
          <ExchangerRootReview key={review.id + idx} review={review} />
        ))
      ) : (
        <ResponsiveText>Нет отзывов по выбранному фильтру</ResponsiveText>
      )}
    </BoxWrapper>
  );
}
