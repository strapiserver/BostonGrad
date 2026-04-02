// import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// import { IPm } from "../types/selector";
// import React from "react";
// import Exchange from "../components/exchange";
// import { ICache, ICity, IDirText, IPmData } from "../types/exchange";

// import { ISEO } from "../types/general";
// import { nullSeo } from "../components/shared/UniversalSeo";
// import { getSlugToCodes } from "../cache/helper";
// import {
//   loadPms,
//   loadPossibleDirs,
//   loadCities,
//   loadArticleCodes,
//   loadDirsTexts,
//   loadPmLayouts,
//   loadCustomDirText,
// } from "../cache/loadX";
// import { C } from "@upstash/redis/zmscore-CgRD7oFR";
// import {
//   exchangeToSlugCity,
//   findSimilarPmPairs,
//   generateTitle,
//   slugCityToExchange,
// } from "../lib/exchangeHelper";

// const prerenderCountries = ["ukraine", "russia", "belarus"];

// const ExchangePage = (props: {
//   //article?: IArticle | null;
//   //cities: ICity[];
//   //possiblePairs: { [key: string]: string[] };
//   seo: ISEO;
//   givePmData: IPmData | null;
//   getPmData: IPmData | null;
//   locale: "en" | "ru";
//   slug: string | null;
//   dirText: IDirText | null;
//   city: ICity | null;
//   similarPmPairs: [IPm,IPm][] | null;
//   donorCity: ICity | null;
// }) => {
//   return <Exchange {...props} />;
// };

// export async function getStaticProps({
//   locale,
//   params,
// }: {
//   locale: "en" | "ru";
//   params: { exchange: string };
// }) {
//   try {
//     const { exchange } = params;
//     const [slug, cityParam] = exchangeToSlugCity(exchange);
//     const isCash =
//       (slug && slug.startsWith("cash-")) || slug.includes("-cash-");

//     const [pms, possiblePairs, cities, articleCodes, customDirText] =
//       await Promise.all([
//         loadPms(),
//         loadPossibleDirs(),
//         isCash ? loadCities() : null,
//         loadArticleCodes(),
//         loadCustomDirText(locale, slug),
//       ]);

//     const slugToCodes = getSlugToCodes(possiblePairs, pms);

//     if (!pms || !Array.isArray(pms)) {
//       console.error("[getStaticProps] 'pms' is missing or invalid.");
//       return { notFound: true };
//     }
//     const dir = slugToCodes?.[slug];
//     const [giveCode, getCode] = dir?.split("_") ?? [];
//     const givePm = pms?.find((pm) => pm.code === giveCode) ?? null;
//     const getPm = pms?.find((pm) => pm.code === getCode) ?? null;
//     if (!dir || !givePm || !getPm) {
//       console.error("[getStaticProps] Invalid direction or PM data.");
//       return { notFound: true };
//     }

//     const similarPmPairs = findSimilarPmPairs(
//       givePm,
//       getPm,
//       pms,
//       Object.values(slugToCodes)
//     );
//     // обработка городов
//     const city = cityParam
//       ? cities?.find(
//           (c) => c.en_name?.toLowerCase() === cityParam.toLowerCase()
//         ) || null
//       : null;
//     // if (!cities || !Array.isArray(cities)) {
//     //   console.error("[getStaticProps] 'cities' is missing or invalid.");
//     //   return { notFound: true };
//     // }
//     // города доноры это те, у которых нет курса по нарпавлению но есть в соседнем
//     // const donorName =
//     //   (city?.en_name && donors?.[dir]?.[city.en_name]) || null;
//     // const donorCity =
//     //   (donorName &&
//     //     cities?.find(
//     //       (c) => c.en_name?.toLowerCase() === donorName.toLowerCase()
//     //     )) ||
//     //   null;
//     // обработка текстов

//     // первое : достаем коробки описания секций пм, это также ссылки на артиклы пм
//     // и втрое : достаем шаблоны для направления с местами для вставки

