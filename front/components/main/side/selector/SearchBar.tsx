import {
  Input,
  InputGroup,
  InputRightAddon,
  Icon,
  useColorModeValue,
  Button,
  Box,
  HStack,
  Wrap,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { setSearchBarInputValue } from "../../../../redux/mainReducer";
import { ISearchBar } from "../../../../types/selector";
import { Box3D } from "../../../../styles/theme/custom";
import { MdOutlineClear } from "react-icons/md";
import { RiSearchLine } from "react-icons/ri";
import { countryCurrencies } from "./section/helper";

const SearchBar = ({ search_bar }: { search_bar: ISearchBar }) => {
  const [inputFocused, setInputFocused] = useState(false);
  const searchBarInputValue = useAppSelector(
    (state) => state.main.searchBarInputValue
  );
  const country = useAppSelector((state) =>
    state.main.city.en_country_name.toUpperCase()
  ) as keyof typeof countryCurrencies;

  const localCurrency = countryCurrencies?.[country] || "EUR";
  const currencyCodes = ["RUB", "USD", localCurrency, "UAH"];

  const placeholder = inputFocused
    ? search_bar?.ru_give_adornment
    : "Поиск";

  const dispatch = useAppDispatch();

  const renderClearButton = (isEmptyInput: boolean) =>
    isEmptyInput ? (
      <RiSearchLine size="1rem" />
    ) : (
      <MdOutlineClear size="1rem" />
    );

  return (
    <HStack
      w="100%"
      h="12"
      alignItems="center"
      spacing="2"
      justifyContent="space-between"
    >
      <Box3D
        w="100%"
        boxShadow="lg"
        borderRadius="2xl"
        bgColor="bg.900"
        variant="contrast"
      >
        <InputGroup
          size="sm"
          transition="width .5s ease-in-out;"
          borderRadius="2xl"
        >
          <Input
            color={useColorModeValue("violet.700", "violet.600")}
            border="none"
            boxShadow="none !important"
            placeholder={placeholder}
            value={searchBarInputValue}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            onChange={(e) => dispatch(setSearchBarInputValue(e.target.value))}
            _placeholder={{ color: "bg.800" }}
          />
          <InputRightAddon
            bgColor={useColorModeValue("bg.50", "bg.900")}
            borderRadius="2xl"
            cursor="pointer"
            p="2"
            border="none"
            boxShadow="lg"
            onClick={() => dispatch(setSearchBarInputValue(""))}
          >
            {renderClearButton(!searchBarInputValue.length)}
          </InputRightAddon>
        </InputGroup>
      </Box3D>
      <HStack spacing="1">
        {currencyCodes.map((code) => (
          <Button
            key={code}
            variant="extra_contrast"
            size="sm"
            minH="8"
            onClick={() => dispatch(setSearchBarInputValue(code))}
          >
            {code}
          </Button>
        ))}
      </HStack>
    </HStack>
  );
};

export default SearchBar;
