import { useEffect, useRef } from "react";

type TelegramConfirmStatus = {
  ok?: boolean;
  confirmed?: boolean;
};

export const fetchTelegramConfirmationStatus = async (slug: string) => {
  if (!slug) return false;
  try {
    const response = await fetch(
      `/api/telegram/status?slug=${encodeURIComponent(slug)}`
    );
    if (!response.ok) return false;
    const data = (await response.json()) as TelegramConfirmStatus;
    return Boolean(data?.ok && data?.confirmed);
  } catch {
    return false;
  }
};

type UseTelegramConfirmPollingOptions = {
  enabled: boolean;
  slug?: string;
  maxAttempts?: number;
  initialDelayMs?: number;
  stepMs?: number;
  onSuccess?: () => void;
};

const useTelegramConfirmPolling = ({
  enabled,
  slug,
  maxAttempts = 20,
  initialDelayMs = 5000,
  stepMs = 2000,
  onSuccess,
}: UseTelegramConfirmPollingOptions) => {
  const pollingActiveRef = useRef(false);

  useEffect(() => {
    if (!enabled || !slug) return;
    if (pollingActiveRef.current) return;

    pollingActiveRef.current = true;
    let stopped = false;
    let attempt = 0;
    let delayMs = initialDelayMs;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const scheduleNext = () => {
      if (stopped) return;
      if (attempt >= maxAttempts) return;
      timeoutId = setTimeout(async () => {
        if (stopped) return;
        attempt += 1;
        const confirmed = await fetchTelegramConfirmationStatus(slug);
        if (confirmed) {
          onSuccess?.();
          return;
        }
        delayMs += stepMs;
        scheduleNext();
      }, delayMs);
    };

    scheduleNext();

    return () => {
      stopped = true;
      pollingActiveRef.current = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [enabled, slug, maxAttempts, initialDelayMs, stepMs, onSuccess]);
};

export default useTelegramConfirmPolling;
