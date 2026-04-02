import { Avatar, Box, HStack, VStack } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { BsArrowRightShort } from "react-icons/bs";
import { Box3D, ResponsiveText } from "../../../styles/theme/custom";
import { IMakerPreview } from "../../../types/p2p";
import Dot from "../../exchangers/Dot";
import {
  getAvatarSrc,
  getMakerDisplayName,
  getMakerSlug,
  getMakerStatusColor,
} from "./helper";

export default function MakerLink({ maker }: { maker: IMakerPreview }) {
  const displayName = getMakerDisplayName(maker);
  const slug = getMakerSlug(maker);
  const avatarSrc = getAvatarSrc(maker.avatar?.url);
  const statusColor = getMakerStatusColor(maker);
  const offersCount = maker.offers?.length ?? 0;
  const reviewsCount = maker.reviews?.length ?? 0;
  const telegramUsername = `@${maker.telegram_username.replace(/^@/, "")}`;

  return (
    <Box3D
      w="100%"
      as={Link}
      href={`/p2p/${slug}`}
      prefetch={false}
      px="4"
      py="4"
      variant="extra_contrast"
      minW={{ base: "90vw", md: "250px" }}
      justifyContent="start"
      alignItems="center"
      color="bg.800"
      key={displayName}
      _hover={{
        bgColor: "bg.1000",
        color: "violet.600",
      }}
    >
      <HStack w="100%" alignItems="center">
        <HStack spacing="3">
          <Box position="relative">
            <Avatar size="sm" name={displayName} src={avatarSrc || undefined} />
            <Box
              position="absolute"
              bottom="-1"
              right="-1"
              p="1"
              bgColor="bg.700"
              borderRadius="50%"
            >
              <Dot color={statusColor} />
            </Box>
          </Box>
          <VStack alignItems="start" spacing="1">
            <ResponsiveText size="md" variant="primary" fontWeight="bold">
              {displayName}
            </ResponsiveText>
            <HStack spacing="3" color="bg.700" flexWrap="wrap">
              <ResponsiveText size="xs" variant="primary">
                {telegramUsername}
              </ResponsiveText>
              <ResponsiveText size="xs" variant="primary">
                Предложений: {offersCount}
              </ResponsiveText>
              <ResponsiveText size="xs" variant="primary">
                Отзывы: {reviewsCount}
              </ResponsiveText>
            </HStack>
          </VStack>
        </HStack>

        <Box ml="auto" color="inherit">
          <BsArrowRightShort size="1.5rem" />
        </Box>
      </HStack>
    </Box3D>
  );
}
