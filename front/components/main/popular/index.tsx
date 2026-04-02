import { IPopularDirRates } from "../../../types/rates";
import { IPm } from "../../../types/selector";

import CryptoRates from "./CryptoRates";
import { Box, Grid, useBreakpointValue } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import CryptoPm from "./CryptoPm";
import { Box3D, ResponsiveText } from "../../../styles/theme/custom";
import Shader from "../../shared/Shader";

const Popular = ({
  popularRates,
  popularPms,
}: {
  popularRates?: IPopularDirRates;
  popularPms?: IPm[];
}) => {
  const isBase = useBreakpointValue({ base: true, md: false });
  const [isMidVisible, setIsMidVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  if (!popularRates || !popularPms) return <></>;

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof window === "undefined" || !isBase) return;

    let rafId: number | null = null;
    const checkVisible = () => {
      rafId = null;
      const rect = node.getBoundingClientRect();
      const viewportMid = window.innerHeight * 0.5;
      const visible = rect.top <= viewportMid && rect.bottom >= viewportMid;
      setIsMidVisible(visible);
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(checkVisible);
    };

    checkVisible();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [isBase]);

  return (
    <Box ref={containerRef} position="relative" overflowX="hidden">
      <Box
        maxH="400"
        overflowY={isBase ? (isMidVisible ? "auto" : "hidden") : "auto"}
        overscrollBehaviorY="auto"
      >
        {Object.entries(popularRates).map(([cryptoCode, buySell], index) => {
          const cryptoPm = popularPms?.find((pm) => pm?.code == cryptoCode);
          const exchangersCount =
            buySell.buy?.[0]?.exchangers ?? buySell.sell?.[0]?.exchangers ?? 0;
          if (!cryptoPm) return null; // ✅ Changed from <></> to null
          return (
            <Box3D
              key={cryptoCode} // Use cryptoCode as the unique key
              variant="extra_contrast"
              p="2"
              position="relative"
            >
              <Grid
                gridTemplateColumns="auto 1fr 1fr"
                gridGap="2"
                alignItems="center"
                color="bg.500"
                pl="1"
              >
                <CryptoPm cryptoPm={cryptoPm} />

                <ResponsiveText size="sm" fontWeight="bold">
                  {`Купить ${cryptoPm.currency.code.toUpperCase()}`}
                </ResponsiveText>
                <ResponsiveText size="sm" fontWeight="bold">
                  {`Продать ${cryptoPm.currency.code.toUpperCase()}`}
                </ResponsiveText>
                <CryptoRates
                  key={cryptoCode}
                  popularPms={popularPms}
                  cryptoPm={cryptoPm}
                  buySell={buySell}
                />
              </Grid>
              <ResponsiveText
                size="xs"
                textAlign="end"
              >{`Всего обменников: ${exchangersCount}`}</ResponsiveText>
            </Box3D>
          );
        })}

        <Box h="50" />
      </Box>

      <Shader direction="top" no_contrast />
    </Box>
  );
};

export default Popular;
