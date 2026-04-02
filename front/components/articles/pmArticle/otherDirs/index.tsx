import { Box, Divider, VStack } from "@chakra-ui/react";
import React, { useCallback, useMemo, useState } from "react";
import { IPmPairs } from "../../../../types/exchange";
import { IPm } from "../../../../types/selector";
import { H3ForOthers } from "./OtherHeader";
import SectionColumns, { PairedRow } from "./SectionColumns";
import { useDirRates } from "./useDirRates";

const PLACEHOLDER_MIN_HEIGHT = "70px";
const VISIBLE_ROWS = 3;

const OtherDirs = ({
  otherDirs,
  mainPm,
}: {
  otherDirs: { buy: IPmPairs[]; sell: IPmPairs[] };
  mainPm: IPm;
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const allPairs = useMemo(
    () => [...(otherDirs.buy || []), ...(otherDirs.sell || [])],
    [otherDirs.buy, otherDirs.sell]
  );
  const { getRateData } = useDirRates(allPairs);

  const pairKey = (pair: IPmPairs) => {
    const giveCode = pair.givePm?.code;
    const getCode = pair.getPm?.code;
    if (!giveCode || !getCode) return null;
    return [giveCode, getCode].sort().join("_");
  };

  const getSectionKey = useCallback(
    (pair: IPmPairs) => {
      const mainCode = mainPm?.code?.toLowerCase();
      const giveSection = pair.givePm?.section;
      const getSection = pair.getPm?.section;

      if (!mainCode) return giveSection || getSection || "";

      if (pair.givePm?.code?.toLowerCase() === mainCode)
        return getSection || "";
      if (pair.getPm?.code?.toLowerCase() === mainCode)
        return giveSection || "";

      return giveSection || getSection || "";
    },
    [mainPm?.code]
  );

  const pairedRows = useMemo(() => {
    const map = new Map<string, PairedRow>();
    const order: string[] = [];

    const rememberOrder = (key: string) => {
      if (!order.includes(key)) order.push(key);
    };

    otherDirs.buy.forEach((pair) => {
      const key = pairKey(pair);
      if (!key) return;
      rememberOrder(key);
      const entry = map.get(key) || { key, section: getSectionKey(pair) };
      entry.sell = pair;
      map.set(key, entry);
    });

    otherDirs.sell.forEach((pair) => {
      const key = pairKey(pair);
      if (!key) return;
      rememberOrder(key);
      const entry = map.get(key) || { key, section: getSectionKey(pair) };
      entry.buy = pair;
      map.set(key, entry);
    });

    return order.map((key) => map.get(key)!);
  }, [otherDirs.buy, otherDirs.sell, getSectionKey]);

  const groupedRows = useMemo(() => {
    const sectionMap = new Map<
      string,
      { section: string; rows: PairedRow[] }
    >();

    pairedRows.forEach((row) => {
      const section = row.section || "";
      const existing = sectionMap.get(section);
      if (existing) {
        existing.rows.push(row);
      } else {
        sectionMap.set(section, { section, rows: [row] });
      }
    });

    return Array.from(sectionMap.values());
  }, [pairedRows]);

  if (!otherDirs?.buy.length && !otherDirs?.sell.length) return <></>;

  return (
    <VStack mt="4" w="100%" gap="4">
      {groupedRows.map(({ section, rows }) => {
        const headers = H3ForOthers(mainPm, section || "");
        const sectionKey = section || "unknown";

        return (
          <React.Fragment key={sectionKey}>
            <Divider my="4" />
            <Box w="100%">
              <SectionColumns
                headers={headers}
                rows={rows}
                expanded={Boolean(expanded[sectionKey])}
                onToggle={() =>
                  setExpanded((prev) => ({
                    ...prev,
                    [sectionKey]: !prev[sectionKey],
                  }))
                }
                getRateData={getRateData}
                placeholderHeight={PLACEHOLDER_MIN_HEIGHT}
                visibleCount={VISIBLE_ROWS}
              />
            </Box>
          </React.Fragment>
        );
      })}
    </VStack>
  );
};

export default OtherDirs;
