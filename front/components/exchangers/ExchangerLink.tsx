import { Box, Button, HStack } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { Box3D, ResponsiveText } from "../../styles/theme/custom";
import { IExchanger, IParserExchanger } from "../../types/exchanger";
import Dot from "./Dot";
import { exchangerNameToSlug, getStatus } from "./helper";
import ExchangerName from "../shared/ExchangerNameRating";
import { BoxWrapper } from "../shared/BoxWrapper";
import { BsArrowRightShort } from "react-icons/bs";
export default function ExchangerPreview({
  exchanger,
}: {
  exchanger: IExchanger;
}) {
  const displayName = exchanger.display_name || exchanger.name;
  const slug = exchangerNameToSlug(exchanger.name);
  return (
    <Box3D
      w="100%"
      as={Link}
      href={`/exchangers/${slug}`}
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
      <HStack w="100%">
        <ExchangerName
          name={displayName}
          logo={exchanger.logo}
          admin_rating={exchanger.admin_rating}
          statusColor={getStatus(exchanger)}
        />
        <Box ml="auto" color="inherit">
          <BsArrowRightShort size="1.5rem" />
        </Box>
      </HStack>
    </Box3D>
  );
}
