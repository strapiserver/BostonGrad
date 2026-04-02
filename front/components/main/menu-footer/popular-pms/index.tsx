import { HiArrowLongRight } from "react-icons/hi2";

import Wrapper from "../Wrapper";
import { HStack, useColorModeValue } from "@chakra-ui/react";
import SideContext from "../../../shared/contexts/SideContext";
import PopularSide from "./popular-side";

const Popular = () => {
  return (
    <Wrapper title="Quick Change">
      <HStack
        justifyContent="center"
        gap="12"
        color={useColorModeValue("violet.700", "violet.600")}
      >
        <SideContext.Provider value={"give"}>
          <PopularSide />
        </SideContext.Provider>

        <HiArrowLongRight size="2rem" />

        <SideContext.Provider value={"get"}>
          <PopularSide />
        </SideContext.Provider>
      </HStack>
    </Wrapper>
  );
};

export default Popular;
