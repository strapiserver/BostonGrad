import { Box, color, HStack, Text, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";
import { BiLinkExternal } from "react-icons/bi";
import { ResponsiveText } from "../../../styles/theme/custom";
import { IoSearch } from "react-icons/io5";

const RateLink = ({
  slug,
  rateNumber,
  side,
}: {
  slug: string;
  rateNumber: string;
  side: "buy" | "sell";
}) => {
  const green = useColorModeValue("green.700", "green.200");
  const pink = useColorModeValue("pink.700", "pink.200");
  const bgColor = useColorModeValue("bg.10", "bg.800");

  const href = slug?.startsWith("/") ? slug : `/${slug}`;

  return (
    <Link href={href} passHref>
      <HStack
        px="1"
        borderRadius="md"
        bgColor={bgColor}
        _hover={{ filter: "brightness(1.1)" }}
        cursor="pointer"
        my="0.5"
        w="100%"
        justifyContent={"space-between"}
        filter="opacity(0.8)"
      >
        <Text color="bg.800" fontSize="sm">
          {side === "buy" ? "от" : "до"}
        </Text>
        <ResponsiveText color={side === "buy" ? pink : green} textAlign="end">
          {rateNumber}
        </ResponsiveText>
      </HStack>
    </Link>
  );
};

export default RateLink;
