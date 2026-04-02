import React, { useContext } from "react";
import { Box3D } from "../../../styles/theme/custom";
import { HStack, Text, Box, Divider } from "@chakra-ui/react";
import SideButtons from "./SideButtons";
import CryptoList from "./CryptoList";
// import FiatSelector from "./FiatSelector";

import FiatSelector from "./FiatSelector";
import { IPm } from "../../../types/selector";
import MassSideContext from "../sideContext";
import { capitalize } from "../../main/side/selector/section/PmGroup/helper";

export default function MassTableSelector({ cryptoPms }: { cryptoPms: IPm[] }) {
  const { currentCryptoPm } = useContext(MassSideContext);
  const fullName = `${capitalize(
    currentCryptoPm?.ru_name || currentCryptoPm?.en_name
  )} ${
    currentCryptoPm?.subgroup_name?.toUpperCase() ||
    currentCryptoPm?.currency.code?.toUpperCase()
  }`;
  return (
    <Box3D
      variant="no_contrast"
      w="100%"
      minH="10"
      px={["2", "4"]}
      py={["2", "4"]}
    >
      <Box mt="2" px="2" py="2">
        <CryptoList cryptoPms={cryptoPms} />
        <HStack mt="6" justifyContent="space-between" px={{ base: 0, lg: 14 }}>
          <SideButtons />
          <Divider />
          <Box
            borderRadius="xl"
            border="1px solid"
            borderColor="bg.500"
            px="4"
            py="2"
            display={{ base: "none", lg: "block" }}
          >
            <Text fontWeight="bold" whiteSpace={"nowrap"}>
              {fullName}
            </Text>
          </Box>
          <Text display={{ base: "block", lg: "none" }} fontWeight="bold">
            {"за"}
          </Text>
          <Divider />

          <FiatSelector />
        </HStack>
      </Box>
    </Box3D>
  );
}
