import { useToken, useColorModeValue } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";

const HorizontalShader = ({
  direction = "left",
  no_contrast = true,
}: {
  direction: "left" | "right";
  no_contrast?: boolean;
}) => {
  const [shaderColor] = useToken(
    "colors",
    no_contrast
      ? useColorModeValue(["bg.100"], ["bg.700"])
      : useColorModeValue(["bg.50"], ["bg.900"])
  );

  return (
    <Box
      h="100%"
      boxShadow={`0 0 30px 30px ${shaderColor}`}
      position="absolute"
      top="0"
      ml={no_contrast && direction === "left" ? "12" : "unset"}
      mr={no_contrast && direction === "right" ? "12" : "unset"}
      left={direction === "left" ? "0" : "unset"}
      right={direction === "right" ? "0" : "unset"}
      pointerEvents="none"
      zIndex="10"
    />
  );
};

export default HorizontalShader;
