import React, { useMemo } from "react";
import {
  Box,
  Divider,
  Flex,
  HStack,
  Highlight,
  Icon,
  Tag,
  Wrap,
  Text,
} from "@chakra-ui/react";
import BoringAvatar from "boring-avatars";
import {
  MdOutlineSentimentNeutral,
  MdSentimentSatisfiedAlt,
  MdSentimentVeryDissatisfied,
} from "react-icons/md";
import { IExchangerReview } from "../../types/exchanger";
import { ResponsiveText } from "../../styles/theme/custom";
import { ReviewBorder, FormatedDate } from "./BoxWrapper";
import CustomImage from "./CustomImage";
import UserAgent from "../exchangers/exchanger/reviews/UserAgent";
import { ReviewCardWrapper, useReviewCardMeta } from "./ReviewCardWrapper";

type ReviewCompactCardProps = {
  review: IExchangerReview;
  href?: string;
  needTag?: boolean;
};

export const ReviewCompactCard = ({
  review,
  href,
  needTag = true,
}: ReviewCompactCardProps) => {
  const meta = useReviewCardMeta(review);

  const { location, text, type, userAgent, updatedAt, isDispute } = review;

  const disputeTag = useMemo(() => {
    if (isDispute === false) {
      return (
        <Tag
          size="sm"
          px="1"
          py="0.5"
          variant="outline"
          colorScheme="green"
          mt="1.5"
        >
          РЕШЕН ✓
        </Tag>
      );
    }

    if (isDispute === true) {
      return (
        <Tag
          size="sm"
          variant="outline"
          px="1"
          py="0.5"
          colorScheme="red"
          mt="1.5"
        >
          ДИСПУТ ✕
        </Tag>
      );
    }

    return null;
  }, [isDispute]);

  const locationTag = useMemo(() => {
    if (!location || !needTag) return null;

    const label = typeof location === "string" ? location.trim() : "";

    if (!label) return null;

    return (
      <Tag size="sm" variant="outline" colorScheme="violet" mt="1.5">
        {label.toUpperCase()}
      </Tag>
    );
  }, [location]);

  const truncatedText =
    text && text.length > 62 ? `${text.slice(0, 62)}... читать далее` : text;

  return (
    <ReviewCardWrapper
      review={review}
      meta={meta}
      href={href}
      minHeight="240px"
      variant="contrast"
    >
      <ReviewBorder display="flex" flexDirection="column" flex="1">
        <Flex
          flexDir={meta.textIsLink ? "row" : "column"}
          justifyContent="space-between"
          gap="4"
        >
          <HStack gap="4" alignItems="flex-start">
            <Box position="relative" w="30px" h="30px">
              <Box borderRadius="full" overflow="hidden" w="30px" h="30px">
                <BoringAvatar
                  size={30}
                  name={meta.avatarSeed}
                  variant="marble"
                />
              </Box>
              <Box
                position="absolute"
                bottom="-5px"
                right="-5px"
                bgColor="bg.800"
                borderRadius="full"
                w="20px"
                h="20px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon
                  as={
                    type === "positive"
                      ? MdSentimentSatisfiedAlt
                      : type === "negative"
                      ? MdSentimentVeryDissatisfied
                      : MdOutlineSentimentNeutral
                  }
                  w="4"
                  h="4"
                  color={
                    type === "positive"
                      ? "green.300"
                      : type === "negative"
                      ? "red.300"
                      : "gray.300"
                  }
                />
              </Box>
            </Box>

            <ResponsiveText
              size="lg"
              fontWeight="bold"
              variant="contrast"
              mt={{ base: "1", lg: "0" }}
            >
              {meta.displayName}
            </ResponsiveText>

            <Box
              justifySelf="end"
              ml="auto"
              display={{ base: "flex", lg: "flex" }}
              alignSelf="center"
            >
              <UserAgent userAgent={userAgent} />
            </Box>
            <Wrap display={{ base: "none", lg: "flex" }}>
              {disputeTag}
              {locationTag}
            </Wrap>
          </HStack>
          <Wrap display={{ base: "flex", lg: "none" }}>
            {disputeTag}
            {locationTag}
          </Wrap>
          <HStack gap="4" color="bg.800" justifyContent={"space-between"}>
            {review.ipAddress && (
              <ResponsiveText size="xs">{`IP: ${review.ipAddress}`}</ResponsiveText>
            )}
            {href && <FormatedDate updatedAt={updatedAt} />}
          </HStack>
        </Flex>
        <Divider my="4" />
        <Box h="100%" flex="1">
          {review.screenshots && meta.textIsLink && (
            <CustomImage
              h="90px"
              w="auto"
              img={review.screenshots[0]}
              objectFit="contain"
            />
          )}
          {!meta.textIsLink && !!text && (
            <Text fontSize={{ base: "sm", lg: "md" }}>
              <Highlight
                query={["читать далее"]}
                styles={{ color: "violet.600", textDecoration: "underline" }}
              >
                {truncatedText || ""}
              </Highlight>
            </Text>
          )}
        </Box>
      </ReviewBorder>
    </ReviewCardWrapper>
  );
};
