import { memo, useMemo, useState, useEffect } from "react";
import { Box, HStack, Text, Button, useColorModeValue } from "@chakra-ui/react";
import Image from "next/image";

import { useAppSelector } from "../../redux/hooks";
import { Box3D } from "../../styles/theme/custom";
import { format, localFormat, R } from "../../redux/amountsHelper";
import { converterLinkPROD, converterLinkDEV } from "../../services/utils";
import { buildRateString } from "../shared/helper";
import Loader from "../shared/Loader";

const Chart = memo(
  ({
    giveCur,
    getCur,
    noRate = false,
  }: {
    giveCur?: string;
    getCur?: string;
    noRate?: boolean;
  }) => {
    const bgColor = useColorModeValue("violet.700", "bg.900");
    const primaryColor = useColorModeValue("bg.100", "violet.600");
    const color = useColorModeValue("bg.200", "bg.500");

    const SRC = useMemo(() => {
      const env = process.env.NODE_ENV;
      return env === "production" ? converterLinkPROD : converterLinkDEV;
    }, []);

    const [timeframe, setTimeframe] = useState<"1h" | "24h">("24h");

    const ccRates = useAppSelector(
      (state) => state.main.ccRates || ({} as any),
    );
    const { currentRate, giveToUSD, getToUSD, dayTrend, hourTrend } = ccRates;

    const trend = timeframe === "24h" ? dayTrend : hourTrend;

    // const giveUsdRate = useMemo(
    //   () =>
    //     giveToUSD < 1
    //       ? `1 ${giveCur} ~ ${format(1 / giveToUSD, 2)} USD`
    //       : `1 USD ~ ${format(giveToUSD, 2)} ${giveCur}`,
    //   [giveCur, giveToUSD]
    // );

    // const getUsdRate = useMemo(
    //   () =>
    //     getToUSD < 1
    //       ? `1 ${getCur} ~ ${format(1 / getToUSD, 2)} USD`
    //       : `1 USD ~ ${format(getToUSD, 2)} ${getCur}`,
    //   [getCur, getToUSD]
    //);

    const alt = `${giveCur} to ${getCur} in last ${timeframe}`;

    const imgSrc = `${SRC}/${getCur}_${giveCur}/${timeframe}`;
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
      setImageLoaded(false);
      const timeout = setTimeout(() => setImageLoaded(true), 10000);
      return () => clearTimeout(timeout);
    }, [imgSrc]);
    if (!giveCur || !getCur) return <></>;
    return (
      <Box3D
        bgColor={bgColor}
        overflow="hidden"
        position="relative"
        w="fit-content"
        h={`${noRate ? 133 : 200}px`}
        mb="4"
      >
        <Image
          src={imgSrc}
          alt={alt}
          width={noRate ? 280 : 420}
          height={noRate ? 133 : 200}
          style={{ objectFit: "cover" }}
          onLoadingComplete={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
          // placeholder="blur"
          // blurDataURL="/placeholder.png"
        />
        {!imageLoaded && (
          <Box
            position="absolute"
            inset="0"
            bg="blackAlpha.500"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex="30"
          >
            <Loader size="lg" />
          </Box>
        )}

        <HStack position="absolute" top="1" left="1" zIndex="35" px="2">
          <Text
            fontSize="sm"
            color={primaryColor}
            fontFamily="'Mozilla Text', monospace"
          >
            {`${giveCur} / ${getCur}`}
          </Text>
          {!noRate && (
            <Text fontSize="md" color={trend > 0 ? "red.500" : "green.500"}>
              {`${trend > 0 ? "-" : "+"} ${format(Math.abs(trend), 3)}% ${
                trend > 0 ? "▼" : "▲"
              }`}
            </Text>
          )}
        </HStack>

        {!noRate && (
          <>
            <Box
              position="absolute"
              top="0"
              right="0"
              zIndex="35"
              borderRadius="lg"
              px="2"
            >
              <HStack>
                <Button
                  variant="default"
                  size="xs"
                  m="0"
                  color={timeframe === "1h" ? primaryColor : "whiteAlpha.400"}
                  onClick={() => setTimeframe("1h")}
                >
                  1h
                </Button>
                <Button
                  variant="default"
                  size="xs"
                  m="0"
                  color={timeframe === "24h" ? primaryColor : "whiteAlpha.400"}
                  onClick={() => setTimeframe("24h")}
                >
                  24h
                </Button>
              </HStack>
            </Box>

            <Box
              py="0.5"
              px="1"
              bgColor="bg.1000"
              filter="opacity(0.9)"
              borderRadius="lg"
              position="absolute"
              bottom={`${100 - trend * 5}px`}
              display={!currentRate ? "none" : "unset"}
              right="4"
            >
              <Text fontSize="sm" color={color}>
                {buildRateString({
                  course: currentRate,
                  giveCur,
                  getCur,
                })}
              </Text>
            </Box>
          </>
        )}
      </Box3D>
    );
  },
);

export default Chart;
