import React from "react";
import { IPmGroup, IPm } from "../../../../../../types/selector";
import { getPmsFromPmGroup } from "../../../../../main/side/selector/section/PmGroup/helper";
import PmButton from "../../../../../main/side/selector/section/PmGroup/PmButton";
import SelectorPmName from "../../../../../main/side/selector/section/PmGroup/SelectorPmName";
import DirectionSubitems from "./DirectionSubitems";

const DirectionPmGroup = ({
  pm_group,
  onSelect,
}: {
  pm_group: IPmGroup;
  onSelect: (pm: IPm) => void;
}) => {
  const pms = getPmsFromPmGroup(pm_group, undefined, false);
  if (!pms?.length) return <></>;

  const choosePm = (sub?: string) => {
    const pm =
      (sub &&
        pms.find(
          (entry) =>
            entry.subgroup_name == sub || entry.currency.code == sub,
        )) ||
      pms[0];
    if (!pm) return;
    onSelect(pm);
  };

  const name = pm_group.en_name;

  if (pms.length > 1) {
    return (
      <DirectionSubitems
        pmGroupName={name}
        pms={pms}
        color={pm_group.color}
        choosePm={choosePm}
      />
    );
  }

  return (
    <PmButton
      color={pm_group.color}
      icon={pm_group.icon}
      iconAlt={name}
      handleToggle={choosePm}
      shaded={false}
    >
      <SelectorPmName name={name} code={pms[0].currency?.code} />
    </PmButton>
  );
};

export default DirectionPmGroup;
