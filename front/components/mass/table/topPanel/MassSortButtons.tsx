import { Button, HStack, Tooltip, useColorModeValue } from "@chakra-ui/react";
import { FaArrowUpWideShort, FaArrowDownShortWide } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { IMassSort } from "../../../../types/mass";
import { setMassSort } from "../../../../redux/mainReducer";

const MassSortButtons = () => {
  const activeBg = useColorModeValue("bg.100", "bg.600");

  const massSort = useAppSelector((state) => state.main.massSort);

  const dispatch = useAppDispatch();
  const toggleSort = (key: IMassSort["key"]) => {
    dispatch(setMassSort(key));
  };

  const getIcon = (key: string) =>
    massSort.key === key ? (
      massSort.direction === "asc" ? (
        <FaArrowDownShortWide />
      ) : (
        <FaArrowUpWideShort />
      )
    ) : undefined; // ✅ instead of `null`

  const buttons = [
    {
      key: "course",
      label: "Курс",
      tooltip: "Сортировать по курсу",
    },
    {
      key: "limit",
      label: "Лимиты",
      tooltip: "Сортировать по лимитам",
    },
    {
      key: "admin_rating",
      label: "Рейтинг",
      tooltip: "Сортировать по рейтингу",
    },
  ] as const;

  return (
    <HStack
      borderWidth="2px"
      borderRadius="xl"
      borderColor="bg.500"
      spacing={0}
      justifyContent="space-between"
      h="45px"
    >
      {buttons.map(({ key, label, tooltip }) => (
        <Tooltip key={key} label={tooltip} fontSize="sm">
          <Button
            bgColor={massSort.key === key ? activeBg : "transparent"}
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

export default MassSortButtons;
