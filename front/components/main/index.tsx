import React, { useEffect } from "react";
import { VStack, Box, Divider } from "@chakra-ui/react";
import { useAppDispatch } from "../../redux/hooks";
import { clean } from "../../redux/mainReducer";
import { useRouter } from "next/router";
import { ICard, IMainSingle, IStory } from "../../types/pages";
import MassSelector from "./massSelectorSwiper";
import Advantages from "./advantages";
import CustomTitle from "../shared/CustomTitle";
import GeneralStats from "./GeneralStats";
import UniPreview from "./uni_preview";
import CityMapView from "../map";
import { MapHeadings, CityCashSection } from "../map/types";
import { ClosestCityMatch } from "../map/helper";
import { ICity } from "../../types/exchange";
import GreetingImage from "./greeting";
import { IImage } from "../../types/selector";
import MockStoryline from "./mockStoryline";
import ProgramModules from "./ProgramModules";
import Forms from "./form";

type SocialNetworkItem = {
  name: string;
  icon: IImage | null;
  url: string;
};
type CountryOption = {
  id: string;
  name: string;
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
  cards,
  mainSingle,
  countries,
  socialNetworks,
  stories,
}: {
  cards?: ICard[] | null;
  mainSingle?: IMainSingle | null;
  countries?: CountryOption[] | null;
  socialNetworks?: SocialNetworkItem[] | null;
  stories?: IStory[] | null;
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

      <Box mt={{ base: "0", md: "-100" }} position="relative" zIndex={4}>
        <UniPreview cards={cards} />
      </Box>

      <Divider mt="4" />
      <GeneralStats />

      <CustomTitle
        as="h2"
        title={"Поиск программ"}
        subtitle={"Интенсивное обучение 2 недели от лучших университетов мира."}
      />

      <MassSelector />

      <ProgramModules
        programTitle={mainSingle?.program_title}
        programWeeks={mainSingle?.program_weeks}
        reasonsTitle={mainSingle?.reasons_title}
        reasons={mainSingle?.reasons}
        guaranteeTitle={mainSingle?.guarantee_title}
        guarantees={mainSingle?.guarantees}
        priceTitle={mainSingle?.price_title}
        priceValue={mainSingle?.price_value}
        priceNote={mainSingle?.price_note}
        priceButtonText={mainSingle?.price_button_text}
      />

      {/* <CustomTitle
        as="h2"
        title={"Преимущества"}
        subtitle={"Работаем на репутацию, а не на прибыль"}
      />

      <Advantages /> */}

      <CityMapView
        city={mainMapCity}
        exchangerList={[]}
        headings={mainMapHeadings}
        cashSections={mainMapCashSections}
        cityText={null}
        closestCities={mainMapClosestCities}
      />

      <MockStoryline stories={stories || []} />

      <Box
        w="100%"
        mt={{ base: "10", md: "14" }}
        px={{ base: "4", md: "8" }}
        py={{ base: "8", md: "10" }}
        bg="linear-gradient(165deg, #5b1f1f 0%, #431616 100%)"
        borderTop="1px solid rgba(255,210,130,0.5)"
      >
        <Forms
          title="Оставьте заявку"
          countries={countries || []}
          socialNetworks={socialNetworks || []}
        />
      </Box>
    </VStack>
  );
};

export default MainPageContent;
