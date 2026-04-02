import { Box, Heading, Text, VStack } from "@chakra-ui/react";

import { ISEO } from "../../types/general";
import { IFaqCategory } from "../../types/faq";
import { IArticle } from "../../types/pages";
import { BoxWrapper } from "../shared/BoxWrapper";
import CustomTitle from "../shared/CustomTitle";
import UniversalSeo from "../shared/UniversalSeo";
import { TextToHTML } from "../shared/helper";
import { FaqCategoriesList } from "./index";

export default function ArticleFaqPage({
  article,
  faqCategory,
  seo,
}: {
  article: IArticle | null;
  faqCategory: IFaqCategory | null;
  seo: ISEO;
}) {
  return (
    <>
      <UniversalSeo seo={seo} />

      <CustomTitle
        as="h1"
        title={article?.header || seo.title || ""}
        subtitle={article?.subheader || seo.description || ""}
        my="12"
      />

      <VStack spacing={{ base: 4, md: 6 }} align="stretch">
        {article ? (
          <BoxWrapper p={{ base: 4, md: 6 }} variant="extra_contrast">
            {article.text ? (
              <TextToHTML
                text={article.text}
                components={{
                  p: ({ children }) => (
                    <Text my="2" color="bg.500">
                      {children}
                    </Text>
                  ),
                  h2: ({ children }) => (
                    <Heading as="h2" size="md" my="4" color="bg.400">
                      {children}
                    </Heading>
                  ),
                  h3: ({ children }) => (
                    <Heading as="h3" size="sm" my="3" color="bg.400">
                      {children}
                    </Heading>
                  ),
                  ul: ({ children }) => (
                    <Box as="ul" pl="4" my="2">
                      {children}
                    </Box>
                  ),
                  li: ({ children }) => (
                    <Box as="li" my="1" color="bg.500">
                      {children}
                    </Box>
                  ),
                }}
              />
            ) : (
              <Text color="bg.600">Материал скоро появится.</Text>
            )}
          </BoxWrapper>
        ) : (
          <></>
        )}

        {faqCategory ? <FaqCategoriesList categories={[faqCategory]} /> : <></>}
      </VStack>
    </>
  );
}
