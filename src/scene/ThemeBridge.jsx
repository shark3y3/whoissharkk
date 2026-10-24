import { useEffect, useRef } from "react";
import { Color } from "three";

export function readTheme() {
  const styles = getComputedStyle(document.documentElement);
  return {
    background: styles.getPropertyValue("--bg").trim(),
    primary: styles.getPropertyValue("--primary").trim(),
    highlight: styles.getPropertyValue("--highlight").trim(),
  };
}

export function useThemeColors() {
  const colors = useRef({
    background: new Color("#0B1D3A"),
    primary: new Color("#2E8BC0"),
    highlight: new Color("#BFE8FF"),
  });

  useEffect(() => {
    const update = () => {
      const theme = readTheme();
      colors.current.background.set(theme.background);
      colors.current.primary.set(theme.primary);
      colors.current.highlight.set(theme.highlight);
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-style"],
    });
    return () => observer.disconnect();
  }, []);

  return colors;
}
