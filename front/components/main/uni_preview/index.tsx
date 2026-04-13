import {
  Box,
  Text,
  HStack,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ICard } from "../../../types/pages";
import { Box3D } from "../../../styles/theme/custom";
import CustomImage from "../../shared/CustomImage";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const truncateTo100 = (text?: string) => {
  if (!text) return "";
  return text.length > 100 ? `${text.slice(0, 100)}...` : text;
};

const UniPreview = ({ cards }: { cards?: ICard[] | null }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef({ isDown: false, startX: 0, startLeft: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardWidth = { base: "74vw", md: "280px", lg: "340px" };
  const imageHeight = { base: "210px", md: "220px", lg: "260px" };
  const horizontalPad = {
    base: "calc(50vw - 37vw)",
    md: "calc(50vw - 150px)",
    lg: "calc(50vw - 180px)",
  };

  if (!cards?.length) return null;

  const scrollByCard = (direction: "left" | "right") => {
    const node = scrollRef.current;
    if (!node) return;
    const card = node.querySelector("[data-card-idx]") as HTMLElement | null;
    const deltaBase = card ? card.offsetWidth + 16 : node.clientWidth * 0.8;
    const delta = direction === "left" ? -deltaBase : deltaBase;
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
      width={{ base: "100%", md: "100vw" }}
      left={{ base: "0", md: "50%" }}
      right={{ base: "0", md: "50%" }}
      ml={{ base: "0", md: "-50vw" }}
      mr={{ base: "0", md: "-50vw" }}
    >
      <Box w="100%" position="relative">
        <Box
          ref={scrollRef}
          w={{ base: "100%", md: "100vw" }}
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
                    <Box
                      w="100%"
                      h={imageHeight}
                      overflow="hidden"
                      position="relative"
                      transition="filter 0.2s ease"
                      _groupHover={{ filter: "brightness(0.95)" }}
                    >
                      <CustomImage
                        img={card.image}
                        w="100%"
                        h="100%"
                        adaptiveQuality
                        customAlt={card.header || card.slug}
                      />
                      <Box
                        position="absolute"
                        inset={0}
                        bgGradient="linear(to-t, rgba(0,0,0,0.68) 10%, rgba(0,0,0,0.05) 60%)"
                      />
                      <Text
                        position="absolute"
                        left="3"
                        right="3"
                        bottom="3"
                        color="white"
                        fontWeight="700"
                        fontSize={{ base: "xl", md: "lg", lg: "xl" }}
                        textShadow="0 2px 8px rgba(0,0,0,0.45)"
                        noOfLines={2}
                      >
                        {card.header || card.slug}
                      </Text>
                    </Box>
                    <Box
                      display={{ base: "none", lg: "block" }}
                      px="3"
                      py="3"
                      minH="72px"
                      bg="bg.100"
                    >
                      <Text fontSize="sm" color="bg.800" noOfLines={2}>
                        {truncateTo100(card.subheader)}
                      </Text>
                    </Box>
                  </Box>
                </Box3D>
              </Link>
            ))}
          </HStack>
        </Box>

        <Box
          position="absolute"
          left={{ base: "1", md: "2" }}
          top="50%"
          transform="translateY(-50%)"
          zIndex={3}
          bg="rgba(255,255,255,0.92)"
          border="1px solid"
          borderColor="gray.300"
          borderRadius="full"
          cursor="pointer"
          onClick={() => scrollByCard("left")}
          p={{ base: "2", md: "1" }}
          boxShadow="md"
          color="gray.800"
        >
          <MdChevronLeft size="1.25rem" />
        </Box>
        <Box
          position="absolute"
          right={{ base: "1", md: "2" }}
          top="50%"
          transform="translateY(-50%)"
          zIndex={3}
          bg="rgba(255,255,255,0.92)"
          border="1px solid"
          borderColor="gray.300"
          borderRadius="full"
          cursor="pointer"
          onClick={() => scrollByCard("right")}
          p={{ base: "2", md: "1" }}
          boxShadow="md"
          color="gray.800"
        >
          <MdChevronRight size="1.25rem" />
        </Box>
      </Box>
    </Box>
  );
};

export default UniPreview;
