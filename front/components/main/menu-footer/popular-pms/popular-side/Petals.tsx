import { Center } from "@chakra-ui/react";
import React from "react";
import { IPm } from "../../../../../types/selector";
import Petal from "./Petal";

type PetalsProps = {
  pms: IPm[];
} & React.ComponentProps<typeof Center>;

const Petals: React.FC<PetalsProps> = ({ pms, ...layerProps }) => {
  const totalItems = pms.length + 1;
  return (
    <Center borderRadius="50%" position="relative" {...layerProps}>
      {pms.map((pm, index) => (
        <Petal
          key={pm.code ?? index}
          pm={pm}
          index={index}
          totalItems={totalItems}
        />
      ))}
      <Petal index={pms.length} totalItems={totalItems} />
    </Center>
  );
};

export default Petals;
