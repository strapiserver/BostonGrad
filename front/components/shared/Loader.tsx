import { Box, BoxProps } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";

const DotLottieReact = dynamic(
  () =>
    import("@lottiefiles/dotlottie-react").then((mod) => mod.DotLottieReact),
  { ssr: false },
);

const sizeMap = {
  xs: 16,
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
};

type LoaderProps = BoxProps & {
  size?: keyof typeof sizeMap | number;
  src?: string;
  opacity?: number;
  delay?: number;
  shift?: number;
  isActive?: boolean;
};

const Loader = ({
  size = "md",
  src = "/animation4.lottie",
  opacity = 1,
  delay = 0,
  shift = 0,
  isActive = true,
  ...boxProps
}: LoaderProps) => {
  const px = typeof size === "number" ? size : (sizeMap[size] ?? sizeMap.md);
  const boxSize = `${px}px`;
  const delayMs = useMemo(() => Math.max(0, delay) * 1000, [delay]);
  const shiftMs = useMemo(() => Math.max(0, shift) * 1000, [shift]);
  const [dotLottie, setDotLottie] = useState<any>(null);
  const dotLottieRefCallback = useCallback((instance: any) => {
    setDotLottie(instance);
  }, []);

  useEffect(() => {
    if (!dotLottie || delayMs <= 0 || !isActive) {
      return;
    }

    let timer: ReturnType<typeof setTimeout> | null = null;
    const handleComplete = () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        dotLottie.play();
      }, delayMs);
    };

    dotLottie.addEventListener("complete", handleComplete);

    return () => {
      dotLottie.removeEventListener("complete", handleComplete);
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [dotLottie, delayMs, isActive, src]);

  useEffect(() => {
    if (!dotLottie || shiftMs <= 0 || !isActive) {
      return;
    }

    const timer = setTimeout(() => {
      dotLottie.play();
    }, shiftMs);

    return () => {
      clearTimeout(timer);
    };
  }, [dotLottie, shiftMs, isActive, src]);

  useEffect(() => {
    if (!dotLottie) return;

    if (isActive) {
      dotLottie.play();
      return;
    }

    if (typeof dotLottie.pause === "function") {
      dotLottie.pause();
    }
  }, [dotLottie, isActive]);

  return (
    <Box boxSize={boxSize} filter={`opacity(${opacity})`} {...boxProps}>
      <DotLottieReact
        src={src}
        autoplay={isActive && shiftMs <= 0}
        loop={isActive && delayMs <= 0}
        dotLottieRefCallback={dotLottieRefCallback}
        style={{ width: boxSize, height: boxSize }}
      />
    </Box>
  );
};

export default Loader;
