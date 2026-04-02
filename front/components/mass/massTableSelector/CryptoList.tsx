import {
  Box,
  HStack,
  IconButton,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { convertMassDirTextIntoSlug } from "../../../cache/helper";
import MassSideContext from "../sideContext";
import { IMassDirTextId } from "../../../types/mass";
import { IPm } from "../../../types/selector";
import PmName from "../../shared/PmName";
import { capitalize } from "../../main/side/selector/section/PmGroup/helper";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import HorizontalShader from "../../shared/HorizontalShader";

export default function CryptoList({ cryptoPms }: { cryptoPms: IPm[] }) {
  const { isSell, slug, currencyCode, currentCryptoPm } =
    useContext(MassSideContext);
  const currency = { code: currencyCode };
  const currentCode = currentCryptoPm?.code ?? "";

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const selectedItemRef = useRef<HTMLDivElement | null>(null);
  const scrollStep = 220;
  const addScrollPixels = -50;
  const buttonColor = useColorModeValue("bg.900", "bg.100");

  const scrollBy = useCallback((direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const delta = direction === "left" ? -scrollStep : scrollStep;
    scrollRef.current.scrollBy({
      left: delta,
      behavior: "smooth",
    });
  }, []);

  const updateBoundaries = useCallback(() => {
    const node = scrollRef.current;
    if (!node) return;
    const tolerance = 4;
    const { scrollLeft, scrollWidth, clientWidth } = node;
    setIsAtStart(scrollLeft <= tolerance);
    setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - tolerance);
  }, []);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    const handleScroll = () => updateBoundaries();
    node.addEventListener("scroll", handleScroll);
    updateBoundaries();
    return () => {
      node.removeEventListener("scroll", handleScroll);
    };
  }, [updateBoundaries, cryptoPms.length]);

  useEffect(() => {
    const container = scrollRef.current;
    const selectedItem = selectedItemRef.current;
    if (!container || !selectedItem) return;

    const target =
      selectedItem.offsetLeft -
      container.clientWidth / 2 +
      selectedItem.clientWidth / 2 +
      addScrollPixels;
    const maxScrollLeft = Math.max(
      container.scrollWidth - container.clientWidth,
      0
    );
    const nextScrollLeft = Math.min(Math.max(target, 0), maxScrollLeft);

    container.scrollTo({
      left: nextScrollLeft,
      behavior: "smooth",
    });
  }, [slug, cryptoPms.length, addScrollPixels]);

  return (
    <HStack
      w={"100%"}
      alignItems="stretch"
      position="relative"
      overflow="hidden"
    >
      <IconButton
        aria-label="Scroll left"
        icon={<IoIosArrowBack />}
        isDisabled={isAtStart}
        onClick={() => scrollBy("left")}
        variant="ghost"
        color={buttonColor}
        bgColor="bg.800"
        alignSelf="center"
        _hover={{ bg: "bg.800", color: "bg.500" }}
        borderRadius="50%"
        zIndex="15"
      />
      {!isAtEnd && <HorizontalShader direction="right" />}
      <Box
        flex="1"
        overflowX={{ base: "auto", md: "hidden" }}
        overflowY="hidden"
        ref={scrollRef}
        role="group"
        sx={{
          "@media (max-width: 47.99em)": {
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          },
        }}
      >
        <Box w="3" />
        <HStack spacing="2" w="max-content" mx="2">
          {cryptoPms.map((pm) => {
            const newData = {
              code: pm.code,
              currency,
              isSell,
            } as IMassDirTextId;

            const newSlug = convertMassDirTextIntoSlug(newData);

            return (
              <Tooltip
                key={pm.code + currencyCode + pm.en_name + isSell}
                label={`${capitalize(
                  pm.en_name
                )} ${pm.currency.code.toUpperCase()} ${pm.subgroup_name || ""}`}
                fontSize="sm"
              >
                <Box
                  ref={pm.code === currentCode ? selectedItemRef : undefined}
                  border={pm.code == currentCode ? "1px solid" : "unset"}
                  borderRadius="xl"
                  borderColor="violet.600"
                  px="2"
                  py="1"
                  bgColor={pm.code == currentCode ? "bg.800" : "unset"}
                  _hover={{ bgColor: "bg.800" }}
                >
                  <Link href={`${newSlug}`} key={pm.code}>
                    <PmName
                      pm={pm}
                      isFull={false}
                      isTwoLines={true}
                      isHighlited={pm.code == currentCode}
                    />
                  </Link>
                </Box>
              </Tooltip>
            );
          })}
        </HStack>
        <Box w="3" />
      </Box>
      {!isAtStart && <HorizontalShader direction="left" />}

      <IconButton
        aria-label="Scroll right"
        icon={<IoIosArrowForward />}
        isDisabled={isAtEnd}
        onClick={() => scrollBy("right")}
        variant="ghost"
        color={buttonColor}
        bgColor="bg.800"
        alignSelf="center"
        _hover={{ bg: "bg.900", color: "bg.500" }}
        borderRadius="50%"
        zIndex="15"
      />
    </HStack>
  );
}
