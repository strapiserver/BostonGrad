import { IPmPairs } from "../../types/exchange";
import { IArticle } from "../../types/pages";
import Article from "../../components/articles/pmArticle";
import { addArticleCrossLinking } from "../../components/articles/pmArticle/helper";
import { IPm } from "../../types/selector";
import { ISEO } from "../../types/general";
import { nullSeo } from "../../components/shared/UniversalSeo";

import { getSlugToCodes } from "../../cache/helper";
import {
  limitedPossibleDirs,
  loadArticle,
  loadArticleCodes,
  loadPms,
  loadPossibleDirs,
  TTL,
} from "../../cache/loadX";
import { addPathsToSitemap } from "../../cache/cache";
import GeneralArticle from "../../components/articles/generalArticle";

const emptyProps = async () => ({
  props: {
    seo: nullSeo,
    pm: null,
    article: null,
    otherDirs: null,
  },
  revalidate: TTL.slow,
});

const ArticlePage = (props: {
  seo: ISEO;
  pm: IPm | null;
  article: IArticle | null;
  otherDirs: { buy: IPmPairs[]; sell: IPmPairs[] } | null;
}) => {
  if (props.article?.text)
    return <GeneralArticle article={props.article} seo={props.seo} />;
  return <Article {...props} />;
};

export async function getStaticProps({ params }: { params: { code: string } }) {
  try {
    const code = params.code;
    const article = await loadArticle(code);
    if (!article) {
      console.warn(
        `[getStaticProps] No article found for code: ${params.code}`
      );
      return emptyProps();
    }
    const normalizedCode = article?.code.toLowerCase();

    const seo = {
      title: article.seo_title,
      description: article.seo_description,
      canonicalSlug: `articles/${normalizedCode}`,
      updatedAt: article.updatedAt || new Date().toISOString(),
    } as ISEO;

    if (article?.text) {
      return {
        props: {
          seo: seo || nullSeo,
          article: article || null,
        },
        revalidate: TTL.slowest,
      };
    }
    const [articleCodes, pms, allPossibleDirs] = await Promise.all([
      loadArticleCodes(),
      loadPms(),
      loadPossibleDirs(),
    ]);
    const dirs = limitedPossibleDirs(allPossibleDirs, "low");

    const slugToCodes = getSlugToCodes(dirs, pms);

    if (!pms?.length || !slugToCodes) {
      console.warn(
        `[getStaticProps] No pms or slugToCodes found for code: ${params.code}`
      );
      return emptyProps();
    }

    const articlePms = pms.filter(
      (pm) =>
        pm.en_name.toLowerCase().replaceAll(" ", "-") == code.toLowerCase()
    );

    const filteredDirs = Object.values(slugToCodes).filter((dir) => {
      const [giveCode, getCode] = dir.split("_");
      return (
        articlePms.find((pm) => pm.code === giveCode) ||
        articlePms.find((pm) => pm.code === getCode)
      );
    });

    const otherDirs = filteredDirs.reduce(
      (res: { buy: IPmPairs[]; sell: IPmPairs[] }, dir: string) => {
        const slug = Object.keys(slugToCodes).find(
          (key) => slugToCodes[key] === dir
        );
        const givePm = pms.find((pm) => pm.code === dir.split("_")[0]);
        const getPm = pms.find((pm) => pm.code === dir.split("_")[1]);
        const pmPair = { slug, givePm, getPm } as IPmPairs;

        return givePm?.en_name.toLowerCase() ===
          articlePms[0]?.en_name.toLowerCase()
          ? { sell: [...res.sell], buy: [...res.buy, pmPair] }
          : { buy: [...res.buy], sell: [...res.sell, pmPair] };
      },
      { buy: [], sell: [] }
    );

    const linkedArticle = await addArticleCrossLinking(
      article,
      articleCodes,
      pms
    );

    return {
      props: {
        seo: seo || nullSeo,
        pm: articlePms[0] || null,
        article: linkedArticle || null,
        otherDirs: otherDirs || null,
      },
      revalidate: TTL.slow,
    };
  } catch (e) {
    console.error("[getStaticProps] Error:", e);
    return await emptyProps();
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////

export async function getStaticPaths() {
  try {
    const paths: { params: { code: string } }[] = [];
    const articleCodes = (await loadArticleCodes()) as string[];

    articleCodes.forEach((code) => {
      paths.push({
        params: { code: code.toLowerCase() },
      });
    });

    const prerenderLimit = process.env.NEXT_PUBLIC_PRERENDER_LIMIT
      ? Number(process.env.NEXT_PUBLIC_PRERENDER_LIMIT)
      : 5000;

    const slicedPaths = paths.slice(0, prerenderLimit);
    await addPathsToSitemap(paths, { basePath: "articles" });

    return {
      paths: slicedPaths,
      fallback: "blocking",
    };
  } catch (e) {
    console.error("Articles [getStaticPaths] Error while generating paths", e);
    return { paths: [], fallback: "blocking" };
  }
}

export default ArticlePage;
