import React from "react";
import { ICity } from "../../types/exchange";
import { IPm } from "../../types/selector";

export type MassContextValue = {
  isSell: boolean;
  slug: string;
  currencyCode: string;
  currentCryptoPm?: IPm;
  city?: ICity;
};

const MassSideContext = React.createContext<MassContextValue>({
  isSell: true,
  slug: "",
  currencyCode: "",
  currentCryptoPm: undefined,
  city: undefined,
});

export default MassSideContext;
