import { Box, Divider, HStack, VStack } from "@chakra-ui/react";
import { IoMdChatboxes } from "react-icons/io";
import { CustomHeader, FormatedDate } from "../../shared/BoxWrapper";
import { BoxWrapper } from "../../shared/BoxWrapper";
import { ResponsiveText } from "../../../styles/theme/custom";
import { IMaker } from "../../../types/p2p";

export default function MakerReviews({
  reviews,
}: {
  reviews: IMaker["reviews"];
}) {
  return (
    <BoxWrapper>
      <CustomHeader text="Отзывы" Icon={IoMdChatboxes} />
      <Divider my="4" />
      <VStack alignItems="start" spacing="4" px="2">
        {reviews?.map((review) => (
          <Box key={review.id} p="4" borderRadius="xl" bg="bg.900" w="100%">
            <HStack justifyContent="space-between" w="100%">
              <ResponsiveText size="sm" variant="primary" color="bg.700">
                {review.name || ""}
              </ResponsiveText>
              <FormatedDate updatedAt={review.updatedAt} />
            </HStack>
            <ResponsiveText size="sm" variant="primary" color="bg.600">
              {review.text || ""}
            </ResponsiveText>
            <HStack spacing="2" mt="2">
              <ResponsiveText size="xs" variant="primary" color="bg.800">
                {review.type || ""}
              </ResponsiveText>
              <ResponsiveText size="xs" variant="primary" color="bg.800">
                {review.isDispute ? "dispute" : ""}
              </ResponsiveText>
            </HStack>
          </Box>
        )) || null}
      </VStack>
    </BoxWrapper>
  );
}
