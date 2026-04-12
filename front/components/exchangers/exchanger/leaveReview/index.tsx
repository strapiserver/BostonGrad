import {
  Button,
  Divider,
  Flex,
  HStack,
  Input,
  Link,
  Textarea,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { ResponsiveText } from "../../../../styles/theme/custom";
import { RiChatNewFill } from "react-icons/ri";
import { BoxWrapper, CustomHeader } from "../../../shared/BoxWrapper";
import { MdOutlineDone } from "react-icons/md";
import { LuSend } from "react-icons/lu";
import { LuTriangleAlert } from "react-icons/lu";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { sendToast, triggerModal } from "../../../../redux/mainReducer";
import {
  selectReviewForm,
  setReviewCategories,
  setReviewCooldownUntil,
  setReviewHasSubmitted,
  setReviewHoneypot,
  setReviewIsSending,
  setReviewIsExchangeDone,
  setReviewGossip,
  setReviewShouldSubmitAfterModal,
  setReviewSentiment,
  setReviewValue,
  toggleReviewCategory,
} from "../../../../redux/leaveFeedbackSlice";
import CustomModal from "../../../shared/CustomModal";
import ReviewAddons from "./addons";
import { ReviewPowChallenge, solvePowChallenge } from "./helper";
import { IReview } from "../../../../types/exchanger";
import { ICity } from "../../../../types/exchange";
import { locale } from "../../../../services/utils";
import { waitSec } from "../../../shared/helper";
import { useExchangerId } from "../ExchangerContext";
import SentimentButtons from "./SentimentButtons";
export const LEAVE_REVIEW_SECTION_ID = "leave-review-section";
const REVIEW_COOLDOWN_MS = 60 * 60 * 1000;
const TELEGRAM_CHAT_URL =
  String(process.env.NEXT_PUBLIC_TELEGRAM_CHAT) || "https://t.me/p2pie_chat";

export default function LeaveReview() {
  const exchangerId = useExchangerId();
  const dispatch = useAppDispatch();
  const { fingerprintInfo, city, modalId } = useAppSelector((state) => ({
    fingerprintInfo: state.main.fingerprint,
    city: state.main.city as ICity,
    modalId: state.main.modal,
  }));
  const reviewState = useAppSelector((state) =>
    selectReviewForm(state, exchangerId)
  );
  const loadTimeRef = useRef(Date.now());
  const {
    value,
    honeypot,
    hasSubmitted,
    isSending,
    sentiment,
    isExchangeDone,
    gossip,
    cooldownUntil,
    shouldSubmitAfterModal,
    selectedCategoryIds,
  } = reviewState;
  const storageKey = useMemo(
    () => `exchanger:${exchangerId}:review_sent`,
    [exchangerId]
  );
  const reviewModalId = `review:${exchangerId}`;
  const isReviewModalOpen = modalId === reviewModalId;

  const lockReviewSubmission = useCallback(() => {
    const cooldownExpiresAt = Date.now() + REVIEW_COOLDOWN_MS;
    dispatch(
      setReviewCooldownUntil({
        exchangerId,
        cooldownUntil: cooldownExpiresAt,
      })
    );
    dispatch(setReviewHasSubmitted({ exchangerId, hasSubmitted: true }));
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, `${cooldownExpiresAt}`);
    }
  }, [dispatch, exchangerId, storageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      dispatch(setReviewHasSubmitted({ exchangerId, hasSubmitted: false }));
      dispatch(setReviewCooldownUntil({ exchangerId, cooldownUntil: null }));
      return;
    }
    const expiresAt = Number(stored);
    if (!Number.isFinite(expiresAt)) {
      localStorage.removeItem(storageKey);
      dispatch(setReviewHasSubmitted({ exchangerId, hasSubmitted: false }));
      dispatch(setReviewCooldownUntil({ exchangerId, cooldownUntil: null }));
      return;
    }
    if (Date.now() < expiresAt) {
      dispatch(setReviewHasSubmitted({ exchangerId, hasSubmitted: true }));
      dispatch(
        setReviewCooldownUntil({ exchangerId, cooldownUntil: expiresAt })
      );
    } else {
      localStorage.removeItem(storageKey);
      dispatch(setReviewHasSubmitted({ exchangerId, hasSubmitted: false }));
      dispatch(setReviewCooldownUntil({ exchangerId, cooldownUntil: null }));
    }
  }, [dispatch, exchangerId, storageKey]);

  useEffect(() => {
    if (typeof window === "undefined" || !cooldownUntil) return;
    const remaining = cooldownUntil - Date.now();
    if (remaining <= 0) {
      dispatch(setReviewHasSubmitted({ exchangerId, hasSubmitted: false }));
      dispatch(setReviewCooldownUntil({ exchangerId, cooldownUntil: null }));
      localStorage.removeItem(storageKey);
      return;
    }
    const timeoutId = window.setTimeout(() => {
      dispatch(setReviewHasSubmitted({ exchangerId, hasSubmitted: false }));
      dispatch(setReviewCooldownUntil({ exchangerId, cooldownUntil: null }));
      localStorage.removeItem(storageKey);
    }, remaining);
    return () => window.clearTimeout(timeoutId);
  }, [cooldownUntil, dispatch, exchangerId, storageKey]);

  const determinePowDifficulty = useCallback(() => {
    const elapsedMs = Date.now() - loadTimeRef.current;
    if (elapsedMs < 7000) return 30;
    if (elapsedMs < 15000) return 18;
    return 10;
  }, []);

  const runProofOfWork = useCallback(
    async (requestedDifficulty: number) => {
      const challengeResponse = await fetch(
        `/api/review-pow?exchangerId=${encodeURIComponent(
          exchangerId
        )}&complexity=${requestedDifficulty}`
      );
      if (!challengeResponse.ok) {
        throw new Error("Failed to request proof-of-work challenge");
      }
      const {
        challenge,
        difficulty: serverDifficulty,
      }: { challenge: ReviewPowChallenge; difficulty: number } =
        await challengeResponse.json();

      const effectiveDifficulty =
        challenge.difficulty ?? serverDifficulty ?? requestedDifficulty;
      const solution = await solvePowChallenge(challenge, effectiveDifficulty);

      return { challenge, nonce: solution.nonce };
    },
    [exchangerId]
  );

  const leaveReview = useCallback(async () => {
    if (!value.trim() || hasSubmitted || isSending) return;
    try {
      dispatch(setReviewIsSending({ exchangerId, isSending: true }));
      const powDifficulty = determinePowDifficulty();
      const proof = await runProofOfWork(powDifficulty);
      lockReviewSubmission();
      const reviewPayload: IReview = {
        honeypot,
        text: value,
        exchangerId,
        type: sentiment || undefined,
        isDispute: null,
        userAgent: fingerprintInfo?.userAgent,
        fingerprint: fingerprintInfo?.fingerprint,
        ipAddress: fingerprintInfo?.ip,
        location: city?.[`${locale}_name`] || undefined,
        isExchangeDone: isExchangeDone ?? undefined,
        gossip: gossip || undefined,
        review_categories:
          selectedCategoryIds && selectedCategoryIds.length
            ? { connect: selectedCategoryIds }
            : undefined,
      };
      await waitSec(1);
      const response = await fetch("/api/review-submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          challenge: proof.challenge,
          nonce: proof.nonce,
          review: reviewPayload,
        }),
      });
      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(
          errorBody?.error || `Request failed with status ${response.status}`
        );
      }
      console.info("Review submitted via Next.js proxy");
      dispatch(setReviewValue({ exchangerId, value: "" }));
      dispatch(setReviewCategories({ exchangerId, categories: [] }));
      dispatch(setReviewGossip({ exchangerId, gossip: "" }));
      dispatch(
        setReviewIsExchangeDone({ exchangerId, isExchangeDone: null })
      );
    } catch (error) {
      console.error("Failed to send review", error);
    } finally {
      dispatch(setReviewIsSending({ exchangerId, isSending: false }));
      dispatch(
        sendToast({
          status: "success",
          title: (
            <span>
              Спасибо за отзыв! Обсудите обменник в нашем{" "}
              <Link
                href={TELEGRAM_CHAT_URL}
                isExternal
                color="violet.900"
                textDecoration="underline"
              >
                телеграм-чате
              </Link>
            </span>
          ),
          timeBeforeClosing: 8000,
        })
      );
    }
  }, [
    value,
    hasSubmitted,
    isSending,
    exchangerId,
    determinePowDifficulty,
    runProofOfWork,
    lockReviewSubmission,
    honeypot,
    sentiment,
    isExchangeDone,
    gossip,
    selectedCategoryIds,
    fingerprintInfo,
    city,
    dispatch,
  ]);

  useEffect(() => {
    if (!isReviewModalOpen && shouldSubmitAfterModal) {
      dispatch(
        setReviewShouldSubmitAfterModal({
          exchangerId,
          shouldSubmit: false,
        })
      );
      leaveReview();
    }
  }, [
    dispatch,
    exchangerId,
    isReviewModalOpen,
    shouldSubmitAfterModal,
    leaveReview,
  ]);

  const isSubmitDisabled =
    value.trim().length < 10 || hasSubmitted || isSending;

  const handleSubmitClick = () => {
    if (isSubmitDisabled) return;
    dispatch(
      setReviewShouldSubmitAfterModal({
        exchangerId,
        shouldSubmit: true,
      })
    );
    dispatch(triggerModal(reviewModalId));
  };

  const handleToggleCategory = (id?: string) => {
    if (!id) return;
    dispatch(toggleReviewCategory({ exchangerId, categoryId: id }));
  };

  return (
    <BoxWrapper id={LEAVE_REVIEW_SECTION_ID}>
      <HStack justifyContent="space-between" flexWrap="wrap" gap="3">
        <CustomHeader text={"Оставить отзыв"} Icon={RiChatNewFill} />
        <SentimentButtons
          sentiment={sentiment}
          isDisabled={hasSubmitted}
        />
      </HStack>
      <Divider my="4" />
      <Textarea
        placeholder="Ваш отзыв"
        value={value}
        minH="100px"
        onChange={(e) =>
          dispatch(setReviewValue({ exchangerId, value: e.target.value }))
        }
        isDisabled={hasSubmitted}
        borderWidth="2px"
        borderRadius="xl"
        borderColor="violet.800"
        focusBorderColor="violet.500"
      />
      <CustomModal id={reviewModalId} header={"Хотите дополнить отзыв?"}>
        <ReviewAddons
          sentiment={sentiment}
          selectedCategoryIds={selectedCategoryIds}
          onToggleCategory={handleToggleCategory}
          onSentimentSelect={(value) =>
            dispatch(setReviewSentiment({ exchangerId, sentiment: value }))
          }
          isExchangeDone={isExchangeDone}
          gossip={gossip}
          onToggleExchangeDone={(value) =>
            dispatch(
              setReviewIsExchangeDone({ exchangerId, isExchangeDone: value })
            )
          }
          onChangeGossip={(value) =>
            dispatch(setReviewGossip({ exchangerId, gossip: value }))
          }
        />
      </CustomModal>
      <Flex
        flexDir={{ base: "column", lg: "row" }}
        justifyContent="space-between"
        gap="4"
        mt="4"
      >
        <HStack color="bg.700" ml="2">
          <LuTriangleAlert size="0.8rem" />
          <ResponsiveText size="xs" color="inherit">
            Запрещены мат, оскорбления и публикация личных данных
          </ResponsiveText>
          <Input
            size="xs"
            w="1"
            variant="unstyled"
            value={honeypot}
            sx={{ caretColor: "transparent" }}
            _focus={{ caretColor: "transparent" }}
            onChange={(e: any) =>
              dispatch(
                setReviewHoneypot({
                  exchangerId,
                  honeypot: e.target.value,
                })
              )
            }
          />
        </HStack>
        <Button
          ml="auto"
          disabled={isSubmitDisabled}
          variant={isSubmitDisabled ? "unset" : "primary"}
          onClick={handleSubmitClick}
          rightIcon={
            hasSubmitted ? (
              <MdOutlineDone size="1rem" />
            ) : (
              <LuSend size="1rem" />
            )
          }
        >
          {hasSubmitted
            ? "Отправлено"
            : isSending
            ? "Отправляем..."
            : "Отправить"}
        </Button>
      </Flex>
    </BoxWrapper>
  );
}
