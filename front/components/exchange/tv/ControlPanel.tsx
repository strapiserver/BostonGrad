import {
  VStack,
  Button,
  Box,
  useColorModeValue,
  useToken,
} from "@chakra-ui/react";

import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { Box3D } from "../../../styles/theme/custom";
import { useAppSelector } from "../../../redux/hooks";

const ControlPanel = ({
  stepUp,
  stepDown,
  length,
}: {
  stepUp: any;
  stepDown: any;
  length: number;
}) => {
  const [peach300, violet600] = useToken("colors", ["violet.700", "violet.700"]);
  const colorKey = useColorModeValue(violet600, peach300);
  const mainColor = useColorModeValue("violet.700", "violet.600");
  const secondaryColor = useColorModeValue("bg.100", "bg.800");
  const index = useAppSelector((state) => state.main.swiperIdVisible);
  return (
    <Box3D w={"10"} flex="1" overflow="hidden">
      <VStack h="100%">
        <Button variant="default" onClick={() => stepDown()} color="bg.700">
          <IoIosArrowUp size="1.2rem" />
        </Button>
        <VStack
          w="100%"
          px={["0.5", "2"]}
          h="100%"
          justifyContent={length >= 10 ? "space-around" : "center"}
          gap={length >= 20 ? 0 : length >= 10 ? 0.5 : 1}
        >
          {Array.from({ length }).map((_, idx) => (
            <Box
              key={idx}
              transition="background-color 200ms linear"
              bgColor={idx === index ? mainColor : secondaryColor}
              boxShadow={idx === index ? `0 0 10px -2px ${colorKey}` : "unset"}
              borderRadius="sm"
              aspectRatio={length >= 10 ? "8 / 1" : ["1 / 1", "2 / 1"]}
              h={length >= 10 ? "0.5" : ["2", "3"]}
            />
          ))}
        </VStack>
        <Button variant="default" onClick={() => stepUp()} color="bg.700">
          <IoIosArrowDown size="1.2rem" />
        </Button>
      </VStack>
    </Box3D>
  );
};

export default ControlPanel;
