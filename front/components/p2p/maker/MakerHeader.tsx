import { Button, Divider, HStack, Tag, VStack } from "@chakra-ui/react";
import { BoxWrapper } from "../../shared/BoxWrapper";
import { ResponsiveText } from "../../../styles/theme/custom";
import { IMaker } from "../../../types/p2p";
import { getMakerDisplayName } from "../makers/helper";
import ExchangerTopPanel from "../../exchangers/exchanger/exchangerTopPanel";
import { IExchanger, IExchangerTag } from "../../../types/exchanger";
import MakerStats from "../edit/stats";
import MakerTopPanel from "./topPanel";

const getTelegramLink = (username: string) => {
  const cleaned = username.replace(/^@/, "").trim();
  return cleaned ? `https://t.me/${cleaned}` : "";
};

export default function MakerHeader({ maker }: { maker: IMaker }) {
  const displayName = getMakerDisplayName(maker);
  const telegramLink = getTelegramLink(maker.telegram_username);
  const nameFallback = displayName || String(maker.id);

  return (
    <BoxWrapper variant="no_contrast">
      <VStack alignItems="start" gap="4" w="100%">
        <MakerTopPanel maker={maker} />

        <HStack spacing="3" w="100%" justifyContent="space-between">
          <HStack spacing="3">
            <ResponsiveText size="sm" color="bg.700" variant="primary">
              {`@${maker.telegram_username.replace(/^@/, "")}`}
            </ResponsiveText>
            {maker.status ? (
              <Tag colorScheme="orange">{maker.status.toUpperCase()}</Tag>
            ) : null}
          </HStack>
          {telegramLink ? (
            <Button
              as="a"
              href={telegramLink}
              target="_blank"
              rel="noreferrer"
              size="sm"
              variant="outline"
            >
              Telegram
            </Button>
          ) : null}
        </HStack>

        <Divider mb="2" />
        <MakerStats maker={maker} />
      </VStack>
    </BoxWrapper>
  );
}
