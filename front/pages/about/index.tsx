import ArticleFaqPage from "../../components/faq/ArticleFaqPage";
import { loadArticle, loadFAQbyCategoryCode, TTL } from "../../cache/loadX";
import { ISEO } from "../../types/general";
import { IFaqCategory } from "../../types/faq";
import { IArticle } from "../../types/pages";

const PAGE_CODE = "about";

const buildSeo = (article: IArticle | null): ISEO => {
  const brand = process.env.NEXT_PUBLIC_NAME || "p2pie";

  return {
    title:
      article?.seo_title ||
      `О проекте ${brand} — миссия, ценности, команда`,
    description:
      article?.seo_description ||
      `${brand} помогает сравнивать обменные предложения криптовалют, наличных и банков по всему миру. Узнайте, кто мы, зачем создали сервис и как обеспечиваем прозрачность курсов.`,
    canonicalSlug: PAGE_CODE,
    updatedAt: article?.updatedAt ?? null,
  };
};

const emptyProps = async () => ({
  props: {
    article: null,
    faqCategory: null,
    seo: buildSeo(null),
  },
  revalidate: TTL.slowest,
});

const AboutPage = (props: {
  article: IArticle | null;
  faqCategory: IFaqCategory | null;
  seo: ISEO;
}) => <ArticleFaqPage {...props} />;

export const getStaticProps = async () => {
  try {
    const [article, faqCategory] = await Promise.all([
      loadArticle(PAGE_CODE),
      loadFAQbyCategoryCode(PAGE_CODE),
    ]);

    return {
      props: {
        article: article || null,
        faqCategory: faqCategory || null,
        seo: buildSeo(article),
      },
      revalidate: TTL.slowest,
    };
  } catch (e) {
    console.error("[about] getStaticProps error:", e);
    return emptyProps();
  }
};

export default AboutPage;
