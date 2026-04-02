import { Box, Grid } from "@chakra-ui/react";
import PopularRates from "./popular-rates";

import QuickChange from "./popular-pms";

const MenuFooter = () => {
  return (
    <Grid gridTemplateColumns="1fr 1fr" gridGap="4" userSelect="none" mt="4">
      <QuickChange />
      <PopularRates />
    </Grid>
  );
};

export default MenuFooter;
