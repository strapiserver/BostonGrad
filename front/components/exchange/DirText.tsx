"use client";

import Link from "next/link";
import { Box, Text, Heading, Divider } from "@chakra-ui/react";
import { ICity, IDirText, IPmData } from "../../types/exchange";
import { IPm } from "../../types/selector";
import { capitalize } from "../main/side/selector/section/PmGroup/helper";
import { TextToHTML } from "../shared/helper";

export const fillWords = ({
  givePmData,
  getPmData,
  cityName,
  text,
}: {
  givePmData: IPmData;
  getPmData: IPmData;
  cityName?: string;
  text?: string;
}) => {
  if (!text) return null;

  const [givePm, getPm] = [givePmData?.pm, getPmData?.pm];

  const makeSlug = (pm: IPm) =>
    `/articles/${pm.en_name.toLowerCase().replace(/\s+/g, "-")}`;

  const parts = text.split(
    /(give_name|get_name|give_currency|get_currency|city_name)/g
  );

  return parts.map((part, index) => {
    switch (part) {
      case "give_name":
        return givePmData.exists ? (
          <Link key={index} href={makeSlug(givePm)}>
            {capitalize(givePm?.ru_name || givePm.en_name)}
          </Link>
        ) : (
          <>{capitalize(givePm?.ru_name || givePm.en_name)}</>
        );

      case "get_name":
        return getPmData.exists ? (
          <Link key={index} href={makeSlug(getPm)}>
            {capitalize(getPm.ru_name || getPm.en_name)}
          </Link>
        ) : (
          <>{capitalize(getPm.ru_name || getPm.en_name)}</>
        );

      case "give_currency":
        return givePm.currency.code.toUpperCase();
      case "get_currency":
        return getPm.currency.code.toUpperCase();
      case "city_name":
        return cityName || "";
      default:
        return part;
    }
  });
};

const DirText = ({
  dirText,
  givePmData,
  getPmData,
  city,
}: {
  givePmData: IPmData;
  getPmData: IPmData;
  city: ICity | null;
  dirText: IDirText | null;
}) => {
  //  const cityName = city ? city[`${locale}_name`] : "";

  if (!dirText) return <></>;

  return (
    <Box p="2">
      <Heading as="h1" fontSize="2xl">
        {dirText.header}
      </Heading>

      <Divider my="5" />

      <Text>{dirText.text}</Text>
    </Box>
  );
};

export default DirText;
