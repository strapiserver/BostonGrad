import React, { useMemo } from "react";
import { ResponsiveText } from "../../../../styles/theme/custom";
import {
  Box,
  Divider,
  HStack,
  Tag,
  Flex,
  Wrap,
  Highlight,
  Icon,
} from "@chakra-ui/react";
import ExchangerReply from "./ExchangerReply";
import { IExchangerReview } from "../../../../types/exchanger";
import BoringAvatar from "boring-avatars";
import UserAgent from "./UserAgent";

import {
  MdOutlineSentimentNeutral,
  MdSentimentSatisfiedAlt,
  MdSentimentVeryDissatisfied,
} from "react-icons/md";
import { ReviewBorder, FormatedDate } from "../../../shared/BoxWrapper";
import { useAppSelector } from "../../../../redux/hooks";
import { maskIP } from "../../../../services/maskIP";
import CustomImage from "../../../shared/CustomImage";
import {
  ReviewCardWrapper,
  useReviewCardMeta,
} from "../../../shared/ReviewCardWrapper";

export default function ExchangerRootReview({
  review,
  slug,
}: {
  review: IExchangerReview;
  slug?: string;
}) {
  const meta = useReviewCardMeta(review);
  const userIP = useAppSelector((state) => maskIP(state.main.fingerprint?.ip));
  const shouldEqualizeHeight = Boolean(slug);

  if (!review) return <></>;
  const {
    location,
    text,
    type,
    userAgent,
    review_replies,
    updatedAt,
    isDispute,
  } = review;

  const tag = useMemo(() => {
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
    if (!location) return null;

    const label = typeof location === "string" ? location.trim() : "";

    if (!label) return null;

    return (
      <Tag size="sm" variant="outline" colorScheme="violet" mt="1.5">
        {label.toUpperCase()}
      </Tag>
    );
  }, [location]);

  const cardMinHeight = meta.textIsLink || slug ? "200px" : "unset";

  return (
    <ReviewCardWrapper
      review={review}
      meta={meta}
      href={slug ? "/" + slug : undefined}
      minHeight={cardMinHeight}
      variant={slug ? "contrast" : "extra_contrast"}
    >
      <ReviewBorder
        h={shouldEqualizeHeight ? "100%" : undefined}
        display={shouldEqualizeHeight ? "flex" : undefined}
        flexDirection={shouldEqualizeHeight ? "column" : undefined}
        flex={shouldEqualizeHeight ? "1" : undefined}
      >
        <Flex
          flexDir={{ base: "column", lg: slug ? "column" : "row" }}
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
              display={{ base: "flex", lg: slug ? "flex" : "none" }}
              alignSelf="center"
            >
              <UserAgent userAgent={userAgent} />
            </Box>
            {review.ipAddress && (
              <ResponsiveText
                size="xs"
                mt="1.5"
              >{`IP: ${maskIP(review.ipAddress)}`}</ResponsiveText>
            )}
            <HStack display={{ base: "none", lg: "flex" }}>
              {tag}
              {locationTag}
            </HStack>
          </HStack>
          <Wrap display={{ base: "flex", lg: "none" }}>
            {tag}
            {locationTag}
          </Wrap>
          <HStack gap="4" color="bg.800">
            <FormatedDate updatedAt={updatedAt} />
            <Box
              justifySelf="end"
              ml="auto"
              display={{ base: "none", lg: slug ? "none" : "flex" }}
            >
              <UserAgent userAgent={userAgent} />
            </Box>
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
            <Highlight
              query={["читать далее"]}
              styles={{ color: "violet.600", textDecoration: "underline" }}
            >
              {slug && text.length > 62
                ? `${text.slice(0, 62)}... читать далее`
                : text}
            </Highlight>
          )}
        </Box>
      </ReviewBorder>

      {!slug &&
        review_replies &&
        review_replies.map((reply) => (
          <ExchangerReply
            key={reply.id}
            canReply={review.ipAddress == userIP && reply.from !== "author"}
            reply={reply}
            displayName={meta.displayName}
            avatarSeed={meta.avatarSeed}
            exchangerName={review?.exchanger?.name}
            exchangerLogo={review?.exchanger?.logo}
          />
        ))}
    </ReviewCardWrapper>
  );
}
