import ResizeObserver from "resize-observer-polyfill";
import { AnimatePresence } from "framer-motion";
import { ToggleLayer } from "react-laag";

import Petals from "./Petals";
import { Box, Center, useColorModeValue, useOutsideClick } from "@chakra-ui/react";
import { useAppSelector } from "../../../../../redux/hooks";
import { useRef, useState } from "react";

import { IoAddSharp } from "react-icons/io5";

function PopularSide() {
  //const activeSide = useAppSelector((state) => state.main.activeSide);
  const pms = useAppSelector((state) => state.main.pms);
  const filteredPms = pms.filter(
    (pm) => pm.popular_as && pm.popular_as !== "none"
  );
  // const completed = useAppSelector(
  //   (state) => state.main.popularCompleted === side
  // );

  const [isOpen, setOpen] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);
  useOutsideClick({
    ref,
    handler: () => setOpen(false),
  });

  return (
    <Box ref={ref}>
      <ToggleLayer
        isOpen={isOpen}
        ResizeObserver={ResizeObserver}
        placement={{
          anchor: "CENTER",
        }}
        renderLayer={({ isOpen, layerProps }) => {
          return (
            <AnimatePresence>
              {isOpen && <Petals {...layerProps} pms={filteredPms} />}
            </AnimatePresence>
          );
        }}
      >
        {({ triggerRef }) => (
          <Center
            transform={isOpen ? "rotate(45deg)" : "none"}
            onClick={() => setOpen(!isOpen)}
            ref={triggerRef}
            transition="all .3s ease"
            cursor="pointer"
            bgColor="rgba(200,200,200,0.05)"
            _hover={{
              color: useColorModeValue("violet.800", "violet.400"),
              bgColor: "transparent",
            }}
            _active={{
              color: useColorModeValue("violet.700", "violet.700"),
            }}
            p="1"
            borderRadius="50%"
            border="2px dashed"
            borderColor="bg.500"
          >
            <IoAddSharp size="1.5rem" />
          </Center>
        )}
      </ToggleLayer>
    </Box>
    // <Box>
    //   <ToggleLayer
    //     isOpen={true}
    //     ResizeObserver={ResizeObserver}
    //     placement={{
    //       anchor: "CENTER",
    //     }}
    //     renderLayer={({ isOpen, layerProps }) => {
    //       return (
    //         <AnimatePresence>
    //           {isOpen && <Petals {...layerProps} pms={pms} />}
    //         </AnimatePresence>
    //       );
    //     }}
    //   >
    //     {({ triggerRef }) => <Button ref={triggerRef}>test</Button>}
    //   </ToggleLayer>
    // </Box>
  );
}

export default PopularSide;
