import { GetStaticProps } from "next";

import MakersList from "../../components/p2p/makers";
import { ISEO } from "../../types/general";
import { nullSeo } from "../../components/shared/UniversalSeo";
import { loadAllP2PMakers } from "../../cache/loadX";
import { IMakerPreview } from "../../types/p2p";

const MakersPage = ({
  makers,
  seo,
  initialPage,
}: {
  makers: IMakerPreview[] | null;
  seo: ISEO;
  initialPage: number;
}) => <MakersList makers={makers} seo={seo} initialPage={initialPage} />;

export const getStaticProps: GetStaticProps = async () => {
  const itemsPerPage = 20;

  const makers = (await loadAllP2PMakers()) as IMakerPreview[] | null;

  if (!makers?.length) {
    return {
      props: {
        makers: null,
        seo: nullSeo,
        initialPage: 1,
      },
    };
  }

  const totalPages = Math.ceil(makers.length / itemsPerPage);
  const currentPage = 1;

  const seo: ISEO = {
    title: "P2P мейкеры - список активных мейкеров",
    description: "Проверьте статусы, предложения и отзывы P2P мейкеров",
    canonicalSlug:
      currentPage > 1 ? `p2p/makers?page=${currentPage}` : "p2p/makers",
  };

  return {
    props: {
      seo: seo || nullSeo,
      makers: makers || null,
      initialPage: currentPage,
    },
    revalidate: 60,
  };
};

export default MakersPage;
