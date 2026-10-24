import { useEffect, useRef } from "react";

export default function Cursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return undefined;
    document.body.classList.add("has-custom-cursor");

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let ringX = targetX;
    let ringY = targetY;
    let frame;

    const move = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${targetX - 2}px, ${targetY - 2}px, 0)`;
      }
    };
    const setInteractive = (event) => {
      const interactive = event.target.closest("a, button, [role='button']");
      ringRef.current?.classList.toggle("cursor-ring-active", Boolean(interactive));
    };
    const animate = () => {
      ringX += (targetX - ringX) * 0.16;
      ringY += (targetY - ringY) * 0.16;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX - 12}px, ${ringY - 12}px, 0)`;
      }
      frame = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", setInteractive, { passive: true });
    frame = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", setInteractive);
      cancelAnimationFrame(frame);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      <span className="custom-cursor-dot" ref={dotRef} aria-hidden="true" />
      <span className="custom-cursor-ring" ref={ringRef} aria-hidden="true" />
    </>
  );
}
