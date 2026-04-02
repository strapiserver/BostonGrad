import { Box } from "@chakra-ui/react";

type Props = {
  children: React.ReactNode[];
  wrapThreshold?: number; // number of items after which it wraps
  direction?: "start" | "end";
};

const SmartGrid = ({
  children,
  wrapThreshold = 3,
  direction = "end",
}: Props) => {
  const count = children.length;
  const shouldWrap = count >= wrapThreshold;
  const gridDirection = direction === "end" ? "rtl" : "ltr";

  return shouldWrap ? (
    <Box
      display="grid"
      gridTemplateRows="repeat(2, auto)"
      gridAutoFlow="column"
      columnGap="1"
      rowGap="2"
      w="fit-content"
      justifySelf={direction}
      alignItems="center"
      sx={{ direction: gridDirection }}
    >
      {children.map((child, i) => (
        <Box key={i + "column"} sx={{ direction: "ltr" }}>
          {child}
        </Box>
      ))}
    </Box>
  ) : (
    <Box display="flex" alignItems="center" justifyContent={direction} gap="1">
      {children.map((child, i) => (
        <Box key={i + "row"}>{child}</Box>
      ))}
    </Box>
  );
};

export default SmartGrid;
