import { Link, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const navItems = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Products', href: '/admin/products' },
  { label: 'Categories', href: '/admin/categories' },
  { label: 'Blogs', href: '/admin/blogs' },
  { label: 'Pages', href: '/admin/pages' },
  { label: 'Settings', href: '/admin/websiteSettings' },
  { label: 'Inquiries', href: '/admin/inquiries' },
];

export function AdminLayout() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="grid min-h-screen md:grid-cols-[260px_1fr]">
      <aside className="border-r border-[var(--line)] bg-[var(--surface)] p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Admin CMS</p>
        <h2 className="mt-2 text-2xl font-semibold text-[var(--brand)]">Himalayan Churpi</h2>
        <nav className="mt-8 space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} to={item.href} className="block rounded-2xl px-4 py-3 text-sm text-[var(--muted)] hover:bg-[#efe3d0] hover:text-[var(--brand)]">
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="bg-[#f7f1e6] p-6 md:p-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--muted)]">Signed in as {user?.name}</p>
            <h1 className="text-3xl font-semibold text-[var(--brand)]">Content Management</h1>
          </div>
          <button className="rounded-full border border-[var(--line)] px-4 py-2" onClick={() => dispatch(logout())}>
            Logout
          </button>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
