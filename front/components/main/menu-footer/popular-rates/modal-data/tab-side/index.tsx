import { useContext } from "react";
import useSWR from "swr";

import { initParserFetcher } from "../../../../../../services/fetchers";
import { IPopularRate } from "../../../../../../types/rates";
import ErrorWrapper from "../../../../../shared/ErrorWrapper";
import SideContext from "../../../../../shared/contexts/SideContext";
import RateLayer from "./RateLayer";

const fetcher = initParserFetcher();
type PopularRatesResponse = Record<
  string,
  { buy?: IPopularRate[]; sell?: IPopularRate[] }
>;

const TabSide = () => {
  const side = useContext(SideContext) as "buy" | "sell";

  const { data, error } = useSWR<PopularRatesResponse>("top", fetcher);
  const popularRates = data
    ? Object.entries(data).map(([code, rate]) => ({
        code,
        rates: rate?.[side] || [],
      }))
    : [];

  return (
    <ErrorWrapper isError={error} isLoading={!data}>
      {popularRates.map(({ code, rates }) => (
        <RateLayer key={code} code={code} rates={rates} />
      ))}
    </ErrorWrapper>
  );
};

export default TabSide;
