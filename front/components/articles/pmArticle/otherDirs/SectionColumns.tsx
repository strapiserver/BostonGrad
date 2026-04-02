import { Box, Button, Collapse, Grid } from "@chakra-ui/react";
import React from "react";
import { Box3D } from "../../../../styles/theme/custom";
import { IPmPairs } from "../../../../types/exchange";
import OtherHeader from "./OtherHeader";
import DirCardWithTitle from "./DirCardWithTitle";
import { GetRateDataFn } from "./useDirRates";
import Arrow from "../../../shared/Arrow";

export type PairedRow = {
  key: string;
  section: string;
  sell?: IPmPairs;
  buy?: IPmPairs;
};

type ColumnProps = {
  header: string;
  rows: Array<IPmPairs | null>;
  side: "sell" | "buy";
  expanded: boolean;
  onToggle: () => void;
  getRateData: GetRateDataFn;
  placeholderHeight: string;
  hiddenRows: Array<IPmPairs | null>;
};

const Column = ({
  header,
  rows,
  side,
  expanded,
  onToggle,
  getRateData,
  placeholderHeight,
  hiddenRows,
}: ColumnProps) => {
  return (
    <Box3D borderRadius="lg" variant="extra_contrast" w="100%">
      <OtherHeader text={`${header}`} />
      <Box px="4" pb="4">
        {rows.map((pair, idx) => (
          <DirCardWithTitle
            key={pair?.slug || `${side}-${idx}`}
            pair={pair}
            side={side}
            getRateData={getRateData}
            placeholderHeight={placeholderHeight}
          />
        ))}
        {hiddenRows.length > 0 && (
          <>
            <Collapse in={expanded} animateOpacity>
              {hiddenRows.map((pair, idx) => (
                <DirCardWithTitle
                  key={pair?.slug || `${side}-hidden-${idx}`}
                  pair={pair}
                  side={side}
                  getRateData={getRateData}
                  placeholderHeight={placeholderHeight}
                />
              ))}
            </Collapse>
            <Button
              mt="4"
              color="bg.700"
              w="100%"
              bgColor="bg.700"
              onClick={onToggle}
              rightIcon={<Arrow isUp={expanded} />}
            >
              {expanded ? "скрыть" : "показать все"}
            </Button>
          </>
        )}
      </Box>
    </Box3D>
  );
};

type SectionColumnsProps = {
  headers: { sell: string; buy: string };
  rows: PairedRow[];
  expanded: boolean;
  onToggle: () => void;
  getRateData: GetRateDataFn;
  placeholderHeight: string;
  visibleCount?: number;
};

const SectionColumns = ({
  headers,
  rows,
  expanded,
  onToggle,
  getRateData,
  placeholderHeight,
  visibleCount = 3,
}: SectionColumnsProps) => {
  const visibleRows = rows.slice(0, visibleCount);
  const hiddenRows = rows.slice(visibleCount);

  return (
    <Grid
      gridTemplateColumns={{ base: "1fr", lg: "repeat(2, minmax(0, 1fr))" }}
      gap="4"
      alignItems="stretch"
    >
      <Column
        header={headers.sell}
        rows={visibleRows.map((row) => row.sell || null)}
        hiddenRows={hiddenRows.map((row) => row.sell || null)}
        side="sell"
        expanded={expanded}
        onToggle={onToggle}
        getRateData={getRateData}
        placeholderHeight={placeholderHeight}
      />

      <Column
        header={headers.buy}
        rows={visibleRows.map((row) => row.buy || null)}
        hiddenRows={hiddenRows.map((row) => row.buy || null)}
        side="buy"
        expanded={expanded}
        onToggle={onToggle}
        getRateData={getRateData}
        placeholderHeight={placeholderHeight}
      />
    </Grid>
  );
};

export default SectionColumns;
