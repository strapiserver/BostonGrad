import MainPageContent from "../components/main";
import { ICard, IMainSingle } from "../types/pages";
import UniversalSeo, { nullSeo } from "../components/shared/UniversalSeo";
import { ISEO } from "../types/general";
import { Box } from "@chakra-ui/react";
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
  url: string;
};

type CountryOption = {
  id: string;
  name: string;
};

const loadCountries = async (): Promise<CountryOption[]> => {
  const env = process.env.NODE_ENV;
  const publicBase = env === "production" ? cmsLinkPROD : cmsLinkDEV;
  const cmsBase = resolveInternalUrl(publicBase, internalCmsLink);
  const adminUrl = `${cmsBase}/admin/content-manager/collectionType/api::country.country?page=1&pageSize=200&sort=name:ASC`;
  const apiUrl = `${cmsBase}/api/countries?pagination[page]=1&pagination[pageSize]=200&sort=name:ASC`;

  const extractCountries = (payload: any): CountryOption[] => {
    const candidates = [
      ...(Array.isArray(payload?.results) ? payload.results : []),
      ...(Array.isArray(payload?.data) ? payload.data : []),
    ];

    return candidates
      .map((item: any) => {
        const id = item?.id || item?.documentId || item?.attributes?.id;
        const name = item?.name || item?.attributes?.name;
        if (!id || typeof name !== "string" || !name.trim()) return null;
        return { id: String(id), name };
      })
      .filter((country: any): country is CountryOption => Boolean(country));
  };

  try {
    const adminRes = await fetch(adminUrl);
    if (adminRes.ok) {
      const adminJson = await adminRes.json();
      const countries = extractCountries(adminJson);
      if (countries.length) return countries;
    }
  } catch {}

  try {
    const apiRes = await fetch(apiUrl);
    if (!apiRes.ok) return [] as CountryOption[];
    const apiJson = await apiRes.json();
    return extractCountries(apiJson);
  } catch {
    return [] as CountryOption[];
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
        const url = attrs?.url;
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
        return { name, icon, url: typeof url === "string" ? url : "" };
      })
      .filter(
        (item: any): item is SocialNetworkItem =>
          typeof item?.name === "string" &&
          !!item.name.trim() &&
          typeof item?.url === "string" &&
          !!item.url.trim(),
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
          <Box
            as="img"
            src={gridPattern.src}
            alt="Grid background pattern"
            w="100vw"
            h="auto"
          />
        </Box>
        <MainPageContent {...props} />
      </Box>
    </>
  );
};

export default Home;
