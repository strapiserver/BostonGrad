import { VStack, Grid } from "@chakra-ui/react";

const ColumnGrid = ({ children }: { children: any }) => {
  return (
    <Grid
      maxW={{ base: 428, lg: "100%" }}
      gridTemplateColumns={{ base: "1fr", lg: "1fr 1fr" }}
      gridGap="4"
      justifyContent="center"
    >
      {children}
    </Grid>
  );
};

export default ColumnGrid;
