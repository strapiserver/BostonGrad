import {
  useToken,
  Text,
  useColorModeValue,
  Box,
  Heading,
  BoxProps,
} from "@chakra-ui/react";
import React from "react";

type CustomTitleProps = {
  as: "h1" | "h2" | "h3";
  title: string;
  subtitle?: string;
  subtitle2?: string;
} & BoxProps;

export default function ({
  as,
  title,
  subtitle,
  subtitle2,
  ...props
}: CustomTitleProps) {
  const [peripheryColor, centerColor] = useToken(
    "colors",
    useColorModeValue(["violet.900", "violet.700"], ["bg.200", "violet.600"]),
  );

  return (
    <Box
      mt={{ base: "16", lg: "32" }}
      mb={{ base: "8", lg: "16" }}
      zIndex="1"
      bgGradient={`radial-gradient(circle at 50% -10%, ${centerColor} 10%, ${peripheryColor} 70%)`}
      bgClip="text"
      fontSize={{ base: "xl", lg: "5xl" }}
      w="100%"
      textAlign={"center"}
      {...props}
    >
      <Text
        as={as}
        fontWeight="semibold"
        fontFamily="Montserrat, sans-serif"
        color="inherit"
        fontSize="inherit"
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          as="p"
          fontSize={{ base: "md", lg: "xl" }}
          mt={2}
          color="bg.700"
          fontWeight="light"
          fontFamily="Montserrat, sans-serif"
        >
          {subtitle}
        </Text>
      )}

      {subtitle2 && (
        <Text
          as="p"
          fontSize={{ base: "md", lg: "xl" }}
          mt={2}
          color="bg.700"
          fontWeight="light"
          fontFamily="Montserrat, sans-serif"
        >
          {subtitle2}
        </Text>
      )}
    </Box>
  );
}
