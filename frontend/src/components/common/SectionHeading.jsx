export function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl space-y-3">
      {eyebrow ? <p className="text-sm uppercase tracking-[0.34em] text-[var(--accent)]">{eyebrow}</p> : null}
      <h2 className="text-4xl font-semibold leading-none tracking-tight text-[var(--brand)] md:text-6xl">{title}</h2>
      {description ? <p className="max-w-2xl text-base leading-8 text-[var(--muted)] md:text-lg">{description}</p> : null}
    </div>
  );
}
