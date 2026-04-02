import { Box, Button, Center, Grid, Text } from "@chakra-ui/react";
import React from "react";
import Loader from "../../../shared/Loader";
import { FaArrowRight } from "react-icons/fa6";
import { batch } from "react-redux";
import { useAppDispatch } from "../../../../redux/hooks";
import { triggerModal } from "../../../../redux/mainReducer";
import { IP2PLevel } from "../../../../types/p2p";

import { BsArrowRightShort } from "react-icons/bs";
import CustomModal from "../../../shared/CustomModal";
import MakerLevelsDescription from "./MakerLevelsDescription";
import src from "resize-observer-polyfill";

export default function MakerLevels({
  levels,
}: {
  levels?: IP2PLevel[] | null;
}) {
  const dispatch = useAppDispatch();

  const openDialog = () => {
    batch(() => {
      dispatch(triggerModal("levels"));
    });
  };

  // const levels = Array.from(
  //   { length: 10 },
  //   (_, index) => `/p2p/lottie/lvl${index + 1}.lottie`,
  // );
  // const labels = [
  //   "Старт",
  //   "Новичок",
  //   "Частник",
  //   "Опытный",
  //   "Профи",
  //   "Малый обменник",
  //   "Средний обменник",
  //   "Крупный обменник",
  //   "Группа обменников",
  //   "Мониторинг",
  // ];
  if (!levels) return <></>;

  return (
    <Box mt="4" w="100%">
      <Grid
        gridTemplateColumns="repeat(5, 1fr 1rem)"
        gap="auto"
        alignItems="center"
        onClick={openDialog}
      >
        {[...levels]
          .sort((a, b) => (a.level ?? 0) - (b.level ?? 0))
          .map((level, index) => (
            <React.Fragment key={level.id}>
              <Box
                pb="4"
                position="relative"
                display="flex"
                flexDirection="column"
                alignItems="center"
                minH="200px"
                borderRadius="full"
                role="group"
                cursor="pointer"
              >
                <Text
                  fontSize="xs"
                  color="bg.800"
                  position="absolute"
                  top="8"
                  left="8"
                >
                  {`#${index + 1}`}
                </Text>
                <Box
                  position="absolute"
                  top="40%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  boxSize="140px"
                  borderRadius="full"
                  bgGradient="radial(violet.600 0%, transparent 60%)"
                  opacity={index + 1 === 10 ? 0.3 : 0.1}
                  transition="transform 0.3s ease, opacity 0.3s ease"
                  _groupHover={{
                    transform: "translate(-50%, -50%) scale(1.1)",
                    opacity: index + 1 === 10 ? 0.5 : 0.3,
                  }}
                  zIndex={0}
                />
                <Loader
                  size={150}
                  src={`/p2p/lottie/lvl${index + 1}.lottie`}
                  delay={0.2}
                  shift={index * 1}
                  zIndex={1}
                />
                <Box
                  mt="-4"
                  fontSize="sm"
                  fontWeight="bold"
                  fontFamily="Montserrat, sans-serif"
                  textAlign="center"
                  zIndex={1}
                  maxW="120px"
                >
                  {level.title}
                </Box>
              </Box>
              {(index + 1) % 5 ? (
                <Box color="violet.700">
                  <FaArrowRight size="1rem" />
                </Box>
              ) : (
                <Box />
              )}
            </React.Fragment>
          ))}
      </Grid>
      <Center mt="8">
        <CustomModal id={`levels`} header="Уровни развития" size="xl">
          <MakerLevelsDescription levels={levels} />
        </CustomModal>
        <Button
          onClick={() => dispatch(triggerModal(`levels`))}
          variant="ghost"
          color="bg.700"
          size="lg"
          rightIcon={<BsArrowRightShort size="1.2rem" />}
        >
          Подробнее про уровни
        </Button>
      </Center>
    </Box>
  );
}
