import { VStack, Box, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { cmsLinkPROD, cmsLinkDEV } from "../../../services/utils";
import { IMainSingle } from "../../../types/pages";
import { IImage } from "../../../types/selector";
import OverlayContent from "./OverlayContent";

type SocialNetworkItem = {
  name: string;
  icon: IImage | null;
  url: string;
};
type CountryOption = {
  id: string;
  name: string;
};

export default function GreetingImage({
  mainSingle,
  countries,
  socialNetworks,
}: {
  mainSingle: IMainSingle;
  countries: CountryOption[];
  socialNetworks: SocialNetworkItem[];
}) {
  const ambientColor = useColorModeValue(
    "rgba(243, 71, 71, 0.2)",
    "rgba(247, 197, 177, 0.1)",
  );
  const env = process.env.NODE_ENV;
  const CMS_SRC = env === "production" ? cmsLinkPROD : cmsLinkDEV;

  const resolveMediaUrl = (url?: string | null) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `${CMS_SRC}${url}`;
  };
  const mediaShiftTop = {
    base: 0,
    md: "-250px",
    lg: "-350px",
  } as const;
  const overlayContentOffsetTop = {
    base: 0,
    md: "250px",
    lg: "350px",
  } as const;

  return (
    <VStack
      align="stretch"
      spacing="3"
      width="100vw"
      position="relative"
      left="50%"
      right="50%"
      ml="-50vw"
      mr="-50vw"
    >
      <Box position="relative" zIndex="1" w="100%">
        {mainSingle.image ? (
          <Box position="relative" w="100%" overflow="hidden">
            <Box position="relative" mt={mediaShiftTop}>
              <Box
                as="img"
                src={resolveMediaUrl(mainSingle.image.url)}
                alt={mainSingle.title || "Main image"}
                w="100%"
                h="auto"
                display="block"
                pointerEvents="none"
                userSelect="none"
              />
              <Box
                position="absolute"
                inset={0}
                zIndex="1"
                pointerEvents="none"
                bgGradient={`radial-gradient(ellipse at 50% -10%, ${ambientColor} 10%, transparent 50%)`}
              />
              <OverlayContent
                title={mainSingle.title}
                subtitle={mainSingle.subtitle}
                benefits={mainSingle.benefit}
                contentOffsetTop={overlayContentOffsetTop}
                countries={countries}
                socialNetworks={socialNetworks}
              />
            </Box>
          </Box>
        ) : null}
      </Box>
    </VStack>
  );
}
