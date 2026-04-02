import React from "react";
import { Box, useBreakpointValue } from "@chakra-ui/react";
import { ISection, IPm } from "../../../../../../types/selector";
import { SectionContext } from "../../../../../shared/contexts/SectionContext";
import DirectionSection from "./DirectionSection";

const DirectionSectionsList = ({
  sections,
  onSelect,
}: {
  sections: ISection[];
  onSelect: (pm: IPm) => void;
}) => {
  const isSmall = useBreakpointValue({
    base: true,
    md: false,
  });

  return (
    <Box w="100%" borderRadius="lg">
      {sections?.length
        ? sections.map((section) => (
            <SectionContext.Provider
              key={section.id}
              value={{
                columns: section.columns,
                currencyHidden: !(
                  section.en_title.toLowerCase().includes("crypto") ||
                  section.en_title.toLowerCase().includes("cash")
                ),
              }}
            >
              <DirectionSection
                title={section.ru_title || section.en_title}
                itemsToShow={
                  isSmall
                    ? section.columns * 2 - 2
                    : section.columns * section.rows
                }
                pmGroups={section.pm_groups}
                onSelect={onSelect}
              />
            </SectionContext.Provider>
          ))
        : null}
    </Box>
  );
};

export default DirectionSectionsList;
