export const maskIP = (ip?: string | null): string | null | undefined => {
  if (ip == null) return ip;
  const trimmed = ip.trim();
  if (trimmed.length <= 3) return "***";
  return `${trimmed.slice(0, -3)}***`;
};

export const maskReviewList = <T extends { ipAddress?: string | null }>(
  reviews?: T[] | null
): T[] | null | undefined => {
  if (!Array.isArray(reviews)) return reviews;
  return reviews.map((review) =>
    review ? { ...review, ipAddress: maskIP(review.ipAddress) } : review
  );
};
