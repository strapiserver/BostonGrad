// import {
//   Button,
//   HStack,
//   Tag,
//   TagCloseButton,
//   TagLabel,
//   Wrap,
//   useColorModeValue,
//   Box,
// } from "@chakra-ui/react";
// import { useAppSelector, useAppDispatch } from "../../../../../redux/hooks";
// import {  triggerModal } from "../../../../../redux/mainReducer";
// import CustomModal from "../../../../shared/CustomModal";

// import MultipleCitiesContext from "./MultipleCitiesContext";
// import { useContext } from "react";
// import { FaMapMarkerAlt } from "react-icons/fa";
// import {
//   RegularBox,
//   ResponsiveButton,
// } from "../../../../../styles/theme/custom";
// import { AiOutlinePlus } from "react-icons/ai";
// import Arrow from "../../../../shared/Arrow";
// import { useRouter } from "next/router";
// import { useTranslation } from "next-i18next";
// import CountryList from "./CountryList";

// const Location = () => {
//   const { locale } = useRouter() as { locale: "en" | "ru" };
//   const { t } = useTranslation();
//   const locations = useAppSelector((state) => state.main.p2p.locations);
//   const location = useAppSelector((state) => state.main.location);
//   const citiesSelectedLength = useAppSelector(
//     (state) => state.main.p2p.locations.length || 0
//   );
//   const dispatch = useAppDispatch();
//   const cities = useAppSelector((state) => state.main.cities);

//   const isMultiple = useContext(MultipleCitiesContext);
//   const color = useColorModeValue("bg.600", "bg.200");

//   const SelectButton = () => (
//     <RegularBox
//       variant="contrast"
//       display="flex"
//       justifyContent="end"
//       position="absolute"
//       bottom="0"
//       left="0"
//       w="100%"
//       p="4"
//     >
//       <Button
//         zIndex="11"
//         variant={citiesSelectedLength > 0 ? "primary" : "contrast"}
//         onClick={() => dispatch(triggerModal(""))}
//       >
//         {`Select ${citiesSelectedLength || ""}`}
//       </Button>
//     </RegularBox>
//   );

//   const MultipleCities = () => (
//     <RegularBox p="2">
//       <HStack>
//         <ResponsiveButton
//           variant="default"
//           p="2"
//           onClick={() => dispatch(triggerModal("locations"))}
//           leftIcon={<AiOutlinePlus size="1rem" />}
//         >
//           Add City
//         </ResponsiveButton>
//         <Wrap w="80%">
//           {locations.map((l) => (
//             <Tag
//               size="sm"
//               key={l.code}
//               variant="outline"
//               colorScheme="bg"
//               mx="1"
//               onClick={() => dispatch(addLocation(l))}
//               cursor="pointer"
//             >
//               <TagLabel>{l[`${locale}_city_name`]}</TagLabel>
//               <TagCloseButton />
//             </Tag>
//           ))}
//         </Wrap>
//       </HStack>
//     </RegularBox>
//   );
//   if (!cities || !!cities.length) return <></>;
//   return (
//     <Box>
//       <CustomModal
//         id={isMultiple ? "locations" : "location"}
//         header={t("main:chooseCity")}
//       >
//         <>
//           <CountryList cityCodesList={cities} />
//           {isMultiple && <SelectButton />}
//         </>
//       </CustomModal>
//       {isMultiple ? (
//         <MultipleCities />
//       ) : (
//         <ResponsiveButton
//           variant="default"
//           color={color}
//           p="1"
//           mx="2"
//           leftIcon={<FaMapMarkerAlt size="1rem" />}
//           rightIcon={
//             // <Hide below="xs">
//             <Arrow isUp={false} />
//             // </Hide>
//           }
//           onClick={() => dispatch(triggerModal("location"))}
//         >
//           {location[`${locale}_city_name`] || "City"}
//         </ResponsiveButton>
//       )}
//     </Box>
//   );
// };

// export default Location;
