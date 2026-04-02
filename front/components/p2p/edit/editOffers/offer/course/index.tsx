import React from "react";
import { Box, HStack } from "@chakra-ui/react";
import { IFullOffer } from "../../../../../../types/p2p";
import { codeToSymbol } from "../../../../../../redux/amountsHelper";

import { useAppDispatch } from "../../../../../../redux/hooks";
import { setP2PFullOfferField } from "../../../../../../redux/mainReducer";
import { ResponsiveText } from "../../../../../../styles/theme/custom";
import CourseAmountInput from "./CourseAmountInput";
import OfferCourseSlider from "./OfferCourseSlider";

export default function OfferCourse({
  fullOffer,
}: {
  fullOffer: Partial<IFullOffer>;
}) {
  const dispatch = useAppDispatch();
  const offerIndex = fullOffer.index;
  if (offerIndex === undefined) return null;

  const offer = fullOffer || {};
  const givePm = offer.givePm;
  const getPm = offer.getPm;

  const giveCur = givePm?.currency?.code?.toUpperCase();
  const getCur = getPm?.currency?.code?.toUpperCase();

  const course = offer.course;
  const activeSide = offer.side;
  const normalizedGiveAmount =
    course && activeSide === "give"
      ? course
      : course && activeSide === "get"
        ? 1
        : undefined;
  const normalizedGetAmount =
    course && activeSide === "give"
      ? 1
      : course && activeSide === "get"
        ? 1 / course
        : undefined;

  const bestRate = offer.bestRate;
  const bestRateReversed = offer.bestRateRev;
  const googleRate = offer.googleRate;
  const suggestedCourse = offer.suggestedCourse;

  React.useEffect(() => {
    if (!suggestedCourse) return;
    if (course) return;
    if (!giveCur || !getCur) return;
    if (!activeSide) {
      dispatch(
        setP2PFullOfferField({
          index: offerIndex,
          field: "side",
          value: suggestedCourse > 1 ? "give" : "get",
        }),
      );
    }
    dispatch(
      setP2PFullOfferField({
        index: offerIndex,
        field: "course",
        value: suggestedCourse,
      }),
    );
  }, [suggestedCourse, course, giveCur, getCur, dispatch, offerIndex]);

  if (!givePm || !getPm) return null;
  if (!giveCur || !getCur) return null;

  return (
    <Box w="100%">
      <HStack w="fit-content" my="2">
        <ResponsiveText>{"Курс: "}</ResponsiveText>

        <CourseAmountInput index={offerIndex} side="give" />
        <ResponsiveText>{codeToSymbol(giveCur)}</ResponsiveText>
        <ResponsiveText>{` = `}</ResponsiveText>
        <CourseAmountInput index={offerIndex} side="get" />
        <ResponsiveText>{codeToSymbol(getCur)}</ResponsiveText>
      </HStack>
      <OfferCourseSlider
        index={offerIndex}
        suggestedCourse={suggestedCourse}
        bestRate={bestRate}
        bestRateReversed={bestRateReversed}
      />

      {/* <Box>
        <Text>
          {course
            ? `  initialCourse: ${buildRateString({ course, giveCur, getCur })}`
            : null}
        </Text>
        <Text>
          {bestRate
            ? `  bestRate: ${buildRateString({ course: bestRate, giveCur, getCur })}`
            : null}
        </Text>
        <Text>
          {bestRate
            ? `  bestRateRev: ${buildRateString({ course: bestRateRev, giveCur, getCur })}`
            : null}
        </Text>
        <Text>
          {googleRate
            ? `  googleRate: ${buildRateString({ course: googleRate, giveCur, getCur })}`
            : null}
        </Text>
        <Text>
          {suggestedCourse
            ? `  suggestedCourse: ${buildRateString({ course: suggestedCourse, giveCur, getCur })}`
            : null}
        </Text>
        <Text>{`google value: ${googleRate}`}</Text>
        <Text>{`best : ${bestRate}`}</Text>
        <Text>{`best rev: ${bestRateRev}`}</Text>
        <Text>{`suggested value: ${suggestedCourse}`}</Text>
        <Text>{`best > google  ${bestRate && googleRate ? bestRate > googleRate : "-"}`}</Text>
      </Box> */}
      {/* {giveCur && getCur && (
        <Box w="fit-content">
          <Chart
            giveCur={giveCur}
            getCur={getCur}
            //currentRateOverride={googleRate}
          />
        </Box>
      )} */}
    </Box>
  );
}
