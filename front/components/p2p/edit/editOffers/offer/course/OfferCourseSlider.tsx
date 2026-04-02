import React from "react";
import {
  Box,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  useColorModeValue,
  useToken,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../../../../../redux/hooks";
import { setP2PFullOfferField } from "../../../../../../redux/mainReducer";
import { powerOfTenOrder } from "../../../../../../redux/amountsHelper";
import { RxDragHandleDots2 } from "react-icons/rx";

type Props = {
  index: number;
  suggestedCourse?: number;
  bestRate?: number;
  bestRateReversed?: number;
};

const OfferCourseSlider = ({
  index,
  suggestedCourse,
  bestRate,
  bestRateReversed,
}: Props) => {
  const dispatch = useAppDispatch();
  const hasUserChangedRef = React.useRef(false);
  const activeSide = useAppSelector(
    (state) => state.main.p2pFullOffers[index]?.side ?? null,
  );
  const rawCourse = useAppSelector(
    (state) => state.main.p2pFullOffers[index]?.course ?? null,
  );
  const isInverted = activeSide === "get";
  const normalizeValue = (value?: number | null) => {
    if (!value || !Number.isFinite(value)) return undefined;
    return isInverted ? 1 / value : value;
  };
  const denormalizeValue = (value?: number | null) => {
    if (!value || !Number.isFinite(value)) return undefined;
    return isInverted ? 1 / value : value;
  };

  const course = normalizeValue(rawCourse);
  const normalizedSuggestedCourse = normalizeValue(suggestedCourse);
  const normalizedBestRate = normalizeValue(bestRate);
  const normalizedBestRateReversed = normalizeValue(bestRateReversed);
  const baseCourse =
    normalizedSuggestedCourse && normalizedSuggestedCourse > 0
      ? normalizedSuggestedCourse
      : course && course > 0
        ? course
        : 1;

  const stepBase = Number(normalizedSuggestedCourse);
  const stepValue = powerOfTenOrder(stepBase) / 100;
  const safeStep =
    stepValue > 0 ? stepValue : baseCourse > 0 ? baseCourse / 100 : 0.01;

  const spreadMin =
    normalizedBestRate && normalizedBestRateReversed
      ? Math.min(normalizedBestRate, normalizedBestRateReversed)
      : undefined;
  const spreadMax =
    normalizedBestRate && normalizedBestRateReversed
      ? Math.max(normalizedBestRate, normalizedBestRateReversed)
      : undefined;
  const fineStep = safeStep / 10;

  const getStepForValue = (value: number) => {
    if (
      spreadMin !== undefined &&
      spreadMax !== undefined &&
      value >= spreadMin &&
      value <= spreadMax
    ) {
      return fineStep > 0 ? fineStep : safeStep;
    }
    return safeStep;
  };

  const snapToStep = (
    value: number,
    mode: "round" | "ceil" | "floor" = "round",
  ) => {
    const step = getStepForValue(value);
    if (step <= 0) return value;
    if (mode === "ceil") return Math.ceil(value / step) * step;
    if (mode === "floor") return Math.floor(value / step) * step;
    return Math.round(value / step) * step;
  };

  React.useEffect(() => {
    if (!course || !Number.isFinite(course)) return;
    if (
      !hasUserChangedRef.current &&
      normalizedSuggestedCourse &&
      course === normalizedSuggestedCourse
    ) {
      return;
    }
    const snapped = snapToStep(course);
    if (Math.abs(course - snapped) > safeStep / 1000) {
      const nextCourse = denormalizeValue(snapped);
      if (!nextCourse || !Number.isFinite(nextCourse)) return;
      dispatch(
        setP2PFullOfferField({
          index,
          field: "course",
          value: nextCourse,
        }),
      );
    }
  }, [
    course,
    denormalizeValue,
    dispatch,
    index,
    normalizedSuggestedCourse,
    safeStep,
    spreadMin,
    spreadMax,
  ]);

  const baseSlider = 50;
  const maxStepsRight = 100 - baseSlider;
  const maxStepsLeft = baseSlider - 1;

  const getCourseFromSlider = (value: number) => {
    if (safeStep <= 0) return baseCourse;
    let current = baseCourse;
    const steps = value - baseSlider;
    if (steps > 0) {
      for (let i = 0; i < Math.min(steps, maxStepsRight); i += 1) {
        current += getStepForValue(current);
      }
    } else if (steps < 0) {
      for (let i = 0; i < Math.min(-steps, maxStepsLeft); i += 1) {
        current -= getStepForValue(current);
      }
    }
    const snapMode = steps >= 0 ? "ceil" : "floor";
    return snapToStep(current, snapMode);
  };

  const getSliderFromCourse = (value: number) => {
    if (safeStep <= 0 || !Number.isFinite(value)) return baseSlider;
    if (value === baseCourse) return baseSlider;
    let current = baseCourse;
    let steps = 0;
    if (value > current) {
      while (steps < maxStepsRight) {
        current += getStepForValue(current);
        steps += 1;
        if (current >= value) break;
      }
      return baseSlider + steps;
    }
    while (steps < maxStepsLeft) {
      current -= getStepForValue(current);
      steps += 1;
      if (current <= value) break;
    }
    return baseSlider - steps;
  };

  const sliderValue = React.useMemo(() => {
    if (safeStep <= 0) return baseSlider;
    const currentCourse =
      course && course > 0 ? snapToStep(course) : baseCourse;
    return Math.min(100, Math.max(1, getSliderFromCourse(currentCourse)));
  }, [baseCourse, course, safeStep, spreadMax, spreadMin]);

  const onSliderChange = (value: number) => {
    if (safeStep <= 0) return;
    hasUserChangedRef.current = true;
    const stepped = getCourseFromSlider(value);
    const nextCourse = denormalizeValue(stepped);
    if (!nextCourse || !Number.isFinite(nextCourse)) return;
    dispatch(
      setP2PFullOfferField({
        index,
        field: "course",
        value: nextCourse,
      }),
    );
  };

  const getMarkValue = (value?: number) => {
    if (!value || !Number.isFinite(value)) return undefined;
    if (safeStep <= 0) return baseSlider;
    return Math.min(100, Math.max(1, getSliderFromCourse(value)));
  };

  const bestRateMark = getMarkValue(normalizedBestRate);
  const bestRateReversedMark = getMarkValue(normalizedBestRateReversed);
  const rangeStart =
    bestRateMark && bestRateReversedMark
      ? Math.min(bestRateMark, bestRateReversedMark)
      : undefined;
  const rangeEnd =
    bestRateMark && bestRateReversedMark
      ? Math.max(bestRateMark, bestRateReversedMark)
      : undefined;

  const [primary300, secondary600] = useToken("colors", [
    "violet.700",
    "violet.700",
  ]);

  const colorKey = useColorModeValue(secondary600, primary300);
  const colorHint = useColorModeValue("bg.10", "bg.800");
  const mainColor = useColorModeValue("violet.600", "violet.600");

  return (
    <Slider
      min={1}
      max={100}
      step={1}
      w="100%"
      value={sliderValue}
      onChange={onSliderChange}
    >
      <SliderTrack>
        <SliderFilledTrack bg="violet.600" />
      </SliderTrack>
      <SliderThumb
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
      </SliderThumb>
    </Slider>
  );
};

export default OfferCourseSlider;
