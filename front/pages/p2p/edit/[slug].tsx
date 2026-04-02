// certain maker page ad
import { Box, Center } from "@chakra-ui/react";
import MakerPage from "../../../components/p2p/edit";
import Loader from "../../../components/shared/Loader";
import { nullSeo } from "../../../components/shared/UniversalSeo";
import Image from "next/image";
import gridPattern from "../../../public/grid.png";
import {
  addHeadersToSearchIndex,
  addPathsToSitemap,
} from "../../../cache/cache";
import {
  loadAllP2PMakers,
  loadFAQbyCategoryCode,
  loadP2PMaker,
  loadP2PAds,
  loadP2PLevels,
  loadP2PTopParameters,
  loadPms,
  loadTestReview,
  TTL,
} from "../../../cache/loadX";
import { ISEO } from "../../../types/general";
import { IFaqCategory } from "../../../types/faq";
import {
  IFullOffer,
  IMaker,
  IMakerPreview,
  IP2PAd,
  IP2PLevel,
  IP2PTopParameter,
} from "../../../types/p2p";
import { IPm } from "../../../types/selector";
import {
  getMakerDisplayName,
  getMakerSlug,
} from "../../../components/p2p/makers/helper";

const selectTopParametersByIds = (
  linked: Array<{ id?: string | number | null } | null | undefined> | null | undefined,
  all: IP2PTopParameter[] | null | undefined,
) => {
  if (!Array.isArray(linked) || !Array.isArray(all) || !all.length) return [];

  const byId = new Map<string, IP2PTopParameter>(
    all.filter((param) => Boolean(param?.id)).map((param) => [String(param.id), param]),
  );
  const selected: IP2PTopParameter[] = [];
  const seen = new Set<string>();

  linked.forEach((param) => {
    const id = param?.id ? String(param.id) : "";
    if (!id || seen.has(id)) return;
    const full = byId.get(id);
    if (!full) return;
    selected.push(full);
    seen.add(id);
  });

  return selected;
};

type PageProps = {
  maker: IMaker | null;
  seo: ISEO;
  faqCategory: IFaqCategory | null;
  fullOffers: Partial<IFullOffer>[] | null;
  p2pLevels: IP2PLevel[] | null;
  p2pAds: IP2PAd[] | null;
};

export default function P2PMakerEditPage({
  maker,
  seo,
  faqCategory,
  fullOffers,
  p2pLevels,
  p2pAds,
}: PageProps) {
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

  return (
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
          style={{ width: "100vw", height: "auto" }}
        />
      </Box>
      <MakerPage
        maker={maker}
        seo={seo}
        faqCategory={faqCategory}
        fullOffers={fullOffers}
        p2pLevels={p2pLevels}
        p2pAds={p2pAds}
      />
    </Box>
  );
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const [
      maker,
      pms,
      faqCategory,
      p2pLevels,
      p2pAds,
      makerTopParameters,
      offerTopParameters,
    ] = await Promise.all([
      loadP2PMaker(slug),
      loadPms(),
      loadFAQbyCategoryCode("p2p_maker_edit"),
      loadP2PLevels(),
      loadP2PAds(),
      loadP2PTopParameters("p2p_maker"),
      loadP2PTopParameters("p2p_offer"),
    ]);

    if (!maker) {
      console.log(`❌ P2P maker failed to load: ${slug}`);
      return { notFound: true };
    }

    let makerWithReviews = maker;
    if (!Array.isArray(maker.reviews) || maker.reviews.length === 0) {
      const testReviews = await loadTestReview();
      if (testReviews.length > 0) {
        makerWithReviews = { ...maker, reviews: testReviews };
      }
    }

    const makerWithTopParameters: IMaker = {
      ...makerWithReviews,
      top_parameters: selectTopParametersByIds(
        makerWithReviews.top_parameters,
        makerTopParameters,
      ),
      offers: Array.isArray(makerWithReviews.offers)
        ? makerWithReviews.offers.map((offer) => ({
            ...offer,
            top_parameters: selectTopParametersByIds(
              offer?.top_parameters,
              offerTopParameters,
            ),
          }))
        : makerWithReviews.offers,
    };

    let fullOffers: Partial<IFullOffer>[] | null = null;
    if (Array.isArray(makerWithTopParameters.offers) && Array.isArray(pms)) {
      const pmsByCode = new Map<string, IPm>();
      pms.forEach((pm) => {
        if (pm?.code) {
          pmsByCode.set(pm.code.toUpperCase(), pm);
        }
      });

      fullOffers = makerWithTopParameters.offers.map((offer) => {
        const [giveCode, getCode] = offer.dir.split("_");
        const givePm = pmsByCode.get((giveCode || "").toUpperCase());
        const getPm = pmsByCode.get((getCode || "").toUpperCase());
        return { ...offer, givePm, getPm };
      });
    }

    const displayName = getMakerDisplayName(makerWithTopParameters);
    const title = `P2P мейкер ${displayName}`;
    const description = `${displayName}: карточка P2P мейкера`;

    const seo: ISEO = {
      title,
      description,
      canonicalSlug: `p2p/edit/${slug}`,
      updatedAt: maker.createdAt || new Date().toISOString(),
    };

    await addHeadersToSearchIndex({
      slug: `p2p/edit/${slug}`,
      header: `P2P мейкер ${displayName}`,
      wordsToSearchFrom: displayName,
    });

    return {
      props: {
        maker: makerWithTopParameters,
        seo,
        faqCategory: faqCategory || null,
        fullOffers: fullOffers || null,
        p2pLevels: p2pLevels || null,
        p2pAds: p2pAds || null,
      },
      revalidate: TTL.slow,
    };
  } catch (error) {
    console.error("🚨 getStaticProps error:", error);

    return {
      props: {
        maker: null,
        seo: nullSeo,
        faqCategory: null,
        fullOffers: null,
        p2pLevels: null,
        p2pAds: null,
      },
      revalidate: TTL.slow,
    };
  }
}

export async function getStaticPaths() {
  try {
    const makers = (await loadAllP2PMakers()) as IMakerPreview[] | null;
    if (!makers || !Array.isArray(makers)) {
      console.warn("⚠️ No P2P makers found, returning empty paths");
      return {
        paths: [],
        fallback: false,
      };
    }

    const paths = makers
      .map((maker) => getMakerSlug(maker))
      .filter((slug) => Boolean(slug))
      .map((slug) => ({ params: { slug } }));

    const prerenderLimit = process.env.NEXT_PUBLIC_PRERENDER_LIMIT
      ? Number(process.env.NEXT_PUBLIC_PRERENDER_LIMIT)
      : 5000;

    const slicedPaths = paths.slice(0, prerenderLimit);
    await addPathsToSitemap(paths, { basePath: "p2p/edit" });

    return {
      paths: slicedPaths,
      fallback: "blocking",
    };
  } catch (error) {
    return {
      paths: [],
      fallback: "blocking",
    };
  }
}
