import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
  Flex,
  Grid,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsQuestionCircle } from "react-icons/bs";

import { IFaqCategory } from "../../types/faq";
import { ISEO } from "../../types/general";
import CustomTitle from "../shared/CustomTitle";
import { TextToHTML } from "../shared/helper";
import UniversalSeo from "../shared/UniversalSeo";
import CustomIcon from "./CustomIcon";
import { Box3D } from "../../styles/theme/custom";
import { IoMdInformationCircle } from "react-icons/io";
import { CustomHeader } from "../shared/BoxWrapper";

export function FaqCategoriesList({
  categories,
  customTitle,
}: {
  categories: IFaqCategory[];
  customTitle?: string;
}) {
  const accentFallback = useColorModeValue("violet.700", "violet.500");
  const questionColor = useColorModeValue("bg.700", "bg.100");

  return (
    <Grid
      gridTemplateColumns={categories.length % 2 ? "1fr" : "1fr 1fr"}
      gridGap={{ base: 2, md: 4 }}
      mt="2"
    >
      {categories.map((category) => {
        const accent = category.color || accentFallback;

        return (
          <Box3D
            key={category.id}
            p={{ base: 4, md: 6 }}
            variant="contrast"
            h="fit-content"
          >
            {!customTitle ? (
              <Flex
                align={{ base: "flex-start", md: "center" }}
                gap="3"
                wrap="wrap"
                mb="4"
              >
                <CustomIcon
                  image={category.image}
                  id={category.id}
                  description={category.description}
                />
              </Flex>
            ) : (
              <>
                <CustomHeader text={customTitle} Icon={IoMdInformationCircle} />
                <Divider my="4" />
              </>
            )}

            {category.x_faqs?.length ? (
              <Accordion allowMultiple>
                {category.x_faqs.map((faq) => (
                  <AccordionItem
                    key={faq.id}
                    border="none"
                    borderRadius="lg"
                    bgColor="rgba(255,255,255,0.02)"
                    _notLast={{ mb: 2 }}
                  >
                    <AccordionButton
                      px={{ base: 2, md: 3 }}
                      py="3"
                      color="bg.500"
                      _expanded={{
                        color: "violet.500",
                      }}
                    >
                      <Box flex="1" textAlign="left">
                        <Text fontWeight="semibold">{faq.question}</Text>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel
                      px={{ base: 2, md: 3 }}
                      pb={4}
                      color="bg.600"
                    >
                      <Text whiteSpace="pre-line">{faq.response}</Text>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <Text color="bg.700">Вопросы скоро появятся.</Text>
            )}
          </Box3D>
        );
      })}
    </Grid>
  );
}

export default function FaqPage({
  categories,
  seo,
}: {
  categories: IFaqCategory[] | null;
  seo: ISEO;
}) {
  return (
    <>
      <UniversalSeo seo={seo} />

      <CustomTitle
        as="h1"
        title={seo.title || "FAQ"}
        subtitle={
          seo.description ||
          "Ответы на популярные вопросы о сервисе и P2P обменах"
        }
        my="12"
      />

      {!categories?.length ? (
        <Box textAlign="center" color="bg.700" mt="6">
          Пока нет вопросов для отображения.
        </Box>
      ) : (
        <FaqCategoriesList categories={categories} />
      )}
    </>
  );
}
