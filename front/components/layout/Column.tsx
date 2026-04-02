import { Box3D } from "../../styles/theme/custom";

export const Column = ({
  children,
  index,
  isFullWidth = false,
}: {
  children: any;
  index: number;
  isFullWidth?: boolean;
}) => {
  return (
    <Box3D
      key={index}
      variant="no_contrast"
      overflowY="none"
      p={{ base: "2", lg: "4" }}
      w="100%"
      maxW={{ base: "100%", lg: "436px" }}
      gridRow={{ base: index, lg: "unset" }}
      gridColumn={{ base: "unset", lg: isFullWidth ? "1/3" : "unset" }}
    >
      {children}
    </Box3D>
  );
};

export default Column;
