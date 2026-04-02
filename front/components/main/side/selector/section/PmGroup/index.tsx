import Subitems from "./Subitems";

import SelectorPmName from "./SelectorPmName";
import { getPmsFromPmGroup, pmsToSlug } from "./helper";
import { useAppDispatch, useAppSelector } from "../../../../../../redux/hooks";
import { batch } from "react-redux";
import { IPmGroup, IPm } from "../../../../../../types/selector";
import {
  setLoadingStatus,
  setPm,
  triggerModal,
} from "../../../../../../redux/mainReducer";
import { useRouter } from "next/router";
import { useContext } from "react";
import P2PContext from "../../../../../shared/contexts/p2pContext";

import SideContext from "../../../../../shared/contexts/SideContext";
import PmButton from "./PmButton";
import { fetchPossiblePairs } from "../../../../../../redux/thunks";
import { slugCityToExchange } from "../../../../../exchange/helper";

const PmGroup = ({ pm_group }: { pm_group: IPmGroup }) => {
  const router = useRouter();
  //const p2pDirIndex = useContext(P2PContext);
  const dispatch = useAppDispatch();
  const side = useContext(SideContext) as "give" | "get";
  const oppositePm = useAppSelector(
    (state) => state.main?.[`${side === "give" ? "get" : "give"}Pm`]
  );
  const currentPm = useAppSelector((state) => state.main[`${side}Pm`]);
  const cityName = useAppSelector((state) => state.main.city?.en_name);
  const pms = getPmsFromPmGroup(pm_group, undefined, false);
  if (!pms || !pms.length) {
    return <></>;
  }
  const possiblePairs = oppositePm?.possible_pairs;

  const shaded =
    !!possiblePairs &&
    !!oppositePm &&
    !possiblePairs?.find((pair) => pms[0].code === pair);

  const choosePm = (sub?: string) => {
    const pm =
      (sub &&
        pms.find((pm) => pm.subgroup_name == sub || pm.currency.code == sub)) ||
      pms[0];
    if (!pm || pm?.code == currentPm?.code) {
      dispatch(triggerModal(undefined));
      return;
    }
    batch(() => {
      dispatch(fetchPossiblePairs({ code: pm.code, side }));
      dispatch(triggerModal(undefined));
      dispatch(setPm({ pm, side, shaded }));
    });

    if (oppositePm?.code) {
      const [givePm, getPm] =
        side === "give" ? [pm, oppositePm] : [oppositePm, pm];
      dispatch(setLoadingStatus("pending"));
      const slug = pmsToSlug({ givePm, getPm })
        .replaceAll(" ", "")
        .toLowerCase();
      shaded
        ? router.push(`/`)
        : router.push(`/${slugCityToExchange(slug, cityName)}`);
    }
  };

  const name = pm_group.en_name;

  if (pms.length > 1) {
    return (
      <Subitems
        pmGroupName={name}
        pms={pms}
        color={pm_group.color}
        choosePm={choosePm}
        possiblePairs={possiblePairs}
      />
    ); // pm_id from pm_group_short_name + currency or subitem
  }

  return (
    // pm_id from pm_group_short_name or currency
    <PmButton
      color={pm_group.color}
      icon={pm_group.icon}
      iconAlt={name}
      handleToggle={choosePm}
      shaded={shaded}
    >
      <SelectorPmName
        name={name}
        code={pms[0].currency?.code} // for crypto
      />
    </PmButton>
  );
};

export default PmGroup;
