import {
  Text,
  Tooltip,
  HStack,
  Image,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";

import { IoInformation } from "react-icons/io5";
import { IParameter } from "../../../types/rates";
import CustomImage from "../../shared/CustomImage";
import { useAppSelector } from "../../../redux/hooks";
import MyTooltip from "../../shared/MyTooltip";
import { locale } from "../../../services/utils";
import { capitalize } from "../../main/side/selector/section/PmGroup/helper";

const Parameter = ({
  code,
  isExtended,
  needDescription = false,
}: {
  code: string;
  isExtended?: boolean;
  needDescription?: boolean;
}) => {
  const topParameter = useAppSelector((state) =>
    state.main.topParameters.find((p) => p.code == code),
  );
  const rotationColor = 50 * +(topParameter?.id || 0);
  const filter = `invert(40%) sepia(97%) ${useColorModeValue(
    "saturate(550%)",
    topParameter?.id == "26" ? "saturate(10%)" : "saturate(150%)",
  )} hue-rotate(${rotationColor}deg)`;

  if (!topParameter) return <Box display="none"></Box>;

  const [raw_name, description] = [
    topParameter[`${locale}_name`],
    topParameter.parameter[`${locale}_description`],
  ];
  const name = capitalize(raw_name);

  const renderParameter = () => (
    <HStack
      filter={filter}
      zIndex="4"
      w="fit-content"
      position="relative"
      px={["1", "1"]}
      py={["0.2", "0.2"]}
      justifyContent="center"
      cursor="pointer"
      borderRadius="lg"
      border="1px solid"
      borderColor={`white`}
      color={`white`}
      _hover={{ filter: filter + " brightness(1.1)" }}
      _before={{
        content: "''",
        bgColor: `white`,
        filter: "opacity(0.1)",
        boxShadow: `0 0 10px 5px white`,
        left: "0",
        position: "absolute",
        borderRadius: "inherit",
        w: "100%",
        h: "100%",
      }}
    >
      {topParameter.parameter.icon ? (
        <CustomImage
          w="5"
          h="5"
          img={topParameter.parameter.icon}
          customAlt={description}
        />
      ) : (
        <IoInformation size="1rem" />
      )}
      {isExtended && name && <Text fontSize={["xs", "sm"]}>{name}</Text>}
    </HStack>
  );

  return !needDescription ? (
    <MyTooltip label={description} placement="left">
      {renderParameter()}
    </MyTooltip>
  ) : (
    <Box py="1" my="1">
      {renderParameter()}
      <Text size="sm" color="bg.700" mt="4">
        {description}
      </Text>
    </Box>
  );
};

export default Parameter;
