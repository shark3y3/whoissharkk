export default function SlashDivider({ className = "" }) {
  return (
    <div
      className={`slash-divider ${className}`.trim()}
      role="separator"
      aria-orientation="horizontal"
    />
  );
}
