import { Flex, HStack, Tag } from "@chakra-ui/react";
import React from "react";
import { ResponsiveText } from "../../styles/theme/custom";
import { RiCopperCoinLine } from "react-icons/ri";
import { RiExchange2Line } from "react-icons/ri";
import { RiBarChartBoxLine } from "react-icons/ri";

const GeneralStat = ({
  colorScheme,
  label,
  value,
  icon,
}: {
  colorScheme: string;
  label: string;
  value: string;
  icon?: any;
}) => {
  return (
    <Tag
      px="3"
      py="2"
      colorScheme={colorScheme || "green"}
      border="1px solid"
      borderRadius="xl"
      mt="1.5"
      minW="250px"
    >
      {icon}
      <HStack w="100%" justifyContent="space-between" ml="2">
        <ResponsiveText size="lg" color="inherit">
          {label}
        </ResponsiveText>
        <ResponsiveText
          size="lg"
          fontFamily="'Mozilla Text', monospace"
          color="inherit"
        >
          {value}
        </ResponsiveText>
      </HStack>
    </Tag>
  );
};

export default function GeneralStats() {
  return (
    <HStack
      w="100%"
      h="100%"
      justifyContent="space-around"
      alignItems="center"
      my="4"
      flexWrap="wrap"
    >
      <GeneralStat
        colorScheme="orange"
        label="Обменников:"
        value="670"
        icon={<RiCopperCoinLine size="1.5rem" />}
      />
      <GeneralStat
        colorScheme="purple"
        label="Направлений:"
        value="24 450"
        icon={<RiExchange2Line size="1.5rem" />}
      />
      <GeneralStat
        colorScheme="cyan"
        label="Курсов:"
        value="12 570 900"
        icon={<RiBarChartBoxLine size="1.5rem" />}
      />
    </HStack>
  );
}
