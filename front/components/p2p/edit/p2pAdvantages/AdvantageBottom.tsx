import { Box, Grid, HStack, Text, Highlight } from "@chakra-ui/react";
import React from "react";

export default function AdvantageBottom({
  hovering,
  title,
  subtitle,
  icon,
}: {
  hovering: boolean;
  title: string;
  subtitle: string;
  icon: any;
}) {
  return (
    <Grid
      gap="4"
      color={hovering ? "violet.400" : "violet.500"}
      px="4"
      mt="-10"
      mb="4"
      gridTemplateColumns="1.5rem 1fr"
      alignItems="center"
    >
      {icon}
      <Box color="bg.700" fontSize="sm">
        <Text fontSize="lg" fontWeight="bold" color="bg.500">
          {title}
        </Text>
        <Text whiteSpace="pre-line">{subtitle}</Text>

        <Text>
          {`Как это работает? `}
          <Highlight
            query={["читать далее →"]}
            styles={{
              color: "violet.600",
              textDecoration: "underline",
              _hover: {
                color: "violet.400",
              },
            }}
          >
            читать далее →
          </Highlight>
        </Text>
      </Box>
    </Grid>
  );
}
