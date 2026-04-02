// src/components/Swiper/BottomLabel.tsx
import React from "react";
import { Box } from "@chakra-ui/react";

interface BottomLabelProps {
  text?: string;
}

const BottomLabel: React.FC<BottomLabelProps> = ({ text = "End of List" }) => {
  return (
    <Box w="90%" py="2" pointerEvents="none" gap="1">
      {text}
    </Box>
  );
};

export default BottomLabel;
