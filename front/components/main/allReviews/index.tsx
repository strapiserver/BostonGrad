import { Box, Button, Divider, HStack, VStack } from "@chakra-ui/react";
import React, { useEffect, useMemo, useRef } from "react";
import { ReviewCompactCard } from "../../shared/ReviewCompactCard";
import { IExchangerReview } from "../../../types/exchanger";
import { exchangerNameToSlug } from "../../exchangers/helper";
import ErrorWrapper from "../../shared/ErrorWrapper";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import CustomTitle from "../../shared/CustomTitle";
import GeneralStats from "../GeneralStats";
import TopButtons from "./TopButtons";

import HorizontalShader from "../../shared/HorizontalShader";

const AllReviews = ({ reviews }: { reviews?: IExchangerReview[] | null }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const hasInitialScroll = useRef(false);

  const normalizedReviews: IExchangerReview[] | null = useMemo(() => {
    if (reviews === null) return [];
    if (!reviews) return null;
    return reviews;
  }, [reviews]);

  const isLoading = false;
  const isError = false;

  const scrollByAmount = (dir: "left" | "right") => {
    const node = scrollRef.current;
    if (!node) return;
    const delta = dir === "left" ? -250 : 250;
    node.scrollBy({ left: delta, behavior: "smooth" });
  };

  useEffect(() => {
    if (!scrollRef.current) return;
    if (!normalizedReviews || !normalizedReviews.length) return;
    if (hasInitialScroll.current) return;
    hasInitialScroll.current = true;
    const node = scrollRef.current;
    // ensure DOM painted before setting scroll
    const timeoutId = setTimeout(() => {
      node.scrollTo({ left: 260, behavior: "smooth" });
    }, 50);
    return () => clearTimeout(timeoutId);
  }, [reviews]);

  return (
    <>
      <Box
        ref={containerRef}
        w="100vw"
        maxW="100vw"
        left="50%"
        right="50%"
        py="2"
      >
        <ErrorWrapper isLoading={isLoading} isError={isError}>
          {normalizedReviews && normalizedReviews.length > 0 ? (
            <VStack align="stretch" spacing="3" pos="relative">
              <HStack
                ref={scrollRef}
                spacing="6"
                overflowX="auto"
                py="2"
                w="100%"
                alignItems="stretch"
                flexWrap="nowrap"
                sx={{
                  "& > *": { flex: "0 0 auto" },
                  "&::-webkit-scrollbar": { display: "none" },
                  scrollbarWidth: "none",
                }}
              >
                <HorizontalShader direction="right" no_contrast={false} />
                <Box w="10" />
                {normalizedReviews.map((review) => (
                  <Box
                    key={review.id}
                    flex="0 0 auto"
                    minW={{ base: "250px", lg: "420px" }}
                    maxW={{ base: "250px", lg: "420px" }}
                    h="100%"
                    transformOrigin={{ base: "top left", lg: "center" }}
                    _hover={{ filter: "brightness(1.1)" }}
                  >
                    <ReviewCompactCard
                      review={review}
                      needTag={false}
                      href={
                        review?.exchanger?.name
                          ? `/exchangers/${exchangerNameToSlug(
                              review.exchanger.name
                            )}`
                          : undefined
                      }
                    />
                  </Box>
                ))}
                <Box w="10" />
                <HorizontalShader direction="left" no_contrast={false} />
              </HStack>
            </VStack>
          ) : null}
        </ErrorWrapper>
      </Box>
      <Box w="100%">
        <HStack justifyContent="space-between" spacing="2">
          <Button
            onClick={() => scrollByAmount("left")}
            variant="ghost"
            size="sm"
            color="bg.700"
          >
            <MdChevronLeft size="1.5rem" />
          </Button>
          <TopButtons />
          <Button
            onClick={() => scrollByAmount("right")}
            variant="ghost"
            size="sm"
            color="bg.700"
          >
            <MdChevronRight size="1.5rem" />
          </Button>
        </HStack>
      </Box>
    </>
  );
};

export default AllReviews;
