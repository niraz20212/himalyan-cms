import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { loadHomeThunk } from '../../store/slices/siteSlice';
import { Button } from '../../components/common/Button';
import { Seo } from '../../components/common/Seo';
import { HeroSection } from '../../components/sections/HeroSection';
import { SectionHeading } from '../../components/common/SectionHeading';
import { Loader } from '../../components/common/Loader';

export function HomePage() {
  const dispatch = useDispatch();
  const { home, loading } = useSelector((state) => state.site);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!home) dispatch(loadHomeThunk());
  }, [dispatch, home]);

  if (loading || !home) {
    return <div className="mx-auto max-w-7xl px-4 py-10"><Loader /></div>;
  }

  const hero = home.pages?.home?.sections?.find((section) => section.sectionKey === 'hero');
  const trust = home.pages?.home?.sections?.find((section) => section.sectionKey === 'trust');

  return (
    <>
      <Seo title={home.pages?.home?.seo?.metaTitle} description={home.pages?.home?.seo?.metaDescription} />
      <HeroSection section={hero} />
      <section className="mx-auto mt-16 max-w-7xl px-4 md:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {(trust?.content?.stats || []).map((item) => (
            <div key={item.label} className="rounded-[1.75rem] border border-[var(--line)] bg-white/70 p-6">
              <p className="text-4xl font-semibold text-[var(--brand)]">{item.value}</p>
              <p className="mt-2 text-sm uppercase tracking-[0.2em] text-[var(--muted)]">{item.label}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto mt-12 max-w-7xl px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] border border-[var(--line)] bg-white/85 p-8 shadow-[0_18px_50px_rgba(41,73,54,0.08)]">
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">
              {user ? 'Logged In Experience' : 'Start Here'}
            </p>
            <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
              {user ? `Welcome back , ${user.name}` : 'You can order by logging in or creating an account.'}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--muted)]">
              {user
                ? 'From the homepage you can move directly into products, account features, and order flows without being sent to a dead-end profile screen.'
                : 'Creat account for a more personalized experience, or login to access your account and order requests.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button as={Link} to={user ? '/account/orders' : '/login'}>
                {user ? 'View My Orders' : 'Login As User'}
              </Button>
              <Button as={Link} to="/products" className="bg-white text-[var(--brand)] hover:bg-[#f4ecdd]">
                Browse Products
              </Button>
              <Button as={Link} to={user ? '/account/order' : '/signup'} className="bg-[#b98247] hover:bg-[#a57037]">
                {user ? 'Place Order Request' : 'Create Account'}
              </Button>
            </div>
          </div>
          <div className="grid gap-4">
            {[
              {
                title: user ? 'Account Access' : 'User Login',
                description: user ? 'Open your account, review orders, and continue product actions.' : 'Email/password user access with signup and homepage return after login.',
                href: user ? '/account' : '/login',
                cta: user ? 'Open Account' : 'User Login',
              },
              {
                title: 'Ordering Flow',
                description: 'Users can place structured order requests with product, quantity, shipping address, and notes.',
                href: user ? '/account/order' : '/products',
                cta: user ? 'Start Order' : 'See Products',
              },
            ].map((card) => (
              <Link key={card.title} to={card.href} className="rounded-[1.75rem] border border-[var(--line)] bg-[linear-gradient(180deg,#fffdf8_0%,#f3eadb_100%)] p-6 shadow-[0_12px_30px_rgba(185,130,71,0.08)] transition hover:-translate-y-1">
                <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">User Flow</p>
                <h3 className="mt-3 text-2xl font-semibold">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{card.description}</p>
                <p className="mt-5 text-sm font-semibold text-[var(--brand)]">{card.cta}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-6">
        <SectionHeading eyebrow="Flagship Range" title="Premium Dog Chews Built For Global Shelves" description="Every product, story, and product page is managed from the CMS and delivered dynamically through the API." />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {home.featuredProducts.map((product) => (
            <Link key={product.id} to={`/products/${product.slug}`} className="rounded-[1.75rem] border border-[var(--line)] bg-white/80 p-6 shadow-sm transition hover:-translate-y-1">
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">{product.category?.name}</p>
              <h3 className="mt-3 text-2xl font-semibold">{product.name}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{product.shortDesc}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
