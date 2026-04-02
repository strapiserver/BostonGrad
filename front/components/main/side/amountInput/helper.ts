import { R } from "../../../../redux/amountsHelper";
import { ILimit } from "../../../../types/rates";

export const normalizeLimits = (
  min?: ILimit,
  max?: ILimit,
  side?: "give" | "get"
) => {
  const Min = side ? R(min?.[side] || 0, 2) : 0;
  const Max = side ? R(max?.[side] || 0, 2) : 0;
  return { Min, Max };
};

export const getLimitStatus = (
  value: number,
  min?: ILimit,
  max?: ILimit,
  side?: "give" | "get"
) => {
  const { Min, Max } = normalizeLimits(min, max, side);
  if (Min && value < Min) return "below";
  if (Max && value > Max) return "above";
  return null;
};

export const isOutOfRange = (
  value: number,
  min?: ILimit,
  max?: ILimit,
  side?: "give" | "get"
) => !!getLimitStatus(value, min, max, side);
