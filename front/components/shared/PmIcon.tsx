import { Box } from "@chakra-ui/react";
import React from "react";
import { IPm } from "../../types/selector";
import CircularIcon from "./CircularIcon";

function PmIcon({ pm }: { pm: IPm }) {
  return (
    <Box
      cursor="pointer"
      display="inline-flex"
      alignItems="center"
      transform="scale(1)"
      _hover={{ transform: "scale(1.1)" }}
    >
      <CircularIcon
        size="sm"
        iconAlt={pm?.en_name}
        icon={pm?.icon}
        color={pm?.color || "gray"}
      />
    </Box>
  );
}

export default PmIcon;
