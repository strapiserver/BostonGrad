import React, { ReactChildren, useContext, useEffect } from "react";

import {
  Grid,
  Button,
  Text,
  Box,
  Collapse,
  useColorModeValue,
} from "@chakra-ui/react";
import Arrow from "../../../../shared/Arrow";
import SectionGridWrapper from "./SectionGrid";
import PmGroup from "./PmGroup";
import { IPmGroup } from "../../../../../types/selector";

const SectionHidden = ({ children }: { children: IPmGroup[] }) => {
  const dividerColor = useColorModeValue(
    "rgba(0,0,0,0.1)",
    "rgba(225,200,255,0.1)"
  );
  // const [foldedSections, showSection] = React.useState({});
  const [folded, setFolded] = React.useState(true);
  const [mounted, setMounted] = React.useState(false);
  const mount = () => setMounted(true);
  const unmount = () => setTimeout(() => setMounted(!mounted), 300);

  return (
    <Box mt="1">
      <Collapse in={!folded}>
        {mounted && (
          <SectionGridWrapper>
            {children.map((pm_group) => {
              return <PmGroup pm_group={pm_group} key={pm_group.en_name} />;
            })}
          </SectionGridWrapper>
        )}
      </Collapse>

      <Box
        w="100%"
        h="1px"
        background={`linear-gradient(to right, rgba(0,0,0,0) 10%, ${dividerColor} 30%, ${dividerColor} 70%, rgba(0,0,0,0) 90%)`}
      />

      <Button // see all
        maxH="6"
        w="100%"
        variant="default"
        justifyContent="center"
        onClick={() => {
          setFolded(!folded);
          mounted ? unmount() : mount();
        }}
        color="bg.800"
      >
        <Text fontSize="md" m="0 2px">
          {folded ? "показать все" : "скрыть"}
        </Text>
        <Arrow isUp={!folded} />
      </Button>
    </Box>
  );
};

export default SectionHidden;
