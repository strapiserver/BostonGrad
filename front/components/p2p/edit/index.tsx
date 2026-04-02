import React, { useEffect, useMemo } from "react";
import { Box, Center, Divider, VStack } from "@chakra-ui/react";
import UniversalSeo from "../../shared/UniversalSeo";
import Loader from "../../shared/Loader";
import { ISEO } from "../../../types/general";
import { IFaqCategory } from "../../../types/faq";
import {
  IFullOffer,
  IMaker,
  IP2PAd,
  IP2PLevel,
} from "../../../types/p2p";
import MakerMap from "./MakerMap";

import ExchangerReviews from "../../exchangers/exchanger/reviews";
import { IExchangerReview } from "../../../types/exchanger";
import MakerTopPanel from "./topPanel";
import MakerStats from "./stats";
import { BoxWrapper } from "../../shared/BoxWrapper";

import { FaqCategoriesList } from "../../faq";
import EditOffers from "./editOffers";
import MakerDescriptionEdit from "./MakerDescriptionEdit";
import MakerGreeting from "./MakerGreeting";

import P2PAdvantages from "./p2pAdvantages";
import CustomTitle from "../../shared/CustomTitle";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setMakerFields, setP2PFullOffers } from "../../../redux/mainReducer";
import { fetchTopParameters } from "../../../redux/thunks";
import SaveMaker from "./topPanel/SaveMaker";
import MakerLevels from "./levels";
import MakerAds from "./ads";
import { MakerEditProvider } from "./MakerEditContext";

export default function MakerEditPage({
  maker,
  seo,
  faqCategory,
  fullOffers,
  p2pLevels,
  p2pAds,
}: {
  maker: IMaker | null;
  seo: ISEO;
  faqCategory?: IFaqCategory | null;
  fullOffers?: Partial<IFullOffer>[] | null;
  p2pLevels?: IP2PLevel[] | null;
  p2pAds?: IP2PAd[] | null;
}) {
  const dispatch = useAppDispatch();
  const offersCount = useAppSelector(
    (state) => state.main.p2pFullOffers.length,
  );
  const makerDraft = useAppSelector((state) => state.main.maker);
  const topParametersCount = useAppSelector(
    (state) => state.main.topParameters.length,
  );

  if (!maker) {
    return (
      <Center
        w="100%"
        h="100%"
        justifyContent="center"
        alignItems="center"
        minW="100"
        minH="100"
      >
        <Loader size="xl" />
      </Center>
    );
  }

  const offers = useMemo(() => fullOffers || null, [fullOffers]);
  useEffect(() => {
    if (!offers?.length || offersCount) return;
    dispatch(setP2PFullOffers(offers));
  }, [dispatch, offers, offersCount]);

  useEffect(() => {
    if (topParametersCount) return;
    dispatch(fetchTopParameters());
  }, [dispatch, topParametersCount]);

  useEffect(() => {
    if (!maker) return;
    const needsBackfill =
      !makerDraft ||
      makerDraft.status === undefined ||
      makerDraft.telegram_name === undefined ||
      makerDraft.telegram_username === undefined ||
      makerDraft.description === undefined ||
      makerDraft.p2p_level === undefined ||
      makerDraft.top_parameters === undefined;
    if (!needsBackfill) return;
    dispatch(
      setMakerFields({
        status: makerDraft?.status ?? maker.status ?? undefined,
        telegram_name: makerDraft?.telegram_name ?? maker.telegram_name ?? null,
        telegram_username:
          makerDraft?.telegram_username ?? maker.telegram_username ?? null,
        description: makerDraft?.description ?? maker.description ?? null,
        p2p_level: makerDraft?.p2p_level ?? maker.p2p_level ?? null,
        top_parameters:
          makerDraft?.top_parameters ?? maker.top_parameters ?? null,
      }),
    );
  }, [dispatch, maker, makerDraft]);
  const reviews = Array.isArray(maker.reviews) ? maker.reviews : null;

  return (
    <>
      <UniversalSeo seo={seo} />
      <MakerEditProvider maker={maker}>
        <Box>
          <MakerGreeting />
          <VStack>
            <P2PAdvantages />
          </VStack>

          <CustomTitle
            as="h3"
            mb="0"
            title={"Четкая стратегия роста"}
            subtitle={
              "Развивайся от частника до обменника и зарабатывай в разы больше"
            }
            subtitle2={"Мы уже прошли этот путь. Поделимся опытом."}
          />
          <MakerLevels levels={p2pLevels} />
          <CustomTitle
            as="h3"
            mb="0"
            mt="20"
            title={"Твоя p2p страница"}
            subtitle={"Внеси правки и опубликуй предложения обмена"}
          />
          <BoxWrapper variant="no_contrast" data-editing="true" mt="20">
            <MakerTopPanel />
            <Divider my="4" />
            <MakerStats maker={maker} />
          </BoxWrapper>
          <EditOffers offers={offers} />
          <MakerDescriptionEdit description={maker.description} />

          <MakerMap coordinates={maker.coordinates} />

          <Center mb="20" gap="4" flexDir="column">
            <CustomTitle
              as="h3"
              mb="4"
              mt="10"
              title={"Все готово?"}
              subtitle="Опубликуй предожения и жди оповещений в телеграм-боте."
              subtitle2="Бот выдаст ссылку на твою личную страницу. Используй ее для обмена."
            />

            <SaveMaker isBig />
          </Center>

          <ExchangerReviews reviews={reviews as IExchangerReview[] | null} />
          {faqCategory ? (
            <FaqCategoriesList
              categories={[faqCategory]}
              customTitle={"Зачем нужен p2pie"}
            />
          ) : (
            <></>
          )}
        </Box>
        <CustomTitle
          as="h3"
          title={"Дополнительные инструменты"}
          subtitle={
            "Используй эти опции чтобы улучшить свой сервис и повысить прибыль"
          }
        />
        <MakerAds ads={p2pAds} />
      </MakerEditProvider>
    </>
  );
}
