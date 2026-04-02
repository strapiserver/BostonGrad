import { Box } from "@chakra-ui/react";

const NoiseLayer = () => {
  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      width="100vw"
      height="100vh"
      pointerEvents="none" // Ensures the layer is non-interactive
      backgroundImage="url('/noise.png')" // Publicly available noise texture
      backgroundSize="100px 100px" // Adjust this for texture scale
      backgroundRepeat="repeat"
      opacity="0.3" // Set noise visibility
      zIndex="overlay" // Ensures it appears on top
      mixBlendMode="soft-light" // Optional for blending effect
    />
  );
};

export default NoiseLayer;
