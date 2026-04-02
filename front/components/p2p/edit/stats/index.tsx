import { Box, Text, Divider, HStack, VStack } from "@chakra-ui/react";
import { IMaker } from "../../../../types/p2p";
import { Box3D, ResponsiveText } from "../../../../styles/theme/custom";
import StatItem from "./StatItem";
import { FaRegHandshake } from "react-icons/fa6";
import { TbPencil } from "react-icons/tb";
import { MdOutlineDateRange } from "react-icons/md";
import { RiExchange2Line } from "react-icons/ri";
import MakerRating from "./MakerRating";
import { FaCheck } from "react-icons/fa6";
import { FaXmark } from "react-icons/fa6";
import MyTooltip from "../../../shared/MyTooltip";
export default function MakerStats({ maker }: { maker: IMaker }) {
  const offers = Array.isArray(maker.offers) ? maker.offers : null;
  const reviews = Array.isArray(maker.reviews) ? maker.reviews : null;
  const offersCount = offers ? offers.length : null;
  const reviewsCount = reviews ? reviews.length : null;

  const formattedDate = maker.createdAt
    ? new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(maker.createdAt))
    : "";

  const level = maker.p2p_level;
  const levelConditions = Array.isArray(level?.p2p_conditions)
    ? level.p2p_conditions
    : Array.isArray(level?.conditions)
      ? level.conditions
      : [];
  const completedConditionIds = new Set(
    (Array.isArray(maker.p2p_conditions_completed)
      ? maker.p2p_conditions_completed
      : []
    )
      .map((condition) => (condition?.id ? String(condition.id) : ""))
      .filter(Boolean),
  );
  const conditions = levelConditions.map((condition) => {
    const id = condition?.id ? String(condition.id) : "";
    const isCompleted = id
      ? completedConditionIds.has(id)
      : Boolean(condition?.is_completed);
    return { ...condition, is_completed: isCompleted };
  });
  const completed = conditions.filter(
    (condition) => condition?.is_completed,
  ).length;
  const total = conditions.length;

  return (
    <HStack alignItems="start">
      <MakerRating
        completed={completed}
        total={total}
        level={maker.p2p_level?.level || 1}
      />
      <Divider mt="2" orientation="vertical" h="80px" mx="2" />
      <Box w="fit-content" mt="2">
        <StatItem
          label="Предложений"
          value={offersCount}
          Icon={RiExchange2Line}
        />

        <StatItem label="Сделок" value={0} Icon={FaRegHandshake} />

        <StatItem label="Отзывов" value={reviewsCount} Icon={TbPencil} />

        <StatItem
          label="Создан"
          value={formattedDate}
          Icon={MdOutlineDateRange}
        />
      </Box>
      <Divider mt="2" orientation="vertical" h="80px" mx="2" />
      <VStack w="100%" mt="2" spacing="1" alignItems="start">
        <Text fontSize="sm" mb="2" ml="2" color="bg.700">
          Для перехода на следующий уровень необходимо:
        </Text>
        {conditions.map((c, index) => (
          <Box3D
            cursor="pointer"
            key={c.id || c.description || `condition-${index}`}
            py="1"
            px="2"
            w="100%"
            variant={c.is_completed ? "contrast" : "extra_contrast"}
            color={c.is_completed ? "green.300" : "red.300"}
          >
            <MyTooltip label={c.description || ""}>
              <HStack w="100%" justifyContent="space-between">
                <Text
                  fontSize="sm"
                  color={c.is_completed ? "bg.400" : "bg.200"}
                >
                  {`${index + 1}) ${c.title}`}
                </Text>
                {c.is_completed ? (
                  <FaCheck size="1rem" />
                ) : (
                  <FaXmark size="1rem" />
                )}
              </HStack>
            </MyTooltip>
          </Box3D>
        ))}
      </VStack>
    </HStack>
  );
}
