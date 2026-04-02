// import { Divider, Flex } from "@chakra-ui/react";
// import { IMaker } from "../../../../types/p2p";
// import { FormatedDate } from "../../../shared/BoxWrapper";
// import { ResponsiveText } from "../../../../styles/theme/custom";
// import StatItem from "./StatItem";
// import { FaListUl, FaRegHandshake } from "react-icons/fa6";
// import { TbPencil } from "react-icons/tb";
// import { MdOutlineDateRange } from "react-icons/md";
// import { RiExchange2Line } from "react-icons/ri";

// export default function MakerStats({ maker }: { maker: IMaker }) {
//   const offers = Array.isArray(maker.offers) ? maker.offers : null;
//   const reviews = Array.isArray(maker.reviews) ? maker.reviews : null;
//   const offersCount = offers ? offers.length : null;
//   const activeOffersCount = offers
//     ? offers.filter((offer) => offer?.isActive).length
//     : null;
//   const reviewsCount = reviews ? reviews.length : null;

//   const formattedDate = maker.createdAt
//     ? new Intl.DateTimeFormat("ru-RU", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//       }).format(new Date(maker.createdAt))
//     : "";

//   return (
//     <Flex
//       flexDir={{ base: "column", lg: "row" }}
//       color="bg.500"
//       justifyContent="space-between"
//       w="100%"
//       gap="4"
//       px="2"
//     >
//       <StatItem
//         label="Предложений"
//         value={offersCount}
//         Icon={RiExchange2Line}
//       />
//       <ResponsiveText display={{ base: "none", lg: "flex" }} variant="shaded">
//         •
//       </ResponsiveText>
//       <StatItem label="Сделок" value={0} Icon={FaRegHandshake} />
//       <ResponsiveText display={{ base: "none", lg: "flex" }} variant="shaded">
//         •
//       </ResponsiveText>
//       <StatItem label="Отзывов" value={reviewsCount} Icon={TbPencil} />
//       <ResponsiveText display={{ base: "none", lg: "flex" }} variant="shaded">
//         •
//       </ResponsiveText>

//       <StatItem
//         label="Создан"
//         value={formattedDate}
//         Icon={MdOutlineDateRange}
//       />
//     </Flex>
//   );
// }
