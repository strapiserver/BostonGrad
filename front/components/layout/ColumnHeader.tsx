import { Heading, Highlight, useColorModeValue } from "@chakra-ui/react";

const ColumnHeader = ({
  text,
  as = "h2",
  query,
}: {
  text?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p";
  query?: string[];
}) => {
  const secondaryColor = useColorModeValue("bg.700", "bg.200");
  const primaryColor = useColorModeValue("violet.600", "violet.600");
  if (!text) return <></>;
  const isLong = text.length > 36;
  return (
    <Heading
      as={as}
      fontSize={{
        base: isLong ? "15px" : "17px",
        md: isLong ? "18px" : "22px",
      }}
      color={secondaryColor}
      mb="4"
      mt="0"
      display={as == "h2" ? ["none", "block"] : ["block", "block"]}
    >
      <Highlight query={query || []} styles={{ color: primaryColor }}>
        {text}
      </Highlight>
    </Heading>
  );
};

export default ColumnHeader;
