import { Switch } from "@chakra-ui/react";
import React from "react";

type Props = {
  id: string;
  isChecked: boolean;
  handleSwitch: (checked: boolean) => void;
  isDisabled?: boolean;
};

export default function OfferSwitch({
  id,
  isChecked,
  handleSwitch,
  isDisabled,
}: Props) {
  return (
    <Switch
      id={id}
      isChecked={isChecked}
      isDisabled={isDisabled}
      onChange={(event) => handleSwitch(event.target.checked)}
      borderRadius="full"
      sx={{
        ".chakra-switch__track": {
          bg: "bg.1000",
        },
        ".chakra-switch__thumb": {
          bg: "violet.800",
        },
        ".chakra-switch__input:checked + .chakra-switch__track": {
          bg: "violet.600",
        },
        ".chakra-switch__input:checked + .chakra-switch__track .chakra-switch__thumb":
          { bg: "bg.900" },
      }}
      boxShadow="0 0 10px rgba(241,196,181,0.4)"
      _hover={{ bg: "green.500" }}
    />
  );
}
