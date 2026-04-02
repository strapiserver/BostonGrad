import { Grid } from "@chakra-ui/react";
import { SectionContext } from "../../../../shared/contexts/SectionContext";
import { ReactChildren, useContext } from "react";

const SectionGrid = ({ children }: { children: JSX.Element[] }) => {
  const { columns } = useContext(SectionContext);

  return (
    <Grid
      templateColumns={{
        base: `repeat(${columns - 1}, 1fr)`,
        sm: `repeat(${columns}, 1fr)`,
      }}
      gap="1"
      py={2}
      mx="2"
    >
      {children}
    </Grid>
  );
};

export default SectionGrid;
