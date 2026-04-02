import { Box, Flex, HStack, VStack } from "@chakra-ui/react";
import FilterButtons from "./FilterButtons";
import ExchangerSearch from "./ExchangerSearch";
import SortButtons from "./SortButtons";
import { BoxWrapper } from "../shared/BoxWrapper";

export default function TopPanel({
  toggleFilter,
  activeFilter,
  setSearchQuery,
  sortCriteria,
  sortDirection,
  toggleSort,
}: {
  toggleFilter: (status: string) => void;
  activeFilter: string | null;
  setSearchQuery: (query: string) => void;
  sortCriteria: "name" | "total_rates" | "admin_rating";
  sortDirection: "asc" | "desc";
  toggleSort: (criteria: typeof sortCriteria) => void;
}) {
  return (
    <BoxWrapper mt="4" p="4" variant="extra_contrast" w="100%">
      <Box maxW="container.xl">
        {/* Large screens */}
        <HStack
          gap="4"
          align="stretch"
          w="100%"
          display={{ base: "none", lg: "flex" }}
        >
          <FilterButtons
            toggleFilter={toggleFilter}
            activeFilter={activeFilter}
          />
          <ExchangerSearch onSearch={setSearchQuery} />
          <SortButtons
            sortCriteria={sortCriteria}
            sortDirection={sortDirection}
            toggleSort={toggleSort}
          />
        </HStack>

        {/* Small screens */}
        <VStack
          justify="center"
          gap="4"
          display={{ base: "flex", lg: "none" }}
          align="stretch"
        >
          <HStack w="100%" justify="space-between">
            <ExchangerSearch onSearch={setSearchQuery} />
            <FilterButtons
              toggleFilter={toggleFilter}
              activeFilter={activeFilter}
            />
          </HStack>

          <SortButtons
            sortCriteria={sortCriteria}
            sortDirection={sortDirection}
            toggleSort={toggleSort}
          />
        </VStack>
      </Box>
    </BoxWrapper>
  );
}
