import { Box } from "@chakra-ui/react";
import React from "react";

type FlagTextProps = {
  text?: string;
};

const usaPattern = /(США)/gi;

const FlagText = ({ text }: FlagTextProps) => {
  return (
    <>
      {String(text || "")
        .split(usaPattern)
        .map((part, index) => {
          if (part.toLowerCase() !== "сша") return part;

          return (
            <Box
              key={`${part}-${index}`}
              as="span"
              display="inline-block"
              mx="0.04em"
              bgImage="url('/flag.jpg')"
              bgPosition="center"
              bgRepeat="no-repeat"
              bgSize="100% 100%"
              bgClip="text"
              color="transparent"
              filter="brightness(1.06) contrast(1.04)"
              textShadow="none"
              sx={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "none",
              }}
            >
              {part.toUpperCase()}
            </Box>
          );
        })}
    </>
  );
};

export default FlagText;
