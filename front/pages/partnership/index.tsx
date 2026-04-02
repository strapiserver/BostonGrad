import ArticleFaqPage from "../../components/faq/ArticleFaqPage";
import { loadArticle, loadFAQbyCategoryCode, TTL } from "../../cache/loadX";
import { ISEO } from "../../types/general";
import { IFaqCategory } from "../../types/faq";
import { IArticle } from "../../types/pages";

const PAGE_CODE = "partnership";

const buildSeo = (article: IArticle | null): ISEO => ({
  title:
    article?.seo_title ||
    `Партнерство с ${process.env.NEXT_PUBLIC_NAME || ""}`,
  description:
    article?.seo_description ||
    "Партнерские условия, реферальная программа и варианты сотрудничества.",
  canonicalSlug: PAGE_CODE,
  updatedAt: article?.updatedAt ?? null,
});

const emptyProps = async () => ({
  props: {
    article: null,
    faqCategory: null,
    seo: buildSeo(null),
  },
  revalidate: TTL.slowest,
});

const PartnershipPage = (props: {
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
    console.error("[partnership] getStaticProps error:", e);
    return emptyProps();
  }
};

export default PartnershipPage;
