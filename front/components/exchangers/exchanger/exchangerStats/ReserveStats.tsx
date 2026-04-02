import { HStack } from "@chakra-ui/react";
import { PiMoneyWavy } from "react-icons/pi";
import { ResponsiveText } from "../../../../styles/theme/custom";

const ReserveStats = ({
  reserveTotal,
}: {
  reserveTotal?: string | number | null;
}) => {
  if (!reserveTotal && reserveTotal !== 0) return null;

  return (
    <HStack>
      <PiMoneyWavy size="1.2rem" />
      <ResponsiveText>{`Резерв: $${reserveTotal}`}</ResponsiveText>
    </HStack>
  );
};

export default ReserveStats;
