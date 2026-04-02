import React from "react";
import {
  Box,
  Button,
  Collapse,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IPmGroup, IPm } from "../../../../../../types/selector";
import SectionGrid from "../../../../../main/side/selector/section/SectionGrid";
import Arrow from "../../../../../shared/Arrow";
import DirectionPmGroup from "./DirectionPmGroup";

const DirectionSectionHidden = ({
  pmGroups,
  onSelect,
}: {
  pmGroups: IPmGroup[];
  onSelect: (pm: IPm) => void;
}) => {
  const dividerColor = useColorModeValue(
    "rgba(0,0,0,0.1)",
    "rgba(225,200,255,0.1)",
  );
  const [folded, setFolded] = React.useState(true);
  const [mounted, setMounted] = React.useState(false);
  const mount = () => setMounted(true);
  const unmount = () => setTimeout(() => setMounted(!mounted), 300);

  return (
    <Box mt="1">
      <Collapse in={!folded}>
        {mounted && (
          <SectionGrid>
            {pmGroups.map((pm_group) => (
              <DirectionPmGroup
                pm_group={pm_group}
                key={pm_group.en_name}
                onSelect={onSelect}
              />
            ))}
          </SectionGrid>
        )}
      </Collapse>

      <Box
        w="100%"
        h="1px"
        background={`linear-gradient(to right, rgba(0,0,0,0) 10%, ${dividerColor} 30%, ${dividerColor} 70%, rgba(0,0,0,0) 90%)`}
      />

      <Button
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

export default DirectionSectionHidden;
