export function SiteFooter({ companyInfo, links = [] }) {
  return (
    <footer className="mt-20 border-t border-[var(--line)] bg-[var(--surface-dark)] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#d7b28f]">Himalayan Origin</p>
          <h3 className="mt-3 text-2xl font-semibold">{companyInfo?.companyName || 'Himalayan Churpi'}</h3>
          <p className="mt-3 max-w-sm text-sm leading-7 text-white/70">{companyInfo?.description}</p>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#d7b28f]">Navigation</p>
          <div className="mt-4 space-y-3">
            {links.map((item) => (
              <a key={item.id} href={item.href} className="block text-sm text-white/75">
                {item.label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#d7b28f]">Contact</p>
          <div className="mt-4 space-y-3 text-sm text-white/75">
            <p>{companyInfo?.address}</p>
            <p>{companyInfo?.email}</p>
            <p>{companyInfo?.phone}</p>
            <p>WhatsApp: {companyInfo?.whatsapp}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
