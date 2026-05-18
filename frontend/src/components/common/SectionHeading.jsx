export function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-2xl space-y-3">
      {eyebrow ? <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">{eyebrow}</p> : null}
      <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">{title}</h2>
      {description ? <p className="text-base leading-7 text-[var(--muted)] md:text-lg">{description}</p> : null}
    </div>
  );
}
