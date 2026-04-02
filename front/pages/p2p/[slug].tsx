// certain maker page ad
import { Center } from "@chakra-ui/react";
import MakerPage from "../../components/p2p/maker";
import Loader from "../../components/shared/Loader";
import { nullSeo } from "../../components/shared/UniversalSeo";
import { addHeadersToSearchIndex, addPathsToSitemap } from "../../cache/cache";
import {
  loadAllP2PMakers,
  loadFAQbyCategoryCode,
  loadP2PMaker,
  loadP2PTopParameters,
  loadPms,
  TTL,
} from "../../cache/loadX";
import { ISEO } from "../../types/general";
import { IFaqCategory } from "../../types/faq";
import { IFullOffer, IMaker, IMakerPreview, IP2PTopParameter } from "../../types/p2p";
import { IPm } from "../../types/selector";
import {
  getMakerDisplayName,
  getMakerSlug,
} from "../../components/p2p/makers/helper";

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
  pms: IPm[] | null;
  faqCategory: IFaqCategory | null;
};

export default function P2PMakerPage({
  maker,
  seo,
  pms,
  faqCategory,
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
    <MakerPage maker={maker} seo={seo} pms={pms} faqCategory={faqCategory} />
  );
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const [maker, pms, faqCategory, makerTopParameters, offerTopParameters] =
      await Promise.all([
        loadP2PMaker(slug),
        loadPms(),
        loadFAQbyCategoryCode("p2p_maker"),
        loadP2PTopParameters("p2p_maker"),
        loadP2PTopParameters("p2p_offer"),
      ]);

    if (!maker) {
      console.log(`❌ P2P maker failed to load: ${slug}`);
      return { notFound: true };
    }

    let makerWithFullOffers: IMaker = {
      ...maker,
      top_parameters: selectTopParametersByIds(maker.top_parameters, makerTopParameters),
      offers: Array.isArray(maker.offers)
        ? maker.offers.map((offer) => ({
            ...offer,
            top_parameters: selectTopParametersByIds(
              offer?.top_parameters,
              offerTopParameters,
            ),
          }))
        : maker.offers,
    };

    if (Array.isArray(makerWithFullOffers.offers) && Array.isArray(pms)) {
      const pmsByCode = new Map<string, IPm>();
      pms.forEach((pm) => {
        if (pm?.code) {
          pmsByCode.set(pm.code.toUpperCase(), pm);
        }
      });

      const fullOffers = makerWithFullOffers.offers.map((offer) => {
        const [giveCode, getCode] = offer.dir.split("_");
        const givePm = pmsByCode.get((giveCode || "").toUpperCase());
        const getPm = pmsByCode.get((getCode || "").toUpperCase());
        return { ...offer, givePm, getPm };
      });
      makerWithFullOffers = { ...makerWithFullOffers, offers: fullOffers };
    }

    const displayName = getMakerDisplayName(makerWithFullOffers);
    const title = `P2P мейкер ${displayName}`;
    const description = `${displayName}: карточка P2P мейкера`;

    const seo: ISEO = {
      title,
      description,
      canonicalSlug: `p2p/${slug}`,
      updatedAt: maker.createdAt || new Date().toISOString(),
    };

    await addHeadersToSearchIndex({
      slug: `p2p/${slug}`,
      header: `P2P мейкер ${displayName}`,
      wordsToSearchFrom: displayName,
    });

    return {
      props: {
        maker: makerWithFullOffers,
        seo,
        pms: pms || null,
        faqCategory: faqCategory || null,
      },
      revalidate: TTL.slow,
    };
  } catch (error) {
    console.error("🚨 getStaticProps error:", error);

    return {
      props: {
        maker: null,
        seo: nullSeo,
        pms: null,
        faqCategory: null,
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
    await addPathsToSitemap(paths, { basePath: "p2p" });

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
