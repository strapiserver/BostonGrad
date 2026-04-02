import { Box, Divider, HStack, Text } from "@chakra-ui/react";
import React from "react";
import { IExchangerReviewReply } from "../../../../types/exchanger";
import { HiReply } from "react-icons/hi";
import { FormatedDate, ReviewBorder } from "../../../shared/BoxWrapper";
import { ResponsiveText } from "../../../../styles/theme/custom";
import BoringAvatar from "boring-avatars";
import CustomImage from "../../../shared/CustomImage";
import { IImage } from "../../../../types/selector";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import ReplyText from "../leaveReply";

export default function ExchangerReply({
  reply,
  displayName,
  avatarSeed,
  exchangerName,
  exchangerLogo,
  canReply,
}: {
  reply: IExchangerReviewReply;
  displayName: string;
  avatarSeed: string;
  exchangerName?: string | null;
  exchangerLogo?: IImage | null;
  canReply?: boolean;
}) {
  const ReplyMonitoring = () => (
    <HStack gap="4" color="violet.500">
      <Box borderRadius="full" overflow="hidden" w="30px" h="30px">
        <CustomImage img={null} w="auto" h="auto" />
      </Box>
      <ResponsiveText fontWeight="bold" variant="contrast">
        {`Команда ${process.env.NEXT_PUBLIC_NAME}`}
      </ResponsiveText>
      <RiVerifiedBadgeFill size="1rem" />
    </HStack>
  );
  const ReplyAuthor = () => {
    return (
      <HStack gap="4">
        <Box borderRadius="full" overflow="hidden" w="30px" h="30px">
          <BoringAvatar size={30} name={avatarSeed} variant="marble" />
        </Box>
        <ResponsiveText fontWeight="bold" variant="contrast">
          {displayName}
        </ResponsiveText>
      </HStack>
    );
  };

  const ReplyExchanger = () => (
    <HStack gap="4" color="violet.500">
      <Box borderRadius="full" overflow="hidden" w="30px" h="30px">
        {exchangerLogo?.url ? (
          <CustomImage img={exchangerLogo} w="auto" h="auto" />
        ) : (
          <BoringAvatar
            size={30}
            name={exchangerName || "exchanger"}
            variant="beam"
          />
        )}
      </Box>
      <ResponsiveText fontWeight="bold" variant="contrast">
        {exchangerName || "Обменник"}
      </ResponsiveText>
      <RiVerifiedBadgeFill size="1rem" />
    </HStack>
  );
  return (
    <HStack key={reply.id} mt="6">
      <Box transform="rotate(180deg)" color="bg.600">
        <HiReply size="1rem" />
      </Box>

      <ReviewBorder>
        <HStack w="100%" justifyContent="space-between">
          {reply.from == "author" ? (
            <ReplyAuthor />
          ) : reply.from == "admin" ? (
            <ReplyMonitoring />
          ) : (
            <ReplyExchanger />
          )}

          <FormatedDate updatedAt={reply.updatedAt} />
        </HStack>
        <Divider my="4" />
        <ReplyText text={reply.text} canReply={canReply} />
      </ReviewBorder>
    </HStack>
  );
}
