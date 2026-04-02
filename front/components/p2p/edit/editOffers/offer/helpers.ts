import { IPm } from "../../../../../types/selector";
import { DirectionSide } from "./types";

export const getModalId = (index: number, side: DirectionSide) =>
  `p2p_edit_direction_${index}_${side}`;

export const checkBlockchainExists = (giveCur: string, getCur: string) => {
  return giveCur == "USDT" || getCur == "USDT";
};