//     // const dirText =
//     //   dirTexts?.find(
//     //     (text) =>
//     //       text?.section_give == givePm?.section &&
//     //       text?.section_get == getPm?.section
//     //   ) || null;
//     // //если есть текст для направления - внедряем
//     // const dirTextFetcher = initCMSFetcher();
//     // const textBoxes = (await dirTextFetcher(TextBoxQuery, {
//     //   locale,
//     //   key: dir.toUpperCase(),
//     // })) as ITextBox[];
//     // if (dirText && textBoxes?.length && textBoxes[0]?.text) {
//     //   dirText.text = enrichText(textBoxes[0]?.text, articleCodes, pms, locale);
//     // }
//     let [giveExists, getExists] = [false, false];
//     if (articleCodes.length) {
//       giveExists = !!articleCodes?.find(
//         (code) => code?.toUpperCase() == givePm.en_name.toUpperCase()
//       );
//       getExists = !!articleCodes?.find(
//         (code) => code?.toUpperCase() == getPm.en_name.toUpperCase()
//       );
//     }
//     const givePmData = {
//       pm: givePm,
//       exists: giveExists,
//       // possiblePairs: possiblePairs[givePm.code],
//     } as IPmData;
//     const getPmData = {
//       pm: getPm,
//       exists: getExists,
//       // possiblePairs: possiblePairs[getPm.code],
//     } as IPmData;
//     const title1 = generateTitle({
//       locale,
//       givePm,
//       getPm,
//     });
//     const giveCur = givePm.currency.code.toUpperCase();
//     const getCur = getPm.currency.code.toUpperCase();
//     let [description, cityAddon, site_name] = ["", "", ""];
//     if (locale == "ru") {
//       description = `Обмен ${givePm.ru_name || givePm.en_name} ${giveCur} ${
//         givePm.subgroup_name || ""
//       } на ${getPm.ru_name || getPm.en_name} ${getCur}`;
//       if (city) cityAddon = ` в ${city.ru_name}, ${city.ru_country_name}`;
//       site_name = `${process.env.NEXT_PUBLIC_NAME} мониторинг обменников`;
//     } else {
//       if (city) cityAddon = ` в ${city.en_name}, ${city.en_country_name}`;
//       description = `Exchange ${givePm.en_name} ${giveCur} ${
//         givePm.subgroup_name || ""
//       } for ${getPm.en_name} ${getCur}`;
//       site_name = `${process.env.NEXT_PUBLIC_NAME} Exchange Monitoring`;
//     }
//     const seo = {
//       title: title1,
//       description: description + cityAddon,
//       canonicalPath: `${locale}/${slugCityToExchange(slug, city?.en_name)}`,
//       locale,
//       alternateLangs: [
//         {
//           rel: "alternate",
//           hrefLang: "en",
//           href: `https://${
//             process.env.NEXT_PUBLIC_NAME
//           }.com/en/${slugCityToExchange(slug, city?.en_name)}`,
//         },
//         {
//           rel: "alternate",
//           hrefLang: "ru",
//           href: `https://${
//             process.env.NEXT_PUBLIC_NAME
//           }.com/ru/${slugCityToExchange(slug, city?.en_name)}`,
//         },
//       ],
//       breadcrumbs: [
//         {
//           position: 1,
//           name: locale === "en" ? "Home" : "Главная",
//           item: `https://${process.env.NEXT_PUBLIC_NAME}.com/${locale}`,
//         },
//         {
//           position: 2,
//           name: title1,
//           item: `https://${
//             process.env.NEXT_PUBLIC_NAME
//           }.com/${locale}/${slugCityToExchange(slug, city?.en_name)}`,
//         },
//       ],
//     };
//     return {
//       props: {
//         locale,
//         seo: seo || nullSeo,
//         slug: slug || null,
//         cities: cities || null,
//         givePmData: givePmData || null,
//         getPmData: getPmData || null,
//         dirText: dirText || null,
//         city: city || null,
//         similarPmPairs: similarPmPairs || null,
//         //donorCity: donorCity || null,
//         ...(await serverSideTranslations(locale || "ru", ["main"])),
//       },
//       revalidate: 2400,
//     };
//   } catch (e) {
//     console.error(e);
//     return {
//       props: {
//         locale,
//         seo: nullSeo,
//         slug: null,
//         cities: null,
//         givePmData: null,
//         getPmData: null,
//         dirText: null,
//         city: null,
//         similarPmPairs: null,
//         donorCity: null,
//         ...(await serverSideTranslations(locale || "ru", ["main"])),
//       },
//       revalidate: 2400,
//     };
//   }
// }

// //.....................................................................................................
// //.....................................................................................................
// //.....................................................................................................
// //.....................................................................................................
// //.....................................................................................................

