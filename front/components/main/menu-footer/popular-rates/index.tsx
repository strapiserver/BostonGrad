import {
  Box,
  Center,
  Grid,
  HStack,
  Text,
  useColorModeValue,
  useToken,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
// import { curveNatural } from "@visx/curve";
// import { LinearGradient } from "@visx/gradient";
// import { scaleLinear } from "@visx/scale";
// import { LinePath } from "@visx/shape";
import { RiArrowDropUpFill, RiArrowDropDownFill } from "react-icons/ri";
import { batch } from "react-redux";
import { addSpaces } from "../../../../redux/amountsHelper";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { triggerModal } from "../../../../redux/mainReducer";
import CustomModal from "../../../shared/CustomModal";
import Wrapper from "../Wrapper";
import PopularRates from "./modal-data";
import PopularRatesModal from "./modal-data";

export default function BestRates() {
  //   const height = 50;
  //   const width = 180;
  //   const padding = 8;

  //   const [primary200, primary500, bg700, bg900] = useToken("colors", [
  //     "violet.600",
  //     "violet.800",
  //     "bg.700",
  //     "bg.900",
  //   ]);

  //   const xScale = scaleLinear({
  //     domain: [1, 10],
  //     range: [0 + padding, width - padding],
  //   });

  //   const yScale = scaleLinear({
  //     domain: [0, 50],
  //     range: [height - padding, padding * 2],
  //   });

  //   const data1 = [
  //     [1, 0],
  //     [2, 10],
  //     [3, 30],
  //     [4, 19],
  //     [5, 16],
  //     [6, 23],
  //     [7, 48],
  //     [8, 43],
  //     [9, 38],
  //     [10, 0],
  //   ];
  const bestRatesPreview = useAppSelector(
    (state) => state.main.bestRatesPreview,
  );

  const ratePairs =
    bestRatesPreview && Object.keys(bestRatesPreview).length
      ? Object.entries(bestRatesPreview).map(([currency, rate]) => [
          currency,
          addSpaces(rate),
        ])
      : [
          ["ETH", "$3,331.35"],
          ["BTC", "$63,750.60"],
          ["USDT", "$1.01"],
        ];

  const [bg50, bg900] = useToken("colors", ["bg.10", "bg.900"]);
  const bg = useColorModeValue(bg50, bg900);
  const dispatch = useAppDispatch();

  return (
    <Wrapper title="Best Rates">
      <VStack
        alignItems="center"
        position="relative"
        w="85%"
        cursor="pointer"
        onClick={() => dispatch(triggerModal("popular-rates"))}
        transition="all .3s ease"
        bgColor={useColorModeValue("rgba(2,2,2,0.1)", "rgba(200,200,200,0.05)")}
        _hover={{
          bgColor: "transparent",
        }}
        borderRadius="30%"
        p="2"
        maxH="20"
        gap="0"
      >
        <CustomModal
          id="popular-rates"
          header="The best rates for crypto exchange"
        >
          <PopularRates />
        </CustomModal>

        {ratePairs.map((ratePair, index) => (
          <Grid
            key={String(ratePair)}
            zIndex="3"
            gridTemplateColumns="1fr 2fr 12px"
            w={index % 2 ? "100%" : "95%"}
            gap={0}
            color={index % 2 ? "green.500" : "red.500"}
            fontSize={index % 2 ? "sm" : "xs"}
          >
            <Text color={useColorModeValue("violet.700", "violet.600")}>
              {String(ratePair[0]).toUpperCase()}
            </Text>

            <Text
              color={useColorModeValue("bg.700", "bg.200")}
              justifySelf="end"
            >
              {ratePair[1]}
            </Text>
            {index % 2 ? (
              <RiArrowDropUpFill size="1rem" />
            ) : (
              <RiArrowDropDownFill size="1rem" />
            )}
          </Grid>
        ))}
        <Box
          w="100%"
          h="100%"
          position="absolute"
          zIndex="4"
          bottom="0"
          borderRadius="xl"
          bgGradient={`linear(to-b, ${bg} 10%, transparent  50%, ${bg} 90%)`}
        />
      </VStack>
    </Wrapper>
  );
}
