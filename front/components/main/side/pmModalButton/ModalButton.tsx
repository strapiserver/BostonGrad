import { useColorModeValue, Hide } from "@chakra-ui/react";
import { ReactElement } from "react";
import Arrow from "../../../shared/Arrow";
import { ResponsiveButton } from "../../../../styles/theme/custom";

const ModalButton = ({
  children,
  leftIcon,
  openDialog,
}: {
  children: any;
  leftIcon?: ReactElement;
  openDialog: Function;
}) => {
  const color = useColorModeValue("violet.700", "violet.600");

  return (
    <ResponsiveButton
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        openDialog();
        e.stopPropagation();
      }}
      position="relative"
      variant="default"
      color={color}
      display="flex"
      justifyContent="start"
      alignItems="center"
      //border={`1px ${leftIcon ? "solid" : "dashed"}`}
      borderColor="whiteAlpha.100"
      leftIcon={leftIcon}
    >
      {children}
    </ResponsiveButton>
  );
};

export default ModalButton;