// export async function getStaticPaths() {
//   const locales = ["en", "ru"];

//   const [
//     pms,
//     possiblePairs,
//     cities,
//     dirTextsRu,
//     dirTextsEn,
//     articleCodes,
//   ] = await Promise.all([
//     loadPms(),
//     loadPossibleDirs(),
//     loadCities(),
//     loadDirsTexts("ru"),
//     loadDirsTexts("en"),
//     loadArticleCodes(),
//   ]);

//   const slugToCodes = getSlugToCodes(possiblePairs, pms);

//   if (!slugToCodes || !cities) {
//     console.error(
//       "[getStaticPaths] 'slugToCodes' or 'cities' is missing or invalid."
//     );
//     return {
//       paths: [],
//       fallback: "blocking",
//     };
//   }

//   const allPaths = Object.keys(slugToCodes).reduce(
//     (
//       res: {
//         params: { exchange: string };
//         locale: string;
//       }[],
//       slug: string
//     ) => [
//       ...res,
//       ...locales.map((locale) => ({
//         params: { exchange: slug },
//         locale,
//       })),
//     ],
//     []
//   );

//   // const parserFetcher = initParserFetcher();
//   // const nonEmpty = (await parserFetcher(`non_empty_cities`)) as {
//   //   [key: string]: { [key: string]: number };
//   // };

//   // if (!nonEmpty) {
//   //   console.error("[getStaticPaths] nonEmpty data is missing or invalid.");
//   //   return {
//   //     paths: [],
//   //     fallback: "blocking",
//   //   };
//   // }

//   // const nonEmptyCities = new Set(
//   //   Object.keys(nonEmpty).map((key) => key.toLowerCase())
//   // );

//   // const tryDonor = (city: ICity) =>
//   //   city.closest_cities?.find((c) =>
//   //     nonEmptyCities.has(c.en_name.toLowerCase())
//   //   )?.en_name;

//   // let donors = {} as IDonors;

//   // await Promise.all(
//   //   cities.map(async (city) => {
//   //     Object.entries(slugToCodes).forEach(([slug, dir]) => {
//   //       // если направление не кэш или город имеет меньше 2 курсов  - скипаем его
//   //       if (!(slug.startsWith("cash-") || slug.includes("-cash-"))) return;
//   //       const rateIsEmpty = nonEmpty?.[city?.en_name.toLowerCase()]?.[dir] < 2;
//   //       const donorName = tryDonor(city);
//   //       if (rateIsEmpty && !donorName) return;
//   //       if (rateIsEmpty && donorName && dir) {
//   //         donors[dir] = donors[dir] || {};
//   //         donors[dir][donorName] = city.en_name;
//   //       }

//   //       locales.forEach((locale) => {
//   //         allPaths.push({
//   //           params: {
//   //             exchange: `${slug}-in-${[city.en_name.toLowerCase()]}`,
//   //           },
//   //           locale,
//   //         });
//   //       });
//   //     });
//   //   })
//   // );

//   //writeCache({ ...cachedData, donors });

//   const needPrerender = (exchangePath: string) => {
//     if (!exchangePath.includes("-in-")) return true; // dont prerender cities
//     const city = cities?.find((city) =>
//       exchangePath.includes(city.en_name.toLowerCase())
//     );
//     if (!city) {
//       console.warn(
//         "[getStaticPaths] City not found for exchangePath:",
//         exchangePath
//       );
//     }
//     const countryName = city?.en_country_name?.toLowerCase();
//     // пререндерим крупные города и определенные страны
//     return (
//       city &&
//       countryName &&
//       city?.population > 3 &&
//       prerenderCountries.includes(countryName)
//     );
//   };

//   const paths = allPaths.filter((p) => needPrerender(p.params.exchange));

//   // далее кешируем все направления

//   // ПУТИ ЕСТЬ ПОЛНЫЕ ДЛЯ САЙТМАП, А  ЕСТЬ ДЛЯ ПРЕРЕНДЕРИНГА
//   return {
//     paths: paths.slice(
//       0,
//       process.env.NEXT_PUBLIC_PRERENDER_LIMIT
//         ? Number(process.env.NEXT_PUBLIC_PRERENDER_LIMIT)
//         : 10000
//     ),
//     fallback: "blocking", // Use "blocking" to dynamically generate pages on demand
//   };
// }

// export default ExchangePage;
