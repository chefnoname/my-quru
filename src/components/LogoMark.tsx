/** The Quru mark: a disc cut by two parallel lines, purple with a pink cap. Colours come from the page styles. */
export function LogoMark(props: { className?: string; label?: string }) {
  const { className, label } = props;
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true, focusable: false })}
    >
      <path className="a" d="M11.21 50.75A28 28 0 1 1 54.08 14.78Z" />
      <path className="a" d="M14.58 53.92L56.62 18.66A28 28 0 0 1 59.49 26.69L21.99 58.15A28 28 0 0 1 14.58 53.92Z" />
      <path className="b" d="M27.4 59.62L60 32.26A28 28 0 0 1 27.4 59.62Z" />
    </svg>
  );
}
