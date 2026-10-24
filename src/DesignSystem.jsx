import Button from "./components/ui/Button.jsx";
import Card from "./components/ui/Card.jsx";
import SectionHeading from "./components/ui/SectionHeading.jsx";
import SlashDivider from "./components/ui/SlashDivider.jsx";
import StyleSwitcher from "./components/ui/StyleSwitcher.jsx";
import { useStyle } from "./hooks/useStyle.js";

const TOKENS = [
  ["--bg-deep", "Deep background"],
  ["--bg", "Background"],
  ["--surface", "Surface"],
  ["--primary", "Primary"],
  ["--highlight", "Highlight"],
  ["--accent", "Accent"],
  ["--text", "Text"],
  ["--text-muted", "Muted text"],
  ["--glow", "Glow"],
  ["--border", "Border"],
];

const PALETTES = {
  water: ["#060E1F", "#0B1D3A", "#0F2748", "#2E8BC0", "#BFE8FF", "#D62839", "#E8F4FF", "#8FA9C4", "rgba(46, 139, 192, 0.3)", "#244362"],
  flame: ["#100603", "#1A0A06", "#2A120A", "#E4572E", "#FFB347", "#D62839", "#FFF2E8", "#D5B2A1", "rgba(228, 87, 46, 0.3)", "#5A2A1B"],
  thunder: ["#090813", "#14121F", "#211D31", "#FFD23F", "#FFF8D6", "#D62839", "#F7F4FF", "#C4BED2", "rgba(255, 210, 63, 0.3)", "#423A57"],
  wind: ["#07130F", "#0E1F1A", "#142D25", "#4CAF8F", "#D9F2E6", "#D62839", "#EAF8F1", "#ADD2C1", "rgba(76, 175, 143, 0.3)", "#2D5144"],
};

function ColorSwatches({ style }) {
  return (
    <div className="swatch-grid">
      {TOKENS.map(([token, label], index) => {
        const value = PALETTES[style][index];
        return (
        <div className="swatch-card" key={token}>
          <div className="swatch-color" style={{ backgroundColor: value }} />
          <div className="swatch-info">
            <strong>{label}</strong>
            <code>{token}</code>
            <span>{value}</span>
          </div>
        </div>
        );
      })}
    </div>
  );
}

function PatternPreview({ title, className, children }) {
  return (
    <div className="pattern-preview">
      <div className={`pattern-sample ${className}`} aria-hidden="true" />
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
    </div>
  );
}

export default function DesignSystem() {
  const { style, setStyle } = useStyle();

  return (
    <main className="design-system">
      <div className="mist-overlay" aria-hidden="true" />
      <div className="page-content">
        <header className="hero">
          <p className="eyebrow">WHO IS SHARK — DESIGN SYSTEM / 01</p>
          <h1 className="type-h1">
            Misty<span className="hero-period">.</span>
            <br />
            Sharp<span className="hero-period">.</span> Luminous<span className="hero-period">.</span>
          </h1>
          <p className="hero-copy type-body">
            A quiet atmosphere. A precise edge. A glimmer in the dark.
          </p>
          <div className="hero-switcher">
            <span className="eyebrow">COLOR STYLE</span>
            <StyleSwitcher style={style} setStyle={setStyle} />
          </div>
        </header>

        <SlashDivider />

        <section className="showcase-section" aria-labelledby="colors-title">
          <SectionHeading
            kanji="色"
            title="Color tokens"
            subtitle="Four breathing palettes, one shared foundation."
          />
          <div className="section-body">
            <h3 className="type-h3" id="colors-title">Live palette</h3>
            <p className="section-intro">Switch styles above to preview every token in context.</p>
            <ColorSwatches style={style} />
          </div>
        </section>

        <section className="showcase-section" aria-labelledby="type-title">
          <SectionHeading
            kanji="字"
            title="Typography"
            subtitle="Literary forms meet a clean, readable interface."
          />
          <div className="type-scale" id="type-title">
            <div className="type-row">
              <span className="type-label">H1 · Shippori Mincho 800</span>
              <p className="type-h1">A quiet current</p>
            </div>
            <div className="type-row">
              <span className="type-label">H2 · Shippori Mincho 600</span>
              <p className="type-h2">Move with intention</p>
            </div>
            <div className="type-row">
              <span className="type-label">H3 · Shippori Mincho 600</span>
              <p className="type-h3">Clarity through craft</p>
            </div>
            <div className="type-row">
              <span className="type-label">Body · Inter 400</span>
              <p className="type-body">
                Thoughtful software is built from small, deliberate decisions. This body
                style keeps longer reading comfortable and clear.
              </p>
            </div>
            <div className="type-row">
              <span className="type-label">Small · Inter 500</span>
              <p className="type-small">A little detail, held in the light.</p>
            </div>
            <div className="type-row">
              <span className="type-label">Brush · Yuji Boku</span>
              <p className="brush-sample font-brush" lang="ja">静かな力</p>
            </div>
          </div>
        </section>

        <section className="showcase-section" aria-label="CSS patterns">
          <SectionHeading
            kanji="紋"
            title="Surface patterns"
            subtitle="Pure CSS texture, kept deliberately quiet."
          />
          <div className="pattern-grid">
            <PatternPreview title="Haori" className="pattern-haori">
              A subdued checkered weave.
            </PatternPreview>
            <PatternPreview title="Uroko" className="pattern-uroko">
              Repeating triangular scales.
            </PatternPreview>
            <div className="pattern-preview">
              <div className="pattern-sample mist-sample">
                <span className="mist-preview" aria-hidden="true" />
                <span>MIST</span>
              </div>
              <div>
                <h3>Mist overlay</h3>
                <p>Layered, soft radial light.</p>
              </div>
            </div>
            <div className="pattern-preview">
              <div className="pattern-sample glow-sample">
                <span className="glow-preview">GLOW EDGE</span>
              </div>
              <div>
                <h3>Glow edge</h3>
                <p>A fine border with a soft bloom.</p>
              </div>
            </div>
            <div className="pattern-preview">
              <div className="pattern-sample slash-sample">
                <span className="slash-line" />
              </div>
              <div>
                <h3>Slash line</h3>
                <p>A sharp accent for quiet dividers.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="showcase-section" aria-label="Base components">
          <SectionHeading
            kanji="道具"
            title="Base components"
            subtitle="A small, reusable kit for the pages to come."
          />
          <div className="component-grid">
            <Card className="component-card">
              <span className="type-label">BUTTONS</span>
              <h3 className="type-h3">Choose your path</h3>
              <div className="button-row">
                <Button>Primary action</Button>
                <Button variant="slash">Slash action</Button>
              </div>
            </Card>
            <Card className="component-card">
              <span className="type-label">CARD</span>
              <h3 className="type-h3">A quiet surface</h3>
              <p className="type-body">
                Subtle texture, a crisp edge, and a little light on hover.
              </p>
            </Card>
            <Card className="component-card section-heading-card">
              <span className="type-label">SECTION HEADING</span>
              <SectionHeading
                kanji="水"
                title="Flow with focus"
                subtitle="Large type, a faint kanji, one decisive slash."
              />
            </Card>
          </div>
          <div className="divider-demo">
            <span className="type-label">SECTION DIVIDER</span>
            <SlashDivider />
          </div>
        </section>

        <footer className="page-footer">
          <span>PHASE 01 — DESIGN SYSTEM</span>
          <span>Built for clarity in the fog.</span>
        </footer>
      </div>
    </main>
  );
}
