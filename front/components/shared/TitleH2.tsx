import { Box } from "@chakra-ui/react";

export const TitleH2 = ({
  children,
  isLong,
}: {
  children: any;
  isLong: boolean;
}) => (
  <Box
    as="h2"
    fontSize={{
      base: isLong ? "sm" : "md",
      lg: isLong ? "md" : "lg",
    }}
    color="bg.600"
    fontWeight="normal"
  >
    {children}
  </Box>
);
