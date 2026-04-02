import React from "react";
import { Box3D } from "../../../../../styles/theme/custom";
import {
  Box,
  Button,
  Collapse,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Input,
  Select,
  SimpleGrid,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import { BsArrowRightShort } from "react-icons/bs";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { batch, shallowEqual } from "react-redux";
import DirectionPmButton from "./directionPmButton";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import DeleteOffer from "./DeleteOffer";
import OfferCourse from "./course";
import OfferLimit from "./limits/OfferLimitInput";
import { fetchP2POfferCourseRates } from "../../../../../redux/thunks";
import {
  setP2PDirectionPm,
  setP2PFullOfferField,
} from "../../../../../redux/mainReducer";
import { powerOfTenOrder } from "../../../../../redux/amountsHelper";
import { IFullOffer, IMakerOffer } from "../../../../../types/p2p";
import OfferLimitSlider from "./limits/OfferLimitSlider";
import Chart from "../../../../exchange/Chart";
import RightOptions from "./rightOptions/FollowMarket";
import OfferLimits from "./limits";
import OfferFee from "./fee";
import OfferExplanation from "./OfferExplanation";
import OfferParameters from "./OfferParameters";

type Props = {
  index: number;
  opened: number;
  setOpened: React.Dispatch<React.SetStateAction<number>>;
  handleExpand: (event: React.MouseEvent, index: number) => void;
  initialOffer?: Partial<IFullOffer>;
};

const Offer = ({
  index,
  opened,
  setOpened,
  handleExpand,
  initialOffer,
}: Props) => {
  const dispatch = useAppDispatch();
  const storeOffer = useAppSelector(
    (state) => state.main.p2pFullOffers[index],
    shallowEqual,
  );
  const fullOffer = React.useMemo(
    () => ({
      ...(initialOffer || {}),
      ...(storeOffer || {}),
      index,
    }),
    [initialOffer, storeOffer, index],
  );

  React.useEffect(() => {
    if (!initialOffer) return;
    if (storeOffer && Object.keys(storeOffer).length) return;
    batch(() => {
      const seedFields: Array<{
        field: keyof Omit<IMakerOffer, "id" | "dir">;
        value: IMakerOffer[keyof IMakerOffer] | null | undefined;
      }> = [
        { field: "side", value: initialOffer.side },
        { field: "isActive", value: initialOffer.isActive },
        { field: "follow_market", value: initialOffer.follow_market },
        { field: "fee_enabled", value: initialOffer.fee_enabled },
        { field: "course", value: initialOffer.course },
        { field: "min", value: initialOffer.min },
        { field: "max", value: initialOffer.max },
        { field: "fee_type", value: initialOffer.fee_type },
        { field: "fee_amount", value: initialOffer.fee_amount },
        { field: "city_from", value: initialOffer.city_from },
        { field: "city_to", value: initialOffer.city_to },
        { field: "top_parameters", value: initialOffer.top_parameters },
      ];
      seedFields.forEach(({ field, value }) => {
        if (value === undefined) return;
        dispatch(setP2PFullOfferField({ index, field, value }));
      });
      if (initialOffer.givePm) {
        dispatch(
          setP2PDirectionPm({ index, side: "give", pm: initialOffer.givePm }),
        );
      }
      if (initialOffer.getPm) {
        dispatch(
          setP2PDirectionPm({ index, side: "get", pm: initialOffer.getPm }),
        );
      }
    });
  }, [dispatch, index, initialOffer, storeOffer]);

  const givePm = fullOffer?.givePm;
  const getPm = fullOffer?.getPm;
  const currencyPair =
    givePm?.currency?.code && getPm?.currency?.code
      ? `${givePm.currency.code}_${getPm.currency.code}`.toUpperCase()
      : undefined;
  const dir =
    fullOffer.dir ||
    (givePm?.code && getPm?.code ? `${givePm.code}_${getPm.code}` : undefined);

  const prevSideRef = React.useRef<typeof fullOffer.side>(fullOffer?.side);
  React.useEffect(() => {
    const prevSide = prevSideRef.current;
    const currentSide = fullOffer?.side;
    if (!currentSide || !prevSide || currentSide === prevSide) {
      prevSideRef.current = currentSide;
      return;
    }
    const course = fullOffer?.course;
    if (!course || !Number.isFinite(course) || course <= 0) {
      prevSideRef.current = currentSide;
      return;
    }
    const convertValue = (value?: number | null) => {
      if (value === null || value === undefined) return value;
      if (!Number.isFinite(value)) return value;
      return currentSide === "get" ? value / course : value * course;
    };
    const normalizeLimit = (value?: number | null, kind?: "min" | "max") => {
      if (value === null || value === undefined) return value;
      if (!Number.isFinite(value)) return value;
      const order = powerOfTenOrder(value);
      if (!order) return value;
      return kind === "max" ? order * 10 : order;
    };
    const nextMin = normalizeLimit(convertValue(fullOffer?.min), "min");
    const nextMax = normalizeLimit(convertValue(fullOffer?.max), "max");
    if (nextMin !== undefined) {
      dispatch(setP2PFullOfferField({ index, field: "min", value: nextMin }));
    }
    if (nextMax !== undefined) {
      dispatch(setP2PFullOfferField({ index, field: "max", value: nextMax }));
    }
    prevSideRef.current = currentSide;
  }, [
    dispatch,
    fullOffer?.course,
    fullOffer?.max,
    fullOffer?.min,
    fullOffer?.side,
    index,
  ]);

  React.useEffect(() => {
    if (!dir && !currencyPair) return;
    dispatch(fetchP2POfferCourseRates({ index }));
  }, [dispatch, index, dir, currencyPair]);

  const dirExists = fullOffer.givePm && fullOffer.getPm;

  return (
    <Box3D
      id={`direction-item-${index}`}
      w="100%"
      flex="1"
      px="4"
      py="2"
      display="block"
      alignSelf="stretch"
      transition="filter 0.2s ease-in"
      _hover={{ filter: "brightness(1.1)" }}
      variant="extra_contrast"
      //
      //minH={fullHeight ? "70px" : "unset"}
    >
      <Grid
        gridTemplateColumns={"3fr 40px 3fr 2fr"}
        gridTemplateRows="auto"
        color="bg.800"
        alignItems="center"
        columnGap="2"
        cursor="pointer"
        onClick={() => setOpened(index == opened ? 1000 : index)}
      >
        <DirectionPmButton
          side="give"
          directionIndex={index}
          pm={fullOffer?.givePm}
          handleExpand={handleExpand}
        />

        <BsArrowRightShort size="1.5rem" />

        <DirectionPmButton
          side="get"
          directionIndex={index}
          pm={fullOffer?.getPm}
          handleExpand={handleExpand}
        />
        <HStack justifySelf="end">
          {!!dirExists ? (
            <Button variant="ghost">
              {index == opened ? (
                <MdOutlineKeyboardArrowUp size="1.5rem" />
              ) : (
                <MdOutlineKeyboardArrowDown size="1.5rem" />
              )}
            </Button>
          ) : (
            <DeleteOffer index={index} />
          )}
        </HStack>
      </Grid>
      <Collapse in={index == opened && !!dirExists}>
        {/* <HStack> */}
        <Divider my="4" />
        <HStack
          w="100%"
          onClick={(event) => event.stopPropagation()}
          alignItems="start"
          mb="4"
        >
          <VStack spacing="4" w="100%" mx="4">
            <OfferCourse fullOffer={fullOffer} />
            <OfferLimits fullOffer={fullOffer} />
            <OfferFee fullOffer={fullOffer} />
          </VStack>
          <Divider orientation="vertical" h="200px" mr="1" />
          <VStack w="100%" spacing="2" alignItems="end">
            <Chart
              giveCur={givePm?.currency.code.toUpperCase()}
              getCur={getPm?.currency.code.toUpperCase()}
              noRate
              //currentRateOverride={googleRate}
            />
            <RightOptions fullOffer={fullOffer} />
          </VStack>
        </HStack>
        <Divider my="4" />
        <OfferExplanation fullOffer={fullOffer} />
        <Divider my="4" />
        <HStack w="100%" justifyContent="space-between" my="4" spacing="4">
          <OfferParameters offerIndex={index} />
          <DeleteOffer index={index} isFull />
        </HStack>
      </Collapse>
    </Box3D>
  );
};

export default Offer;
