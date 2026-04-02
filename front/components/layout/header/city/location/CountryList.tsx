// import { Box, Grid, Text } from "@chakra-ui/react";
// import { ICityCodesList } from "../../../../../types/shared";
// import Country from "./Country";
// import { formatCityCodesList } from "./helper";
// import { useAppSelector } from "../../../../../redux/hooks";

// const CountryList = ({ cityCodesList }: { cityCodesList?: ICityCodesList }) => {
//   const highlightedCities = useAppSelector((state) =>
//     state.main.p2p.locations.map((l) => l.en_city_name)
//   );

//   if (!cityCodesList) return <></>;

//   const formattedCountryList = formatCityCodesList(cityCodesList);

//   const list = Object.values(formattedCountryList).sort((a, b) =>
//     a.en_name.localeCompare(b.en_name)
//   );

//   const threePartIndex = Math.ceil(list.length / 3);
//   const parts = [
//     list.splice(-threePartIndex),
//     list.splice(-threePartIndex),
//     list,
//   ].reverse();

//   return (
//     <Grid gridTemplateColumns="1fr 1fr 1fr" mt="4" p="4">
//       {parts.map((part, index) => (
//         <Box key={index}>
//           {part.map((country) => (
//             <Country
//               key={country.en_name}
//               country={country}
//               highlightedCities={highlightedCities}
//             />
//           ))}
//         </Box>
//       ))}
//     </Grid>
//   );
// };

// export default CountryList;
