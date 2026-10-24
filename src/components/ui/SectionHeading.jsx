export default function SectionHeading({ kanji, title, subtitle }) {
  return (
    <header className="section-heading">
      {kanji ? (
        <span className="section-heading-kanji font-brush" aria-hidden="true">
          {kanji}
        </span>
      ) : null}
      <div className="section-heading-content">
        <p className="eyebrow">DESIGN SYSTEM</p>
        <h2 className="type-h2">{title}</h2>
        {subtitle ? <p className="section-heading-subtitle">{subtitle}</p> : null}
        <div className="slash-line" aria-hidden="true" />
      </div>
    </header>
  );
}
