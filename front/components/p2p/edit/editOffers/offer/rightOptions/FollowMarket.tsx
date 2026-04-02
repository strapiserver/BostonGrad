import { FormControl, FormLabel } from "@chakra-ui/react";
import React from "react";
import { ResponsiveText } from "../../../../../../styles/theme/custom";
import MyTooltip from "../../../../../shared/MyTooltip";
import { IoInformationCircle } from "react-icons/io5";
import OfferSwitch from "../OfferSwitch";
import { useAppDispatch } from "../../../../../../redux/hooks";
import { setP2PFullOfferField } from "../../../../../../redux/mainReducer";
import { IFullOffer } from "../../../../../../types/p2p";

export default function RightOptions({
  fullOffer,
}: {
  fullOffer: Partial<IFullOffer>;
}) {
  const dispatch = useAppDispatch();
  const offerIndex = fullOffer.index;
  if (offerIndex === undefined) return null;

  const handleSwitch = (checked: boolean) => {
    dispatch(
      setP2PFullOfferField({
        index: offerIndex,
        field: "follow_market",
        value: checked,
      }),
    );
  };

  return (
    <FormControl
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      pb="2"
      pr="2"
      gap="2"
      w="280px"
    >
      <FormLabel
        display="flex"
        htmlFor={`follow-market-${offerIndex}`}
        mb="0"
        color="violet.500"
        flexDir="row"
        gap="2"
        alignItems="center"
      >
        <MyTooltip label="test">
          <IoInformationCircle size="1rem" />
        </MyTooltip>
        <ResponsiveText>Следовать за рынком</ResponsiveText>
      </FormLabel>
      <OfferSwitch
        id={`follow-market-${offerIndex}`}
        isChecked={Boolean(fullOffer.follow_market)}
        handleSwitch={handleSwitch}
      />
    </FormControl>
  );
}
