import React from "react";
import { IP2PLevel } from "../../../../types/p2p";
import { Grid, Box, Text, Divider, HStack, VStack } from "@chakra-ui/react";
import { FaArrowRight } from "react-icons/fa";
import Loader from "../../../shared/Loader";
import { Box3D } from "../../../../styles/theme/custom";

export default function MakerLevelsDescription({
  levels,
}: {
  levels: IP2PLevel[];
}) {
  return (
    <Box mt="4">
      {[...levels]
        .sort((a, b) => (a.level ?? 0) - (b.level ?? 0))
        .map((level, index) => (
          <Box key={level.id}>
            <HStack alignItems="start">
              <Box3D
                w="fit-content"
                pb="4"
                position="relative"
                display="flex"
                flexDirection="column"
                alignItems="center"
                minH="200px"
                role="group"
                cursor="pointer"
              >
                <Text
                  fontSize="xs"
                  color="bg.800"
                  position="absolute"
                  top="8"
                  left="8"
                >
                  {`#${index + 1}`}
                </Text>
                <Box
                  position="absolute"
                  top="40%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  boxSize="140px"
                  borderRadius="full"
                  bgGradient="radial(violet.600 0%, transparent 60%)"
                  opacity={index + 1 === 10 ? 0.3 : 0.1}
                  transition="transform 0.3s ease, opacity 0.3s ease"
                  _groupHover={{
                    transform: "translate(-50%, -50%) scale(1.1)",
                    opacity: index + 1 === 10 ? 0.5 : 0.3,
                  }}
                  zIndex={0}
                />

                <Loader
                  size={150}
                  src={`/p2p/lottie/lvl${index + 1}.lottie`}
                  delay={0.2}
                  shift={index * 0.5}
                  zIndex={1}
                />

                <Box
                  mb="auto"
                  fontSize="sm"
                  fontWeight="bold"
                  fontFamily="Montserrat, sans-serif"
                  textAlign="center"
                  zIndex={1}
                  maxW="120px"
                >
                  {level.title}
                </Box>
              </Box3D>
              <VStack
                fontSize="xs"
                color="violet.500"
                p="2"
                spacing="1"
                alignItems="start"
              >
                <Text color="bg.500" fontSize="sm" whiteSpace="pre-line" mb="2">
                  {level.description}
                </Text>
                {!!level.deals_needed && (
                  <Text>{`• Сделок минимум: ${level.deals_needed}`}</Text>
                )}
                <Text>
                  {`• Онлайн сделка частями до ~${level.limit_online_usd}$ или одной транзакцией через эскроу-смарт-контракт (только для USDT)`}
                </Text>
                <Text>
                  {`• Личная встреча частями до ~${level.limit_offline_usd}$ или одной транзакцией через эскроу-смарт-контракт (только для USDT)`}
                </Text>
                {!!level.deposit_usd && (
                  <Text>
                    {`• На этот уровень доверия можно перескочить сразу через депозит ${level.deposit_usd} USDT`}
                  </Text>
                )}
              </VStack>
            </HStack>
            {index + 1 !== 10 ? <Divider my="4" /> : <Box />}
          </Box>
        ))}
    </Box>
  );
}
