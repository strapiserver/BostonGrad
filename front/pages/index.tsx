import MainPageContent from "../components/main";
import { ICard, IMainSingle } from "../types/pages";
import UniversalSeo, { nullSeo } from "../components/shared/UniversalSeo";
import { ISEO } from "../types/general";
import { Box } from "@chakra-ui/react";
import Image from "next/image";
import gridPattern from "../public/grid.png";
import { loadCards, loadMainSingle, TTL } from "../cache/loadX";

export const getStaticProps = async () => {
  try {
    const mainSingle = await loadMainSingle();
    const cards = await loadCards();

    const seo: ISEO = {
      title: mainSingle?.seo_title || mainSingle?.title || "Главная",
      description:
        mainSingle?.seo_subtitle || mainSingle?.subtitle || "Главная страница",
      canonicalSlug: "",
    };

    return {
      props: {
        seo: seo || nullSeo,
        mainSingle: (mainSingle || null) as IMainSingle | null,
        cards: (cards || []) as ICard[],
        popularPms: [],
        popularRates: null,
        mainTexts: [],
        rootText: null,
        reviews: [],
      },
      revalidate: TTL.slow,
    };
  } catch (e) {
    console.error("Error during getStaticProps:", e);

    return {
      props: {
        seo: nullSeo,
        mainSingle: null,
        cards: [],
        popularPms: [],
        popularRates: null,
        mainTexts: [],
        rootText: null,
        reviews: [],
      },
      revalidate: TTL.slow,
    };
  }
};

const Home = (props: any) => {
  return (
    <>
      <UniversalSeo seo={props.seo} />
      <Box position="relative" w="100%">
        <Box
          position="absolute"
          top="1%"
          left="50%"
          transform="translateX(-50%)"
          w="100vw"
          filter={{ base: "opacity(0.5)", lg: "opacity(0.3)" }}
          zIndex={0}
          pointerEvents="none"
        >
          <Image
            src={gridPattern}
            alt="Grid background pattern"
            width={2000}
            height={420}
            loading="eager"
            style={{ width: "100vw", height: "auto" }}
          />
        </Box>
        <MainPageContent {...props} />
      </Box>
    </>
  );
};

export default Home;
