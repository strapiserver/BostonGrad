import {
  HStack,
  InputGroup,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { BsFillPinAngleFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import { ResponsiveText } from "../../../../styles/theme/custom";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { setMassAmount } from "../../../../redux/mainReducer";
import { IMassDirTextId } from "../../../../types/mass";

const AmountInput = ({ massDirTextId }: { massDirTextId: IMassDirTextId }) => {
  const dispatch = useAppDispatch();
  const massAmount = useAppSelector((state) => state.main.massAmount);

  const fiatCode = massDirTextId.currency.code;
  const cryptoCode = massDirTextId.code;

  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  const setCode = (code: string) => {
    setValue("");
    dispatch(
      setMassAmount({
        value: "",
        code,
      })
    );
  };

  useEffect(() => {
    dispatch(
      setMassAmount({
        value: debouncedValue,
        code: massAmount.code || fiatCode,
      })
    );
  }, [debouncedValue]);

  useEffect(() => {
    // это для дебаунса
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, 500);
    return () => clearTimeout(handler);
  }, [value]);

  return (
    <InputGroup>
      <NumberInput
        value={value.length > 9 ? "✖" : value}
        onChange={(v: any) => setValue(v)}
        borderWidth="2px"
        borderRadius="xl"
        borderColor="bg.500"
        size="md"
        h="45px"
        focusBorderColor="violet.500"
        position="relative"
        max={100000000}
        min={0} // no negative
      >
        <HStack
          mr="20"
          mt="1"
          minW="100"
          justifyContent="end"
          position="absolute"
          left="0"
          top="1"
          zIndex="10"
        >
          {[cryptoCode, fiatCode].map((code) => (
            <ResponsiveText
              cursor="pointer"
              variant={
                (massAmount.code || fiatCode) == code ? "primary" : "shaded"
              }
              fontWeight={
                (massAmount.code || fiatCode) == code ? "bold" : "unset"
              }
              onClick={() => setCode(code)}
            >
              {code.slice(0, 4)}
            </ResponsiveText>
          ))}
        </HStack>

        <NumberInputField
          px="2"
          float="right"
          textAlign="end"
          placeholder={"0.00"}
          fontFamily="'Mozilla Text', monospace"
          fontSize={["2xl", "3xl"]}
          value={value} // use raw value for instant update
          border="hidden"
          _placeholder={{ color: "bg.800" }}
          w="100%"
        />
      </NumberInput>
    </InputGroup>
  );
};

export default AmountInput;
