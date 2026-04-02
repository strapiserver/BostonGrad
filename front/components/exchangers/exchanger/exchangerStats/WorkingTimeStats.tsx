import { HStack } from "@chakra-ui/react";
import { IoTimeOutline } from "react-icons/io5";
import { ResponsiveText } from "../../../../styles/theme/custom";

const WorkingTimeStats = ({ workingTime }: { workingTime?: string | null }) => {
  if (!workingTime) return null;

  return (
    <HStack>
      <IoTimeOutline size="1.2rem" />
      <ResponsiveText>{`Время работы: ${workingTime}`}</ResponsiveText>
    </HStack>
  );
};

export default WorkingTimeStats;
