import { Box, Button, Grid, Input, Text } from "@chakra-ui/react";
import { RiSendPlaneFill } from "react-icons/ri";
import CustomSelect from "../../shared/CustomSelect";
import { IImage } from "../../../types/selector";
import settings from "./settings.json";
import { FormEvent, useState } from "react";

const { fieldCommon } = settings;
const { placeholderColor, ...fieldCommonInputStyles } = fieldCommon;

export default function Forms({
  countries = [],
  socialNetworks = [],
}: {
  countries?: { id: string; name: string }[];
  socialNetworks?: { name: string; icon: IImage | null; url: string }[];
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const submitCooldownMs = 20_000;
  const ageOptions = [
    { value: "12", label: "до 14" },
    { value: "16", label: "14-17" },
    { value: "20", label: "18-22" },
    { value: "23", label: "22+" },
  ];
  const countryOptions = countries.map((country) => ({
    value: country.id,
    label: country.name,
  }));
  const socialNetworkOptions = socialNetworks.map((network) => ({
    value: network.url,
    label: network.name,
    icon: network.icon,
  }));

  const normalizeExternalUrl = (value: string) => {
    const trimmed = String(value || "").trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  const withTelegramStartCode = (url: string, startCode?: string) => {
    if (!startCode) return url;
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.toLowerCase();
      if (host !== "t.me" && host !== "telegram.me" && !host.endsWith(".t.me")) {
        return url;
      }
      parsed.searchParams.set("start", startCode);
      return parsed.toString();
    } catch {
      return url;
    }
  };

  const withWhatsAppStartCode = (url: string, startCode?: string) => {
    if (!startCode) return url;
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.toLowerCase();
      const isWhatsapp =
        host === "wa.me" ||
        host === "api.whatsapp.com" ||
        host.endsWith(".whatsapp.com");
      if (!isWhatsapp) return url;
      const existing = parsed.searchParams.get("text");
      const prefix = existing ? `${existing}\n` : "";
      parsed.searchParams.set("text", `${prefix}START ${startCode}`);
      return parsed.toString();
    } catch {
      return url;
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const kidAgeRaw = String(formData.get("kid_age") || "").trim();
    const country = String(formData.get("country") || "").trim();
    const honeypot = String(formData.get("contact_time") || "").trim();
    const socialNetworkUrlRaw = String(formData.get("socialnetwork") || "").trim();
    const socialNetworkUrl = normalizeExternalUrl(socialNetworkUrlRaw);

    if (!socialNetworkUrl) {
      setError("Выберите социальную сеть");
      return;
    }
    if (!name || !kidAgeRaw || !country) return;

    if (typeof window !== "undefined") {
      const lastSubmitTs = Number(window.localStorage.getItem("lead_submit_ts") || "0");
      if (Date.now() - lastSubmitTs < submitCooldownMs) {
        setError("Подождите немного перед повторной отправкой");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/lead-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          kid_age: Number(kidAgeRaw),
          country,
          honeypot,
        }),
      });
      if (!response.ok) {
        throw new Error("Lead submit failed");
      }
      const payload = (await response.json()) as {
        leadStartCode?: string;
        telegramStartCode?: string;
      };
      if (typeof window !== "undefined") {
        window.localStorage.setItem("lead_submit_ts", String(Date.now()));
      }
      if (typeof window !== "undefined") {
        const startCode = payload?.leadStartCode || payload?.telegramStartCode;
        const targetUrl = withWhatsAppStartCode(
          withTelegramStartCode(socialNetworkUrl, startCode),
          startCode,
        );
        window.open(targetUrl, "_blank", "noopener,noreferrer");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box w="100%" as="form" onSubmit={onSubmit}>
      <Grid w="100%" gap="4" mt="4" gridTemplateColumns="1fr 1fr 1fr">
        <Input
          type="text"
          name="name"
          borderRadius="lg"
          placeholder="Ваше имя"
          required
          {...fieldCommonInputStyles}
          _placeholder={{ color: placeholderColor }}
        />
        <Input
          type="text"
          name="contact_time"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          position="absolute"
          left="-9999px"
          top="-9999px"
          h="0"
          p="0"
          opacity={0}
        />

        {/* <FormLabel>Возраст ребенка</FormLabel> */}
        <CustomSelect
          name="kid_age"
          placeholder="Возраст ребенка"
          options={ageOptions}
          {...fieldCommonInputStyles}
        />

        {/* <FormLabel>Страна</FormLabel> */}
        <CustomSelect
          name="country"
          placeholder="Страна"
          options={countryOptions}
          defaultValue={countryOptions[0]?.value}
          {...fieldCommonInputStyles}
        />

        <CustomSelect
          name="socialnetwork"
          placeholder="Способ связи"
          options={socialNetworkOptions}
          {...fieldCommonInputStyles}
        />
        <Button
          size="md"
          variant="primary"
          gridColumn="span 2"
          rightIcon={<RiSendPlaneFill />}
          type="submit"
          isLoading={isSubmitting}
        >
          Отправить
        </Button>
        {error ? (
          <Text gridColumn="1 / -1" color="red.300" fontSize="sm" textTransform="none">
            {error}
          </Text>
        ) : null}
      </Grid>
    </Box>
  );
}
