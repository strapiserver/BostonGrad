import { Box, Grid, HStack, Tooltip } from "@chakra-ui/react";
import React from "react";
import { ResponsiveText } from "../../../styles/theme/custom";
import { RiInformationLine } from "react-icons/ri";

const text =
  "Курсы с разными способами оплаты объединяются при отличии не более, чем на 1%";

export default function Headers() {
  return (
    <Grid
      gridTemplateColumns="3fr 3rem 100px 10px 4fr 3fr"
      w="100%"
      gap={["2", "6"]}
      mt="5"
      px="2"
      borderRadius="lg"
      color="bg.700"
    >
      <ResponsiveText size="xs">Обменник</ResponsiveText>
      <ResponsiveText size="xs">Рейтинг</ResponsiveText>
      <ResponsiveText size="xs" textAlign="end">
        Параметры
      </ResponsiveText>
      <Box />
      <Tooltip openDelay={500} hasArrow label={text} size="md">
        <HStack>
          <ResponsiveText textAlign="end" size="xs">
            Курс
          </ResponsiveText>
          <RiInformationLine size="1.2rem" />
        </HStack>
      </Tooltip>
      <ResponsiveText textAlign="end" size="xs">
        Способы оплаты
      </ResponsiveText>
    </Grid>
  );
}
