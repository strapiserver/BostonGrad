import { VStack } from "@chakra-ui/react";
import { IDirText } from "../../types/exchange";
import { CityCashSection, MapHeadings } from "./types";

type CityMapDirectionsProps = {
  cityText: IDirText | null;
  cashSections: CityCashSection[];
  headings: MapHeadings;
};

const CityMapDirections = ({
  cityText,
  cashSections,
  headings,
}: CityMapDirectionsProps) => {
  if (!cityText && !cashSections.length) return null;

  return <VStack align="stretch" spacing="3" mt="6" w="full"></VStack>;
};

export default CityMapDirections;
