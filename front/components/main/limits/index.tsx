import {
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Box,
  Flex,
  Center,
  useToken,
  Text,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Tooltip,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import useSmooth from "../../../services/hooks/smooth";
import { Box3D, ResponsiveText } from "../../../styles/theme/custom";
import Limit from "./Limit";
import {
  isClose,
  kFormatter,
  localFormat,
  R,
} from "../../../redux/amountsHelper";
import { setAmount } from "../../../redux/mainReducer";
import { RxDragHandleDots2 } from "react-icons/rx";
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";
import Thumb from "./Thumb";

import { useRouter } from "next/router";
const CustomRangeSlider = ({
  resMin,
  resMax,
  orientation = "horizontal",
  children,
}: {
  resMin: number;
  resMax: number;
  orientation?: "horizontal" | "vertical";
  children: React.ReactNode;
}) => {
  const smoothResMin = useSmooth(resMin);
  const smoothResMax = useSmooth(resMax);

  return (
    <RangeSlider
      value={[smoothResMin, smoothResMax]}
      aria-label={["min", "max"]}
      min={0}
      max={100}
      orientation={orientation}
    >
      {children}
    </RangeSlider>
  );
};

const LimitsRange = () => {
  const dispatch = useAppDispatch();
  const currentDirRate = useAppSelector(
    (state) => state.main?.dirRates?.[state.main.swiperIdVisible]
  );

  const side = useAppSelector((state) => state.main.side as "give" | "get");

  // const [minWord, maxWord, limitsWord] =
  //   locale == "en" ? ["min", "max", "limits"] : ["мин", "макс", "лимиты"];
  // if(!currentDirRate) return <></>

  const giveCur = useAppSelector(
    (state) => state.main.givePm?.currency.code.toUpperCase() || ""
  );
  const getCur = useAppSelector(
    (state) => state.main.getPm?.currency.code.toUpperCase() || ""
  );

  const mainCur = side === "give" ? giveCur : getCur;

  const dirRates = useAppSelector((state) => state.main.dirRates || []);
  const allMins = dirRates?.map((r) => R(r.min?.[side], 2));
  const allMaxes = dirRates?.map((r) => R(r.max?.[side], 2));
  // Avoid Infinity when dirRates is empty or contains non-numeric values
  const validMaxes = allMaxes.filter((n) => Number.isFinite(n) && n > 0);
  const validMins = allMins.filter((n) => Number.isFinite(n) && n > 0);
  const highestMaxBase = Math.max(...validMaxes);

  const lowestMinBase =
    validMins.length > 0 ? Math.min(...validMins) : 1; /* safe default */
  let [highestMax, lowestMin] = [highestMaxBase, lowestMinBase];
  if (highestMax > lowestMin * 10000) {
    highestMax = highestMax / 10;
  }

  const amount =
    useAppSelector(
      (state) => +state.main.amountOutputs[side].replaceAll(" ", "")
    ) || 0;

  const { min, max } = currentDirRate
    ? currentDirRate
    : { min: { give: 0, get: 0 }, max: { give: 0, get: 0 } };

  const [MIN, MAX] =
    min?.[side] && max?.[side] ? [R(min[side], 2), R(max[side], 2)] : [0, 0];

  const minVal = R(
    validMins.length > 0 ? Math.min(...validMins) : lowestMinBase,
    3
  );
  const maxVal = R(
    validMaxes.length > 0 ? Math.max(...validMaxes) : highestMaxBase,
    3
  );
  const logStartPerc = 6;
  const logEndPerc = 96;
  const logStartAmount = Math.max(minVal * 10, 0.001); // ties into last low special point
  const logEndAmount = Math.max(maxVal / 100, logStartAmount * 1.01); // ties into first high special point
  const percToAmount = (x: number) => {
    // special snap zones
    if (x > 98) return maxVal;
    if (x > 97) return maxVal / 10;
    if (x > 96) return maxVal / 100;
    if (x < 2) return minVal * 1;
    if (x < 3) return minVal * 2;
    if (x < 4) return minVal * 3;
    if (x < 5) return minVal * 5;
    if (x < 6) return minVal * 10;

    // logarithmic curve anchored to the special points at 6% and 96%
    const t = (x - logStartPerc) / (logEndPerc - logStartPerc);
    return R(logStartAmount * (logEndAmount / logStartAmount) ** t, 3);
  };

  const amountToPerc = (x?: number) => {
    if (!x) return 0;
    if (x >= maxVal) return 99; // close to top
    if (x > maxVal / 10) return 98.5;
    if (x > maxVal / 100) return 97.5;
    if (x <= minVal) return 1;
    if (x <= minVal * 2) return 2.5;
    if (x <= minVal * 3) return 3.5;
    if (x <= minVal * 5) return 4.5;
    if (x <= minVal * 10) return 5.5;

    const t =
      Math.log(x / logStartAmount) / Math.log(logEndAmount / logStartAmount);
    return logStartPerc + t * (logEndPerc - logStartPerc);
  };
  const [percMin, percMax] = [amountToPerc(MIN), amountToPerc(MAX)];
  //const smoothCenter = useSmooth(percMin + (percMax - percMin) / 2);

  const stickTo = [1, 10, 100, 1_000, 10_000, 100_000, 1_000_000, MIN, MAX];
  const stick = (a: number) => stickTo.find((s) => isClose(s, a)) || a;

  const stickyAmount = stick(amount);

  const mainColor = useColorModeValue("violet.600", "violet.600");

  //const color1 = useColorModeValue("bg.300", "bg.800");
  const colorTrackInactive = useColorModeValue("bg.300", "bg.600");
  const colorTrackBG = useColorModeValue("bg.100", "bg.800");
  //const colorHint = useColorModeValue("bg.10", "bg.800");

  const colorTrackFilled =
    stickyAmount >= MIN && stickyAmount <= MAX ? mainColor : colorTrackInactive;

  const props = { mainCur, stickyAmount, MIN, MAX };
  if (!MIN || !MAX)
    return <Box3D minW="40px" minH="167px" h="100%" alignSelf="stretch" />;

  // --- LimitsRange (vertical layout) ---
  return (
    <Box3D
      py="2"
      // my={[2, 3, 4]}
      cursor="pointer"
      display="flex"
      flexDir="column"
      alignItems="center"
      alignSelf="stretch"
    >
      {/* give/get toggle on top */}
      {/* <VStack spacing={1} mb="3" onClick={changeSide}>
        <Text fontSize="xs" color={side === "give" ? mainColor : "bg.500"}>
          {giveCur}
        </Text>
        <Text fontSize="xs" color={side === "get" ? mainColor : "bg.500"}>
          {getCur}
        </Text>
      </VStack> */}

      {/* vertical sliders */}
      <VStack
        position="relative"
        h="100%"
        w="10"
        justifyContent="center"
        alignItems="center"
      >
        {/* user amount (single) */}
        <Box
          position="absolute"
          left="20px"
          transform="translateX(-50%)"
          zIndex="3"
          h="96%"
          // w="64px" // <-- force same width as range track box
          display="flex"
          justifyContent="center" // center track inside
        >
          <Slider
            orientation="vertical"
            aria-label="limits"
            focusThumbOnChange={false}
            value={amountToPerc(stickyAmount)}
            step={0.5}
            onChange={(x) => {
              const newAmount = stick(percToAmount(x));
              if (amount !== newAmount) {
                dispatch(
                  setAmount({ side, num: newAmount, str: String(newAmount) })
                );
              }
            }}
            h="100%"
            w="4px" // <-- make the actual slider narrow (just like track)
          >
            <Thumb {...props} />
            <SliderTrack bgColor="transparent" />
          </Slider>
        </Box>

        {/* min/max range (readonly) */}
        <Box h="96%" pointerEvents="none" color="bg.800">
          <CustomRangeSlider
            resMin={percMin}
            resMax={percMax}
            orientation="vertical"
          >
            <RangeSliderTrack bgColor={colorTrackBG}>
              <RangeSliderFilledTrack bgColor={colorTrackFilled} />
            </RangeSliderTrack>

            {/* Min thumb */}
            <RangeSliderThumb boxSize={1} index={0} bgColor={mainColor}>
              {/* <Box
                position="absolute"
                left="100%" // push label to the right of slider
                ml="2"
                bgColor={colorHint}
                boxShadow="lg"
                borderRadius="md"
                px="1"
                py="0.5"
              >
                <ResponsiveText size="xs">
                  {`${minWord}: ${localFormat(MIN, mainCur, locale)}`}
                </ResponsiveText>
              </Box> */}
            </RangeSliderThumb>

            {/* Max thumb */}
            <RangeSliderThumb boxSize={1} index={1} bgColor={mainColor}>
              {/* <Box
                position="absolute"
                left="100%"
                ml="2"
                bgColor={colorHint}
                boxShadow="lg"
                borderRadius="md"
                px="1"
                py="0.5"
              >
                <ResponsiveText size="xs">
                  {`${maxWord}: ${localFormat(MAX, mainCur, locale)}`}
                </ResponsiveText>
              </Box> */}
            </RangeSliderThumb>
          </CustomRangeSlider>
        </Box>
      </VStack>
    </Box3D>
  );
};

export default LimitsRange;
