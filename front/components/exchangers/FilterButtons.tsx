import { Box, HStack, Button, ButtonGroup } from "@chakra-ui/react";
import Dot from "./Dot";
import { IDotColors } from "../../types/exchanger";

export default function FilterButtons({
  toggleFilter,
  activeFilter,
}: {
  toggleFilter: (status: string) => void;
  activeFilter: string | null;
}) {
  const colors = ["green", "orange"] as IDotColors[];
  return (
    <HStack borderWidth="2px" borderRadius="xl" borderColor="bg.500" gap="0">
      {colors.map((color) => (
        <Button
          key={color}
          onClick={() => toggleFilter(color)}
          bgColor={activeFilter === color ? "bg.700" : "transparent"}
        >
          <Dot color={color} />
        </Button>
      ))}
    </HStack>
  );
}
