import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { Box, useBreakpointValue } from "@chakra-ui/react";
import Swiper from "./Swiper";
import { useIsMobile } from "./hooks";
import { updateDirRates } from "../../../redux/thunks";
import { setLoadingStatus } from "../../../redux/mainReducer";
import CustomModal from "../../shared/CustomModal";
import RateDetails from "./rateDetails";
import { useRouter } from "next/router";
import { ICity, IDirText } from "../../../types/exchange";

const TV = ({
  dir,
  city,
  dirText,
}: {
  dir: string;
  city: ICity | null;
  donorCity: ICity | null;
  dirText: IDirText | null;
}) => {
  const loadingStatus = useAppSelector((state) => state.main.loading);
  const containerHeight = useBreakpointValue({ base: 320, md: 416 }) || 416;
  const router = useRouter();
  const { exchange } = router.query as { exchange: string };

  const dirRates = useAppSelector((state) => state.main.dirRates) || [];
  const dirRatesReloadTrigger = useAppSelector(
    (state) => state.main.dirRatesReloadTrigger
  );
  // const cityName = useAppSelector((state) => state.main.city.en_name);
  const isCash =
    (exchange && exchange.startsWith("cash-")) || exchange.includes("-cash-");

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!dir) return;
    const cityName = isCash ? city?.en_name || "moscow" : "";
    dispatch(updateDirRates({ dir, cityName }));
  }, [dir, city?.en_name, isCash, dispatch]);

  useEffect(() => {
    if (loadingStatus === "pending" && dirRates.length) {
      dispatch(setLoadingStatus("fulfilled"));
    }
  }, [loadingStatus, dirRates.length, dispatch]);

  // useEffect(() => {
  //   if (!dir) return;
  //   const cityName = isCash ? city?.en_name || "moscow" : "";
  //   let cancelled = false;
  //   let timeoutId: ReturnType<typeof setTimeout>;

  //   const schedule = () => {
  //     timeoutId = setTimeout(async () => {
  //       await dispatch(updateDirRates({ dir, cityName, keepAmount: true }));
  //       if (!cancelled) schedule();
  //     }, 60_000);
  //   };

  //   schedule();

  //   return () => {
  //     cancelled = true;
  //     clearTimeout(timeoutId);
  //   };
  // }, [dir, city?.en_name, isCash, dispatch]);

  const isMobile = useIsMobile();
  const itemHeight = 100; // Height of each text box
  const visibleItems = 3; // Number of items visible in the container

  const props = {
    isMobile,
    itemHeight,
    visibleItems,
    containerHeight,
    dirRates,
    dirText,
    dirRatesReloadTrigger,
  };

  return (
    <Box h={{ base: "fit-content", lg: "416px" }}>
      <Swiper {...props} />
    </Box>
  );
};

export default TV;
