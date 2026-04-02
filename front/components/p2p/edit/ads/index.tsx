import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import React, { useRef } from "react";
import { Box3D, ResponsiveText } from "../../../../styles/theme/custom";
import HorizontalShader from "../../../shared/HorizontalShader";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { IP2PAd } from "../../../../types/p2p";
import Ad from "./Ad";

export default function MakerAds({ ads }: { ads?: IP2PAd[] | null }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollByAmount = (dir: "left" | "right") => {
    const node = scrollRef.current;
    if (!node) return;
    const delta = dir === "left" ? -250 : 250;
    node.scrollBy({ left: delta, behavior: "smooth" });
  };
  if (!ads || !ads.length) return <></>;
  return (
    <>
      <Box
        w="100vw"
        maxW="100vw"
        py="2"
        ml="calc(50% - 50vw)"
        mr="calc(50% - 50vw)"
      >
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
            {ads.map((ad, index) => (
              <Ad ad={ad} key={ad.id || ad.slug || ad.title || String(index)} />
            ))}
            <Box w="10" />
            <HorizontalShader direction="left" no_contrast={false} />
          </HStack>
        </VStack>
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
}
