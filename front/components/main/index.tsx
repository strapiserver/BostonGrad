import React, { useEffect } from "react";
import { VStack, Box, Divider } from "@chakra-ui/react";
import { useAppDispatch } from "../../redux/hooks";
import { clean } from "../../redux/mainReducer";
import { useRouter } from "next/router";
import { IMainText, ICard, IMainSingle } from "../../types/pages";
import { IPopularDirRates } from "../../types/rates";
import { IPm } from "../../types/selector";
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
import GreetingImage from "./greeting";
import { IImage } from "../../types/selector";

type SocialNetworkItem = {
  name: string;
  icon: IImage | null;
};

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
  countries,
  socialNetworks,
}: {
  popularPms?: IPm[] | null;
  popularRates?: IPopularDirRates | null;
  mainTexts?: IMainText[] | null;
  cards?: ICard[] | null;
  mainSingle?: IMainSingle | null;
  rootText?: IDirText | null;
  reviews?: IExchangerReview[] | null;
  countries?: string[] | null;
  socialNetworks?: SocialNetworkItem[] | null;
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
        <GreetingImage
          mainSingle={mainSingle}
          countries={countries || []}
          socialNetworks={socialNetworks || []}
        />
      ) : null}

      <Box mt="-100">
        <Cards cards={cards} />
      </Box>

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
