import { Box, Grid } from "@chakra-ui/react";
import { ResponsiveText } from "../../../../styles/theme/custom";

export default function StatItem({
  label,
  value,
  Icon,
}: {
  label: string;
  value?: React.ReactNode;
  Icon?: any;
}) {
  return (
    <Grid
      gap="4"
      color="bg.700"
      gridTemplateColumns="10px auto 1fr auto"
      alignItems="center"
    >
      {Icon && <Icon size="1rem" />}
      <ResponsiveText size="sm" color="inherit">
        {`${label}:`}
      </ResponsiveText>
      <Box borderBottom="1px solid" borderColor="bg.600" />
      <ResponsiveText size="sm" color="inherit">
        {`${value ?? ""}`}
      </ResponsiveText>
    </Grid>
  );
}
