export default function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  href,
  ...props
}) {
  const variantClass = variant === "slash" ? "button-slash" : "button-primary";
  const Component = href ? "a" : "button";

  return (
    <Component
      className={`ui-button ${variantClass} ${className}`.trim()}
      {...(href ? { href } : { type })}
      {...props}
    >
      <span>{children}</span>
    </Component>
  );
}
