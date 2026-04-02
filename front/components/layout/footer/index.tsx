import { Box, Divider, Flex, Grid, HStack, VStack } from "@chakra-ui/react";
import WebsiteData from "./WebsiteData";
import FooterLinks from "./FooterLinks";

const Footer = () => {
  return (
    <Box w="100%" px={{ base: "2", lg: "12%" }}>
      <Flex flexDir="column" justifyContent="space-between" alignItems="center">
        <Grid
          gridTemplateColumns="1fr 1fr 1fr"
          w={{ base: "90%", lg: "70%" }}
          justifyContent="center"
          gridGap="4"
        >
          <FooterLinks links={aboutLinks} title={"О нас"} />
          <FooterLinks links={productLinks} title={"Сервисы"} />
          <FooterLinks links={supportLinks} title={"Поддержка"} />
        </Grid>
        <Divider mt="8" />
        <WebsiteData />
      </Flex>
    </Box>
  );
};

export default Footer;

const aboutLinks = [
  { label: "О проекте", href: "/articles/about" },
  { label: "Партнерство", href: "/partnership" },
  { label: "Блог", href: "/articles" },
];

const productLinks = [
  { label: "Таблица курсов", href: "/buy/btc-for-rub" },
  { label: "Карта обменников", href: "/map" },
  { label: "Список обменников", href: "/exchangers" },
];

const supportLinks = [
  { label: "FAQ", href: "/faq" },
  { label: "Контакты", href: "/contacts" },
  {
    label: "Телеграм группа ",
    href: process.env.NEXT_PUBLIC_TELEGRAM_CHAT || "#",
  },
];
