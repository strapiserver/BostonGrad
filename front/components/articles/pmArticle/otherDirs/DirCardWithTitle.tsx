import { Box, Center } from "@chakra-ui/react";
import React from "react";
import Dir from "../../../exchange/Dir";
import { Box3D, ResponsiveText } from "../../../../styles/theme/custom";
import { IPmPairs } from "../../../../types/exchange";
import { dirTitle } from "./dirTitle";
import { GetRateDataFn } from "./useDirRates";

type DirCardWithTitleProps = {
  pair?: IPmPairs | null;
  side: "sell" | "buy";
  getRateData: GetRateDataFn;
  placeholderHeight: string;
};

const DirCardWithTitle = ({
  pair,
  side,
  getRateData,
  placeholderHeight,
}: DirCardWithTitleProps) => {
  const rateData = pair ? getRateData(pair) : null;

  return (
    <Box w="100%" mt="6">
      {pair ? (
        <Box minH={placeholderHeight}>
          <ResponsiveText as="h4" size="xs" variant="shaded" mb="2">
            {dirTitle(pair, side)}
          </ResponsiveText>
          <Dir
            givePm={pair.givePm}
            getPm={pair.getPm}
            slug={pair.slug}
            fullHeight
            bottomLeft={
              rateData ? (
                <ResponsiveText size="xs" variant="no_contrast">
                  {`Предложений: ${rateData.amountOfCourses}`}
                </ResponsiveText>
              ) : null
            }
            bottomRight={
              rateData ? (
                <ResponsiveText size="xs" variant="no_contrast">
                  {rateData.rateText}
                </ResponsiveText>
              ) : null
            }
          />
        </Box>
      ) : (
        <Box>
          <ResponsiveText as="h4" size="xs" variant="shaded" mb="2">
            Нет обратного направления
          </ResponsiveText>
          <Box3D variant="extra_contrast">
            <Center minH={placeholderHeight} w="100%" color="whiteAlpha.200">
              ㄨ
            </Center>
          </Box3D>
        </Box>
      )}
    </Box>
  );
};

export default DirCardWithTitle;
