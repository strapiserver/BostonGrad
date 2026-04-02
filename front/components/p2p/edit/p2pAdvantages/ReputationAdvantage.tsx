import { Box, Center } from "@chakra-ui/react";
import React from "react";

import AdvantageBottom from "./AdvantageBottom";
import { BsPersonFillCheck } from "react-icons/bs";
import Loader from "../../../shared/Loader";
export default function ReputationAdvantage({
  hovering,
}: {
  hovering: boolean;
}) {
  const accentOpacity = hovering ? "0.9" : "0.4";

  return (
    <>
      <Center
        position="relative"
        zIndex="4"
        w="100%"
        transition="transform 0.2s ease, filter 0.2s ease"
        transform={hovering ? "scale(1.1)" : undefined}
        filter={`saturate(${hovering ? 1 : 0.3}) brightness(${hovering ? 1 : 0.5})`}
      >
        <Box
          position="absolute"
          top="-170px"
          boxSize="140px"
          borderRadius="full"
          bgGradient="radial(rgba(242, 197, 182, 0.2) 0%, transparent 60%)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          transition="transform 0.3s ease"
          _groupHover={{
            transform: "scale(1.05)",
          }}
          zIndex={0}
        >
          <Loader
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            size={400}
            src={`/p2p/lottie/particles.lottie`}
            isActive={hovering}
            zIndex={0}
            pointerEvents="none"
          />
          <Loader
            size={150}
            src={`/p2p/lottie/REPUTATION.lottie`}
            isActive={hovering}
            zIndex={1}
          />
        </Box>
      </Center>
      <AdvantageBottom
        icon={<BsPersonFillCheck size="1.5rem" />}
        hovering={hovering}
        title="Твой гарант репутации"
        subtitle={
          "Работай через телеграм-чат, как прежде.\nБез риска, без комиссий, без депозитов."
        }
      />
    </>
  );
}
