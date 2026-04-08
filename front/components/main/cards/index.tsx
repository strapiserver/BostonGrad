import {
  Box,
  Text,
  HStack,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ICard } from "../../../types/pages";
import { Box3D, ResponsiveText } from "../../../styles/theme/custom";
import CustomImage from "../../shared/CustomImage";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const truncateTo100 = (text?: string) => {
  if (!text) return "";
  return text.length > 100 ? `${text.slice(0, 100)}...` : text;
};

const Cards = ({ cards }: { cards?: ICard[] | null }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef({ isDown: false, startX: 0, startLeft: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardWidth = useBreakpointValue({
    base: "85px",
    md: "170px",
    lg: "340px",
  });
  const cardHeight = useBreakpointValue({
    base: "120px",
    md: "240px",
    lg: "480px",
  });
  const cardStep = useBreakpointValue({ base: 101, md: 186, lg: 376 }) || 376;
  const horizontalPad = useBreakpointValue({
    base: "calc(50vw - 52.5px)",
    md: "calc(50vw - 95px)",
    lg: "calc(50vw - 180px)",
  });

  if (!cards?.length) return null;

  const scrollByCard = (direction: "left" | "right") => {
    const node = scrollRef.current;
    if (!node) return;
    const delta = direction === "left" ? -cardStep : cardStep;
    node.scrollBy({ left: delta, behavior: "smooth" });
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const node = scrollRef.current;
    if (!node) return;
    dragState.current = {
      isDown: true,
      startX: e.clientX,
      startLeft: node.scrollLeft,
    };
    setIsDragging(true);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const node = scrollRef.current;
    if (!node || !dragState.current.isDown) return;
    const dx = e.clientX - dragState.current.startX;
    node.scrollLeft = dragState.current.startLeft - dx;
  };

  const onMouseUpOrLeave = () => {
    dragState.current.isDown = false;
    setIsDragging(false);
  };

  useEffect(() => {
    const node = scrollRef.current;
    if (!node || !cards?.length) return;

    const centerIndex = Math.floor((cards.length - 1) / 2); // odd: N/2, even: N/2 - 1

    const centerToTarget = () => {
      const target = node.querySelector(
        `[data-card-idx="${centerIndex}"]`,
      ) as HTMLElement | null;
      if (!target) return;

      const targetCenter = target.offsetLeft + target.offsetWidth / 2;
      const left = targetCenter - node.clientWidth / 2;
      node.scrollTo({ left, behavior: "smooth" });
    };

    const t1 = window.setTimeout(centerToTarget, 0);
    const t2 = window.setTimeout(centerToTarget, 120);
    window.addEventListener("resize", centerToTarget);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("resize", centerToTarget);
    };
  }, [cards?.length]);

  return (
    <Box
      position="relative"
      width="100vw"
      left="50%"
      right="50%"
      ml="-50vw"
      mr="-50vw"
    >
      <Box w="100%" position="relative">
        <Box
          position="absolute"
          left="2"
          top="50%"
          transform="translateY(-50%)"
          zIndex={2}
          bg="bg.100"
          borderRadius="full"
          cursor="pointer"
          onClick={() => scrollByCard("left")}
          p="1"
        >
          <MdChevronLeft size="1.5rem" />
        </Box>
        <Box
          position="absolute"
          right="2"
          top="50%"
          transform="translateY(-50%)"
          zIndex={2}
          bg="bg.100"
          borderRadius="full"
          cursor="pointer"
          onClick={() => scrollByCard("right")}
          p="1"
        >
          <MdChevronRight size="1.5rem" />
        </Box>
      </Box>
      <Box
        ref={scrollRef}
        w="100vw"
        overflowX="auto"
        scrollBehavior="smooth"
        scrollSnapType="x mandatory"
        px={horizontalPad}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUpOrLeave}
        onMouseLeave={onMouseUpOrLeave}
        cursor={isDragging ? "grabbing" : "grab"}
        sx={{
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <HStack
          w="max-content"
          spacing="4"
          alignItems="stretch"
          flexWrap="nowrap"
        >
          {cards.map((card, idx) => (
            <Link
              key={card.id}
              href={`/${card.slug}`}
              style={{ textDecoration: "none" }}
            >
              <Box3D
                data-card-idx={idx}
                role="group"
                minW={cardWidth}
                maxW={cardWidth}
                overflow="hidden"
                borderRadius="xl"
                boxShadow="lg"
                flexShrink={0}
                scrollSnapAlign="center"
                scrollSnapStop="always"
                cursor="pointer"
                _hover={{ filter: "brightness(1.01)" }}
              >
                <Box h="100%">
                  <VStack align="stretch" spacing="3" mx="0">
                    <Box
                      w={cardWidth}
                      h={cardHeight}
                      overflow="hidden"
                      alignSelf="center"
                      transition="filter 0.2s ease"
                      _groupHover={{ filter: "brightness(0.95)" }}
                    >
                      <CustomImage
                        img={card.image}
                        w={cardWidth}
                        h={cardHeight}
                        adaptiveQuality
                        customAlt={card.header || card.slug}
                      />
                    </Box>

                    <VStack align="start" p={["1", "2"]} minH="200px">
                      <Text
                        variant="contrast"
                        fontSize={["xs", "sm", "lg"]}
                        fontWeight="700"
                      >
                        {card.header || card.slug}
                      </Text>

                      <ResponsiveText variant="no_contrast" whiteSpace="normal">
                        {truncateTo100(card.subheader)}{" "}
                        <Box as="span" textDecor="underline">
                          читать далее →
                        </Box>
                      </ResponsiveText>
                    </VStack>
                  </VStack>
                </Box>
              </Box3D>
            </Link>
          ))}
        </HStack>
      </Box>
    </Box>
  );
};

export default Cards;
