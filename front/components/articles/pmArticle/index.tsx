import { Heading, Box, HStack, Text, Divider } from "@chakra-ui/react";

import React, { useMemo, useRef, useState } from "react";
import { Box3D, ResponsiveText } from "../../../styles/theme/custom";
import { IPmPairs } from "../../../types/exchange";
import { ISEO } from "../../../types/general";
import { IArticle } from "../../../types/pages";
import { TextToHTML } from "../../shared/helper";
import UniversalSeo from "../../shared/UniversalSeo";
import FoundError from "./FoundError";
import OtherDirs from "./otherDirs";
import TopImage from "./TopImage";
import Stats from "./Stats";
import { IPm } from "../../../types/selector";
import { locale } from "../../../services/utils";
import ContentPreview from "../helper";

const Article = ({
  seo,
  pm,
  article,
  otherDirs,
}: {
  seo: ISEO;
  pm: IPm | null;
  article?: IArticle | null;
  otherDirs: { buy: IPmPairs[]; sell: IPmPairs[] } | null;
}) => {
  // Early fallback before any hooks
  if (!article) {
    return <>No article</>;
  }
  if (!pm) {
    return <>Nothing was found!</>;
  }

  // Stable refs for chapters
  const chapterRefs = useMemo(
    () => article.chapters.map(() => React.createRef<HTMLDivElement>()),
    [article.chapters.length]
  );

  const refChapters = article.chapters.map((chapter, idx) => ({
    ...chapter,
    ref: chapterRefs[idx],
  }));

  const timestampToDate = (ts?: string) => {
    const [y, m, d] = ts ? ts.split("T")[0].split("-") : ["-", "-", "-"];
    return `${d}.${m}.${y}`;
  };

  const symbols = article.chapters.reduce(
    (length, chapter) => length + chapter.text.length,
    0
  );

  const minToRead = Math.round(symbols / 1000);

  return (
    <>
      <UniversalSeo seo={seo} />
      <Box3D
        variant="contrast"
        w="100%"
        mt={["2", "8"]}
        px={["2", "8"]}
        py={["4", "8"]}
        position="relative"
      >
        <TopImage pm={pm} />

        <Heading as="h1" fontSize={["xl", "2xl", "3xl"]}>
          {article.header}
        </Heading>

        <Heading as="h2" fontSize={["lg", "xl"]}>
          {article.subheader}
        </Heading>

        <ResponsiveText fontSize="md">{`${timestampToDate(
          article.updatedAt
        )} • ${minToRead} minutes read`}</ResponsiveText>

        <Stats stats={article.stats} />

        {/* Table of contents */}
        <ContentPreview refChapters={refChapters} />
        {/* Chapters */}
        <Box>
          {refChapters.map((chapter, idx) => (
            <Box key={"chapter:" + idx}>
              <HStack fontSize={["md", "lg"]} fontWeight="bold" mt="4">
                <Text color="violet.600">#</Text>
                <Text ref={chapter.ref} color={"violet.600"}>
                  {chapter.title || ""}
                </Text>
              </HStack>
              <TextToHTML text={chapter.text} />
              {/* Uncomment if disclaimer handling is needed */}
              {/* {chapter.disclaimer && (
                <Disclaimer disclaimer={chapter.disclaimer} />
              )} */}
            </Box>
          ))}
        </Box>

        {otherDirs && <OtherDirs mainPm={pm} otherDirs={otherDirs} />}

        <FoundError />
      </Box3D>
    </>
  );
};

export default Article;
