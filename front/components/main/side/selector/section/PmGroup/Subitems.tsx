import _ from "lodash";
import {
  Button,
  Flex,
  Collapse,
  Spacer,
  Grid,
  Box,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import SelectorPmName from "./SelectorPmName";
import PmButton from "./PmButton";
import React, { useContext } from "react";
import Arrow from "../../../../../shared/Arrow";
import { SubButton } from "./SubButton";
import { IPm } from "../../../../../../types/selector";
import { useAppSelector } from "../../../../../../redux/hooks";
import SideContext from "../../../../../shared/contexts/SideContext";

const Subitems = ({
  pmGroupName,
  pms,
  choosePm,
  possiblePairs,
  color,
}: {
  pmGroupName: string;
  pms: IPm[];
  choosePm: Function;
  possiblePairs?: string[];
  color: string;
}) => {
  const side = useContext(SideContext) as "give" | "get";
  const oppositePm = useAppSelector(
    (state) => state.main[`${side === "give" ? "get" : "give"}Pm`]
  );
  const [folded, setFolded] = React.useState(true);
  const [mounted, setMounted] = React.useState(false);
  const mount = () => setMounted(true);
  const unmount = () => setTimeout(() => setMounted(!mounted), 300);
  const shaded =
    !!oppositePm && !pms.some((pm) => possiblePairs?.includes(pm.code));
  const subShaded = (pm: IPm) =>
    !!possiblePairs &&
    !!oppositePm &&
    !possiblePairs?.find((pair) => pm.code === pair);
  return (
    // сама обложка раскрывалки
    <VStack>
      <PmButton
        color={color}
        icon={pms[0].icon}
        handleToggle={() => {
          setFolded(!folded);
          mounted ? unmount() : mount();
        }}
        shaded={shaded}
      >
        <SelectorPmName
          name={pmGroupName}
          code={pms[0].currency.code.toUpperCase()} // только для крипты нужен код
        />
        <Spacer />
        <Arrow isUp={!folded} />
        <Spacer />
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
                  shaded={subShaded(pm)}
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

export default Subitems;
