import MainPageContent from "../components/main";
import { ICard, IMainSingle } from "../types/pages";
import UniversalSeo, { nullSeo } from "../components/shared/UniversalSeo";
import { ISEO } from "../types/general";
import { Box } from "@chakra-ui/react";
import Image from "next/image";
import gridPattern from "../public/grid.png";
import { loadCards, loadMainSingle, TTL } from "../cache/loadX";
import {
  cmsLinkDEV,
  cmsLinkPROD,
  internalCmsLink,
  resolveInternalUrl,
} from "../services/utils";
import { IImage } from "../types/selector";

type SocialNetworkItem = {
  name: string;
  icon: IImage | null;
};

const loadCountries = async (): Promise<string[]> => {
  const env = process.env.NODE_ENV;
  const publicBase = env === "production" ? cmsLinkPROD : cmsLinkDEV;
  const cmsBase = resolveInternalUrl(publicBase, internalCmsLink);
  const adminUrl = `${cmsBase}/admin/content-manager/collectionType/api::country.country?page=1&pageSize=200&sort=name:ASC`;
  const apiUrl = `${cmsBase}/api/countries?pagination[page]=1&pagination[pageSize]=200&sort=name:ASC`;

  const extractNames = (payload: any): string[] => {
    const candidates = [
      ...(Array.isArray(payload?.results) ? payload.results : []),
      ...(Array.isArray(payload?.data) ? payload.data : []),
    ];

    return candidates
      .map((item: any) => item?.name || item?.attributes?.name)
      .filter((name: any): name is string => typeof name === "string" && !!name.trim());
  };

  try {
    const adminRes = await fetch(adminUrl);
    if (adminRes.ok) {
      const adminJson = await adminRes.json();
      const names = extractNames(adminJson);
      if (names.length) return names;
    }
  } catch {}

  try {
    const apiRes = await fetch(apiUrl);
    if (!apiRes.ok) return [];
    const apiJson = await apiRes.json();
    return extractNames(apiJson);
  } catch {
    return [];
  }
};

const loadSocialNetworks = async (): Promise<SocialNetworkItem[]> => {
  const env = process.env.NODE_ENV;
  const publicBase = env === "production" ? cmsLinkPROD : cmsLinkDEV;
  const cmsBase = resolveInternalUrl(publicBase, internalCmsLink);
  const adminUrl = `${cmsBase}/admin/content-manager/collectionType/api::socialnetwork.socialnetwork?page=1&pageSize=200&sort=name:ASC`;
  const apiUrl = `${cmsBase}/api/socialnetworks?pagination[page]=1&pagination[pageSize]=200&sort=name:ASC&populate=logo`;

  const extractItems = (payload: any): SocialNetworkItem[] => {
    const candidates = [
      ...(Array.isArray(payload?.results) ? payload.results : []),
      ...(Array.isArray(payload?.data) ? payload.data : []),
    ];

    return candidates
      .map((item: any) => {
        const attrs = item?.attributes || item || {};
        const name = attrs?.name;
        const iconRaw = attrs?.logo;
        const iconAttrs = iconRaw?.data?.attributes || iconRaw || {};
        const iconUrl =
          typeof iconAttrs?.url === "string"
            ? iconAttrs.url
            : typeof iconRaw === "string"
              ? iconRaw
              : null;
        const icon = iconUrl
          ? ({
              id: String(iconAttrs?.id || iconRaw?.data?.id || ""),
              url: iconUrl,
              alternativeText:
                typeof iconAttrs?.alternativeText === "string"
                  ? iconAttrs.alternativeText
                  : null,
            } as IImage)
          : null;
        return { name, icon };
      })
      .filter(
        (item: any): item is SocialNetworkItem =>
          typeof item?.name === "string" && !!item.name.trim(),
      );
  };

  try {
    const adminRes = await fetch(adminUrl);
    if (adminRes.ok) {
      const adminJson = await adminRes.json();
      const items = extractItems(adminJson);
      if (items.length) return items;
    }
  } catch {}

  try {
    const apiRes = await fetch(apiUrl);
    if (!apiRes.ok) return [];
    const apiJson = await apiRes.json();
    return extractItems(apiJson);
  } catch {
    return [];
  }
};

export const getStaticProps = async () => {
  try {
    const [mainSingle, cards, countries, socialNetworks] = await Promise.all([
      loadMainSingle(),
      loadCards(),
      loadCountries(),
      loadSocialNetworks(),
    ]);

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
        countries: countries || [],
        socialNetworks: socialNetworks || [],
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
        countries: [],
        socialNetworks: [],
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
