import { useState, useEffect } from "react";

/**
 * Smoothly interpolate numeric values to avoid abrupt jumps on sliders.
 * Falls back to the target value immediately when the delta is negligible.
 */
const useSmooth = (value: number, slow: boolean = false) => {
  const [smoothValue, setSmoothValue] = useState(value);

  useEffect(() => {
    if (!Number.isFinite(value)) {
      setSmoothValue(value);
      return;
    }

    const diff = value - smoothValue;
    const threshold = Math.max(0.001, Math.abs(value) * 0.0005);

    if (Math.abs(diff) <= threshold) {
      setSmoothValue(value);
      return;
    }

    const timeout = setTimeout(
      () => setSmoothValue((prev) => prev + diff * 0.4),
      slow ? 25 : 10
    );

    return () => clearTimeout(timeout);
  }, [value, smoothValue, slow]);

  return smoothValue;
};

export default useSmooth;
