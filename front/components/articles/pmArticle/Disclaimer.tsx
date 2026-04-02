import { Box, HStack, Text } from "@chakra-ui/react";
import { IDisclaimer } from "../../../types/pages";
import { IoIosWarning } from "react-icons/io";
import { FaLightbulb } from "react-icons/fa";
import { IconType } from "react-icons";
import { RiErrorWarningFill } from "react-icons/ri";

const Disclaimer = ({ disclaimer }: { disclaimer: IDisclaimer }) => {
  const colors = {
    red: ["rgba(250, 60, 60, 0.1)", RiErrorWarningFill],
    yellow: ["rgba(250, 200, 80, 0.1)", IoIosWarning],
    green: ["rgba(60, 250, 60, 0.1)", FaLightbulb],
  };
  const [color, Icon] = colors[disclaimer.color] as [string, IconType];
  return (
    <Box key={disclaimer.id} borderRadius="lg" bgColor={color} my="4" minH="14">
      <HStack bgColor={color} p="2" borderTopRadius="inherit">
        <Icon size="1.2rem" />
        <Text>{disclaimer.title}</Text>
      </HStack>
      <Box p="2">{disclaimer.text}</Box>
    </Box>
  );
};

export default Disclaimer;
