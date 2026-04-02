import React, { useState } from "react";
import { Box, Center, HStack, Text } from "@chakra-ui/react";
import { IoAddOutline } from "react-icons/io5";
import { batch } from "react-redux";
import { useAppDispatch } from "../../../../../../redux/hooks";
import {
  setSearchBarInputValue,
  triggerModal,
} from "../../../../../../redux/mainReducer";
import ModalButton from "../../../../../main/side/pmModalButton/ModalButton";
import PmIcons from "../../../../../main/side/pmModalButton/PmIcons";
import { IPm } from "../../../../../../types/selector";

import { getModalId } from "../helpers";
import { DirectionSide } from "../types";
import { getPmNameFromPm } from "../../../../../shared/helper";
import { capitalize } from "../../../../../main/side/selector/section/PmGroup/helper";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import DirectionSelectorModal from "./DirectionSelectorModal";

const DirectionPmButton = ({
  side,
  directionIndex,
  pm,
  handleExpand,
}: {
  side: DirectionSide;
  directionIndex: number;
  pm?: IPm;
  handleExpand: (event: any, index: number) => void;
}) => {
  const dispatch = useAppDispatch();
  // const [hovered, setHovered] = useState(false);
  const pms = pm ? [pm] : [];
  const currencyCode = pms?.[0]?.currency?.code?.toUpperCase();
  const unselectedPmText =
    side === "give" ? "Клиент отдает" : "Клиент получает";
  const modalId = getModalId(directionIndex, side);

  const openDialog = () => {
    batch(() => {
      dispatch(triggerModal(modalId));
      dispatch(setSearchBarInputValue(""));
    });
  };

  const pmName = getPmNameFromPm(pms[0]);

  //const shortName = getPmNameFromPm(pms[0], true);

  return (
    <HStack
      borderRadius="xl"
      bgColor={"unset"}
      _hover={{
        bgColor: "whiteAlpha.200",
      }}
      onClick={(e: any) => {
        handleExpand(e, directionIndex);
        openDialog();
      }}
      py="2"
      px="4"
    >
      {pms?.length ? (
        <PmIcons pms={pms} />
      ) : (
        <Center
          border="2px dashed"
          borderColor="bg.500"
          borderRadius="50%"
          h="6"
          w="6"
          ml="-1"
        >
          <IoAddOutline size="1rem" />
        </Center>
      )}
      <DirectionSelectorModal
        id={modalId}
        side={side}
        directionIndex={directionIndex}
      />
      <Text
        fontSize="lg"
        color="violet.500"
        fontWeight="semibold"
        fontFamily="Montserrat, sans-serif"
      >
        {!pms?.length ? unselectedPmText : pmName}
      </Text>
      <Box ml="auto" color="bg.900">
        <MdOutlineKeyboardArrowDown size="1.5rem" />
      </Box>
    </HStack>
  );
};

export default DirectionPmButton;

//  <Box3D
//         w="100%"
//         flex="1"
//         px="4"
//         py="2"
//         cursor="pointer"
//         display="block"
//         alignSelf="stretch"
//         transition="filter 0.2s ease-in"
//         _hover={{ filter: "brightness(1.1)" }}
//         variant="contrast"
//         minH={fullHeight ? "70px" : "unset"}
//       >
//         <Grid
//           gridTemplateColumns={"1fr 40px 1fr"}
//           gridTemplateRows="auto"
//           color="bg.800"
//           alignItems="center"
//           columnGap="2"
//         >
//           <Box gridColumn="1" display="flex" flexDir="column" gap="1">
//             <PmName pm={givePm} isFull={false} />
//             {leftContent}
//           </Box>

//           <Box gridColumn="2" justifySelf="center">
//             <BsArrowRightShort size="1.5rem" />
//           </Box>

//           <Box gridColumn="3" display="flex" flexDir="column" gap="1">
//             <PmName pm={getPm} isFull={false} />
//             {rightContent}
//           </Box>
//         </Grid>
//       </Box3D>
