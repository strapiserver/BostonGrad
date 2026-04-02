import { Box } from "@chakra-ui/react";
import { ReactNode, useMemo } from "react";
import { IExchangerReview } from "../../types/exchanger";
import { BoxWrapper } from "./BoxWrapper";
import { LinkWrapper } from "./LinkWrapper";
import { useColorModeValue } from "@chakra-ui/react";

export const useReviewCardMeta = (review: IExchangerReview) => {
  const defaultAmbientColor = useColorModeValue(
    "rgba(143,92,292,0.2)",
    "rgba(128, 125, 121, 0.25)"
  );
  const positiveAmbientColor = useColorModeValue(
    "rgba(29, 179, 37, 0.18)",
    "rgba(15, 66, 39, 0.39)"
  );
  const negativeAmbientColor = useColorModeValue(
    "rgba(255, 0, 25, 0.32)",
    "rgba(114, 13, 13, 0.3)"
  );

  const ambientColor = useMemo(() => {
    if (review.type === "positive") return positiveAmbientColor;
    if (review.type === "negative") return negativeAmbientColor;
    return defaultAmbientColor;
  }, [
    review.type,
    defaultAmbientColor,
    positiveAmbientColor,
    negativeAmbientColor,
  ]);

  const textIsLink = /^(https?:\/\/|www\.)[^\s]+$/i.test(review?.text || "");

  const avatarSeed = useMemo(
    () =>
      review.fingerprint ||
      review.name ||
      review.id ||
      Math.random().toString(36).slice(2),
    [review.fingerprint, review.name, review.id]
  );

  const displayName = review.name?.trim() || "Аноним";

  return {
    ambientColor,
    textIsLink,
    avatarSeed,
    displayName,
  };
};

type ReviewCardWrapperProps = {
  review: IExchangerReview;
  meta: ReturnType<typeof useReviewCardMeta>;
  children: ReactNode;
  href?: string;
  minHeight?: string | number;
  variant?: "contrast" | "no_contrast" | "extra_contrast";
};

export const ReviewCardWrapper = ({
  review,
  meta,
  children,
  href,
  minHeight,
  variant = "extra_contrast",
}: ReviewCardWrapperProps) => {
  const url = meta.textIsLink ? review?.text || "#" : href;

  return (
    <LinkWrapper _blank={meta.textIsLink} exists={!!url} url={url || "#"}>
      <BoxWrapper
        w="100%"
        p="4"
        my="6"
        variant={variant}
        position="relative"
        overflow="hidden"
        minH={minHeight}
      >
        {children}

        <Box
          position="absolute"
          top="0"
          w="100%"
          h="100%"
          zIndex={0}
          pointerEvents="none"
          bgGradient={`radial-gradient(circle at 85% -10%, ${meta.ambientColor} 0%, transparent 40%)`}
        />
        <Box
          position="absolute"
          bottom="0"
          left="0"
          w="100%"
          h="100%"
          zIndex={0}
          pointerEvents="none"
          bgGradient={`radial-gradient(circle at 5% 70%, ${meta.ambientColor} 0%, transparent 40%)`}
        />
      </BoxWrapper>
    </LinkWrapper>
  );
};
