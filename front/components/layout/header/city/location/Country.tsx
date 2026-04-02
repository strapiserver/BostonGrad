// import { Box, Text, Collapse, Highlight } from "@chakra-ui/react";
// import { useContext, useState } from "react";
// import { batch } from "react-redux";
// import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
// import Link from "next/link";
// import {
//   addLocation,
//   setCity,
//   triggerModal,
// } from "../../../../../redux/mainReducer";
// import { RegularBox } from "../../../../../styles/theme/custom";
// import { ICity, IFormattedCountry } from "../../../../../types/shared";
// import { popularCityNames, popularCountryNames } from "./helper";
// import MultipleCitiesContext from "./MultipleCitiesContext";
// import { useRouter } from "next/router";
// import { slugCityToExchange } from "../../../../exchange/helper";

// import { pmsToSlug } from "../../../../main/side/selector/section/PmGroup/helper";

// const Country = ({
//   country,
//   highlightedCities,
// }: {
//   country: IFormattedCountry;
//   highlightedCities: string[];
// }) => {
//   const [opened, setOpened] = useState(false);
//   const { locale } = useRouter();
//   const slug = useAppSelector((state) =>
//     pmsToSlug({ givePm: state.main.givePm, getPm: state.main.getPm })
//   );
//   const countryName = country.en_name.toLowerCase() as
//     | keyof typeof popularCountryNames;
//   const isPopular = popularCountryNames?.[countryName] || "";

//   const dispatch = useAppDispatch();

//   const isMultiple = useContext(MultipleCitiesContext);
//   const handleChooseCity = (city: ICity) => {
//     const location = {
//       en_city_name: city.en_name,
//       ru_city_name: city.ru_name,
//       en_country_name: country.en_name,
//       ru_country_name: country.ru_name,
//       code: city.code,
//     };
//     isMultiple
//       ? dispatch(addLocation(location))
//       : batch(() => {
//           dispatch(setCity(location));
//           dispatch(triggerModal(undefined));
//         });
//   };
//   return (
//     <Box>
//       <Text
//         my="1"
//         fontWeight={isPopular ? "bold" : "normal"}
//         fontSize={isPopular}
//         variant={isPopular ? "extra_contrast" : "contrast"}
//         cursor="pointer"
//         onClick={() => setOpened(!opened)}
//       >
//         {country[`${locale as "en" | "ru"}_name`]}
//       </Text>
//       <Collapse in={opened}>
//         {country.cities.map((city) => {
//           const popularCityName =
//             city.en_name.toLowerCase() as keyof typeof popularCityNames;
//           const isPopular = popularCityNames?.[popularCityName] || "";
//           const selected = highlightedCities.find((c) => c == city.en_name);

//           //const bullet = !isMultiple ? "" : selected ? "•" : "◦";
//           return (
//             <Link href={`/${slugCityToExchange(slug, city.en_name)}`} passHref>
//               <Text
//                 ml="1"
//                 key={city.code}
//                 cursor="pointer"
//                 fontWeight={isPopular ? "bold" : "normal"}
//                 fontSize={isPopular}
//                 variant={
//                   selected ? "primary" : isPopular ? "constrast" : "no_contrast"
//                 }
//                 onClick={() => handleChooseCity(city)}
//               >
//                 {city[`${locale as "en" | "ru"}_name`]}
//               </Text>
//             </Link>
//           );
//         })}
//       </Collapse>
//     </Box>
//   );
// };

// export default Country;
