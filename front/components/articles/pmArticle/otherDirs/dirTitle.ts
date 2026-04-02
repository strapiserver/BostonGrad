import { capitalize } from "../../../main/side/selector/section/PmGroup/helper";
import { IPm } from "../../../../types/selector";
import { IPmPairs } from "../../../../types/exchange";
import { codeToRuName } from "../../../../redux/amountsHelper";

const pmDisplayName = (pm?: IPm | null) =>
  pm
    ? capitalize(
        [
          pm.section == "cash" ? "" : pm?.ru_name || pm?.en_name,
          pm?.subgroup_name,
          pm.section == "cash"
            ? codeToRuName(pm?.currency?.code)
            : "",
        ]
          .filter(Boolean)
          .join(" ")
      )
    : "";

export const dirTitle = (pair: IPmPairs, side: "sell" | "buy") => {
  const givePm = pair?.givePm;
  const getPm = pair?.getPm;
  if (!givePm || !getPm) return "";

  const giveName = pmDisplayName(givePm);
  const getName = pmDisplayName(getPm);

  const buyVerb = "Купить";
  const sellVerb = "Продать";

  const buyTitle = `${buyVerb} ${getName}`.trim();
  const sellTitle = `${sellVerb} ${giveName}`.trim();

  const buySuffix = giveName ? ` за ${giveName}` : "";
  const sellSuffix = getName ? ` за ${getName}` : "";

  return side === "buy"
    ? `${buyTitle}${buySuffix}`.trim()
    : `${sellTitle}${sellSuffix}`.trim();
};
