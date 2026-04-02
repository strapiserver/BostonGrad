import React, { useContext } from "react";
import { addSpaces, curToSymbol, R } from "../../../../redux/amountsHelper";
import { ResponsiveText } from "../../../../styles/theme/custom";
import { IMassDirTextId } from "../../../../types/mass";
import MassSideContext from "../../sideContext";

export default function MassRateAmount({
  course,
  massAmount,
  massDirTextId,
}: {
  course: number;
  massAmount: { code?: string; value: string };
  massDirTextId: IMassDirTextId;
}) {
  const { code, currency } = massDirTextId;
  const symbol = curToSymbol(currency.code);
  const { isSell } = useContext(MassSideContext);

  let left = "";
  let right = "";

  if (massAmount.value === "") {
    // default: 1 code → ? symbol
    left = `1 ${code.slice(0, 4)}`;
    right = `${
      course < 1 ? addSpaces(R(1 / course, 1)) : addSpaces(R(course, 1))
    } ${symbol}`;
  } else if (code === massAmount.code) {
    // input is base code
    left = `${addSpaces(R(Number(massAmount.value), 1))} ${code.slice(0, 4)}`;
    right = `${
      course < 1
        ? addSpaces(R((1 / course) * Number(massAmount.value), 1))
        : addSpaces(R(course * Number(massAmount.value), 1))
    } ${symbol}`;
  } else {
    // input is fiat
    left = `${
      course < 1
        ? addSpaces(R(course * Number(massAmount.value), 1))
        : addSpaces(R((1 / course) * Number(massAmount.value), 1))
    } ${code.slice(0, 4)}`;
    right = `${addSpaces(R(Number(massAmount.value), 1))} ${symbol}`;
  }

  // swap if not selling
  if (!isSell) {
    [left, right] = [right, left];
  }

  return (
    <ResponsiveText
      fontSize={{ base: "xl", lg: "sm" }}
      mt="1"
      variant="contrast"
    >
      {`${left} ≈ ${right}`}
    </ResponsiveText>
  );
}
