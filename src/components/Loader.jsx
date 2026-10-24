import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import gsap from "gsap";

const MINIMUM_DISPLAY_MS = 2000;
const RING_LENGTH = 251.3;

export default function Loader({ onComplete }) {
  const { progress, active } = useProgress();
  const rootRef = useRef(null);
  const ringRef = useRef(null);
  const slashRef = useRef(null);
  const [minimumElapsed, setMinimumElapsed] = useState(false);
  const [finished, setFinished] = useState(false);
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setMinimumElapsed(true),
      MINIMUM_DISPLAY_MS,
    );
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (finished || !minimumElapsed || active || progress < 100) return;

    if (prefersReducedMotion) {
      setFinished(true);
      onComplete();
      return;
    }

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        onComplete: () => {
          setFinished(true);
          onComplete();
        },
      });
      timeline
        .fromTo(
          slashRef.current,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.36, ease: "power3.inOut" },
        )
        .to(
          rootRef.current.querySelector(".loader-panel-top"),
          { yPercent: -105, duration: 0.78, ease: "power4.inOut" },
          "-=0.08",
        )
        .to(
          rootRef.current.querySelector(".loader-panel-bottom"),
          { yPercent: 105, duration: 0.78, ease: "power4.inOut" },
          "<",
        )
        .to(slashRef.current, { opacity: 0, duration: 0.12 }, "<0.5");
    }, rootRef);

    return () => context.revert();
  }, [active, finished, minimumElapsed, onComplete, prefersReducedMotion, progress]);

  useEffect(() => {
    if (ringRef.current) {
      const strokeDashoffset = RING_LENGTH * (1 - progress / 100);
      if (prefersReducedMotion) {
        ringRef.current.style.strokeDashoffset = strokeDashoffset;
      } else {
        gsap.to(ringRef.current, {
          strokeDashoffset,
          duration: 0.35,
          ease: "power2.out",
        });
      }
    }
  }, [prefersReducedMotion, progress]);

  if (finished) return null;

  return (
    <div
      className="loader-overlay"
      ref={rootRef}
      aria-label={`Loading portfolio, ${Math.round(progress)} percent`}
      role="status"
    >
      <div className="loader-panel loader-panel-top" />
      <div className="loader-panel loader-panel-bottom" />
      <div className="loader-content">
        <div className="loader-mark">
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <circle className="loader-ring-track" cx="50" cy="50" r="40" />
            <circle
              className="loader-ring-progress"
              cx="50"
              cy="50"
              r="40"
              ref={ringRef}
              style={{
                strokeDasharray: RING_LENGTH,
                strokeDashoffset: RING_LENGTH,
              }}
            />
          </svg>
          <span className="loader-kanji font-brush" lang="ja">水</span>
        </div>
        <span className="loader-percent">{Math.round(progress)}%</span>
        <span className="loader-caption">GATHERING THE CURRENT</span>
      </div>
      <span className="loader-slash" ref={slashRef} aria-hidden="true" />
    </div>
  );
}
