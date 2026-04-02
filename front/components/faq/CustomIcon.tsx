import { useColorModeValue, HStack, Text } from "@chakra-ui/react";
import React from "react";
import { IoInformation } from "react-icons/io5";
import description from "../map/description";
import CustomImage from "../shared/CustomImage";
import { IImage } from "../../types/selector";

export default function CustomIcon({
  id,
  image,
  description,
}: {
  id: string;
  image?: IImage;
  description?: string;
}) {
  if (!image) return <></>;
  const rotationColor = 50 * +(id || 0);
  const filter = `invert(60%) sepia(97%) ${useColorModeValue(
    "saturate(550%)",
    "saturate(150%)"
  )} hue-rotate(${rotationColor}deg)`;

  return (
    <HStack
      filter={filter}
      zIndex="4"
      w="100%"
      position="relative"
      justifyContent="start"
      cursor="pointer"
      borderRadius="50px"
      color={`white`}
    >
      {image ? (
        <CustomImage w="30px" h="30px" img={image} customAlt={description} />
      ) : (
        <IoInformation size="3rem" />
      )}
      <Text fontSize={["lg", "xl"]}>{description}</Text>
    </HStack>
  );
}
