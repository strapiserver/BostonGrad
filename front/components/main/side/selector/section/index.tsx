import React, { ReactChildren, useEffect, useState } from "react";
// import PmGroup from "../PmGroup";
// import SectionGridWrapper from "./SectionGridWrapper";

import {
  Button,
  Text,
  Spacer,
  Collapse,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import Arrow from "../../../../shared/Arrow";
import SectionGridWrapper from "./SectionGrid";
import SectionHidden from "./SectionHidden";
import PmGroup from "./PmGroup";
import { IPmGroup } from "../../../../../types/selector";
import {
  Box3D,
  RegularBox,
  ResponsiveText,
} from "../../../../../styles/theme/custom";

const Section = ({
  title,
  itemsToShow = 6,
  pmGroups,
}: {
  title: string;
  itemsToShow: number;
  pmGroups: IPmGroup[];
}) => {
  // const country = useAppSelector((state) =>
  //   state.main.location.en_country_name.toUpperCase()
  // );
  // const filteredPmGroups = pmGroups.filter(
  //   (pmGroup) =>
  //     !pmGroup.countries ||
  //     !pmGroup.countries.length ||
  //     pmGroup.countries.find((c) => c.toUpperCase() == country)
  // );
  const showSeeAll = pmGroups.length > itemsToShow;
  const visiblePmGroups = [...pmGroups];
  visiblePmGroups.length = itemsToShow - 2;
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
        <Spacer />
      </RegularBox>

      <Box pb="1">
        <SectionGridWrapper>
          {pmGroups.slice(0, itemsToShow).map((pm_group) => {
            return <PmGroup pm_group={pm_group} key={pm_group.id} />;
          })}
        </SectionGridWrapper>

        {showSeeAll && (
          <SectionHidden>{pmGroups.slice(itemsToShow)}</SectionHidden>
        )}
      </Box>
    </Box3D>
  );
};

export default Section;
