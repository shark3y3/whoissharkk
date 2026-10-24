import { useCallback, useEffect, useState } from "react";

export const STYLES = ["water", "flame", "thunder", "wind"];
const STORAGE_KEY = "whoissharkk-style";

function getInitialStyle() {
  try {
    const savedStyle = window.localStorage.getItem(STORAGE_KEY);
    return STYLES.includes(savedStyle) ? savedStyle : "water";
  } catch (error) {
    console.warn("Unable to read the saved color style.", error);
    return "water";
  }
}

export function useStyle() {
  const [style, setCurrentStyle] = useState(getInitialStyle);

  useEffect(() => {
    document.documentElement.dataset.style = style;
  }, [style]);

  const setStyle = useCallback((nextStyle) => {
    if (!STYLES.includes(nextStyle)) {
      throw new Error(`Unknown color style: ${nextStyle}`);
    }

    document.documentElement.dataset.style = nextStyle;
    setCurrentStyle(nextStyle);

    try {
      window.localStorage.setItem(STORAGE_KEY, nextStyle);
    } catch (error) {
      console.warn("Unable to save the selected color style.", error);
    }
  }, []);

  return { style, setStyle };
}
