import { HStack, Icon } from "@chakra-ui/react";
import {
  MdOutlineSentimentNeutral,
  MdSentimentSatisfiedAlt,
  MdSentimentVeryDissatisfied,
} from "react-icons/md";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { ResponsiveText } from "../../../../styles/theme/custom";
import { IExchangerReview } from "../../../../types/exchanger";

const ReviewsStats = ({ reviews }: { reviews?: IExchangerReview[] | null }) => {
  if (!reviews || !reviews.length) return <></>;
  const positive = reviews.filter((r) => r.type === "positive").length;
  const negative = reviews.filter((r) => r.type === "negative").length;
  const neutral = reviews.length - positive - negative;

  return (
    <HStack>
      <IoChatbubbleEllipsesOutline size="1.2rem" />
      <ResponsiveText>Отзывы: </ResponsiveText>
      <ResponsiveText color="green.400" mr="-1">
        {positive}
      </ResponsiveText>
      <Icon as={MdSentimentSatisfiedAlt} color="green.300" w="4" h="4" mb="1" />

      <ResponsiveText>/</ResponsiveText>
      <ResponsiveText mr="-1">{neutral}</ResponsiveText>
      <Icon
        as={MdOutlineSentimentNeutral}
        color="gray.400"
        w="4"
        h="4"
        mb="1"
      />

      <ResponsiveText>/</ResponsiveText>
      <ResponsiveText color="red.400" mr="-1">
        {negative}
      </ResponsiveText>
      <Icon
        as={MdSentimentVeryDissatisfied}
        color="red.400"
        w="4"
        h="4"
        mb="1"
      />
    </HStack>
  );
};

export default ReviewsStats;
