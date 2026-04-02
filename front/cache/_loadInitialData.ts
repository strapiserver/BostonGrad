// import {
//   ICity,
//   IPossiblePmPair,
//   IDirText,
//   ICache,
//   ILocalData,
// } from "../types/exchange";
// import { IExchanger, IParserExchanger } from "../types/exchanger";
// import { ISelector, IPmGroup, ISection, IPm } from "../types/selector";
// import { initCMSFetcher, initParserFetcher } from "../services/fetchers";
// import {
//   selectorQuery,
//   citiesQuery,
//   dirsTextQuery,
//   exchangersQuery,
//   articleCodesQuery,
//   blogQuery,
//   articleQuery,
//   MainTextsQuery,
//   TextBoxQuery,
//   exchangerQuery,
// } from "../services/initialQueries";

// import { IArticle, IMainText, ITextBox } from "../types/pages";

// import { getPmsFromSelector, getSlugToCodes, mergeExchangers } from "./helper";

// import { readCacheItem, writeCacheItem } from ".";

// // FETCHERS

// const parserFetcher = initParserFetcher();
// const cmsFetcher = initCMSFetcher();

// type FetchKey = string;

// // кешируем только при билде, чтобы не грузить лишний раз
// const memoryCache = {} as any;
// const isBuildTime = process.env.BUILD_CACHE === "true";

// export const safeFetch = async <T>(
//   key: FetchKey,
//   fetcher: () => Promise<T>
// ): Promise<T> => {
//   // Skip cache if not build time
//   if (!isBuildTime) {
//     try {
//       return await fetcher();
//     } catch (e) {
//       console.error(`Failed to fetch ${key}:`, e);
//       return {} as T;
//     }
//   }

//   // Use in-memory cache
//   if (memoryCache[key]) {
//     return memoryCache[key] as T;
//   }

//   // Use disk cache if available
//   const cachedData = readCacheItem(key);
//   if (cachedData) {
//     memoryCache[key] = cachedData;
//     return cachedData;
//   }

//   // Fetch fresh data and cache it
//   try {
//     const data = await fetcher();
//     memoryCache[key] = data;
//     writeCacheItem(key, data);
//     return data;
//   } catch (e) {
//     console.error(`Failed to fetch ${key}:`, e);
//     return {} as T;
//   }
// };

// export const loadRootText = async (locale: "en" | "ru") =>
//   await safeFetch("root_text", async () => {
//     const textBoxes = await cmsFetcher(TextBoxQuery, { locale, key: "root" });
//     return textBoxes[0] || null;
//   });
// export const loadMainTexts = async (locale: "en" | "ru") =>
//   await safeFetch("main_texts", async () => {
//     const mainTexts = await cmsFetcher(MainTextsQuery, { locale });
//     return mainTexts || null;
//   });

// export const loadParserExchangers = () =>
//   safeFetch("exchangers", () => parserFetcher("exchangers"));

// export const loadDirsTexts = () =>
//   safeFetch("dirsTexts", () => cmsFetcher(dirsTextQuery)) as Promise<
//     IDirText[]
//   >;

// export const loadArticleCodes = async () => {
//   const articleCodes = (await safeFetch("articleCodes", () =>
//     cmsFetcher(articleCodesQuery)
//   )) as Promise<{ id: undefined; code: string }[]>;
//   return (await articleCodes).map((res) => res.code);
// };

// export const loadBlog = () =>
//   safeFetch("articles", () => cmsFetcher(blogQuery)) as Promise<IArticle[]>;

// export const loadArticle = (code: string, locale: "en" | "ru") =>
//   safeFetch(`article_${code}_${locale}`, () =>
//     cmsFetcher(articleQuery, { code, locale })
//   ) as Promise<IArticle[]>;

// export const loadPossibleDirs = () =>
//   safeFetch("possible_pairs", () => parserFetcher("possible_pairs")) as Promise<
//     Record<string, string[]>
//   >;
// export const loadPms = async () => {
//   const selector = (await safeFetch("selector", () =>
//     cmsFetcher(selectorQuery)
//   )) as ISelector;
//   const pms = getPmsFromSelector(selector);
//   return pms;
// };

// export const loadExchanger = async (
//   name: string
// ): Promise<IExchanger | null> => {
//   const exchanger = (await safeFetch(`exchanger_${name}`, async () =>
//     cmsFetcher(exchangerQuery, { name })
//   )) as Promise<IExchanger[]>;
//   return (await exchanger)[0];
// };

// export const loadExchangers = async () => {
//   const [cmsExchangers, parserExchangers] = await Promise.all([
//     safeFetch("cms_exchangers", () => cmsFetcher(exchangersQuery)) as Promise<
//       IExchanger[]
//     >,
//     safeFetch("parser_exchangers", () =>
//       parserFetcher("exchangers")
//     ) as Promise<Record<string, IParserExchanger>>,
//   ]);
//   const exchangers = mergeExchangers(cmsExchangers, parserExchangers);
//   return exchangers;
// };

// export const loadCities = () =>
//   safeFetch("cities", async () => {
//     const parserSettings = (await cmsFetcher(citiesQuery)) as {
//       cities: ICity[] | null;
//     };
//     return parserSettings?.cities;
//   }) as Promise<ICity[]>;

// export const fetchDirsTexts = async (
//   locale: "en" | "ru"
// ): Promise<IDirText[]> => {
//   const fetcher = initCMSFetcher();
//   const dirsTextsRes = await fetcher(dirsTextQuery, { locale });
//   return dirsTextsRes as IDirText[];
// };
// //// SELECTORS

// export const emptyProps = (locale: "en" | "ru") => ({
//   pm: null,
//   locale,
//   article: null,
//   otherDirs: null,
// });
