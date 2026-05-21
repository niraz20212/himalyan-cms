import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '../common/Button';

export function SiteHeader({ menu = [], user, onLogout, companyInfo }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(user?.role);
  const navigate = useNavigate();
  const location = useLocation();
  const showBackButton = location.pathname !== '/';
  const logoUrl = companyInfo?.logo?.url;
  const companyName = companyInfo?.companyName || 'Himalayan Churpi';
  const navItems = menu.length ? menu : [{ id: 'products', label: 'Products', href: '/products' }];

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 border-b border-white/50 bg-[rgba(251,248,241,0.72)] backdrop-blur-2xl"
    >
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {showBackButton ? (
              <button
                onClick={() => navigate(-1)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] bg-white/75 text-lg font-semibold text-[var(--brand)] transition hover:bg-white"
                aria-label="Go back"
              >
                &larr;
              </button>
            ) : null}

            <Link to="/" className="group flex items-center gap-3">
              {logoUrl ? (
                <motion.img
                  whileHover={{ rotate: -4, scale: 1.04 }}
                  src={logoUrl}
                  alt={companyName}
                  className="h-12 w-12 rounded-full border border-[var(--line)] bg-white object-cover shadow-sm"
                />
              ) : (
                <motion.div
                  whileHover={{ rotate: -4, scale: 1.04 }}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--line)] bg-white text-sm font-bold text-[var(--brand)] shadow-sm"
                >
                  HC
                </motion.div>
              )}
              <div>
                <p className="font-body text-[11px] uppercase tracking-[0.34em] text-[var(--accent)]">Premium Nepali Dog Chews</p>
                <p className="text-2xl font-semibold leading-none text-[var(--brand)] transition group-hover:text-[#183126]">{companyName}</p>
              </div>
            </Link>
          </div>

          <nav className="hidden items-center gap-3 rounded-full border border-white/60 bg-white/45 px-3 py-2 shadow-[0_12px_30px_rgba(41,73,54,0.06)] lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.id || item.href}
                to={item.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold tracking-[0.12em] uppercase transition ${
                  location.pathname === item.href ? 'bg-[#214231] text-white shadow-[0_10px_24px_rgba(33,66,49,0.18)]' : 'text-[var(--muted)] hover:bg-white/80 hover:text-[var(--brand)]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {user ? (
              <>
                <Link to={isAdmin ? '/admin' : '/account'} className="rounded-full bg-white/75 px-4 py-2 text-sm font-semibold text-[var(--brand)] shadow-sm transition hover:bg-white">
                  {isAdmin ? 'Admin Panel' : `${user.name}'s Account`}
                </Link>
                <button onClick={onLogout} className="rounded-full border border-[var(--line)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-[var(--brand)]">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold uppercase tracking-[0.1em] text-[var(--muted)] transition hover:text-[var(--brand)]">
                  Login
                </Link>
                <Button as={Link} to="/signup" className="bg-white text-[var(--brand)] hover:bg-[#f4ecdd]">
                  Sign Up
                </Button>
              </>
            )}
            <Button as={Link} to="/contact" className="shimmer-line">
              Export Inquiry
            </Button>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] bg-white/75 text-xl text-[var(--brand)] lg:hidden"
            onClick={() => setMobileOpen((current) => !current)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? 'X' : '|||'}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.24 }}
              className="glass-panel mt-4 rounded-[1.8rem] border border-white/60 p-4 shadow-[var(--shadow-strong)] lg:hidden"
            >
              <nav className="flex flex-col gap-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.id || item.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <Link
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-[var(--brand)] hover:bg-[#f5ecde]"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="mt-4 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link
                      to={isAdmin ? '/admin' : '/account'}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-full bg-[#f5ecde] px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.1em] text-[var(--brand)]"
                    >
                      {isAdmin ? 'Admin Panel' : 'My Account'}
                    </Link>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        onLogout();
                      }}
                      className="rounded-full border border-[var(--line)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-[var(--brand)]"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="rounded-full border border-[var(--line)] px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.1em] text-[var(--brand)]">
                      Login
                    </Link>
                    <Button as={Link} to="/signup" onClick={() => setMobileOpen(false)} className="text-center">
                      Sign Up
                    </Button>
                  </>
                )}
                <Button as={Link} to="/contact" onClick={() => setMobileOpen(false)} className="text-center">
                  Export Inquiry
                </Button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
