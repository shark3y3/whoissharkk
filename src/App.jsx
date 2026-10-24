import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Lenis from "lenis";
import "./styles/portfolio.css";

const DesignSystem = lazy(() => import("./DesignSystem.jsx"));
const PortfolioPage = lazy(() => import("./sections/PortfolioPage.jsx"));

function useReducedMotionPreference() {
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reducedMotion;
}

function useSmoothScroll(reducedMotion) {
  useEffect(() => {
    if (reducedMotion) return undefined;
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    let frameId;
    const raf = (time) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };
    frameId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, [reducedMotion]);
}

function Application() {
  const reducedMotion = useReducedMotionPreference();
  useSmoothScroll(reducedMotion);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<div className="route-loading" />}>
              <PortfolioPage />
            </Suspense>
          }
        />
        <Route
          path="/design-system"
          element={
            <Suspense fallback={<div className="route-loading" />}>
              <DesignSystem />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return <Application />;
}
