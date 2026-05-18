import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMeThunk } from '../../store/slices/authSlice';
import { Loader } from '../../components/common/Loader';
import { Seo } from '../../components/common/Seo';

const featureCards = [
  {
    title: 'Browse Products',
    description: 'Review available Himalayan yak cheese chew lines, variants, and product details.',
    href: '/products',
  },
  {
    title: 'Place Order Request',
    description: 'Submit a product order or wholesale interest request directly from your account.',
    href: '/account/order',
  },
  {
    title: 'My Order Details',
    description: 'Review your submitted orders, shipping addresses, quantities, and current status.',
    href: '/account/orders',
  },
  {
    title: 'Read Export Updates',
    description: 'Follow product, sourcing, and export stories from the Himalayan supply chain.',
    href: '/blogs',
  },
  {
    title: 'Contact Sales',
    description: 'Reach the export team for private label, MOQ, or logistics discussions.',
    href: '/contact',
  },
];

export function AccountPage() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (auth.token && !auth.user?.lastName) {
      dispatch(fetchMeThunk());
    }
  }, [dispatch, auth.token, auth.user]);

  if (auth.loading && !auth.user) {
    return <div className="mx-auto max-w-4xl px-4 py-14"><Loader /></div>;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <Seo title="My Account | Himalayan Churpi" description="Authenticated user profile." />
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-[var(--line)] bg-white/85 p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">Account</p>
          <h1 className="mt-4 text-4xl font-semibold">{auth.user?.name} {auth.user?.lastName}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">
            Your account now gives you direct access to products, order requests, export inquiries, and brand updates.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--line)] p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Email</p>
              <p className="mt-2 text-lg">{auth.user?.email}</p>
            </div>
            <div className="rounded-2xl border border-[var(--line)] p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Role</p>
              <p className="mt-2 text-lg">{auth.user?.role}</p>
            </div>
          </div>
          <div className="mt-8 rounded-[1.75rem] border border-[var(--line)] bg-[var(--surface-dark)] p-6 text-white">
            <p className="text-sm uppercase tracking-[0.3em] text-[#d7b28f]">What You Can Do</p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {['View product catalogue', 'Send order request', 'Read brand updates', 'Access your account details'].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-4">
          {featureCards.map((card) => (
            <Link key={card.title} to={card.href} className="rounded-[1.75rem] border border-[var(--line)] bg-white/85 p-6 transition hover:-translate-y-1">
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">Feature</p>
              <h2 className="mt-3 text-2xl font-semibold">{card.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{card.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
