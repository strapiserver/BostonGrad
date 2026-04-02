// import {
//   ICityCodesList,
//   IFormattedCountry,
// } from "./../../../../../types/shared";

// export const popularCountryNames = {
//   russia: "xl",
//   turkey: "md",
//   ukraine: "lg",
//   belarus: "lg",
//   kazakhstan: "md",
//   azerbaijan: "md",
//   armenia: "md",
//   uzbekistan: "md",
// };

// export const popularCityNames = {
//   "saint petersburg": "lg",
//   moscow: "xl",
//   minsk: "xl",
//   kyiv: "xl",
//   kharkiv: "lg",
//   istanbul: "md",
// };

// export const formatCityCodesList = (
//   cityCodesList: ICityCodesList
// ): { [key: string]: IFormattedCountry } => {
//   return Object.entries(cityCodesList).reduce(
//     (
//       formattedCountryList: { [key: string]: IFormattedCountry },
//       [code, [ruCityCountry, enCityCountry]]
//     ) => {
//       const [ruCityName, ruCountryName] = ruCityCountry.split(", ");
//       const [enCityName, enCountryName] = enCityCountry.split(", ");
//       const city = { ru_name: ruCityName, en_name: enCityName, code };
//       const countryExists = formattedCountryList[enCountryName];
//       if (countryExists) {
//         return {
//           ...formattedCountryList,
//           [enCountryName]: {
//             ...countryExists,
//             cities: [...countryExists.cities, city].sort((a, b) =>
//               a.en_name.localeCompare(b.en_name)
//             ),
//           },
//         };
//       }
//       const country = {
//         en_name: enCountryName,
//         ru_name: ruCountryName,
//         cities: [{ ru_name: ruCityName, en_name: enCityName, code }],
//       } as IFormattedCountry;
//       return { ...formattedCountryList, [enCountryName]: country };
//     },
//     {}
//   );
// };
//  TURN THIS
// {
//   "AKT": [
//     "Актобе, Казахстан",
//     "Aktobe, Kazakhstan"
//   ],
// }
//  INTO THIS
// { Kazakhstan:
//   { cities: [{
//     ru_name: Актобе
//     en_name: Aktobe
//     code: AKT
//   }],
//   ru_name: Казахстан
//   en_name: Kazakhstan }
// }

// export const formatCities = (
//   languageIndex: number,
//   citiCodes: string[],
//   cityList: ICityCodesList
// ) => {
//   return citiCodes.reduce(
//     (accumulator: { [key: string]: string[] }, cityCode: string) => {
//       let [city, country] = cityList[cityCode]
//         ? cityList[cityCode][languageIndex].split(",")
//         : [null, null];
//       if (city && country) {
//         country = country.replace(" ", "");
//         accumulator[country] = accumulator[country]
//           ? [...accumulator[country], city]
//           : [city];
//       }
//       return accumulator;
//     },
//     {}
//   );
// };
