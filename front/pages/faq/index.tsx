import FaqPageContent from "../../components/faq";
import { loadFAQs, TTL } from "../../cache/loadX";
import { ISEO } from "../../types/general";
import { IFaqCategory } from "../../types/faq";

const buildSeo = (): ISEO => {
  const brand = process.env.NEXT_PUBLIC_NAME || "p2pie";

  return {
    title: `FAQ — ответы на вопросы о ${brand}`,
    description: `Краткие ответы о ${brand}: как находить лучшие курсы обмена, безопасность сделок, комиссии, способы оплаты и решение типовых вопросов.`,
    canonicalSlug: "faq",
  };
};

const emptyProps = async () => ({
  props: {
    categories: null,
    seo: buildSeo(),
  },
  revalidate: TTL.slow,
});

const FaqPage = ({
  categories,
  seo,
}: {
  categories: IFaqCategory[] | null;
  seo: ISEO;
}) => <FaqPageContent categories={categories} seo={seo} />;

export const getStaticProps = async () => {
  try {
    const categories = (await loadFAQs()) as IFaqCategory[];

    if (!categories?.length) {
      return emptyProps();
    }

    return {
      props: {
        categories: categories || null,
        seo: buildSeo(),
      },
      revalidate: TTL.slowest,
    };
  } catch (e) {
    console.error("[faq] getStaticProps error:", e);
    return emptyProps();
  }
};

export default FaqPage;
