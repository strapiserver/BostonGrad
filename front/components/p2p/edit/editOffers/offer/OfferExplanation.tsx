import React from "react";
import { Box } from "@chakra-ui/react";
import { IFullOffer } from "../../../../../types/p2p";
import {
  beautifyAmount,
  curToSymbol,
} from "../../../../../redux/amountsHelper";
import { useAppSelector } from "../../../../../redux/hooks";
import { ResponsiveText } from "../../../../../styles/theme/custom";
import { checkBlockchainExists } from "./helpers";

type Props = {
  fullOffer: Partial<IFullOffer>;
};

export default function OfferExplanation({ fullOffer }: Props) {
  const makerP2PLevel = useAppSelector((state) => state.main.maker?.p2p_level);
  const offerIndex = fullOffer?.index;
  const storeOffer = useAppSelector((state) =>
    offerIndex !== undefined ? state.main.p2pFullOffers[offerIndex] : undefined,
  );

  const offer = fullOffer || {};
  const activeSide = offer.side as "give" | "get";
  const givePm = offer.givePm;
  const getPm = offer.getPm;
  const giveCur = givePm?.currency?.code?.toUpperCase();
  const getCur = getPm?.currency?.code?.toUpperCase();
  const mainCur = activeSide == "give" ? giveCur : getCur;
  const course = offer.course;
  const feeAmount = offer.fee_amount;
  const feeType = offer.fee_type;

  const feeEnabled =
    offer.fee_enabled ??
    (feeAmount !== null && feeAmount !== undefined ? true : Boolean(feeType));
  const toUSD =
    (storeOffer?.[`${activeSide}ToUSD`] ?? offer?.[`${activeSide}ToUSD`]) || 0;

  if (!givePm || !getPm || !giveCur || !getCur) return null;

  const normalizedGiveAmount =
    course && activeSide === "give"
      ? course
      : course && activeSide === "get"
        ? 1
        : undefined;
  const normalizedGetAmount =
    course && activeSide === "give"
      ? 1
      : course && activeSide === "get"
        ? 1 / course
        : undefined;

  const givePmRuName = (givePm.ru_name ?? givePm.en_name)?.toLowerCase();
  const getPmRuName = (getPm.ru_name ?? getPm.en_name)?.toLowerCase();

  const explanation =
    normalizedGiveAmount && normalizedGetAmount && course && course >= 1
      ? `Клиент покупает твой ${getPmRuName} по курсу ${beautifyAmount(course, 1)} ${curToSymbol(giveCur)} за 1 ${curToSymbol(getCur)}.`
      : normalizedGiveAmount && normalizedGetAmount && course && course < 1
        ? `Клиент продает тебе ${givePmRuName} по курсу 1 ${curToSymbol(giveCur)} за ${beautifyAmount(1 / course, 1)} ${curToSymbol(getCur)}.`
        : "Установите курс";

  const feeSuffix = (() => {
    if (!feeEnabled) return "";
    const feeLabel =
      feeAmount && feeAmount < 0 ? "Твоя доплата:" : "Твоя комиссия:";
    if (feeAmount === null || feeAmount === undefined || !feeType) {
      return "";
    }
    const feeValue = Math.abs(feeAmount);
    if (feeType === "percentage") {
      return ` \n  ${feeLabel} ${beautifyAmount(feeValue, 2)}%`;
    }
    if (feeType === "give") {
      return ` \n  ${feeLabel} ${beautifyAmount(feeValue, 2)} ${curToSymbol(
        giveCur,
      )}`;
    }
    return ` \n  ${feeLabel} ${beautifyAmount(feeValue, 2)} ${curToSymbol(getCur)}`;
  })();

  const blockchainExists = checkBlockchainExists(giveCur, getCur);
  const blockchainSuffix = blockchainExists
    ? `Или используйте эскроу-смарт-контракт для более безопасной сделки в одну транзакцию. Контракт временно блокирует поступившие средства автоматически. Контракту доступны только два действия: перевод получателю или возврат. Прямого доступа к средствам у сервиса p2pie нет.`
    : "";

  const rawLimit = toUSD * (makerP2PLevel?.limit_online_usd || 0);
  const limit =
    Number.isFinite(rawLimit) && rawLimit > 0
      ? beautifyAmount(rawLimit, 2)
      : "0";
  const limitsSuffix = ` Сделка свыше ${limit} ${curToSymbol(mainCur)} оплачивается частями не более ${limit} ${curToSymbol(mainCur)}. Чтобы повысить лимит разовой транзакции перейдите на следующий уровень.  ${blockchainSuffix}`;

  return (
    <Box w="100%" whiteSpace="preserve-breaks">
      <ResponsiveText whiteSpace="unset" mb="2" size="sm">
        {`${explanation}   ${limitsSuffix} ${feeSuffix}`}
      </ResponsiveText>
    </Box>
  );
}
