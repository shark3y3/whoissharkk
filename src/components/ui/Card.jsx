export default function Card({ children, className = "", ...props }) {
  return (
    <article className={`ui-card pattern-haori ${className}`.trim()} {...props}>
      {children}
    </article>
  );
}
