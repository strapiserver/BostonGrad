import React from "react";
import { ResponsiveText } from "../../styles/theme/custom";
import { Box, Grid, VStack } from "@chakra-ui/react";
import { ISEO } from "../../types/general";
import { IArticle } from "../../types/pages";
import UniversalSeo from "../shared/UniversalSeo";
import ArticlePreview from "./ArticlePreview";
import CustomTitle from "../shared/CustomTitle";

export default function ArticlesList({
  articles,
  seo,
}: {
  articles: IArticle[] | null;
  seo: ISEO;
}) {
  return (
    <>
      <UniversalSeo seo={seo} />

      <CustomTitle
        my="16"
        as="h1"
        title={"Последние новости"}
        subtitle={"Узнавайте новости из мира криптовалюты первыми"}
      />
      {!articles ? (
        <> Нет статей </>
      ) : (
        <Grid gap="4" gridTemplateColumns="1fr 1fr 1fr">
          {articles.map((article) => {
            const key = article.id || article.code;
            return <ArticlePreview key={key} article={article} />;
          })}
        </Grid>
      )}
    </>
  );
}
