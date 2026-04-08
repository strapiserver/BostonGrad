import { Box, Button, Grid, Input } from "@chakra-ui/react";
import { RiSendPlaneFill } from "react-icons/ri";
import CustomSelect from "../../shared/CustomSelect";
import { IImage } from "../../../types/selector";
import settings from "./settings.json";

const { fieldCommon } = settings;
const { placeholderColor, ...fieldCommonInputStyles } = fieldCommon;

export default function Forms({
  countries = [],
  socialNetworks = [],
}: {
  countries?: string[];
  socialNetworks?: { name: string; icon: IImage | null }[];
}) {
  const ageOptions = [
    { value: "до 14", label: "до 14" },
    { value: "14-17", label: "14-17" },
    { value: "18-22", label: "18-22" },
    { value: "22+", label: "22+" },
  ];
  const countryOptions = countries.map((country) => ({
    value: country,
    label: country,
  }));
  const socialNetworkOptions = socialNetworks.map((network) => ({
    value: network.name,
    label: network.name,
    icon: network.icon,
  }));

  return (
    <Box w="100%">
      <Grid w="100%" gap="4" mt="4" gridTemplateColumns="1fr 1fr 1fr">
        <Input
          type="text"
          name="name"
          borderRadius="lg"
          placeholder="Ваше имя"
          required
          {...fieldCommonInputStyles}
          _placeholder={{ color: placeholderColor }}
        />

        {/* <FormLabel>Возраст ребенка</FormLabel> */}
        <CustomSelect
          name="ageRange"
          placeholder="Возраст ребенка"
          options={ageOptions}
          {...fieldCommonInputStyles}
        />

        {/* <FormLabel>Страна</FormLabel> */}
        <CustomSelect
          name="country"
          placeholder="Страна"
          options={countryOptions}
          {...fieldCommonInputStyles}
        />

        <CustomSelect
          name="socialnetwork"
          placeholder="Способ связи"
          options={socialNetworkOptions}
          {...fieldCommonInputStyles}
        />
        <Button
          size="md"
          variant="primary"
          gridColumn="span 2"
          rightIcon={<RiSendPlaneFill />}
        >
          Отправить
        </Button>
      </Grid>
    </Box>
  );
}
