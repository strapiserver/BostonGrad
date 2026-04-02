import { Box, HStack } from "@chakra-ui/react";
import { IDotColors } from "../../../../types/exchanger";
import { IMaker } from "../../../../types/p2p";
import ExchangerName from "../../../shared/ExchangerNameRating";
import MakerTags from "./MakerTags";
import Actions from "../../../exchangers/exchanger/exchangerTopPanel/Actions";
import { ExchangerTopButtons } from "../../../exchangers/exchanger/exchangerTopPanel/ExchangerTopButtons";
const MakerTopPanel = ({ maker }: { maker: IMaker }) => {
  const statusColor: IDotColors =
    maker.status === "active" ? "green" : "orange";
  const displayName =
    maker.telegram_name || maker.telegram_username.toUpperCase();

  return (
    <HStack justifyContent="space-between" gap="2" position="relative">
      <ExchangerName
        name={maker.telegram_name || maker.telegram_username.toUpperCase()}
        logo={maker.avatar}
        statusColor={statusColor}
      />

      <MakerTags tags={maker.exchanger_tags} />
      <Actions id={maker.id} displayName={displayName} />
      <Box display={{ base: "none", lg: "flex" }} flexDir="row" gap="2">
        <ExchangerTopButtons ref_link={maker.telegram_username} />
      </Box>
    </HStack>
  );
};

export default MakerTopPanel;
