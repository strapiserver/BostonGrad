import { Box, Divider, Text } from "@chakra-ui/react";
import { BoxWrapper, CustomHeader } from "../../shared/BoxWrapper";
import { IoMdInformationCircle } from "react-icons/io";

import { ResponsiveText } from "../../../styles/theme/custom";

export default function MakerDescription({
  description,
}: {
  description?: string | null;
}) {
  return (
    <BoxWrapper>
      <CustomHeader text="Описание" Icon={IoMdInformationCircle} />
      <Divider my="4" />
      <Box px="2" color="bg.700">
        <Text color="bg.600">{description}</Text>
      </Box>
    </BoxWrapper>
  );
}
