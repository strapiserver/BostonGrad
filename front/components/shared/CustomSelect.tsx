import {
  Button,
  ButtonProps,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { RiArrowDownSLine } from "react-icons/ri";
import { IImage } from "../../types/selector";
import CustomImage from "./CustomImage";

type Option = {
  value: string;
  label: string;
  icon?: IImage | null;
};

type CustomSelectProps = Omit<ButtonProps, "children"> & {
  name: string;
  options: Option[];
  placeholder?: string;
  defaultValue?: string;
};

export default function CustomSelect({
  name,
  options,
  placeholder,
  defaultValue,
  ...props
}: CustomSelectProps) {
  const initialValue = defaultValue || "";
  const [value, setValue] = useState(initialValue);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (value) return;
    if (defaultValue) {
      setValue(defaultValue);
      return;
    }
    if (options.length > 0) {
      setValue(options[0].value);
    }
  }, [defaultValue, options, value]);

  const selectedOption = useMemo(() => {
    if (!value) return "";
    return options.find((option) => option.value === value) || "";
  }, [options, value]);

  const renderIcon = (icon?: IImage | null) =>
    icon ? <CustomImage img={icon} w="30px" h="30px" objectFit="contain" /> : null;

  return (
    <>
      <input type="hidden" name={name} value={value} />
      {!mounted ? (
        <Button
          w="100%"
          justifyContent="space-between"
          textAlign="left"
          rightIcon={<RiArrowDownSLine />}
          fontWeight="normal"
          {...props}
        >
          {placeholder || ""}
        </Button>
      ) : (
      <Menu matchWidth placement="bottom-start">
        <MenuButton
          as={Button}
          w="100%"
          justifyContent="space-between"
          textAlign="left"
          rightIcon={<RiArrowDownSLine />}
          fontWeight="normal"
          {...props}
        >
          {selectedOption ? (
            <HStack spacing="2">
              {renderIcon(selectedOption.icon)}
              <Text>{selectedOption.label}</Text>
            </HStack>
          ) : (
            placeholder || ""
          )}
        </MenuButton>
        <MenuList bg="white" borderColor="red.400" textAlign="left">
          {options.map((option) => (
            <MenuItem
              key={option.value}
              bg="white"
              color="black"
              _hover={{ bg: "red.500", color: "white" }}
              _focus={{ bg: "red.500", color: "white" }}
              onClick={() => setValue(option.value)}
            >
              <HStack spacing="2">
                {renderIcon(option.icon)}
                <Text>{option.label}</Text>
              </HStack>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      )}
    </>
  );
}
