import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Loader from "../components/Loader.jsx";
import Navbar from "../components/Navbar.jsx";
import Cursor from "../components/Cursor.jsx";
import Hero from "./Hero.jsx";
import { useStyle } from "../hooks/useStyle.js";

const Scene = lazy(() => import("../scene/Scene.jsx"));

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

function useLowPowerMode() {
  const [lowPower] = useState(() => (
    window.matchMedia("(max-width: 700px)").matches
    || navigator.hardwareConcurrency <= 4
    || (navigator.deviceMemory && navigator.deviceMemory <= 4)
  ));
  return lowPower;
}

export default function PortfolioPage() {
  const { style, setStyle } = useStyle();
  const reducedMotion = useReducedMotionPreference();
  const lowPower = useLowPowerMode();
  const [ready, setReady] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const heroRef = useRef(null);
  const cursor = useRef({ x: 0, y: 0 });
  const scrollProgress = useRef(0);
  const finishLoading = useCallback(() => setReady(true), []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      setHeroVisible(entry.isIntersecting);
    }, { threshold: 0 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateScroll = () => {
      scrollProgress.current = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  return (
    <main className="portfolio-page">
      <div className="scene-fallback" aria-hidden="true">
        <div className="scene-fallback-moon" />
        <div className="scene-fallback-water" />
      </div>
      <Canvas
        className="portfolio-canvas"
        frameloop={reducedMotion ? "demand" : heroVisible ? "always" : "never"}
        dpr={lowPower ? 1 : [1, 1.5]}
        gl={{ antialias: !lowPower, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 1.15, 7.7], fov: 43, near: 0.1, far: 100 }}
        fallback={<div className="scene-webgl-fallback" aria-hidden="true" />}
      >
        <Suspense fallback={null}>
          <Scene
            cursor={cursor}
            scrollProgress={scrollProgress}
            style={style}
            lowPower={lowPower}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      </Canvas>
      <Navbar style={style} setStyle={setStyle} />
      <Hero ready={ready} reducedMotion={reducedMotion} sectionRef={heroRef} />
      <section className="missions-transition" id="missions" aria-label="Portfolio preview">
        <span className="missions-kicker">01 / BEYOND THE SURFACE</span>
        <p className="missions-statement font-heading">
          The next chapter is <span>taking shape.</span>
        </p>
        <a className="missions-link" href="/design-system">
          Explore the design system <span aria-hidden="true">↗</span>
        </a>
      </section>
      {!ready ? <Loader onComplete={finishLoading} /> : null}
      <Cursor />
      <div className="global-mist" aria-hidden="true" />
    </main>
  );
}
