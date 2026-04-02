import { Center, HStack } from "@chakra-ui/react";
import React from "react";

import { BsCurrencyBitcoin } from "react-icons/bs";
import AdvantageBottom from "./AdvantageBottom";
import { FaBolt } from "react-icons/fa6";
import { Box3D, ResponsiveText } from "../../../../styles/theme/custom";
import { BiSolidFace } from "react-icons/bi";

export default function TrafficAdvantage({ hovering }: { hovering: boolean }) {
  const accentOpacity = hovering ? "1" : "0.8";

  return (
    <>
      <Center
        position="absolute"
        top="20px"
        zIndex="3"
        w="100%"
        filter={`opacity(${hovering ? 0.35 : 0.2})`}
        transform={hovering ? "translateY(2px)" : undefined}
      >
        <Box3D
          w="80%"
          borderRadius="lg"
          h="14"
          variant="extra_contrast"
        ></Box3D>
      </Center>
      <Center
        position="absolute"
        top="40px"
        zIndex="3"
        w="100%"
        filter={`opacity(${hovering ? 0.55 : 0.4})`}
        transform={hovering ? "translateY(6px)" : undefined}
      >
        <Box3D
          w="85%"
          borderRadius="lg"
          h="14"
          variant="extra_contrast"
        ></Box3D>
      </Center>
      <Center
        position="absolute"
        top="60px"
        zIndex="4"
        w="100%"
        transition="transform 0.2s ease, filter 0.2s ease"
        transform={hovering ? "translateY(10px)" : undefined}
        filter={`saturate(${hovering ? 1.1 : 0.9})`}
      >
        <Box3D
          w="90%"
          h="16"
          borderRadius="lg"
          variant="extra_contrast"
          dropShadow="lg"
          p="2"
        >
          <HStack justifyContent="space-between">
            <HStack gap="1" color="bg.700">
              <BiSolidFace size="1rem" />
              <ResponsiveText
                size="xs"
                fontWeight="bold"
                mt="0.5"
                color="inherit"
              >
                Алексей
              </ResponsiveText>
            </HStack>

            <ResponsiveText size="xs" variant="shaded" color={"bg.700"}>
              сейчас
            </ResponsiveText>
          </HStack>
          <ResponsiveText
            size="xs"
            mt="1"
            ml="1"
            color={`rgba(255,255,255,${accentOpacity})`}
          >
            Есть кто продает USDT за наличку в Москве?
          </ResponsiveText>
        </Box3D>
      </Center>
      <AdvantageBottom
        icon={<FaBolt size="1rem" />}
        hovering={hovering}
        title="Бесплатный трафик"
        subtitle="Ищем твоих потенциальных клиентов в сотнях телеграм групп в реальном времени"
      />
    </>
  );
}
