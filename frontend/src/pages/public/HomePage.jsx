import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { loadHomeThunk } from '../../store/slices/siteSlice';
import { Seo } from '../../components/common/Seo';
import { HeroSection } from '../../components/sections/HeroSection';
import { SectionHeading } from '../../components/common/SectionHeading';
import { Loader } from '../../components/common/Loader';

export function HomePage() {
  const dispatch = useDispatch();
  const { home, loading } = useSelector((state) => state.site);

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
