import {
  Center,
  Box,
  Text,
  Link,
  HStack,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";

import { IMainText } from "../../types/pages";
import Shader from "../shared/Shader";
import { useState, useEffect } from "react";
import CustomImage from "../shared/CustomImage";
import { ResponsiveText } from "../../styles/theme/custom";

const CircularTexts = ({ mainTexts }: { mainTexts?: IMainText[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const borderColor = useColorModeValue("bg.200", "bg.600");
  const bgColor = useColorModeValue("bg.100", "bg.700");
  const mainColor = useColorModeValue("violet.700", "violet.600");
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, 5000); // 2 seconds pause + 1 second transition

    return () => clearInterval(intervalId);
  }, []);
  if (!mainTexts?.length) return <></>;
  return (
    <Box overflow="hidden" pos="relative" w="100%" mx="2">
      <Shader direction="top" no_contrast />
      <Box position="relative" w="100%" minH="100%" h="200px">
        {mainTexts.map((mt, index) => (
          <Box
            key={index}
            position="absolute"
            top={currentIndex % mainTexts.length === index ? "50%" : "1020%"}
            left="50%"
            transform={
              currentIndex % mainTexts.length === index
                ? "translate(-50%, -50%)"
                : "translate(-50%, 100%)"
            }
            width="100%"
            opacity={currentIndex % mainTexts.length === index ? 1 : 0}
            transition="opacity 1s ease-in-out, transform .8s ease-in-out"
          >
            <ResponsiveText as="h3" fontSize={{ base: "xl", lg: "2xl" }}>
              {mt.title}
            </ResponsiveText>
            <Box h="1px" bgColor={borderColor} w="60%" my="1" />
            <ResponsiveText
              whiteSpace="normal"
              variant="no_contrast"
              maxW="68%"
            >
              {mt.description}
            </ResponsiveText>

            <Link
              href={mt.link?.href}
              isExternal={mt.link?.isExternal}
              color={mainColor}
            >
              {mt.link?.text}
            </Link>
          </Box>
        ))}

        <Box
          position="absolute"
          top="50%"
          left={{ base: "3%", lg: "12%" }}
          w="600px"
          h="600px"
          borderRadius="50%"
          border="2px dashed"
          borderColor={borderColor}
          transition="transform 1s ease-in-out"
          transform={`translate(-50%, -50%) rotate(${
            (-currentIndex * 360) / mainTexts.length
          }deg)`}
        >
          {mainTexts.map((mt, index) => {
            const angle = (index * Math.PI) / (mainTexts.length / 2); // Divide the circle into 12 equal parts
            const x = 300 * Math.cos(angle) + 300 - 52; // Adjusting x position
            const y = 300 * Math.sin(angle) + 300 - 52; // Adjusting y position
            return (
              <Center
                key={index}
                h="100px"
                w="100px"
                border="2px dashed"
                borderColor={borderColor}
                bgColor={bgColor}
                borderRadius="50%"
                position="absolute"
                left={`${x}px`}
                top={`${y}px`}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Box
                  transform={`rotate(${(index * 360) / mainTexts.length}deg)`}
                >
                  <CustomImage
                    img={mt.image}
                    w="60px"
                    h="60px"
                    customAlt={mt.title}
                    objectFit="contain"
                  />
                </Box>
              </Center>
            );
          })}
        </Box>
      </Box>
      <Shader direction="bottom" no_contrast />
    </Box>
  );
};

export default CircularTexts;
