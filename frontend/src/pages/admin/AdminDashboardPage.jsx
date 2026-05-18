const cards = [
  { label: 'Products', value: 'Dynamic CMS' },
  { label: 'SEO', value: 'Database-driven' },
  { label: 'Inquiries', value: 'Tracked' },
  { label: 'Menus', value: 'Editable' },
];

export function AdminDashboardPage() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-[1.75rem] border border-[var(--line)] bg-white/85 p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">{card.label}</p>
          <p className="mt-3 text-2xl font-semibold text-[var(--brand)]">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
