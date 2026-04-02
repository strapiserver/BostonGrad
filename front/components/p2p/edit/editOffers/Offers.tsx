import React, { useState, useEffect, useRef, useMemo } from "react";
import { VStack } from "@chakra-ui/react";
import { useAppSelector } from "../../../../redux/hooks";
import Offer from "./offer";
import { IFullOffer } from "../../../../types/p2p";

const DirectionsPicker = ({
  offers,
}: {
  offers?: Partial<IFullOffer>[] | null;
}) => {
  const fullOffersCount = useAppSelector(
    (state) => state.main.p2pFullOffers.length,
  );
  const [opened, setOpened] = useState(0);

  const handleExpand = (event: any, index: number) => {
    if (index !== opened) return;
    event.preventDefault();
    event.stopPropagation();
    setOpened(index);
  };

  const prevOpenedRef = useRef(opened);
  useEffect(() => {
    const prevOpened = prevOpenedRef.current;
    prevOpenedRef.current = opened;
    if (prevOpened === opened) return;
    if (prevOpened === 1000 || opened === 1000) return;
    const timer = window.setTimeout(() => {
      const target = document.getElementById(`direction-item-${opened}`);
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [opened]);

  const fallbackOffers = useMemo(() => offers || [], [offers]);
  const renderCount = Math.max(fullOffersCount, fallbackOffers.length);
  const directionIndexes = useMemo(
    () => Array.from({ length: renderCount }, (_, index) => index),
    [renderCount],
  );

  return (
    <VStack align="stretch" spacing="6" px="2">
      {directionIndexes.map((index) => (
        <Offer
          key={`direction-${index}`}
          index={index}
          opened={opened}
          setOpened={setOpened}
          handleExpand={handleExpand}
          initialOffer={fallbackOffers[index]}
        />
      ))}
    </VStack>
  );
};

export default DirectionsPicker;
