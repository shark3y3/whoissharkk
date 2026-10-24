import StyleSwitcher from "./ui/StyleSwitcher.jsx";

export default function Navbar({ style, setStyle }) {
  return (
    <nav className="portfolio-nav" aria-label="Main navigation">
      <a className="nav-wordmark font-heading" href="#top" aria-label="Shreyash, home">
        Shreyash<span>.</span>
      </a>
      <div className="nav-links">
        <a href="#top" aria-current="page">Home</a>
        <a href="#missions">Missions</a>
        <a href="mailto:hello@shreyash.dev">Contact</a>
      </div>
      <StyleSwitcher style={style} setStyle={setStyle} />
    </nav>
  );
}
