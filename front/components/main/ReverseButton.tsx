import {
  useColorModeValue,
  Center,
  Button,
  useToken,
  Box,
} from "@chakra-ui/react";
import { CgArrowsExchange } from "react-icons/cg";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { clearDirRates } from "../../redux/mainReducer";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import NextLink from "next/link";
import { exchangeToSlugCity, slugCityToExchange } from "../exchange/helper";
import { serverLinkDEV, serverLinkPROD } from "../../services/utils";

const courseFilterLink =
  (process.env.NODE_ENV === "production" ? serverLinkPROD : serverLinkDEV) ||
  "";

const Patch = () => {
  const [bg10, bg900] = useToken("colors", ["bg.10", "bg.900"]);
  const color1 = useColorModeValue(bg10, bg900);
  return (
    <Box position="absolute" zIndex="2">
      <Box
        w="30"
        h="8"
        background={`radial-gradient(circle at 0 100%, rgba(11, 111, 111, 0) 15px,${color1} 16px), 
      radial-gradient(circle at 100% 100%, rgba(111, 0, 0, 0) 15px, ${color1} 16px)`}
        backgroundPosition="bottom left, bottom right"
        backgroundSize=" 50% 50%"
        backgroundRepeat="no-repeat"
      ></Box>
      <Box
        w="40"
        h="8"
        background={`radial-gradient(circle at 100% 0, rgba(1, 111, 0, 0) 15px, ${color1} 16px), 
  radial-gradient(circle at 0 0, rgba(204, 111, 0, 0) 15px, ${color1} 16px)`}
        backgroundPosition="top right, top left"
        backgroundSize=" 50% 50%"
        backgroundRepeat="no-repeat"
      ></Box>
    </Box>
  );
};

const ReverseButton = () => {
  const dispatch = useAppDispatch();

  const color = useColorModeValue("bg.700", "bg.300");
  const bothPmsSelected = useAppSelector(
    (state) => state.main.givePm?.code && state.main.getPm?.code
  );
  const [reverseExists, setReverseExists] = useState(false);
  const giveCode = useAppSelector((state) => state.main.givePm?.code);
  const getCode = useAppSelector((state) => state.main.getPm?.code);
  const router = useRouter();
  const exchangeParam = router.query?.exchange;
  const exchange =
    typeof exchangeParam === "string" ? exchangeParam : exchangeParam?.[0];
  let reversedExchange = "";
  const [slug, cityFromSlug] = useMemo(() => {
    if (exchange && exchange.length) {
      try {
        return exchangeToSlugCity(exchange);
      } catch {
        return [exchange, ""];
      }
    }
    return ["", ""];
  }, [exchange]);
  if (slug && slug.length) {
    try {
      const [leftPart, rightPart] = slug.split("-to-");
      const reversed_slug = `${rightPart}-to-${leftPart}`;
      reversedExchange = slugCityToExchange(
        reversed_slug,
        cityFromSlug || undefined
      );
    } catch (e) {
      reversedExchange = "";
    }
  }

  useEffect(() => {
    let cancelled = false;
    if (!giveCode || !getCode) {
      setReverseExists(false);
      return () => {
        cancelled = true;
      };
    }
    if (!courseFilterLink) {
      setReverseExists(false);
      return () => {
        cancelled = true;
      };
    }
    setReverseExists(false);
    const checkReverseDir = async () => {
      try {
        const res = await fetch(
          `${courseFilterLink}/possible_pairs/give/${getCode}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch reverse dirs");
        }
        const possiblePairs = (await res.json()) as string[];
        if (!cancelled) {
          const exists =
            Array.isArray(possiblePairs) &&
            possiblePairs.some(
              (code) => code?.toUpperCase() === giveCode.toUpperCase()
            );
          setReverseExists(exists);
        }
      } catch (error) {
        if (!cancelled) {
          setReverseExists(false);
        }
      }
    };
    checkReverseDir();
    return () => {
      cancelled = true;
    };
  }, [giveCode, getCode]);

  const canReverse = Boolean(
    bothPmsSelected && reverseExists && reversedExchange
  );

  return (
    <Center position="relative" w="100%" minH="4">
      <Box position="absolute">
        {canReverse ? (
          <NextLink href={`/${reversedExchange}`}>
            <Button
              p="0 !important"
              size={{ base: "sm", lg: "md" }}
              variant="ghost"
              onClick={() => dispatch(clearDirRates())}
              color={color}
              zIndex="3"
              aria-label="Reverse direction"
              transform={"rotate(90deg)"}
            >
              <CgArrowsExchange size="1.5rem" />
            </Button>
          </NextLink>
        ) : (
          <Button
            w="4"
            p="0 !important"
            variant="extra_contrast"
            size={{ base: "sm", lg: "md" }}
            color={"bg.800"}
            disabled
            zIndex="3"
            transform={"rotate(90deg)"}
            aria-label="Reverse direction"
          >
            <CgArrowsExchange size="1.5rem" />
          </Button>
        )}
      </Box>
      <Patch />
    </Center>
  );
};

export default ReverseButton;
