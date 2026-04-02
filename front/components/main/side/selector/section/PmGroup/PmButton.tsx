import { Button, useColorModeValue } from "@chakra-ui/react";
import CircularIcon from "../../../../../shared/CircularIcon";
import { sendToast } from "../../../../../../redux/mainReducer";
import { useAppDispatch } from "../../../../../../redux/hooks";

export default function PmButton({
  children,
  color,
  icon,
  handleToggle,
  shaded,
  iconAlt,
}: {
  children: JSX.Element | JSX.Element[];
  color: string;
  icon?: any;
  handleToggle: any;
  shaded: boolean;
  iconAlt?: string;
}) {
  const dispatch = useAppDispatch();
  return (
    <Button
      w="100%"
      p="0"
      variant="default"
      filter={shaded ? "opacity(0.3) grayscale(0.8)" : "none"}
      justifyContent="start"
      onClick={
        shaded
          ? () =>
              dispatch(
                sendToast({
                  status: "info",
                  title: "Направление обмена не доступно",
                  timeBeforeClosing: 4000,
                })
              )
          : handleToggle
      } // works as choosePm or as open subitems
      leftIcon={<CircularIcon iconAlt={iconAlt} icon={icon} color={color} />}
      color="transparent"
      transition="filter 0.5s ease"
      _hover={{
        color: "bg.600",
        filter: shaded ? "opacity(0.1) grayscale(1)" : "brightness(1.2)",
      }}
    >
      {children}
    </Button>
  );
}
