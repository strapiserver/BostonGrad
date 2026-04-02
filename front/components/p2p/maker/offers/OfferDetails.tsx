import React from "react";
import { IMakerOffer } from "../../../../types/p2p";
import { HStack } from "@chakra-ui/react";
import { addSpaces } from "../../../../redux/amountsHelper";
import { ResponsiveText } from "../../../../styles/theme/custom";

export default function OfferDetails({ offer }: { offer: IMakerOffer }) {
  return (
    <>
      <HStack spacing="2">
        <ResponsiveText size="sm" color="bg.700" variant="primary">
          Сторона
        </ResponsiveText>
        <ResponsiveText size="md" variant="primary">
          {offer.side || ""}
        </ResponsiveText>
      </HStack>
      <HStack spacing="2">
        <ResponsiveText size="sm" color="bg.700" variant="primary">
          Курс
        </ResponsiveText>
        <ResponsiveText size="md" variant="primary">
          {offer.course ?? ""}
        </ResponsiveText>
      </HStack>
      <HStack spacing="2">
        <ResponsiveText size="sm" color="bg.700" variant="primary">
          Лимиты
        </ResponsiveText>
        <ResponsiveText size="md" variant="primary">
          {offer.min != null || offer.max != null
            ? `${addSpaces(String(offer.min ?? ""))} - ${addSpaces(
                String(offer.max ?? ""),
              )}`
            : ""}
        </ResponsiveText>
      </HStack>
      <HStack spacing="2">
        <ResponsiveText size="sm" color="bg.700" variant="primary">
          Комиссия
        </ResponsiveText>
        <ResponsiveText size="md" variant="primary">
          {offer.fee_amount != null
            ? `${offer.fee_amount} ${offer.fee_type || ""}`
            : ""}
        </ResponsiveText>
      </HStack>
    </>
  );
}
