import {
  Box,
  Divider,
  Grid,
  Heading,
  HStack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { IArticle } from "../../../types/pages";
import { ISEO } from "../../../types/general";
import { IoMdInformationCircle } from "react-icons/io";
import description from "../../map/description";
import { BoxWrapper, CustomHeader } from "../../shared/BoxWrapper";
import { TextToHTML } from "../../shared/helper";
import UniversalSeo from "../../shared/UniversalSeo";
import { IoWarningOutline } from "react-icons/io5";
import CustomTitle from "../../shared/CustomTitle";

import CustomImage from "../../shared/CustomImage";
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
  const quoteText = useColorModeValue("violet.900", "violet.500");
  const ambientColor = useColorModeValue(
    "rgba(143,92,292,0.2)",
    "rgba(247, 197, 177, 0.15)",
  );
  return (
    <>
      <UniversalSeo seo={seo} />

      <VStack
        gap={{ base: "4", lg: "-20" }}
        my={{ base: "4", lg: "10" }}
        zIndex="1"
      >
        <CustomTitle
          as="h1"
          mt="0"
          title={article?.header || ""}
          subtitle={article?.subheader}
          mb="0"
        />
        <Box position="relative">
          <CustomImage
            customAlt={`${process.env.NEXT_PUBLIC_NAME} ${article?.code}`}
            img={article?.wallpaper}
            w="600px"
            objectFit="contain"
          />
          <Box
            position="absolute"
            inset={0}
            h="400px"
            w="100%"
            top="-80px"
            zIndex={0}
            pointerEvents="none" // <-- lets all clicks/touches pass through
            bgGradient={`radial-gradient(ellipse at 50% 50%, ${ambientColor} 10%, transparent 35%)`}
          />
        </Box>
      </VStack>

      <BoxWrapper
        pos="relative"
        display="flex"
        alignItems="center"
        flexDir="column"
      >
        <ArticleStats article={article} />
        <Divider my="4" />

        <Box px="2" color="bg.700">
          {article?.text && (
            <TextToHTML
              text={article.text}
              components={{
                p: ({ children, node }) => {
                  const isQuote =
                    (node as any)?.parent?.tagName === "blockquote";
                  return (
                    <Text
                      color={isQuote ? quoteText : "bg.300"}
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
