import { useState, useEffect } from "react";

const useViewportHeight = () => {
  const [vh, setVh] = useState(1);

  useEffect(() => {
    const updateVh = () => {
      if (typeof window !== "undefined") {
        setVh(window.innerHeight * 0.01);
      }
    };

    // Update on initial load if window is defined
    updateVh();

    // Update on resize
    window.addEventListener("resize", updateVh);
    return () => window.removeEventListener("resize", updateVh);
  }, []);

  return vh;
};

export default useViewportHeight;
