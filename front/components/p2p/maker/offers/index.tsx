import { Divider, Grid, Box, VStack, HStack } from "@chakra-ui/react";
import { IoMdListBox } from "react-icons/io";
import { addSpaces } from "../../../../redux/amountsHelper";
import { ResponsiveText } from "../../../../styles/theme/custom";
import { IMaker } from "../../../../types/p2p";
import { IPm } from "../../../../types/selector";
import { BoxWrapper, CustomHeader } from "../../../shared/BoxWrapper";

import Offer from "./Offer";
import OfferDetails from "./OfferDetails";

export default function MakerOffers({
  offers,
  pms,
}: {
  offers: IMaker["offers"];
  pms: IPm[] | null;
}) {
  const pmsByCode = new Map<string, IPm>();
  (pms || []).forEach((pm) => {
    if (pm?.code) {
      pmsByCode.set(pm.code.toUpperCase(), pm);
    }
  });
  return (
    <BoxWrapper>
      <CustomHeader text="Предложения" Icon={IoMdListBox} />
      <Divider my="4" />
      <Grid
        templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
        gap="4"
        px="2"
      >
        {offers?.map((offer) => (
          <Box key={offer.id} p="4" borderRadius="xl" bg="bg.900">
            <Offer offer={offer} pmsByCode={pmsByCode} />
            <OfferDetails offer={offer} />
          </Box>
        )) || null}
      </Grid>
    </BoxWrapper>
  );
}
