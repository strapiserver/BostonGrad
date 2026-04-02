import {
  Box,
  Button,
  Divider,
  Grid,
  HStack,
  useColorMode,
  useColorModeValue,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { ResponsiveText } from "../../../styles/theme/custom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { FaStar } from "react-icons/fa";
import { capitalize } from "../../main/side/selector/section/PmGroup/helper";
import { addSpaces, localFormat, R } from "../../../redux/amountsHelper";
import { redirect } from "../../../redux/thunks";
import { IRate } from "../../../types/rates";
import { triggerModal } from "../../../redux/mainReducer";
import { GrCircleInformation } from "react-icons/gr";
import TopParameter from "./TopParameter";
import { useIsMobile } from "./hooks";
import Rating from "./Rating";
import CustomImage from "../../shared/CustomImage";
import { buildRateString, secondsAgo } from "../../shared/helper";

import Link from "next/link";
import ExchangerName from "../../shared/ExchangerNameRating";
import CustomModal from "../../shared/CustomModal";
import RateDetails from "./rateDetails";

const DesktopParameters = ({
  parameterCodes,
}: {
  parameterCodes?: string[];
}) => {
  if (!parameterCodes) return <></>;
  return (
    <HStack justifyContent="end" mb="1" alignSelf="end">
      {parameterCodes.map((code, i) => (
        <TopParameter
          isExtended={parameterCodes.length < 3}
          code={code}
          key={code + i}
        />
      ))}
    </HStack>
  );
};

const MobileParameters = ({
  parameterCodes,
}: {
  parameterCodes?: string[];
}) => {
  if (!parameterCodes) return <></>;
  return (
    <Grid
      position="absolute"
      bottom="1"
      right="1"
      alignItems="end"
      templateRows="repeat(2, 1fr)"
      gridAutoFlow="column"
      gap="1"
      dir="rtl"
      zIndex="1"
    >
      {parameterCodes.map((code, i) => (
        <TopParameter
          isExtended={false}
          code={code}
          key={code + i + "mobile"}
        />
      ))}
    </Grid>
  );
};
const ExchangerCard = ({ index, rate }: { index: number; rate: IRate }) => {
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  if (!rate) return <></>;

  const {
    display_name,
    name,
    course,
    min,
    max,
    ref_link,
    logo,
    last_time_updated,
  } = rate;
  const displayName = display_name || name || "";
  const displayNameShort =
    displayName.length > 15 ? `${displayName.slice(0, 15)}...` : displayName;
  const givePm = useAppSelector((state) => state.main.givePm);
  const getPm = useAppSelector((state) => state.main.getPm);
  const cityCode = useAppSelector((state) => state.main.city.codes[0]);

  const giveCur = givePm?.currency.code.toUpperCase() || "";
  const getCur = getPm?.currency.code.toUpperCase() || "";

  const side = course > 1 ? "give" : "get";
  const smallCur = side === "give" ? giveCur : getCur;
  const bigCur = side === "give" ? getCur : giveCur;
  const bgColor = useColorModeValue("bg.10", "bg.700");
  const [MIN, MAX] =
    min?.[side] && max?.[side] ? [R(min[side], 2), R(max[side], 2)] : [0, 0];

  const handleInfoClick = (event: any) => {
    event?.stopPropagation();
    dispatch(triggerModal(`details_${displayName}`));
  };

  return (
    <VStack
      alignItems="start"
      position="relative"
      py="1"
      px="2"
      gap="0"
      justifyContent="space-between"
      h="100%"
      w="100%"
      borderRadius="inherit"
      bgColor={bgColor}
      //filter="none"
      // transition="filter 200ms linear"
      // _hover={{
      //   filter: "brightness(1.05)",
      // }}
      cursor="pointer"
      onClick={(e) => {
        handleInfoClick(e);
      }}
      // bgColor removed for test
    >
      <CustomModal id={`details_${displayName}`} header="Условия обмена">
        <RateDetails rate={rate} />
      </CustomModal>
      <Box w="100%">
        <HStack justifyContent={isMobile ? "start" : "space-between"}>
          <HStack w="100%" justifyContent="space-between">
            <ExchangerName
              name={displayNameShort}
              logo={logo}
              admin_rating={rate.admin_rating}
            />
          </HStack>
        </HStack>
        <Box mt="1">
          <ResponsiveText size="sm">
            {`Курс: ${buildRateString({ course, giveCur, getCur })}`}
          </ResponsiveText>
          <ResponsiveText size="xs" variant="no_contrast">
            {`Лимиты: ${localFormat(MIN, smallCur)} — ${localFormat(
              MAX,
              smallCur
            )}`}
          </ResponsiveText>
        </Box>
      </Box>
      <MobileParameters parameterCodes={rate.parameterCodes} />
      {/* {isMobile ? (
        <MobileParameters parameterCodes={rate.parameterCodes} />
      ) : (
        <DesktopParameters parameterCodes={rate.parameterCodes} />
      )} */}
    </VStack>
  );
};
export default ExchangerCard;
