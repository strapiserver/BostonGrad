import React, { useMemo } from "react";
import { Center, VStack } from "@chakra-ui/react";
import useSWR from "swr";
import { batch } from "react-redux";
import { initCMSFetcher } from "../../../../../../services/fetchers";
import { selectorQueryAll } from "../../../../../../services/queries";
import { ISelector, IPm } from "../../../../../../types/selector";
import { useAppDispatch, useAppSelector } from "../../../../../../redux/hooks";
import {
  setP2PDirectionPm,
  setSearchBarInputValue,
  triggerModal,
} from "../../../../../../redux/mainReducer";
import { filterSections } from "../../../../../main/side/selector/section/helper";
import SearchBar from "../../../../../main/side/selector/SearchBar";
import ErrorWrapper from "../../../../../shared/ErrorWrapper";
import Loader from "../../../../../shared/Loader";
import DirectionSectionsList from "./DirectionSectionsList";
import { DirectionSide } from "../types";

const selectorFetcher = initCMSFetcher();

const DirectionSelector = ({
  side,
  directionIndex,
}: {
  side: DirectionSide;
  directionIndex: number;
}) => {
  const dispatch = useAppDispatch();
  const searchBarInputValue = useAppSelector(
    (state) => state.main.searchBarInputValue,
  );
  const { data, error } = useSWR(selectorQueryAll, selectorFetcher) as {
    data: ISelector | null;
    error: any;
  };

  const sections = useMemo(
    () => filterSections(searchBarInputValue, data?.sections || []),
    [searchBarInputValue, data?.sections],
  );

  const handleSelect = (pm: IPm) => {
    batch(() => {
      dispatch(setP2PDirectionPm({ index: directionIndex, side, pm }));
      dispatch(triggerModal(undefined));
      dispatch(setSearchBarInputValue(""));
    });
  };

  if (!data)
    return (
      <Center
        w="100%"
        h="100%"
        justifyContent="center"
        alignItems="center"
        minW="100"
        minH="100"
      >
        <Loader size="xl" />
      </Center>
    );

  return (
    <VStack
      borderRadius="lg"
      p="2"
      justifyContent="center"
      css={{
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-track": {
          width: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "",
          borderRadius: "24px",
        },
      }}
    >
      <ErrorWrapper isLoading={!data} isError={!!error}>
        <SearchBar search_bar={data?.search_bar} />
        <DirectionSectionsList sections={sections} onSelect={handleSelect} />
      </ErrorWrapper>
    </VStack>
  );
};

export default DirectionSelector;
