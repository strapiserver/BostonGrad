import React from "react";
import { Box, BoxProps } from "@chakra-ui/react";

type GlassProps = BoxProps & {
  children: React.ReactNode;
};

const Glass = ({ children, ...boxProps }: GlassProps) => {
  return (
    <Box
      position="relative"
      display="inline-block"
      w="fit-content"
      h="fit-content"
      maxW="100%"
      maxH="100%"
      borderRadius="28px"
      px={{ base: "2", md: "8" }}
      py={{ base: "1", md: "6" }}
      bg="rgba(255,255,255,0.01)"
      border="1px solid rgba(170, 140, 240, 0.55)"
      boxShadow="0 18px 60px rgba(36, 18, 76, 0.2), inset 0 0 0 1px rgba(206,184,255,0.32)"
      backdropFilter="blur(6px) saturate(115%)"
      WebkitBackdropFilter="blur(6px) saturate(115%)"
      overflow="hidden"
      {...boxProps}
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
      {children}
    </Box>
  );
};

export default Glass;
