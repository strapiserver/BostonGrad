import { Box, Divider, HStack } from "@chakra-ui/react";
import React from "react";
import OfferLimitSlider from "./OfferLimitSlider";
import OfferLimitInput from "./OfferLimitInput";
import { powerOfTenOrder } from "../../../../../../redux/amountsHelper";
import { IFullOffer } from "../../../../../../types/p2p";

export default function OfferLimits({
  fullOffer,
}: {
  fullOffer: Partial<IFullOffer>;
}) {
  const offerIndex = fullOffer.index;
  if (offerIndex === undefined) return null;
  const side = fullOffer?.side === "get" ? "get" : "give";

  const toUSD = side === "give" ? fullOffer?.giveToUSD : fullOffer?.getToUSD;
  const suggestedMin = powerOfTenOrder((toUSD || 0) * 500);
  const suggestedMax = powerOfTenOrder((toUSD || 0) * 2000);
  const suggestedMinPossible = powerOfTenOrder((toUSD || 0) * 100);
  const sliderMin =
    Number.isFinite(fullOffer?.min) && fullOffer?.min !== null
      ? fullOffer.min
      : suggestedMin;
  const sliderMax =
    Number.isFinite(fullOffer?.max) && fullOffer?.max !== null
      ? fullOffer.max
      : suggestedMax;
  const sliderMinSeed =
    sliderMin && Number.isFinite(sliderMin) && sliderMin > 0
      ? sliderMin
      : sliderMax && Number.isFinite(sliderMax) && sliderMax > 0
        ? sliderMax
        : 0;
  const sliderMinPossible =
    suggestedMinPossible > 0
      ? suggestedMinPossible
      : powerOfTenOrder(sliderMinSeed);

  return (
    <Box w="100%">
      <HStack w="fit-content" spacing="3" my="2">
        <OfferLimitInput
          index={offerIndex}
          field="min"
          suggested={suggestedMin}
          fullOffer={fullOffer}
        />
        <Divider orientation="vertical" h="5" />
        <OfferLimitInput
          index={offerIndex}
          field="max"
          suggested={suggestedMax}
          fullOffer={fullOffer}
        />
      </HStack>
      <OfferLimitSlider
        index={offerIndex}
        min={sliderMin}
        max={sliderMax}
        minPossible={sliderMinPossible}
      />
    </Box>
  );
}
{
}
