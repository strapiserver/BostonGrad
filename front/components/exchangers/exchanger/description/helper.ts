export function formatPhoneNumber(input: string): string {
  // Remove all non-digit chars
  const digits = input.replace(/\D/g, "");

  if (digits.length === 0) return "";

  // US-style formatting as default
  if (digits.length === 10)
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;

  // International format (e.g. +1, +44, etc.)
  if (digits.length > 10)
    return `+${digits.slice(0, digits.length - 10)} (${digits.slice(
      -10,
      -7
    )}) ${digits.slice(-7, -4)}-${digits.slice(-4)}`;

  // Partial formatting for input typing
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}
