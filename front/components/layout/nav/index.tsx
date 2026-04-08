import { Box } from "@chakra-ui/react";
import NavBody from "./NavBody";

const Nav = () => {
  return (
    <Box
      display={{ base: "none", xl: "block" }}
      h="calc(100vh - 80px)"
      w="100%"
      position="absolute"
      top="80px"
      left="0"
      right="0"
      px="2"
    >
      <NavBody />
    </Box>
  );
};

export default Nav;
