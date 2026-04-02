import React from "react";
import { Box } from "@chakra-ui/react";
import { IPmGroup, IPm } from "../../../../../../types/selector";
import { Box3D, RegularBox, ResponsiveText } from "../../../../../../styles/theme/custom";
import SectionGrid from "../../../../../main/side/selector/section/SectionGrid";
import DirectionPmGroup from "./DirectionPmGroup";
import DirectionSectionHidden from "./DirectionSectionHidden";

const DirectionSection = ({
  title,
  itemsToShow = 6,
  pmGroups,
  onSelect,
}: {
  title: string;
  itemsToShow: number;
  pmGroups: IPmGroup[];
  onSelect: (pm: IPm) => void;
}) => {
  const showSeeAll = pmGroups.length > itemsToShow;
  if (!pmGroups.length) return <></>;

  return (
    <Box3D mb="4" position="relative" px="1">
      <RegularBox
        position="sticky"
        top="-0.5"
        p="2"
        boxShadow="0 10px 15px -6px rgba(0,0,0,0.25)"
        borderBottomRadius="0"
        variant="extra_contrast"
        zIndex="10"
        w="100%"
        justifyContent="start"
      >
        <ResponsiveText fontWeight="bold" variant="no_contrast">
          {title.toUpperCase()}
        </ResponsiveText>
      </RegularBox>

      <Box pb="1">
        <SectionGrid>
          {pmGroups.slice(0, itemsToShow).map((pm_group) => (
            <DirectionPmGroup
              key={pm_group.id}
              pm_group={pm_group}
              onSelect={onSelect}
            />
          ))}
        </SectionGrid>

        {showSeeAll && (
          <DirectionSectionHidden
            pmGroups={pmGroups.slice(itemsToShow)}
            onSelect={onSelect}
          />
        )}
      </Box>
    </Box3D>
  );
};

export default DirectionSection;
