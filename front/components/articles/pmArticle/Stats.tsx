import React from "react";
import { Box, Grid, HStack, VStack, Wrap } from "@chakra-ui/react";
import { ResponsiveText } from "../../../styles/theme/custom";
import { capitalize } from "../../main/side/selector/section/PmGroup/helper";

const Bricks = ({ n }: { n: number }) => {
  const color = n > 4 ? "green" : n > 3 ? "yellow" : n > 2 ? "orange" : "red";
  return (
    <Wrap gap="2">
      {new Array(n).fill(undefined).map((_, i) => (
        <Box
          key={i}
          minW="3"
          minH="1"
          bgColor={color + ".500"}
          borderRadius="lg"
        />
      ))}
    </Wrap>
  );
};

export default function Stats({ stats }: { stats: { [key: string]: number } }) {
  const entries = Object.entries(stats);
  return (
    <Grid
      my="4"
      w="100%"
      gap="4"
      alignItems="start"
      gridTemplateColumns={{
        lg: `repeat(${entries.length}, 1fr)`,
        base: `repeat(${entries.length - 3}, 1fr)`,
      }}
    >
      {entries.map(([param, n], idx) => {
        const str = param.replaceAll("_", " ");
        return (
          <Box
            mb="2"
            key={idx}
            border="1px solid"
            borderRadius="lg"
            p="2"
            borderColor="bg.500"
          >
            <ResponsiveText mb="1" size="sm">
              {str[0].toUpperCase() + str.slice(1)}
            </ResponsiveText>
            <Bricks key={idx} n={n} />
          </Box>
        );
      })}
    </Grid>
  );
}
