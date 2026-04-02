import React from "react";
import {
  Box,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Text,
  useColorModeValue,
  useToken,
} from "@chakra-ui/react";

import { setP2PFullOfferField } from "../../../../../../redux/mainReducer";
import { RxDragHandleDots2 } from "react-icons/rx";
import { useAppDispatch } from "../../../../../../redux/hooks";

export default function OfferLimitSlider({
  index,
  minPossible,
  min,
  max,
}: {
  index: number;
  minPossible: number;
  min?: number;
  max?: number;
}) {
  const dispatch = useAppDispatch();
  const safeMin = min && Number.isFinite(min) ? min : minPossible;
  const safeMax = max && Number.isFinite(max) ? max : minPossible;
  const clampPercent = (percent: number) =>
    Math.min(100, Math.max(0, Math.round(percent)));

  const amountFromPercentage = (percentage: number) => {
    if (!Number.isFinite(percentage) || minPossible <= 0) return minPossible;
    let p = clampPercent(percentage);
    let value = minPossible;
    let stepSize = minPossible;
    let nextLimit = minPossible * 30;
    let pCursor = 0;

    while (true) {
      const blockPct = (nextLimit - value) / stepSize;
      if (p <= pCursor + blockPct) {
        return value + stepSize * (p - pCursor);
      }
      value = nextLimit;
      pCursor += blockPct;
      stepSize *= 10;
      nextLimit *= 10;
    }
  };

  const percentageFromAmount = (amount: number) => {
    if (!Number.isFinite(amount) || amount <= 0 || minPossible <= 0) return 0;
    let value = minPossible;
    let stepSize = minPossible;
    let nextLimit = minPossible * 30;
    let pCursor = 0;

    while (true) {
      const blockPct = (nextLimit - value) / stepSize;
      if (amount <= nextLimit) {
        const localPct = (amount - value) / stepSize;
        return clampPercent(pCursor + localPct);
      }
      value = nextLimit;
      pCursor += blockPct;
      stepSize *= 10;
      nextLimit *= 10;
      if (pCursor >= 100) return 100;
    }
  };

  const maxPossible = React.useMemo(() => {
    if (!Number.isFinite(minPossible) || minPossible <= 0) return 0;
    return amountFromPercentage(100);
  }, [minPossible]);

  const clampAmount = (value: number) => {
    if (!Number.isFinite(value)) return minPossible;
    if (minPossible <= 0 || maxPossible <= 0) return value;
    return Math.min(maxPossible, Math.max(minPossible, value));
  };

  const clampedMin = clampAmount(safeMin);
  const clampedMax = clampAmount(safeMax);
  const orderedMin = Math.min(clampedMin, clampedMax);
  const orderedMax = Math.max(clampedMin, clampedMax);

  const [range, setRange] = React.useState<[number, number]>([
    percentageFromAmount(orderedMin),
    percentageFromAmount(orderedMax),
  ]);

  React.useEffect(() => {
    setRange([
      percentageFromAmount(orderedMin),
      percentageFromAmount(orderedMax),
    ]);
    if (Number.isFinite(safeMin) && orderedMin !== safeMin) {
      dispatch(
        setP2PFullOfferField({ index, field: "min", value: orderedMin }),
      );
    }
    if (Number.isFinite(safeMax) && orderedMax !== safeMax) {
      dispatch(
        setP2PFullOfferField({ index, field: "max", value: orderedMax }),
      );
    }
  }, [dispatch, index, orderedMin, orderedMax, safeMin, safeMax]);

  const handleChange = (value: number[]) => {
    const nextPercentMin = clampPercent(value[0] ?? range[0]);
    const nextPercentMax = clampPercent(value[1] ?? range[1]);
    const orderedMin = Math.min(nextPercentMin, nextPercentMax);
    const orderedMax = Math.max(nextPercentMin, nextPercentMax);
    setRange([orderedMin, orderedMax]);
    const nextMin = amountFromPercentage(orderedMin);
    const nextMax = amountFromPercentage(orderedMax);
    dispatch(setP2PFullOfferField({ index, field: "min", value: nextMin }));
    dispatch(setP2PFullOfferField({ index, field: "max", value: nextMax }));
  };

  const [primary300, secondary600] = useToken("colors", [
    "violet.700",
    "violet.700",
  ]);

  const colorKey = useColorModeValue(secondary600, primary300);
  const colorHint = useColorModeValue("bg.10", "bg.800");
  const mainColor = useColorModeValue("violet.600", "violet.600");

  return (
    <RangeSlider
      min={0}
      max={100}
      step={1}
      value={range}
      onChange={handleChange}
    >
      <RangeSliderTrack>
        <RangeSliderFilledTrack bg="violet.600" />
      </RangeSliderTrack>
      <RangeSliderThumb
        index={0}
        boxSize={9}
        bgColor="transparent"
        position="relative"
        boxShadow="none"
      >
        <Box
          w="5"
          h="3"
          position="relative"
          borderRadius="md"
          bgColor={mainColor}
          boxShadow={`0 0 10px -2px ${colorKey}`}
          color={colorHint}
          as={RxDragHandleDots2}
        />
      </RangeSliderThumb>
      <RangeSliderThumb
        index={1}
        boxSize={9}
        bgColor="transparent"
        position="relative"
        boxShadow="none"
      >
        <Box
          w="5"
          h="3"
          position="relative"
          borderRadius="md"
          bgColor={mainColor}
          boxShadow={`0 0 10px -2px ${colorKey}`}
          color={colorHint}
          as={RxDragHandleDots2}
        />
      </RangeSliderThumb>
    </RangeSlider>
  );
}
