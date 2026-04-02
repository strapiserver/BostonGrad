import { GetStaticProps } from "next";

import { IExchanger } from "../../types/exchanger";
import ExchangersList from "../../components/exchangers";

import { ISEO } from "../../types/general";
import { nullSeo } from "../../components/shared/UniversalSeo";
import { loadExchangers } from "../../cache/loadX";

const ExchangersPage = ({
  exchangers,
  seo,
  initialPage,
}: {
  exchangers: IExchanger[] | null;
  seo: ISEO;
  initialPage: number;
}) => (
  <ExchangersList
    exchangers={exchangers}
    seo={seo}
    initialPage={initialPage}
  />
);

export const getStaticProps: GetStaticProps = async () => {
  const exchangers = await loadExchangers();

  if (!exchangers?.length) {
    return {
      props: {
        exchangers: null,
        initialPage: 1,
      },
    };
  }

  const itemsPerPage = 20;
  const totalPages = Math.ceil(exchangers.length / itemsPerPage);
  const currentPage = 1;

  const seo: ISEO = {
    title: "Обменники - список всех активных обменников",
    description: "Проверьте статусы обменников, рейтинг и описание",
    canonicalSlug:
      currentPage > 1 ? `exchangers?page=${currentPage}` : "exchangers",
  };

  return {
    props: {
      seo: seo || nullSeo,
      exchangers: exchangers || null,
      initialPage: currentPage,
    },
    revalidate: 60,
  };
};

export default ExchangersPage;
