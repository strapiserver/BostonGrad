import { useCallback, useMemo } from "react";
import useSWR from "swr";
import { IPmPairs } from "../../../../types/exchange";
import { initParserFetcher } from "../../../../services/fetchers";
import { format } from "../../../../redux/amountsHelper";
import { buildRateString } from "../../../shared/helper";

type RateData = { amountOfCourses: number; rateText: string };

const CHUNK_SIZE = 2;

export const useDirRates = (pairs: IPmPairs[]) => {
  const fetcher = useMemo(() => initParserFetcher(), []);

  const dirCodes = useMemo(() => {
    const codes = pairs
      .map((pair) =>
        pair?.givePm?.code && pair?.getPm?.code
          ? `${pair.givePm.code}_${pair.getPm.code}`
          : null
      )
      .filter((code): code is string => Boolean(code));

    return Array.from(new Set(codes));
  }, [pairs]);

  const fetchRates = useCallback(
    async (codes: string[]) => {
      const rateMap: Record<string, [number, number]> = {};

      for (let i = 0; i < codes.length; i += CHUNK_SIZE) {
        const chunk = codes.slice(i, i + CHUNK_SIZE);
        if (!chunk.length) continue;

        const response = (await fetcher(`similar/dirs=${chunk.join(",")}`)) as
          | [number, number][]
          | null;

        if (Array.isArray(response)) {
          response.forEach((entry, idx) => {
            if (entry) rateMap[chunk[idx]] = entry;
          });
        }
      }

      return rateMap;
    },
    [fetcher]
  );

  const { data: rateMap } = useSWR(
    dirCodes.length ? ["article-dir-rates", dirCodes.join(",")] : null,
    () => fetchRates(dirCodes)
  ) as { data?: Record<string, [number, number]> };

  const renderRate = useCallback(
    (pair: IPmPairs, [course, amountOfCourses]: [number, number]) => {
      const [giveCur, getCur] = [
        pair.givePm?.currency.code.toUpperCase(),
        pair.getPm?.currency.code.toUpperCase(),
      ];
      if (!giveCur || !getCur) return null;

      return {
        amountOfCourses,
        rateText: buildRateString({ course, giveCur, getCur }),
      } as RateData;
    },
    []
  );

  const getRateData = useCallback(
    (pair: IPmPairs) => {
      const pairCode =
        pair?.givePm?.code && pair?.getPm?.code
          ? `${pair.givePm.code}_${pair.getPm.code}`
          : null;
      if (!pairCode || !rateMap) return null;
      const rateEntry = rateMap[pairCode];
      if (!rateEntry) return null;
      return renderRate(pair, rateEntry);
    },
    [rateMap, renderRate]
  );

  return { getRateData };
};

export type GetRateDataFn = ReturnType<typeof useDirRates>["getRateData"];
