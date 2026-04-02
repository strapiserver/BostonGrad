import React, {
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { FaLocationArrow } from "react-icons/fa";
import { motion, useMotionValue, useAnimation } from "framer-motion";
import { Box, Grid, useColorModeValue } from "@chakra-ui/react";
import Shader from "../../shared/Shader";
import { Box3D } from "../../../styles/theme/custom";
import ControlPanel from "./ControlPanel";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setSwiperIdVisible } from "../../../redux/mainReducer";
import { IRate } from "../../../types/rates";
import Item from "./Item";
import debounce from "./utils/debounce";
import { fetchTopParameters } from "../../../redux/thunks";
import type { DirRatesReloadTrigger } from "../../../redux/thunks";
import ErrorWrapper from "../../shared/ErrorWrapper";
import BottomLabel from "./BottomLabel";
import TopLabel from "./TopLabel";
import { IDirText } from "../../../types/exchange";
import FoundError from "../../articles/pmArticle/FoundError";

// You asked to keep TopLabel/BottomLabel separate files; if you haven't created them,
// simple presentational components are provided below inline — replace with your imports if you prefer.

const MotionBox = motion(Box);

const [dragElastic, inertiaPower, inertiaTimeConstant, debounceTime] = [
  0.1, 0.4, 240, 200,
];

