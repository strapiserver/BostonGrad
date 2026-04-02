import { Box, Divider } from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { useAppSelector } from "../../../redux/hooks";
import { Box3D } from "../../../styles/theme/custom";
import { IMassRate, IMassDirTextId } from "../../../types/mass";
import { IPm } from "../../../types/selector";
import Pagination from "./Pagination"; // adjust the path
import { pickKeys } from "../helper";
import MassRate from "./massRate";
import TopPanel from "./topPanel";
import TableHeaders from "./TableHeaders";

function MassTable({
  massRates,
  fiatPms,
  massDirTextId,
}: {
  massRates: IMassRate[];
  fiatPms: Record<string, IPm>;
  massDirTextId: IMassDirTextId;
}) {
  const massPmsFilter = useAppSelector((state) => state.main.massPmsFilter);
  const filterSet = new Set(massPmsFilter.map((f) => f.toLowerCase()));
  const massSort = useAppSelector((state) => state.main.massSort);
  const massAmount = useAppSelector((state) => state.main.massAmount);

  const filteredMassRates = massPmsFilter?.length
    ? massRates.filter((mr) =>
        mr.codes.some((code) => filterSet.has(code.toLowerCase()))
      )
    : massRates;

  const sortedMassRates = useMemo(() => {
    const { direction, key } = massSort;
    const sorted = filteredMassRates?.sort((a, b) => {
      let result = 0;

      if (key === "course") result = (a.course || 0) - (b.course || 0);
      else if (key === "limit") {
        result =
          direction === "asc"
            ? (a.min.give || 0) - (b.min.give || 0)
            : (a.max.give || 0) - (b.max.give || 0);
      } else if (key === "admin_rating")
        result =
          (Number(a?.admin_rating) || 0) - (Number(b?.admin_rating) || 0);

      return direction === "asc" ? result : -result;
    });

    return sorted;
  }, [massAmount, filteredMassRates, massSort]);

  // ✅ Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const totalPages = Math.ceil(sortedMassRates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRates = sortedMassRates.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <Box3D px={["1", "4"]} py={["2", "4"]} variant="contrast">
      <TopPanel fiatPms={fiatPms} massDirTextId={massDirTextId} />
      <Box display={{ base: "none", md: "block" }}>
        <TableHeaders />
      </Box>

      <Box py={["1", "2"]} mt="2">
        {paginatedRates.map((rate, idx) => {
          const pms = pickKeys(fiatPms, rate.codes);
          return (
            <React.Fragment key={rate.ref_link + idx}>
              <Divider w="100%" />
              <MassRate
                rate={rate}
                fiatPms={pms}
                massDirTextId={massDirTextId}
                massAmount={massAmount}
              />
            </React.Fragment>
          );
        })}
      </Box>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </Box3D>
  );
}

export default MassTable;
