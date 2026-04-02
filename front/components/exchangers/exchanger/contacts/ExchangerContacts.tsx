import { Button, HStack, Wrap, WrapItem } from "@chakra-ui/react";
import React from "react";
import { IExchangerCard } from "../../../../types/exchanger";
import { FaTelegramPlane, FaWhatsapp, FaPhone } from "react-icons/fa";
import { IoMailOpenSharp } from "react-icons/io5";
import { formatPhoneNumber } from "../description/helper";

export default function ExchangerContacts({
  exchangerCard,
}: {
  exchangerCard?: IExchangerCard | null;
}) {
  if (!exchangerCard) return <></>;
  const {
    email,
    phone_number,
    telegram,
    whatsapp,
  } = exchangerCard;

  const buildTelegramLink = (value?: string | null) => {
    if (!value) return null;
    const handle = value.trim();
    if (!handle) return null;
    if (/^https?:\/\//i.test(handle)) return handle;
    return `https://t.me/${handle.replace(/^@/, "")}`;
  };

  const buildWhatsappLink = (value?: string | null) => {
    if (!value) return null;
    const handle = value.trim();
    if (!handle) return null;
    if (/^https?:\/\//i.test(handle)) return handle;
    const digits = handle.replace(/\D+/g, "");
    if (!digits) return null;
    return `https://wa.me/${digits}`;
  };

  const telegramLink = buildTelegramLink(telegram);
  const whatsappLink = buildWhatsappLink(whatsapp);
  const hasContacts = telegramLink || whatsappLink || phone_number || email;

  if (!hasContacts) return <></>;

  return (
    <Wrap justify={{ lg: "flex-end", base: "flex" }} spacing="20px" px="4">
      {telegramLink && (
        <WrapItem>
          <Button
            as="a"
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            leftIcon={<FaTelegramPlane size="1rem" />}
            variant="outline"
            colorScheme="violet"
            size={{ lg: "md", base: "xs" }}
          >
            Telegram
          </Button>
        </WrapItem>
      )}
      {whatsappLink && (
        <WrapItem>
          <Button
            as="a"
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            leftIcon={<FaWhatsapp size="1rem" />}
            variant="outline"
            colorScheme="green"
            size={{ lg: "md", base: "xs" }}
          >
            WhatsApp
          </Button>
        </WrapItem>
      )}
      {phone_number && (
        <WrapItem>
          <Button
            as="a"
            href={`tel:${phone_number}`}
            leftIcon={<FaPhone size="1rem" />}
            variant="outline"
            colorScheme="purple"
            size={{ lg: "md", base: "xs" }}
          >
            {formatPhoneNumber(phone_number)}
          </Button>
        </WrapItem>
      )}
      {email && (
        <WrapItem>
          <Button
            as="a"
            href={`mailto:${email}`}
            leftIcon={<IoMailOpenSharp size="1rem" />}
            variant="outline"
            colorScheme="orange"
            size={{ lg: "md", base: "xs" }}
          >
            {email}
          </Button>
        </WrapItem>
      )}
    </Wrap>
  );
}
