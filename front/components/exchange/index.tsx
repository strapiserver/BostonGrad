import {
  Box,
  Grid,
  Heading,
  VStack,
  Text,
  HStack,
  Center,
  useColorModeValue,
  useToken,
  Divider,
} from "@chakra-ui/react";
import { Box3D } from "../../styles/theme/custom";

import { IPm } from "../../types/selector";
import LimitsRange from "../main/limits";
import TV from "./tv";
import Calculator from "../main/Calculator";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setLoadingStatus, setInitialData } from "../../redux/mainReducer";
import DirText from "./DirText";

import Chart from "./Chart";
import {
  fetchCurrencyConverterRates,
  fetchPossiblePairs,
} from "../../redux/thunks";
import { useEffect } from "react";

import { batch } from "react-redux";
import SimilarList from "./SimilarList";
import { Column } from "../layout/Column";

import { ICity, IDirText, IPmData } from "../../types/exchange";
import ColumnGrid from "../layout/ColumnGrid";

import UniversalSeo from "../shared/UniversalSeo";
import { ISEO } from "../../types/general";
import { IMassDirTextId } from "../../types/mass";

import { TextToHTML } from "../shared/helper";
import { codeToRuName2, codeToRuName3 } from "../../redux/amountsHelper";
import Loader from "../shared/Loader";
import { TitleH2 } from "../shared/TitleH2";

const Exchange = ({
  seo,
  dirText,
  givePmData,
  getPmData,
  city,
  similarPmPairs,
  donorCity,
  dirTextIds,
}: {
  //article?: IArticle | null;
  seo: ISEO;

  givePmData: IPmData | null;
  getPmData: IPmData | null;
  dirText: IDirText | null;
  city: ICity | null;
  similarPmPairs: IPm[][] | null;
  donorCity: ICity | null;
  dirTextIds: IMassDirTextId[];
}) => {
  const dispatch = useAppDispatch();

  const [peripheryColor, centerColor] = useToken(
    "colors",
    useColorModeValue(["bg.500", "violet.700"], ["bg.400", "violet.600"])
  );

  if (!givePmData?.pm || !getPmData?.pm) {
    return (
      <Center h="100vh">
        <Loader size="md" />
      </Center>
    );
  }
  const [givePm, getPm] = [givePmData.pm, getPmData.pm];
  const dir = `${givePm.code}_${getPm.code}`;
  const curPair = `${givePm.currency.code}_${getPm.currency.code}`;
  const isLong = dirText?.h1 ? dirText?.h1.length > 30 : true;

  useEffect(() => {
    batch(() => {
      dispatch(fetchCurrencyConverterRates({ curPair }));
      dispatch(fetchPossiblePairs({ code: givePm.code, side: "give" }));
      dispatch(fetchPossiblePairs({ code: getPm.code, side: "get" }));
      dispatch(setLoadingStatus("fulfilled"));
      dispatch(
        setInitialData({
          givePm,
          getPm,
          city,
        })
      );
    });
  }, [dir, city]);

  const giveCur = givePm.currency.code.toUpperCase();
  const getCur = getPm.currency.code.toUpperCase();

  return (
    <VStack mt={[0, 4]}>
      <UniversalSeo seo={seo} />

      {/* <Box
        bgGradient={`radial-gradient(circle at 50% -10%, ${centerColor} 0%, ${peripheryColor} 60%)`}
        bgClip="text"
        mx="2"
        mt="-4"
        alignSelf={{ lg: "start", base: "unset" }}
      >
        <Heading
          fontSize={{ base: isLong ? "md" : "lg", lg: isLong ? "lg" : "xl" }}
          as="h1"
          fontWeight="bold"
          color="inherit"
        >
          {dirText?.h1}
        </Heading>
      </Box> */}

      <ColumnGrid>
        <Column index={0}>
          <TitleH2 isLong={isLong}>
            <>{`Курс ${codeToRuName2(giveCur)} к ${codeToRuName3(
              getCur
            )} на сегодня`}</>
          </TitleH2>

          <Chart giveCur={giveCur} getCur={getCur} />
          <TitleH2 isLong={isLong}>
            <>Похожие направления:</>
          </TitleH2>

          {similarPmPairs && (
            <SimilarList
              similarPmPairs={similarPmPairs}
              givePm={givePm}
              getPm={getPm}
              dirTextIds={dirTextIds}
              city={city}
            />
          )}
        </Column>

        <Column index={1}>
          <TitleH2 isLong={isLong}>
            <TextToHTML text={dirText?.h1} />
          </TitleH2>

          <HStack
            mb="4"
            h={{ base: "unset", lg: "200px" }}
            gap="4"
            alignItems="stretch"
          >
            <Calculator />

            <LimitsRange />
          </HStack>
          <Box display={{ base: "none", lg: "block" }}>
            <TitleH2 isLong={isLong}>
              <>Предложения обмена:</>
            </TitleH2>
          </Box>

          <TV dir={dir} city={city} donorCity={donorCity} dirText={dirText} />
        </Column>
        <Box3D
          p="4"
          variant="no_contrast"
          gridColumn={{ base: "unset", lg: "1/3" }}
          gridRow={{ base: "3", lg: "2" }}
        >
          <DirText
            dirText={dirText}
            givePmData={givePmData}
            getPmData={getPmData}
            city={city}
          />
        </Box3D>
      </ColumnGrid>
    </VStack>
  );
};

export default Exchange;
