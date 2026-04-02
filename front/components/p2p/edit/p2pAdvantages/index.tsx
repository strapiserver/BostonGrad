import { Box, Flex, Grid, HStack, useColorModeValue } from "@chakra-ui/react";
import React from "react";

import Advantage from "./Advantage";
import plots from "../../../../public/p2p/advantages/plots.png";
import dots from "../../../../public/p2p/advantages/dots.png";
import security from "../../../../public/p2p/advantages/security.png";
import squares from "../../../../public/p2p/advantages/squares.png";
import HashAdvantage from "./SecurityAdvantage";
import DotsAdvantage from "./TrafficAdvantage";
import PlotAdvantage from "./DynamicRateAdvantage";
import DynamicRateAdvantage from "./DynamicRateAdvantage";
import SecurityAdvantage from "./SecurityAdvantage";
import ReputationAdvantage from "./ReputationAdvantage";
import TrafficAdvantage from "./TrafficAdvantage";

export default function P2PAdvantages() {
  const ambientColor = useColorModeValue(
    "rgba(143,92,292,0.2)",
    "rgba(247, 197, 177, 0.1)",
  );
  return (
    <Grid gap="8" gridTemplateColumns="1fr 1fr">
      <Box
        position="absolute"
        inset={0}
        zIndex={0}
        top="-150px"
        pointerEvents="none" // <-- lets all clicks/touches pass through
        bgGradient={`radial-gradient(ellipse at 50% 50%, ${ambientColor} 10%, transparent 65%)`}
      />
      <Advantage alt="advantage-traffic" imageSrc={dots}>
        {(hovering) => <TrafficAdvantage hovering={hovering} />}
      </Advantage>
      <Advantage alt="advantage-reputation" imageSrc={squares}>
        {(hovering) => <ReputationAdvantage hovering={hovering} />}
      </Advantage>
      <Advantage alt="advantage-dynamic-rate" imageSrc={plots}>
        {(hovering) => <DynamicRateAdvantage hovering={hovering} />}
      </Advantage>

      <Advantage alt="advantage-security" imageSrc={security}>
        {(hovering) => <SecurityAdvantage hovering={hovering} />}
      </Advantage>
    </Grid>
  );
}