export const Swiper = (props: {
  isMobile: boolean;
  itemHeight: number;
  visibleItems: number;
  containerHeight: number;
  dirRates: IRate[];
  dirText: IDirText | null;
  dirRatesReloadTrigger?: DirRatesReloadTrigger;
}) => {
  const {
    isMobile,
    itemHeight,
    visibleItems,
    containerHeight,
    dirRates,
    dirText,
    dirRatesReloadTrigger,
  } = props;

  const [initial, setInitial] = useState(true);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchTopParameters());
    setInitial(false);
  }, [dispatch]);

  const loadingStatus = useAppSelector((state) => state.main.loading);
  const isError = loadingStatus === "rejected"; //
  const isLoading =
    loadingStatus === "pending" || (!initial && !dirRates.length);

  const length = dirRates.length;
  const reloadTrigger: DirRatesReloadTrigger =
    dirRatesReloadTrigger || "manual";

  const bgColor = useColorModeValue("bg.50", "bg.800");
  const triangleColor = useColorModeValue("violet.700", "violet.600");
  const mouseEnteredRef = useRef(false);
  const originalOverflowRef = useRef<string | null>(null);
  const originalPaddingRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const y = useMotionValue(0);
  const controls = useAnimation();
  const arrowControls = useAnimation();

  const getIndex = useCallback(() => {
    const index = Math.round(
      (-y.get() + (containerHeight / 2 - itemHeight / 2)) / itemHeight
    );
    return Math.min(length - 1, Math.max(0, index));
  }, [containerHeight, itemHeight, length, y]);

  const snapToNearest = useCallback(
    (currentY: number) => {
      const offset = containerHeight / 2 - itemHeight / 2;
      const index = Math.round((-currentY + offset) / itemHeight);

      if (index <= 0) return offset; // snap to first element
      if (index >= length - 1) return -itemHeight * (length - 1) + offset; // snap to last
      return -index * itemHeight + offset;
    },
    [containerHeight, itemHeight, length]
  );

  const move = useCallback(
    (yVal: number) => {
      controls.start({
        y: yVal,
        transition: { type: "tween", ease: "easeOut", duration: 0.2 },
      });
    },
    [controls]
  );

  const debouncedSetSwiperIdVisible = useMemo(
    () =>
      debounce(debounceTime, (index: number) => {
        dispatch(setSwiperIdVisible(index));
      }),
    [dispatch]
  );

  const scrollToItem = useCallback(
    (index: number) => {
      const targetY =
        -(itemHeight * index) + containerHeight / 2 - itemHeight / 2;
      move(targetY);
    },
    [containerHeight, itemHeight, move]
  );

  const selectVisibleIndex = useCallback(() => {
    if (!length) return;
    debouncedSetSwiperIdVisible(getIndex());
  }, [debouncedSetSwiperIdVisible, getIndex, length]);

  const changeIndexByDelta = useCallback(
    (delta: number) => {
      if (!length) return;
      const currentIndex = getIndex();
      const newIndex = Math.min(length - 1, Math.max(0, currentIndex + delta));
      debouncedSetSwiperIdVisible(newIndex);
      scrollToItem(newIndex);
    },
    [debouncedSetSwiperIdVisible, getIndex, length, scrollToItem]
  );

  const stepDown = () => changeIndexByDelta(-1);

  const stepUp = () => changeIndexByDelta(1);

  const restoreBodyStyles = useCallback(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = originalOverflowRef.current ?? "";
    document.body.style.paddingRight = originalPaddingRef.current ?? "";
    originalOverflowRef.current = null;
    originalPaddingRef.current = null;
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (isMobile || mouseEnteredRef.current) return;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    originalOverflowRef.current = document.body.style.overflow;
    originalPaddingRef.current = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    mouseEnteredRef.current = true;
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    if (isMobile) return;
    restoreBodyStyles();
    mouseEnteredRef.current = false;
  }, [isMobile, restoreBodyStyles]);

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      const containerEl = containerRef.current;
      const targetNode = event.target as Node | null;
      const path = (event as any).composedPath?.() as Node[] | undefined;
      const targetInside =
        !!containerEl &&
        (containerEl === targetNode ||
          (!!targetNode && containerEl.contains(targetNode)) ||
          (Array.isArray(path) && path.includes(containerEl)));

      if (targetInside && !mouseEnteredRef.current) {
        handleMouseEnter();
      }
      if (isMobile || !mouseEnteredRef.current) return;
      if (!event.deltaY) return;
      const magnitude = Math.min(
        3,
        Math.max(1, Math.round(Math.abs(event.deltaY) / 120))
      );
      const direction = event.deltaY > 0 ? 1 : -1;
      changeIndexByDelta(direction * magnitude);
      event.preventDefault();
    },
    [changeIndexByDelta, handleMouseEnter, isMobile]
  );

  const handleKeyDown = (event: any) => {
    if (isMobile) return;
    if (event.key === "ArrowUp" || event.key === "ArrowRight") {
      stepDown();
    } else if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
      stepUp();
    }
  };

  useEffect(() => {
    if (mouseEnteredRef.current) if (initial) return;
    if (!length) return;
    if (reloadTrigger === "auto") return;

    const timeout = setTimeout(() => {
      scrollToItem(0);
      debouncedSetSwiperIdVisible(0);
    }, 700);

    return () => clearTimeout(timeout);
  }, [
    initial,
    length,
    reloadTrigger,
    debouncedSetSwiperIdVisible,
    scrollToItem,
  ]);

  useEffect(() => {
    if (isMobile) return;
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown, isMobile]);

  useEffect(() => {
    return () => {
      mouseEnteredRef.current = false;
      restoreBodyStyles();
    };
  }, [restoreBodyStyles]);

  const animateArrow = useCallback(
    (direction: "up" | "down") => {
      const keyframes =
        direction === "up"
          ? [225, 205, 235, 220, 225]
          : [225, 245, 215, 230, 225];

      arrowControls.start({
        rotate: keyframes,
        transition: {
          duration: 0.5,
          times: [0, 0.18, 0.42, 0.68, 1],
          ease: "easeOut",
        },
      });
    },
    [arrowControls]
  );

  useEffect(() => {
    let lastIndex = getIndex();
    const unsubscribe = y.onChange(() => {
      const idx = getIndex();
      if (idx !== lastIndex) {
        animateArrow(idx < lastIndex ? "up" : "down");
        lastIndex = idx;
      }
    });
    return () => {
      unsubscribe();
    };
  }, [animateArrow, getIndex, y]);

  const topLabelBaseTop = -itemHeight;
  const bottomLabelBaseTop = length * itemHeight;

  return (
    <Grid
      gridTemplateColumns="1fr auto"
      gridGap={["2", "4"]}
      h={`${containerHeight}px`}
      w="100%"
      minW={0}
    >
      <Box3D variant="extra_contrast" px="2" py="1" minW={0}>
        <ErrorWrapper
          isError={isError}
          isLoading={isLoading}
          primaryMessage="No rates available!"
          secondaryMessage="check your network connection"
        >
          <Box
            position="relative"
            overflow="hidden"
            h={`${containerHeight}px`}
            bgColor={bgColor}
            px="1"
            py="4"
            borderRadius={`${4}% ${4}% ${4}% ${4}% / 50% 50% 50% 50%`}
            ref={containerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onWheel={handleWheel as any}
          >
            <Shader direction="top" />

            {/* motion div with items exactly as before */}
            <motion.div
              drag="y"
              dragConstraints={{
                top:
                  -itemHeight * (length - visibleItems) +
                  containerHeight / 2 -
                  itemHeight * 3,
                bottom: containerHeight / 2,
              }}
              dragElastic={dragElastic}
              dragMomentum
              dragTransition={{
                power: inertiaPower,
                timeConstant: inertiaTimeConstant,
                modifyTarget: (target: any) => snapToNearest(target),
              }}
              onDragTransitionEnd={selectVisibleIndex}
              animate={controls}
              style={{
                y,
                width: "100%",
                height: `${length * itemHeight}px`,
                position: "relative",
                willChange: "transform",
              }}
            >
              {dirRates.map((rate, index) => {
                const top = index * itemHeight;
                return (
                  <Box
                    key={"exchanger_" + rate.exchangerId}
                    position="absolute"
                    top={`${top}px`}
                    left="0"
                    right="0"
                  >
                    <Item
                      rate={rate}
                      y={y}
                      index={index}
                      itemHeight={itemHeight}
                      containerHeight={containerHeight}
                    />
                  </Box>
                );
              })}
            </motion.div>

            <MotionBox
              position="absolute"
              left="0"
              right="0"
              style={{ top: `${topLabelBaseTop + 10}px`, y }}
              height={`${itemHeight}px`}
              display="flex"
              alignItems="center"
              justifyContent="center"
              pointerEvents="none"
            >
              <TopLabel text={dirText?.h1} length={dirRates.length} />
            </MotionBox>

            <MotionBox
              position="absolute"
              left="0"
              right="0"
              style={{ top: `${bottomLabelBaseTop}px`, y }}
              height={`${itemHeight}px`}
              display="flex"
              alignItems="center"
              justifyContent="center"
              pointerEvents="auto"
              zIndex="655"
            >
              <FoundError />
            </MotionBox>

            <Shader direction="bottom" />
          </Box>

          <MotionBox
            position="absolute"
            right={{ base: "0", md: "-2" }}
            top={`calc(${containerHeight / 2}px + 0.5rem)`}
            color={triangleColor}
            animate={arrowControls}
            initial={{ rotate: 225 }}
            // style={{ scaleX: 1.8 }}
          >
            <FaLocationArrow size="1.5rem" />
          </MotionBox>
        </ErrorWrapper>
      </Box3D>
      <ControlPanel length={length} stepUp={stepUp} stepDown={stepDown} />
    </Grid>
  );
};

export default Swiper;
