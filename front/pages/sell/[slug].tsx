import { GetStaticPaths } from "next";
import {
  convertMassDirTextIntoSlug,
  convertSlugIntoMassDirText,
} from "../../cache/helper";
import {
  loadMassDirText,
  loadMassDirTextIds,
  loadMassRates,
  loadPms,
  TTL,
} from "../../cache/loadX";
import UniversalSeo, { nullSeo } from "../../components/shared/UniversalSeo";
import { ISEO } from "../../types/general";

import {
  createDefaultMassDirText,
  generateMassSeo,
  getCryptoPms,
  getPmsByCodes,
} from "../../components/mass/helper";
import Mass from "../../components/mass";
import { IMassDirText, IMassDirTextId, IMassRate, IPm } from "../../types/mass";

import { addHeadersToSearchIndex, addPathsToSitemap } from "../../cache/cache";

const isSell = true;

type Props = {
  seo: ISEO;
  fiatPms: Record<string, IPm>;
  cryptoPms: IPm[];
  massDirTextId: IMassDirTextId;
  massDirText: IMassDirText;
  massRates: IMassRate[];
  isSell: boolean;
  slug: string;
};

const SellPage = (props: Props) => (
  <>
    <UniversalSeo seo={props.seo} />
    <Mass {...props} />
  </>
);

/////////////////////////////////////////////////////////////////////////
export const getStaticProps = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const { slug } = params;
  const massDirTextId = convertSlugIntoMassDirText(slug, isSell);

  const [massDirTextResponse, pms, massRates] = await Promise.all([
    loadMassDirText({
      massDirTextId,
      isSell,
    }) as Promise<IMassDirText | null>,
    loadPms(),
    loadMassRates({
      currencyCode: massDirTextId.currency.code,
      code: massDirTextId.code,
      isSell,
    }),
  ]);

  const massDirText =
    massDirTextResponse ||
    createDefaultMassDirText({
      massDirTextId,
      pms,
      isSell,
    });

  const { seo_title, seo_description, header } = massDirText;

  const fiatPms = getPmsByCodes(massRates, pms);
  const cryptoPms = getCryptoPms(pms);

  try {
    const seo = generateMassSeo({
      title: seo_title || "",
      description: seo_description || "",
      slug,
      isSell,
    }) as ISEO;

    await addHeadersToSearchIndex({
      slug: `${isSell ? "sell" : "buy"}/${slug}`,
      header: seo_title,
      wordsToSearchFrom: `${header} ${seo_title}`,
    });

    return {
      props: {
        seo,
        fiatPms,
        cryptoPms,
        massDirText,
        massRates,
        massDirTextId,
        isSell,
        slug,
      },
      revalidate: TTL.slow,
    };
  } catch (e) {
    console.error("Error during getStaticProps:", e);

    return {
      props: {
        seo: nullSeo,
        fiatPms: null,
        massDirText: null,
        massRates: null,
        massDirTextId: null,
        isSell,
        slug,
      },
      revalidate: TTL.slow,
    };
  }
};
////////////////////////////

export const getStaticPaths: GetStaticPaths = async () => {
  const massDirTextIds = await loadMassDirTextIds({ isSell });

  const paths = massDirTextIds.map((mdtid) => ({
    params: { slug: convertMassDirTextIntoSlug(mdtid) },
  }));

  await addPathsToSitemap(paths, { basePath: "sell" });

  return {
    paths,
    fallback: "blocking",
  };
};

export default SellPage;
