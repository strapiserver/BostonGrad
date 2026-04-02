import React from "react";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ResponsiveText } from "../../../styles/theme/custom";
import { RiArrowDownWideLine } from "react-icons/ri";
import { RiSearchLine } from "react-icons/ri";

function pluralize(
  count: number,
  one: string,
  few: string,
  many: string
): string {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return one; // 1, 21, 31, ...
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few; // 2–4, 22–24...
  return many; // 0, 5–20, 25–30, ...
}

const MotionBox = motion(Box);

interface TopLabelProps {
  text?: string;
  length: number;
}

const TopLabel: React.FC<TopLabelProps> = ({ text, length }) => {
  const isLong = text ? text.length > 30 : true;

  return (
    <VStack
      position="absolute"
      top="auto"
      w="90%"
      py="1"
      pointerEvents="none"
      gap="1"
      color="bg.700"
    >
      {/* <Text as="h1" textAlign="center" fontSize={isLong ? "sm" : "lg"} mb="1">
        {text}
      </Text> */}

      <HStack>
        {/* <RiSearchLine size="1rem" /> */}
        <ResponsiveText textAlign="center" size="lg" color="inherit">
          {`Найдено ${length} ${pluralize(
            length,
            "предложение",
            "предложения",
            "предложений"
          )}`}
        </ResponsiveText>
      </HStack>

      <Box position="absolute" bottom="-8" transform="scaleX(1.5)">
        <MotionBox
          animate={{
            y: [0, -2, 0],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            type: "spring",
            stiffness: 150,
            damping: 8,
          }}
        >
          <RiArrowDownWideLine size="1.2rem" />
        </MotionBox>

        {/* Arrow 2 - larger bounce, synced frequency */}
        <MotionBox
          mt="-2"
          animate={{
            y: [0, -3, 0],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,

            repeatType: "mirror",
            ease: "easeInOut",
            type: "spring",
            stiffness: 150,
            damping: 8,
          }}
        >
          <RiArrowDownWideLine size="1.2rem" />
        </MotionBox>
      </Box>
    </VStack>
  );
};

export default TopLabel;
