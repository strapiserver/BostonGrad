import { Center } from "@chakra-ui/react";
import React from "react";
import { FaLock } from "react-icons/fa";
import { BsPersonFillCheck, BsShieldLockFill } from "react-icons/bs";
import { FaShield } from "react-icons/fa6";
import AdvantageBottom from "./AdvantageBottom";
import { Box3D } from "../../../../styles/theme/custom";

export default function SecurityAdvantage({ hovering }: { hovering: boolean }) {
  const ringOpacity = hovering ? "whiteAlpha.300" : "whiteAlpha.100";

  return (
    <>
      <Center position="absolute" top="10" w="100%">
        <Center
          p="2"
          borderRadius="50%"
          border="2px solid"
          borderColor={ringOpacity}
          transition="transform 0.2s ease, border-color 0.2s ease"
          transform={hovering ? "scale(1.05)" : undefined}
        >
          <Center
            p="2"
            borderRadius="50%"
            border="2px solid"
            borderColor={ringOpacity}
          >
            <Box3D
              w="16"
              h="16"
              borderRadius="50%"
              variant="extra_contrast"
              dropShadow="lg"
            >
              <Center h="16" color={hovering ? "violet.400" : "violet.500"}>
                <BsShieldLockFill size="1.7rem" />
              </Center>
            </Box3D>
          </Center>
        </Center>
      </Center>
      <AdvantageBottom
        icon={<BsPersonFillCheck size="1.5rem" />}
        hovering={hovering}
        title="Проверка твоего клиента"
        subtitle="Сканируем источник средств клиента, минимизируя возможность мошенничества"
      />
    </>
  );
}
