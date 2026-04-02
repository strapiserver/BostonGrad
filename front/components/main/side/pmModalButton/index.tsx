import { Box, Center, Tag, Text, useColorModeValue } from "@chakra-ui/react";
import React, { useContext } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import SideContext from "../../../shared/contexts/SideContext";
import { capitalize } from "../selector/section/PmGroup/helper";
import p2pContext from "../../../shared/contexts/p2pContext";

import { ResponsiveText } from "../../../../styles/theme/custom";
import { batch } from "react-redux";
import {
  triggerModal,
  setSearchBarInputValue,
} from "../../../../redux/mainReducer";

import SelectorModal from "../selector/SelectorModal";
import PmIcons from "./PmIcons";
import ModalButton from "./ModalButton";
import { fetchPossiblePairs } from "../../../../redux/thunks";
import { IoAddOutline } from "react-icons/io5";

const PmModalButton = () => {
  const dispatch = useAppDispatch();
  const side = useContext(SideContext) as "give" | "get";

  const pms = useAppSelector((state) => {
    const pm = state.main?.[`${side}Pm`];
    return pm ? [pm] : [];
    //      state.main[`${side == "give" ? "get" : "give"}Pm`],
  }); // либо три в ряд для п2п либо pm и обратная pm

  const openDialog = () => {
    batch(() => {
      // берем возможные пары для обратной пм если такая выбрана
      dispatch(triggerModal(side));
      dispatch(setSearchBarInputValue(""));
    });
  };
  const unselectedPmText = side === "give" ? "Отдаю" : "Получаю";

  const currencyCode = pms?.[0]?.currency.code.toUpperCase();
  return (
    <ModalButton
      openDialog={openDialog}
      leftIcon={
        pms?.length ? (
          <PmIcons pms={pms} />
        ) : (
          <Center
            border="2px dashed"
            borderColor="bg.500"
            borderRadius="50%"
            h="6"
            w="6"
          >
            <IoAddOutline size="1rem" />
          </Center>
        )
      }
    >
      <SelectorModal id={side || ""} />
      <Text
        fontSize="lg"
        color="violet.500"
        fontWeight="semibold"
        fontFamily="Montserrat, sans-serif"
      >
        {!pms?.length ? unselectedPmText : currencyCode}
      </Text>

      {/* {pms?.[0]?.subgroup_name && ( // tag
        <Box
          position="absolute"
          zIndex="5"
          w="fit-content"
          right={2}
          bottom={-3}
        >
          <Tag size="sm" bgColor="blackAlpha.300">
            <Text variant="contrast">{pms?.[0].subgroup_name}</Text>
          </Tag>
        </Box>
      )} */}
    </ModalButton>
  );
};

export default PmModalButton;
