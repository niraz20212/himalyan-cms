import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';

export function SiteHeader({ menu = [], user, onLogout, companyInfo }) {
  const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(user?.role);
  const navigate = useNavigate();
  const location = useLocation();
  const showBackButton = location.pathname !== '/';
  const logoUrl = companyInfo?.logo?.url;
  const companyName = companyInfo?.companyName || 'Himalayan Churpi';

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(251,248,241,0.85)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          {showBackButton ? (
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] bg-white/70 text-lg font-semibold text-[var(--brand)] transition hover:bg-white"
              aria-label="Go back"
            >
              ←
            </button>
          ) : null}
          <Link to="/" className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt={companyName} className="h-11 w-11 rounded-full border border-[var(--line)] object-cover bg-white" />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] bg-white text-sm font-bold text-[var(--brand)]">
                HC
              </div>
            )}
            <div>
              <p className="text-lg font-semibold tracking-[0.2em] text-[var(--brand)]">{companyName.toUpperCase()}</p>
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Nepal Premium Dog Chews</p>
            </div>
          </Link>
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          {menu.map((item) => (
            <Link key={item.id} to={item.href} className="text-sm text-[var(--muted)] transition hover:text-[var(--brand)]">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link to={isAdmin ? '/admin' : '/account'} className="rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-[var(--brand)] transition hover:bg-white">
                {isAdmin ? 'Admin Panel' : `${user.name}'s Account`}
              </Link>
              <button onClick={onLogout} className="rounded-full border border-[var(--line)] px-4 py-3 text-sm font-semibold text-[var(--brand)]">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-[var(--muted)] transition hover:text-[var(--brand)]">
                Login
              </Link>
              <Button as={Link} to="/signup" className="bg-white text-[var(--brand)] hover:bg-[#f4ecdd]">
                Sign Up
              </Button>
            </>
          )}
          <Button as={Link} to="/contact">
            Export Inquiry
          </Button>
        </div>
      </div>
    </header>
  );
}
