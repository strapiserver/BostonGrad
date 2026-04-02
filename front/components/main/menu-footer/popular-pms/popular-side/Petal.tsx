import { Center, Icon, useColorModeValue } from "@chakra-ui/react";
import { FiMoreHorizontal } from "react-icons/fi";
import { IPm } from "../../../../../types/selector";
import CircularIcon from "../../../../shared/CircularIcon";

type PetalProps = {
  totalItems: number;
  pm?: IPm;
  index: number;
};

const radiusPx = 80;

const computePosition = (index: number, totalItems: number) => {
  if (totalItems <= 0) {
    return { x: 0, y: 0 };
  }
  const angle = (index / totalItems) * 2 * Math.PI;
  return {
    x: radiusPx * Math.cos(angle),
    y: radiusPx * Math.sin(angle),
  };
};

const Petal = ({ totalItems, pm, index }: PetalProps) => {
  const accent = useColorModeValue("violet.700", "violet.600");
  const { x, y } = computePosition(index, totalItems);

  return (
    <Center
      position="absolute"
      transform={`translate(${x}px, ${y}px)`}
      pointerEvents="all"
      w="48px"
      h="48px"
    >
      {pm ? (
        <CircularIcon icon={pm.icon} color={pm.color || "gray"} size="md" />
      ) : (
        <Center
          border="1px dashed"
          borderColor={accent}
          borderRadius="full"
          w="36px"
          h="36px"
          color={accent}
        >
          <Icon as={FiMoreHorizontal} boxSize="1.25rem" />
        </Center>
      )}
    </Center>
  );
};

export default Petal;
