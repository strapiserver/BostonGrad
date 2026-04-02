import type { NextApiRequest, NextApiResponse } from "next";
import { redisGet } from "../../cache/redisClient";
import {
  loadPms,
  loadPossibleDirs,
  limitedPossibleDirs,
  loadExchangers,
  loadCities,
} from "../../cache/loadX";
import { getSlugToCodes } from "../../cache/helper";
import { generateExchangeH1 } from "../../components/exchange/helper";
import { exchangerNameToSlug } from "../../components/exchangers/helper";

type SearchIndexEntry = {
  slug: string;
  header: string;
  wordsToSearchFrom: string;
};

type SearchIndexCache = {
  data: SearchIndexEntry[];
  updatedAt: string | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end();

  const cached =
    ((await redisGet("search:index")) as SearchIndexCache | null) || {
      data: [],
      updatedAt: null,
    };

  try {
    const cachedData = Array.isArray(cached.data) ? cached.data : [];

    const [dirs, pms, exchangers, cities] = await Promise.all([
      loadPossibleDirs(),
      loadPms(),
      loadExchangers(),
      loadCities(),
    ]);
    const exchangeEntries: SearchIndexEntry[] = [];
    if (dirs && Array.isArray(pms) && pms.length) {
      const limitedDirs = limitedPossibleDirs(dirs, "low");
      const slugToCodes = getSlugToCodes(limitedDirs, pms);
      const pmByCode = new Map(
        pms.map((pm) => [pm.code.toUpperCase(), pm])
      );

      for (const [slug, codes] of Object.entries(slugToCodes)) {
        const [giveCode, getCode] = codes.split("_");
        const givePm = pmByCode.get(giveCode);
        const getPm = pmByCode.get(getCode);
        if (!givePm || !getPm) continue;

        const header = generateExchangeH1(givePm, getPm, null, {
          articleCodes: [],
          cityPageExists: false,
        });
        const wordsToSearchFrom = [
          givePm.en_name,
          givePm.ru_name,
          givePm.currency?.code,
          givePm.subgroup_name,
          getPm.en_name,
          getPm.ru_name,
          getPm.currency?.code,
          getPm.subgroup_name,
        ]
          .filter(Boolean)
          .join(" ");

        exchangeEntries.push({
          slug,
          header,
          wordsToSearchFrom,
        });
      }
    }

    const exchangerEntries: SearchIndexEntry[] = Array.isArray(exchangers)
      ? exchangers
          .filter((ex) => ex?.name)
          .map((ex) => {
            const displayName = ex.display_name || ex.name;
            return {
              slug: `exchangers/${exchangerNameToSlug(ex.name)}`,
              header: `Обменник ${displayName}`,
              wordsToSearchFrom: `${displayName} ${ex.name}`,
            };
          })
      : [];

    const cityEntries: SearchIndexEntry[] = Array.isArray(cities)
      ? cities
          .filter((city) => city?.en_name || city?.ru_name)
          .map((city) => {
            const citySlug = (city.en_name || city.ru_name || "")
              .toLowerCase()
              .replace(/\s+/g, "-")
              .trim();
            const cityName = city.ru_name || city.en_name || "Город";
            const wordsToSearchFrom = [
              city.en_name,
              city.ru_name,
              city.en_country_name,
              city.ru_country_name,
              citySlug,
            ]
              .filter(Boolean)
              .join(" ");
            return {
              slug: `map/${citySlug}`,
              header: cityName,
              wordsToSearchFrom,
            };
          })
      : [];

    const mergedMap = new Map<string, SearchIndexEntry>();
    for (const entry of cachedData) {
      if (!entry?.slug) continue;
      mergedMap.set(entry.slug, entry);
    }
    for (const entry of exchangeEntries) {
      if (!entry?.slug || mergedMap.has(entry.slug)) continue;
      mergedMap.set(entry.slug, entry);
    }
    for (const entry of exchangerEntries) {
      if (!entry?.slug || mergedMap.has(entry.slug)) continue;
      mergedMap.set(entry.slug, entry);
    }
    for (const entry of cityEntries) {
      if (!entry?.slug || mergedMap.has(entry.slug)) continue;
      mergedMap.set(entry.slug, entry);
    }

    const combinedData: SearchIndexEntry[] = Array.from(mergedMap.values());

    return res.status(200).json({
      data: combinedData,
      updatedAt: cached.updatedAt ?? null,
    });
  } catch (error) {
    console.error("[search-index] Failed to load search index:", error);
    return res.status(200).json(cached);
  }
}
