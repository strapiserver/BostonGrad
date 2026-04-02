import React from "react";
import { Box } from "@chakra-ui/react";

const Glass = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      borderRadius="28px"
      px={{ base: "6", md: "8" }}
      py={{ base: "5", md: "6" }}
      bg="rgba(255,255,255,0.01)"
      border="1px solid rgba(170, 140, 240, 0.55)"
      boxShadow="0 18px 60px rgba(36, 18, 76, 0.2), inset 0 0 0 1px rgba(206,184,255,0.32)"
      backdropFilter="blur(6px) saturate(115%)"
      WebkitBackdropFilter="blur(6px) saturate(115%)"
      overflow="hidden"
      _before={{
        content: '""',
        position: "absolute",
        top: "-80px",
        left: "-70px",
        width: "220px",
        height: "220px",
        borderRadius: "full",
        background:
          "radial-gradient(circle, rgba(170,140,240,0.1) 0%, rgba(170,140,240,0) 72%)",
        pointerEvents: "none",
      }}
      _after={{
        content: '""',
        position: "absolute",
        bottom: "-95px",
        right: "-90px",
        width: "260px",
        height: "260px",
        borderRadius: "full",
        background:
          "radial-gradient(circle, rgba(148,104,232,0.1) 0%, rgba(148,104,232,0) 74%)",
        pointerEvents: "none",
      }}
    >
      <Box
        position="absolute"
        top="10px"
        right="14px"
        w="80px"
        h="2px"
        bg="rgba(188,160,250,0.7)"
      />
      <Box position="relative" zIndex={1}>
        {children}
      </Box>
    </Box>
  );
};

export default Glass;
