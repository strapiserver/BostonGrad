import { Button, HStack, Tooltip, useColorModeValue } from "@chakra-ui/react";
import { FaArrowUpWideShort, FaArrowDownShortWide } from "react-icons/fa6";
import React from "react";

interface SortButtonsProps {
  sortCriteria: "name" | "total_rates" | "admin_rating";
  sortDirection: "asc" | "desc";
  toggleSort: (criteria: "name" | "total_rates" | "admin_rating") => void;
}

const SortButtons: React.FC<SortButtonsProps> = ({
  sortCriteria,
  sortDirection,
  toggleSort,
}) => {
  const activeBg = useColorModeValue("bg.100", "bg.600");

  const getIcon = (criteria: SortButtonsProps["sortCriteria"]) =>
    sortCriteria === criteria ? (
      sortDirection === "asc" ? (
        <FaArrowDownShortWide />
      ) : (
        <FaArrowUpWideShort />
      )
    ) : undefined; // ✅ instead of `null`

  const buttons = [
    { key: "name", label: "Имя", tooltip: "Сортировать по имени" },
    {
      key: "total_rates",
      label: "Курсы",
      tooltip: "Сортировать по количеству курсов",
    },
    {
      key: "admin_rating",
      label: "Рейтинг",
      tooltip: "Сортировать по рейтингу администратора",
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
