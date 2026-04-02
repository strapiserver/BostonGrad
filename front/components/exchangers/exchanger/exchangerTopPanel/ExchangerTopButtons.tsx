import { Box, Grid, HStack } from "@chakra-ui/react";

import { LEAVE_REVIEW_SECTION_ID } from "../leaveReview";
import ExchangeButton from "./ExchangeButton";
import LeaveReviewButton from "./LeaveReviewButton";
import { IExchanger } from "../../../../types/exchanger";

export const ExchangerTopButtons = ({ ref_link }: { ref_link: string }) => {
  const handleScrollToLeaveReview = () => {
    if (typeof window === "undefined") return;
    const target = document.getElementById(LEAVE_REVIEW_SECTION_ID);
    if (target) {
      const rect = target.getBoundingClientRect();
      const absoluteTop = rect.top + window.pageYOffset;
      window.scrollTo({
        top: Math.max(absoluteTop - 100, 0),
        behavior: "smooth",
      });
      return;
    }
    const scrollHeight =
      document.documentElement?.scrollHeight ?? document.body.scrollHeight ?? 0;
    window.scrollTo({
      top: Math.max(scrollHeight - 100, 0),
      behavior: "smooth",
    });
  };

  return (
    <>
      <LeaveReviewButton onClick={handleScrollToLeaveReview} />
      <ExchangeButton refLink={ref_link} fullWidth />
    </>
  );
};
