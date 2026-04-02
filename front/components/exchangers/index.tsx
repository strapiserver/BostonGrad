import { Box, Center, Grid } from "@chakra-ui/react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { IExchanger } from "../../types/exchanger";
import { getStatus } from "./helper";
import TopPanel from "./TopPanel";
import ExchangersHeader from "./ExchangersHeader";
import ExchangerLink from "./ExchangerLink";
import { BoxWrapper } from "../shared/BoxWrapper";
import Loader from "../shared/Loader";
import Pagination from "../mass/table/Pagination";

import UniversalSeo from "../shared/UniversalSeo";

import { ISEO } from "../../types/general";

export default function ExchangersList({
  exchangers,
  seo,
  initialPage,
}: {
  exchangers: IExchanger[] | null;
  seo: ISEO;
  initialPage: number;
}) {
  const router = useRouter();
  const [sortCriteria, setSortCriteria] = useState<
    "name" | "total_rates" | "admin_rating"
  >("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingSearchSort, setLoadingSearchSort] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const toggleFilter = (status: string) => {
    setLoadingSearchSort(true);
    setActiveFilter((prev) => (prev === status ? null : status));
  };

  const toggleSort = (criteria: typeof sortCriteria) => {
    setLoadingSearchSort(true);
    if (sortCriteria === criteria) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortCriteria(criteria);
      setSortDirection("desc");
    }
  };

  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    setLoadingSearchSort(true);
    const timeout = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim().toLowerCase());
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoadingSearchSort(false);
    }, 200);
    return () => clearTimeout(timeout);
  }, [debouncedQuery, sortCriteria, sortDirection, activeFilter]);

  const filteredExchangers = useMemo(() => {
    return exchangers?.filter((exchanger) => {
      const displayName = (
        exchanger.display_name ||
        exchanger.name ||
        ""
      ).toLowerCase();
      const matchesFilter =
        activeFilter === null || activeFilter === getStatus(exchanger);

      const matchesSearch =
        debouncedQuery === "" ||
        displayName.includes(debouncedQuery) ||
        exchanger?.ref_link?.toLowerCase().includes(debouncedQuery);

      return matchesFilter && matchesSearch;
    });
  }, [exchangers, debouncedQuery, activeFilter]);

  const sortedExchangers = useMemo(() => {
    const sorted = filteredExchangers?.slice().sort((a, b) => {
      let result = 0;

      if (sortCriteria === "name") {
        const nameA = a.display_name || a.name || "";
        const nameB = b.display_name || b.name || "";
        result = nameA.localeCompare(nameB, "ru", { sensitivity: "base" });
        // } else if (sortCriteria === "total_rates") {
        //   result = (a?.total_rates || 0) - (b?.total_rates || 0);
      } else if (sortCriteria === "admin_rating") {
        result =
          (Number(a?.admin_rating) || 0) - (Number(b?.admin_rating) || 0);
      }

      return sortDirection === "asc" ? result : -result;
    });

    return sorted;
  }, [filteredExchangers, sortCriteria, sortDirection]);

  const itemsPerPage = 20;
  const totalPages = Math.ceil((sortedExchangers?.length || 0) / itemsPerPage);
  const rawPage = useMemo(() => {
    if (!router.isReady) return initialPage;
    const pageValue = Array.isArray(router.query.page)
      ? router.query.page[0]
      : router.query.page;
    const parsed = Number.parseInt(pageValue || "1", 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  }, [router.isReady, router.query.page, initialPage]);

  const currentPage = useMemo(
    () => Math.min(Math.max(rawPage, 1), Math.max(totalPages, 1)),
    [rawPage, totalPages]
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExchangers = sortedExchangers?.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const setPage = useCallback(
    (page: number) => {
      if (!router.isReady) return;
      const nextPage = Math.min(
        Math.max(page, 1),
        Math.max(totalPages, 1)
      );
      if (nextPage === rawPage) return;
      const nextQuery = { ...router.query };
      if (nextPage === 1) {
        delete nextQuery.page;
      } else {
        nextQuery.page = String(nextPage);
      }
      router.push({ pathname: router.pathname, query: nextQuery });
    },
    [router.isReady, router.pathname, router.query, rawPage, totalPages]
  );

  const getPageHref = useCallback(
    (page: number) =>
      page > 1 ? `${router.pathname}?page=${page}` : router.pathname,
    [router.pathname]
  );

  const effectiveSeo = useMemo(() => {
    const canonicalSlug =
      currentPage > 1 ? `exchangers?page=${currentPage}` : "exchangers";
    return { ...seo, canonicalSlug };
  }, [seo, currentPage]);

  useEffect(() => {
    if (!router.isReady) return;
    if (totalPages > 0 && rawPage > totalPages) {
      setPage(totalPages);
    }
  }, [router.isReady, totalPages, rawPage, setPage]);

  if (!exchangers?.length) return <>no exchangers</>;

  return (
    <>
      <UniversalSeo seo={effectiveSeo} />

      <BoxWrapper p="4" variant="no_contrast" mt="10" minH="100vh">
        <ExchangersHeader exchangers={exchangers} />

        <TopPanel
          toggleFilter={toggleFilter}
          activeFilter={activeFilter}
          setSearchQuery={setSearchQuery}
          sortCriteria={sortCriteria}
          sortDirection={sortDirection}
          toggleSort={toggleSort}
        />

        <Box mt="4">
          <Box maxW="container.xl" mx="auto">
            {loadingSearchSort ? (
              <Center py="20">
                <Loader size="xl" />
              </Center>
            ) : (
              <Grid
                gap="4"
                w="100%"
                justifyItems="center"
                gridTemplateColumns={{
                  base: "1fr",
                  md: "repeat(2, 1fr)",
                }}
              >
                {paginatedExchangers?.map((exchanger) => (
                  <ExchangerLink key={exchanger.id} exchanger={exchanger} />
                ))}
              </Grid>
            )}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
                getPageHref={getPageHref}
              />
            )}
          </Box>
        </Box>
      </BoxWrapper>
    </>
  );
}
