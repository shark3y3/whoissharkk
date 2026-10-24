import { useEffect, useRef } from "react";
import gsap from "gsap";
import Button from "../components/ui/Button.jsx";

const BIO_LINES = [
  "I turn ideas into interactive digital experiences.",
  "Building seamless frontends, powerful backends, and intelligent systems.",
  "Connecting design, logic, and data into one cohesive product.",
  "From the first pixel to the final deployment.",
];

export default function Hero({ ready, reducedMotion, sectionRef }) {
  const heroRef = useRef(null);
  const slashRef = useRef(null);
  const nameRef = useRef(null);
  const eyebrowRef = useRef(null);
  const bioRef = useRef(null);
  const actionsRef = useRef(null);

  useEffect(() => {
    if (!ready) return undefined;
    const context = gsap.context(() => {
      const lines = bioRef.current.querySelectorAll(".hero-bio-line");
      if (reducedMotion) {
        gsap.set([eyebrowRef.current, nameRef.current, lines, actionsRef.current], {
          clearProps: "all",
        });
        return;
      }

      gsap.set(nameRef.current, { clipPath: "inset(0 100% 0 0)" });
      gsap.set(eyebrowRef.current, { opacity: 0, y: 10 });
      gsap.set(lines, { opacity: 0, y: 18 });
      gsap.set(actionsRef.current, { opacity: 0, y: 12 });
      const timeline = gsap.timeline();
      timeline
        .to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" })
        .fromTo(
          slashRef.current,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.48, ease: "power3.inOut" },
          "-=0.12",
        )
        .to(
          nameRef.current,
          { clipPath: "inset(0 0% 0 0)", duration: 0.72, ease: "power3.inOut" },
          "-=0.08",
        )
        .to(slashRef.current, { opacity: 0, duration: 0.18 }, "-=0.18")
        .to(lines, { opacity: 1, y: 0, duration: 0.46, stagger: 0.12, ease: "power2.out" }, "-=0.12")
        .to(actionsRef.current, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.08");
    }, heroRef);
    return () => context.revert();
  }, [ready, reducedMotion]);

  return (
    <section className="portfolio-hero" id="top" ref={(node) => {
      heroRef.current = node;
      if (sectionRef) sectionRef.current = node;
    }} aria-labelledby="hero-name">
      <div className="hero-copy-block">
        <p className="portfolio-eyebrow" ref={eyebrowRef}>
          <span className="eyebrow-mark" aria-hidden="true" />
          FULL-STACK DEVELOPER IN THE MAKING
        </p>
        <div className="hero-name-wrap">
          <span className="hero-name-slash" ref={slashRef} aria-hidden="true" />
          <h1 className="portfolio-name font-heading" id="hero-name" ref={nameRef}>
            Shreyash<span className="name-period">.</span>
          </h1>
        </div>
        <div className="portfolio-bio type-body" ref={bioRef}>
          {BIO_LINES.map((line) => (
            <p className="hero-bio-line" key={line}>{line}</p>
          ))}
        </div>
        <div className="hero-actions" ref={actionsRef}>
          <Button href="#missions">View missions <span aria-hidden="true">↗</span></Button>
          <Button
            href="mailto:hello@shreyash.dev"
            variant="slash"
            aria-label="Send a crow: email Shreyash"
          >
            Send a crow <span aria-hidden="true">↗</span>
          </Button>
        </div>
      </div>
      <div className="hero-side-note" aria-hidden="true">
        <span>WATER / FORM 01</span>
        <span className="hero-side-line" />
        <span>静けさの中に、力を。</span>
      </div>
      <a className="scroll-cue" href="#missions" aria-label="Scroll to the next section">
        <span>SCROLL</span>
        <span className="scroll-cue-line" aria-hidden="true" />
      </a>
    </section>
  );
}
