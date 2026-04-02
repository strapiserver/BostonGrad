import { Box, HStack } from "@chakra-ui/react";
import Link from "next/link";

import { IPm } from "../../../types/selector";
import { ResponsiveText } from "../../../styles/theme/custom";
import CircularIcon from "../../shared/CircularIcon";

const CryptoPm = ({ cryptoPm }: { cryptoPm: IPm }) => {
  return (
    <Link href={`/articles/${cryptoPm.en_name.toLowerCase()}`} passHref>
      <HStack alignItems="center">
        <CircularIcon
          iconAlt={cryptoPm.en_name}
          size="sm"
          color={cryptoPm.color}
          icon={cryptoPm.icon}
        />

        {/* <ResponsiveText size="sm" variant="primary" fontWeight="bold">
            {`${cryptoPm.currency.code.toUpperCase()}`}
          </ResponsiveText> */}
        <ResponsiveText
          fontSize="12px"
          fontWeight="bold"
          left="0.5"
          mt="2px"
          variant="no_contrast"
        >{`${
          cryptoPm.subgroup_name?.toUpperCase() || cryptoPm.code.toUpperCase()
        }`}</ResponsiveText>
      </HStack>
    </Link>
  );
};

export default CryptoPm;
