import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import {
  normalizeTelegramSlug,
  storeTelegramConfirmation,
  verifyTelegramToken,
} from "../../../services/telegram";

export default function TelegramConfirmPage() {
  const router = useRouter();
  const token = useMemo(() => {
    const queryToken = router.query?.token;
    return Array.isArray(queryToken) ? queryToken[0] : queryToken;
  }, [router.query]);

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string>("Подготовка...");
  const [slug, setSlug] = useState<string>("");

  useEffect(() => {
    if (!router.isReady) return;
    if (!token) {
      setStatus("error");
      setMessage("Не найден token подтверждения");
      return;
    }

    let isMounted = true;
    setStatus("loading");
    setMessage("Проверяем подтверждение в Telegram...");

    verifyTelegramToken(token)
      .then((response) => {
        if (!isMounted) return;
        if (!response.ok) {
          setStatus("error");
          setMessage("Подтверждение не прошло проверку");
          return;
        }

        const normalized = normalizeTelegramSlug(response.slug);
        if (!normalized) {
          setStatus("error");
          setMessage("Некорректные данные подтверждения");
          return;
        }

        storeTelegramConfirmation({
          slug: normalized,
          token,
          telegramUsername: response.telegramUsername,
          confirmedAt: Date.now(),
        });

        setSlug(normalized);
        setStatus("success");
        setMessage("Подтверждение получено. Теперь можно сохранить офферы.");
      })
      .catch(() => {
        if (!isMounted) return;
        setStatus("error");
        setMessage("Не удалось проверить подтверждение");
      });

    return () => {
      isMounted = false;
    };
  }, [router.isReady, token]);

  const canGoBack = status === "success" && slug;

  return (
    <VStack spacing={6} py={{ base: 10, lg: 20 }} px={4} align="center">
      <Box maxW="560px" w="100%" bg="bg.800" p={6} borderRadius="xl">
        <VStack spacing={4} align="stretch">
          <Heading size="md">Подтверждение Telegram</Heading>
          <Text color="bg.300">{message}</Text>
          {canGoBack && (
            <Button
              onClick={() => void router.push(`/p2p/edit/${slug}`)}
              colorScheme="orange"
            >
              Вернуться к редактированию
            </Button>
          )}
          {status === "error" && (
            <Button onClick={() => void router.back()} variant="outline">
              Назад
            </Button>
          )}
        </VStack>
      </Box>
    </VStack>
  );
}
