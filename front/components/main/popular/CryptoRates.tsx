import { Divider, Grid, Text, Box } from "@chakra-ui/react";

import Link from "next/link";
import { BiLinkExternal } from "react-icons/bi";
import { PiArrowsSplitThin } from "react-icons/pi";
import { curToSymbol, format, R } from "../../../redux/amountsHelper";

import { capitalize, pmsToSlug } from "../side/selector/section/PmGroup/helper";

import { IPopularRate } from "../../../types/rates";
import { IPm } from "../../../types/selector";
import RateLink from "./RateLink";
import { ResponsiveText } from "../../../styles/theme/custom";
import { slugCityToExchange } from "../../exchange/helper";
import { isCashPm } from "../../shared/helper";
import { useAppSelector } from "../../../redux/hooks";

const CryptoRates = ({
  cryptoPm,
  buySell,
  popularPms,
}: {
  cryptoPm: IPm;
  popularPms: IPm[];
  buySell: {
    buy: IPopularRate[];
    sell: IPopularRate[];
  };
}) => {
  const citySlug = useAppSelector((state) =>
    state.main.city?.en_name.replaceAll(" ", "-").toLowerCase(),
  );

  const getCurrencyCode = (pm?: IPm | null) => {
    if (!pm) return undefined;
    if (pm.currency?.code) return pm.currency.code;

    if (isCashPm(pm)) {
      const match = pm.code?.toUpperCase().match(/CASH([A-Z]{3})/);
      if (match?.[1]) return match[1];
    }

    return pm.code;
  };

  return (
    <>
      <Box>
        {buySell.buy.map((rate, index) => {
          const pm = popularPms?.find((pm) => pm?.code == rate?.fiat);
          return (
            <ResponsiveText
              key={String(pm?.code) + index}
              size="sm"
              _hover={{ color: "bg.500" }}
              my="1"
            >
              {`${capitalize(pm?.ru_name || pm?.en_name)}`}
            </ResponsiveText>
          );
        })}
      </Box>
      <Box>
        {buySell.buy.map((rate, index) => {
          const pm = popularPms?.find((pm) => pm?.code == rate?.fiat);

          const slug = pmsToSlug({ givePm: pm, getPm: cryptoPm });
          const fullSlug = slugCityToExchange(slug, citySlug);
          const currencyCode = getCurrencyCode(pm);

          const symbol = curToSymbol(currencyCode?.toUpperCase());
          const rateNumber = `${symbol ? `${symbol} ` : ""}${format(
            rate?.course,
            1,
          )}`;
          return (
            <RateLink
              key={String(rate?.exchangerId) + index + "buy"}
              slug={fullSlug}
              rateNumber={rateNumber}
              side="buy"
            />
          );
        })}
      </Box>
      <Box>
        {buySell.sell.map((rate, index) => {
          const pm = popularPms?.find((pm) => pm?.code == rate?.fiat);
          const slug = pmsToSlug({ givePm: cryptoPm, getPm: pm });

          const fullSlug = slugCityToExchange(slug, citySlug);
          const currencyCode = getCurrencyCode(pm);
          const symbol = curToSymbol(currencyCode?.toUpperCase());
          const rateNumber = `${symbol ? `${symbol} ` : ""}${format(
            rate?.course,
            1,
          )}`;
          return (
            <RateLink
              key={String(rate?.exchangerId) + index + "sell"}
              slug={fullSlug}
              rateNumber={rateNumber}
              side="sell"
            />
          );
        })}
      </Box>
    </>
  );
};

export default CryptoRates;
