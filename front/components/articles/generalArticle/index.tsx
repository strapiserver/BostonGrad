import {
  Box,
  Divider,
  Grid,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { IArticle } from "../../../types/pages";
import { ISEO } from "../../../types/general";
import { BoxWrapper } from "../../shared/BoxWrapper";
import { TextToHTML } from "../../shared/helper";
import UniversalSeo from "../../shared/UniversalSeo";
import { IoWarningOutline } from "react-icons/io5";
import CustomTitle from "../../shared/CustomTitle";

import ArticleStats from "./ArticleStats";
export default function GeneralArticle({
  article,
  seo,
}: {
  article: IArticle | null;
  seo: ISEO;
}) {
  const quoteBg = useColorModeValue("violet.400", "violet.900");
  const quoteBorder = useColorModeValue("violet.600", "violet.600");
  const quoteText = useColorModeValue("violet.900", "violet.200");
  const bodyTextColor = useColorModeValue("gray.800", "gray.200");
  return (
    <>
      <UniversalSeo seo={seo} />

      <VStack gap={{ base: "4", lg: "6" }} my={{ base: "4", lg: "10" }} zIndex="1">
        <CustomTitle
          as="h1"
          mt="0"
          fontSize={{ base: "lg", lg: "3xl" }}
          title={article?.header || ""}
          subtitle={article?.subheader}
          mb="0"
        />
      </VStack>

      <BoxWrapper
        pos="relative"
        display="flex"
        alignItems="center"
        flexDir="column"
      >
        <ArticleStats article={article} />
        <Divider my="4" />

        <Box px="2" color={bodyTextColor}>
          {article?.text && (
            <TextToHTML
              text={article.text}
              components={{
                p: ({ children, node }) => {
                  const isQuote =
                    (node as any)?.parent?.tagName === "blockquote";
                  return (
                    <Text
                      color={isQuote ? quoteText : bodyTextColor}
                      my={isQuote ? 0 : "2"}
                      fontStyle={isQuote ? "italic" : "normal"}
                    >
                      {children}
                    </Text>
                  );
                },
                blockquote: ({ children }) => (
                  <Grid
                    as="blockquote"
                    my="4"
                    px="4"
                    py="3"
                    borderLeftWidth="4px"
                    gridTemplateColumns="1fr 2rem"
                    alignItems="center"
                    justifyItems="center"
                    borderLeftColor={quoteBorder}
                    bgColor={quoteBg}
                    borderRadius="md"
                    color={quoteText}
                    sx={{ p: { margin: 0 } }}
                  >
                    {children}
                    <IoWarningOutline size="1.2rem" />
                  </Grid>
                ),
              }}
            />
          )}
        </Box>
      </BoxWrapper>
    </>
  );
}
