import { Box } from "@chakra-ui/react";
import SideContext from "../shared/contexts/SideContext";
import ReverseButton from "./ReverseButton";
import Side from "./side";

const Calculator = () => {
  return (
    <Box>
      <SideContext.Provider value={"give"}>
        <Side />
      </SideContext.Provider>

      <ReverseButton />

      <SideContext.Provider value={"get"}>
        <Side />
      </SideContext.Provider>
    </Box>
  );
};

export default Calculator;
