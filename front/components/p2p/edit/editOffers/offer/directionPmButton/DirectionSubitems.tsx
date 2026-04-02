import React from "react";
import { Box, Collapse, Grid, Spacer, VStack } from "@chakra-ui/react";

import { IPm } from "../../../../../../types/selector";
import PmButton from "../../../../../main/side/selector/section/PmGroup/PmButton";
import SelectorPmName from "../../../../../main/side/selector/section/PmGroup/SelectorPmName";
import { SubButton } from "../../../../../main/side/selector/section/PmGroup/SubButton";
import Arrow from "../../../../../shared/Arrow";

const DirectionSubitems = ({
  pmGroupName,
  pms,
  choosePm,
  color,
}: {
  pmGroupName: string;
  pms: IPm[];
  choosePm: (sub?: string) => void;
  color: string;
}) => {
  const [folded, setFolded] = React.useState(true);
  const [mounted, setMounted] = React.useState(false);
  const mount = () => setMounted(true);
  const unmount = () => setTimeout(() => setMounted(!mounted), 300);

  return (
    <VStack>
      <PmButton
        color={color}
        icon={pms[0].icon}
        handleToggle={() => {
          setFolded(!folded);
          mounted ? unmount() : mount();
        }}
        shaded={false}
      >
        <SelectorPmName
          name={pmGroupName}
          code={pms[0].currency.code.toUpperCase()}
        />
        <Spacer />
        <Arrow isUp={!folded} />
      </PmButton>

      <Collapse in={!folded}>
        {mounted && (
          <Box p="2" w="100% !important" my="1">
            <Grid templateColumns="1fr 1fr" gridGap="2" gridAutoFlow="dense">
              {pms.map((pm: IPm) => (
                <SubButton
                  pm={pm}
                  choosePm={() =>
                    choosePm(pm.subgroup_name || pm.currency.code)
                  }
                  key={pm.code}
                  shaded={false}
                >
                  {pm.subgroup_name || pm.currency.code.toUpperCase()}
                </SubButton>
              ))}
            </Grid>
          </Box>
        )}
      </Collapse>
    </VStack>
  );
};

export default DirectionSubitems;
