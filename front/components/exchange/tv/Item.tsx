import { Flex } from "@chakra-ui/react";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { updateScrollLock } from "../../../redux/mainReducer";
import { useTransform, motion, MotionValue } from "framer-motion";
import ExchangerCard from "./ExchangerCard";
import { IRate } from "../../../types/rates";

function Item({
  rate,
  y,
  index,
  itemHeight,
  containerHeight,
}: {
  rate: IRate;
  y: MotionValue<number>;
  index: number;
  itemHeight: number;
  containerHeight: number;
}) {
  const getScaleX = useCallback(
    (itemIndex: number) => {
      const itemMiddleY = itemIndex * itemHeight + itemHeight / 2;
      const containerMiddle = containerHeight / 2;
      const distanceFromCenter = Math.abs(
        y.get() + itemMiddleY - containerMiddle
      );
      const scaleXRange = 0.02; // Difference in scaleX

      return 1 - scaleXRange * (distanceFromCenter / itemHeight) ** 2;
    },
    [containerHeight, itemHeight, y]
  );
  const getShape = useCallback(
    (itemIndex: number) => {
      const itemMiddleY = itemIndex * itemHeight + itemHeight / 2;
      const containerMiddle = containerHeight / 2;
      const distanceFromCenter = y.get() + itemMiddleY - containerMiddle;
      const maxRadiusEffect = itemHeight / 2;
      if (
        Math.abs(distanceFromCenter) > maxRadiusEffect &&
        distanceFromCenter < 0
      ) {
        return `${3}% ${3}% ${0}% ${0}% / 100% 100% 0% 0%`;
      } else if (
        Math.abs(distanceFromCenter) > maxRadiusEffect &&
        distanceFromCenter > 0
      ) {
        return `${0}% ${0}% ${3}% ${3}% / 0% 0% 100% 100%`;
      }
      return `${1}% ${1}% ${1}% ${1}% / 50% 50% 50% 50%`;
    },
    [containerHeight, itemHeight, y]
  );

  const scaleX = useTransform(y, () => getScaleX(index));
  const borderRadius = useTransform(y, () => getShape(index));

  return (
    <motion.div
      style={{
        height: `${itemHeight}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius,
        padding: "4px",
        scaleX,
        willChange: "transform",
      }}
    >
      <ExchangerCard index={index} rate={rate} />
    </motion.div>
  );
}

export default Item;
