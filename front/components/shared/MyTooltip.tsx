import { Box, Tooltip, useDisclosure } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

const MyTooltip = ({
  children,
  label,
  placement = "bottom",
  openDelay = 100,
}: {
  children: any;
  label?: string;
  placement?: "left" | "right" | "top" | "bottom";
  openDelay?: number;
}) => {
  const { isOpen, onOpen, onToggle, onClose } = useDisclosure();
  const openTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (openTimerRef.current) {
        window.clearTimeout(openTimerRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (openTimerRef.current) {
      window.clearTimeout(openTimerRef.current);
    }
    openTimerRef.current = window.setTimeout(() => {
      onOpen();
    }, openDelay);
  };

  const handleMouseLeave = () => {
    if (openTimerRef.current) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    onClose();
  };
  return (
    <Tooltip
      hasArrow
      isOpen={isOpen}
      label={label || ""}
      bg="bg.300"
      borderRadius="2xl"
      maxW="50vw"
      placement={placement}
    >
      <Box
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onToggle}
      >
        {children}
      </Box>
    </Tooltip>
  );
};

export default MyTooltip;
