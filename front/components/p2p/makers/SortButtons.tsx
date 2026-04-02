import { Button, HStack, Tooltip, useColorModeValue } from "@chakra-ui/react";
import { FaArrowDownShortWide, FaArrowUpWideShort } from "react-icons/fa6";
import React from "react";

type SortCriteria = "name" | "offers" | "reviews";

interface SortButtonsProps {
  sortCriteria: SortCriteria;
  sortDirection: "asc" | "desc";
  toggleSort: (criteria: SortCriteria) => void;
}

const SortButtons: React.FC<SortButtonsProps> = ({
  sortCriteria,
  sortDirection,
  toggleSort,
}) => {
  const activeBg = useColorModeValue("bg.100", "bg.600");

  const getIcon = (criteria: SortCriteria) =>
    sortCriteria === criteria ? (
      sortDirection === "asc" ? (
        <FaArrowDownShortWide />
      ) : (
        <FaArrowUpWideShort />
      )
    ) : undefined;

  const buttons = [
    { key: "name", label: "Имя", tooltip: "Сортировать по имени" },
    {
      key: "offers",
      label: "Предложения",
      tooltip: "Сортировать по количеству предложений",
    },
    {
      key: "reviews",
      label: "Отзывы",
      tooltip: "Сортировать по количеству отзывов",
    },
  ] as const;

  return (
    <HStack
      borderWidth="2px"
      borderRadius="xl"
      borderColor="bg.500"
      spacing={0}
      h="45px"
      w="100%"
      justifyContent="space-between"
    >
      {buttons.map(({ key, label, tooltip }) => (
        <Tooltip openDelay={500} key={key} label={tooltip} fontSize="sm">
          <Button
            bgColor={sortCriteria === key ? activeBg : "transparent"}
            onClick={() => toggleSort(key)}
            rightIcon={getIcon(key)}
            borderRadius="none"
            _first={{ borderTopLeftRadius: "lg", borderBottomLeftRadius: "lg" }}
            _last={{
              borderTopRightRadius: "lg",
              borderBottomRightRadius: "lg",
            }}
          >
            {label}
          </Button>
        </Tooltip>
      ))}
    </HStack>
  );
};

export default SortButtons;
export type { SortCriteria };
