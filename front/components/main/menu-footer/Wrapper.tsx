import { Flex, Box, Text, Center, useColorModeValue } from "@chakra-ui/react";

import { title } from "process";
import { ReactChildren, ReactElement } from "react";
import { Box3D, CustomBox3D } from "../../../styles/theme/custom";

const Wrapper = ({
  title,
  children,
}: {
  title: String;
  children: ReactElement;
}) => {
  return (
    <CustomBox3D p="10" minW="300">
      <Text color="bg.800" fontSize="lg" textAlign="center" mb="10">
        {title}
      </Text>

      <Center h="80%" p="2">
        {children}
      </Center>
    </CustomBox3D>
  );
};

export default Wrapper;
