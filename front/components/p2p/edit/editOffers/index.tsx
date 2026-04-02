import { Divider, Box, VStack, Button } from "@chakra-ui/react";
import { IoMdListBox } from "react-icons/io";
import { BoxWrapper, CustomHeader } from "../../../shared/BoxWrapper";

import DirectionsPicker from "./Offers";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { IoAddOutline } from "react-icons/io5";
import { addP2PDirection } from "../../../../redux/mainReducer";
import { IFullOffer } from "../../../../types/p2p";

type Props = {
  offers?: Partial<IFullOffer>[] | null;
};

export default function EditOffers({ offers }: Props) {
  const offersCount = useAppSelector(
    (state) => state.main.p2pFullOffers.length,
  );
  const dispatch = useAppDispatch();
  const hasInitialOffers = (offers?.length || 0) > 0;
  // все оферы
  return (
    <BoxWrapper w="100%">
      <CustomHeader text="Предложения" Icon={IoMdListBox} />
      <Divider my="4" />

      <VStack align="stretch" spacing="3">
        {!offersCount && !hasInitialOffers ? (
          <Box color="bg.700">
            Добавьте направление, чтобы выбрать методы оплаты.
          </Box>
        ) : (
          <DirectionsPicker offers={offers} />
        )}
        {offersCount < 10 && (
          <Button
            minH="12"
            m="2"
            variant="no_contrast"
            color="violet.800"
            border="2px dashed"
            borderColor="violet.800"
            leftIcon={<IoAddOutline size="1.5rem" />}
            onClick={() => dispatch(addP2PDirection())}
            zIndex="1"
          />
        )}
      </VStack>
    </BoxWrapper>
  );
}
