import React from "react";

import { Box, HStack, ScaleFade, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

import { RiExchange2Fill } from "react-icons/ri";
import AdvantageBottom from "./AdvantageBottom";
import { useAppSelector } from "../../../../redux/hooks";
import Dot from "../../../exchangers/Dot";
import { buildRateString } from "../../../shared/helper";
import Loader from "../../../shared/Loader";

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.25); }
  100% { transform: scale(1); }
`;

export default function DynamicRateAdvantage({
  hovering,
}: {
  hovering: boolean;
}) {
  const ccRates = useAppSelector((state) => state.main.ccRates);
  const [giveCur, getCur] = ["BTC", "руб."];
  const course = ccRates?.currentRate || 0;
  // const rate =
  //   course < 1
  //     ? `1 ${giveCur} ≈ ${format(1 / course, 1)} ${getCur}`
  //     : ` ${format(course, 1)} ${giveCur} ≈ 1 ${getCur}`;

  return (
    <>
      <Box
        position="absolute"
        top="-130px"
        left="50%"
        transform="translateX(-50%)"
        opacity={hovering ? 1 : 0}
        transition="opacity 0.2s ease"
        pointerEvents="none"
      >
        <Loader
          size={300}
          src={`/p2p/lottie/particles.lottie`}
          isActive={hovering}
          pointerEvents="none"
        />
      </Box>
      <Box top="6" position="absolute" right="6">
        <Text color="bg.700" fontSize="xs" mt="0.5">
          Курс биткойна сейчас:
        </Text>
        <HStack gap="2" alignItems="center">
          <Text color="violet.500" fontSize="sm" mt="0.5">
            {buildRateString({ course, giveCur, getCur })}
          </Text>

          <Box animation={`${pulse} 1s ease-in-out infinite`} w="4">
            <ScaleFade in={hovering} initialScale={0}>
              <Dot color="green" />
            </ScaleFade>
          </Box>
        </HStack>
      </Box>
      <AdvantageBottom
        icon={<RiExchange2Fill size="1.5rem" />}
        hovering={hovering}
        title="Авто-курс"
        subtitle="Твои курсы могут следовать за рынком автоматически или быть статичными "
      />
    </>
  );
}
