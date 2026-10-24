import { STYLES } from "../../hooks/useStyle.js";

const STYLE_LABELS = {
  water: "Water",
  flame: "Flame",
  thunder: "Thunder",
  wind: "Wind",
};

export default function StyleSwitcher({ style, setStyle }) {
  return (
    <div className="style-switcher" role="group" aria-label="Choose a color style">
      {STYLES.map((option) => (
        <button
          key={option}
          type="button"
          className="style-switcher-button"
          aria-pressed={style === option}
          onClick={() => setStyle(option)}
        >
          {STYLE_LABELS[option]}
        </button>
      ))}
    </div>
  );
}
