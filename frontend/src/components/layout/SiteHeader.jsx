import { Link } from 'react-router-dom';
import { Button } from '../common/Button';

export function SiteHeader({ menu = [] }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(251,248,241,0.85)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <Link to="/" className="text-lg font-semibold tracking-[0.2em] text-[var(--brand)]">
          HIMALAYAN CHURPI
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {menu.map((item) => (
            <Link key={item.id} to={item.href} className="text-sm text-[var(--muted)] transition hover:text-[var(--brand)]">
              {item.label}
            </Link>
          ))}
        </nav>
        <Button as={Link} to="/contact" className="hidden md:inline-flex">
          Export Inquiry
        </Button>
      </div>
    </header>
  );
}
