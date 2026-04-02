import { Divider, Flex } from "@chakra-ui/react";
import { addSpaces } from "../../../../redux/amountsHelper";
import { IExchangerReview } from "../../../../types/exchanger";

import ReserveStats from "./ReserveStats";
import ReviewsStats from "./ReviewsStats";
import WorkingTimeStats from "./WorkingTimeStats";
import { ResponsiveText } from "../../../../styles/theme/custom";

type Props = {
  reviews?: IExchangerReview[] | null;
  ratesTotal?: number | null;
  reserveTotal?: number | null | string;
  workingTime?: string | null;
};

const ExchangerStats = ({ reviews, reserveTotal, workingTime }: Props) => {
  if (!reviews?.length && !reserveTotal && !workingTime) return <></>;

  return (
    <>
      <Divider mb="2" />
      <Flex
        flexDir={{ base: "column", lg: "row" }}
        color="bg.500"
        justifyContent="space-between"
        w="100%"
        gap="4"
        px="2"
      >
        <ReviewsStats reviews={reviews} />
        <ResponsiveText display={{ base: "none", lg: "flex" }}>
          •
        </ResponsiveText>
        <WorkingTimeStats workingTime={workingTime} />
        <ResponsiveText display={{ base: "none", lg: "flex" }}>
          •
        </ResponsiveText>
        <ReserveStats
          reserveTotal={reserveTotal ? addSpaces(reserveTotal) : null}
        />
      </Flex>
      <Divider my="2" display={{ lg: "none", base: "unset" }} />
    </>
  );
};

export default ExchangerStats;
