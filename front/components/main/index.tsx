import React, { useEffect } from "react";
import { VStack, Box, Divider } from "@chakra-ui/react";
import Greeting from "./Greeting";
import Calculator from "./Calculator";
import { useAppDispatch } from "../../redux/hooks";
import { clean } from "../../redux/mainReducer";
import { useRouter } from "next/router";
import ColumnGrid from "../layout/ColumnGrid";
import Column from "../layout/Column";
import { ResponsiveText } from "../../styles/theme/custom";
import { IMainText, ICard, IMainSingle } from "../../types/pages";
import { IPopularDirRates } from "../../types/rates";
import { IPm } from "../../types/selector";
import CircularTexts from "./CircularTexts";
import Popular from "./popular";
import { IDirText } from "../../types/exchange";
import MassSelector from "./massSelectorSwiper";
import Advantages from "./advantages";
import CustomTitle from "../shared/CustomTitle";
import AllReviews from "./allReviews";
import { IExchangerReview } from "../../types/exchanger";
import GeneralStats from "./GeneralStats";
import Cards from "./cards";
import CityMapView from "../map";
import { MapHeadings, CityCashSection } from "../map/types";
import { ClosestCityMatch } from "../map/helper";
import { ICity } from "../../types/exchange";
import CustomImage from "../shared/CustomImage";
import Glass from "../shared/Glass";

const mainMapCity: ICity = {
  codes: [],
  en_name: "boston",
  ru_name: "Бостон",
  population: 0,
  coordinates: [42.3601, -71.0589],
  preposition: "Бостоне",
  closest_cities: [],
  en_country_name: "USA",
  ru_country_name: "США",
};

const mainMapHeadings: MapHeadings = {
  h1: "Университеты на карте",
  h2: "Карта университетов",
  description: "Карта всех университетов, которые можно посетить",
  empty: "Сейчас нет доступных университетов",
  directionsTitle: "Популярные университеты",
  directionsEmpty: "Нет доступных университетов",
};

const mainMapCashSections: CityCashSection[] = [];
const mainMapClosestCities: ClosestCityMatch[] = [];

const MainPageContent = ({
  popularPms,
  popularRates,
  mainTexts,
  cards,
  mainSingle,
  rootText,
  reviews,
}: {
  popularPms?: IPm[] | null;
  popularRates?: IPopularDirRates | null;
  mainTexts?: IMainText[] | null;
  cards?: ICard[] | null;
  mainSingle?: IMainSingle | null;
  rootText?: IDirText | null;
  reviews?: IExchangerReview[] | null;
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { slug } = router.query;

  useEffect(() => {
    if (!slug) {
      dispatch(clean());
    }
  }, [slug, dispatch]);

  return (
    <VStack align="stretch" w="100%">
      {mainSingle ? (
        <VStack
          align="stretch"
          spacing="3"
          width="100vw"
          position="relative"
          left="50%"
          right="50%"
          ml="-50vw"
          mr="-50vw"
        >
          <Box position="relative">
            {mainSingle.image ? (
              <CustomImage
                img={mainSingle.image}
                w="100vw"
                h="auto"
                objectFit="contain"
                lowQualityOnMobile
                customAlt={mainSingle.title || "Main image"}
              />
            ) : null}

            {/* <Box
              position="absolute"
              top="100px"
              left="50%"
              transform="translateX(-50%)"
              w={{ base: "92vw", md: "680px" }}
              maxW="92vw"
            >
              <Glass>
                <ResponsiveText variant="contrast" size="2xl" fontWeight="700">
                  {mainSingle.title || ""}
                </ResponsiveText>
                <ResponsiveText variant="no_contrast" whiteSpace="normal">
                  {mainSingle.subtitle || ""}
                </ResponsiveText>
              </Glass>
            </Box> */}
          </Box>
        </VStack>
      ) : null}
      <Box mt="-100">
        <Cards cards={cards} />
      </Box>

      <Greeting />

      {/* <ColumnGrid>
        <Column index={3}>
          <CircularTexts mainTexts={mainTexts || []} />
        </Column>
        <Column index={1}>
          <Calculator />
        </Column>
        <Column index={4}>
          <Box p="2">
            <ResponsiveText variant="contrast" whiteSpace="normal" size="lg">
              {rootText?.header || ""}
            </ResponsiveText>
            <Divider my="2" />
            <ResponsiveText variant="no_contrast" whiteSpace="normal">
              {rootText?.text || ""}
            </ResponsiveText>
          </Box>
        </Column>
        <Column index={2}>
          <Popular
            popularRates={popularRates || null}
            popularPms={popularPms || []}
          />
        </Column>
      </ColumnGrid> */}

      <Divider mt="4" />
      <GeneralStats />

      <CustomTitle
        as="h2"
        title={"Поиск программ"}
        subtitle={"Интенсивное обучение 2 недели от лучших университетов мира."}
      />

      <MassSelector />

      <CustomTitle
        as="h2"
        title={"Преимущества"}
        subtitle={"Работаем на репутацию, а не на прибыль"}
      />

      <Advantages />

      <CustomTitle
        fontSize={{ base: "xl", lg: "4xl" }}
        as="h2"
        mb="0"
        ml="8"
        title={"Репутация и доверие"}
        subtitle={"Реальные отзывы клиентов"}
      />

      <AllReviews reviews={reviews || []} />

      <CustomTitle
        as="h2"
        title={"Карта"}
        subtitle={"Локации офисов на карте"}
      />
      <CityMapView
        city={mainMapCity}
        exchangerList={[]}
        headings={mainMapHeadings}
        cashSections={mainMapCashSections}
        cityText={null}
        closestCities={mainMapClosestCities}
      />
    </VStack>
  );
};

export default MainPageContent;
