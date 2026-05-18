import { Link } from 'react-router-dom';
import { fetchProducts } from '../../api/queries';
import { Loader } from '../../components/common/Loader';
import { SectionHeading } from '../../components/common/SectionHeading';
import { Seo } from '../../components/common/Seo';
import { useFetch } from '../../hooks/useFetch';

export function ProductsPage() {
  const { data, loading } = useFetch(fetchProducts, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <Seo title="Products | Himalayan Churpi" description="Premium Himalayan yak cheese dog chew collection." />
      <SectionHeading eyebrow="Product Range" title="Himalayan Dog Chews" description="Dynamic product catalogue with SEO-ready detail pages." />
      <div className="mt-10">
        {loading ? (
          <Loader />
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {data?.map((product) => (
              <Link key={product.id} to={`/products/${product.slug}`} className="rounded-[1.75rem] border border-[var(--line)] bg-white/80 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">{product.category?.name}</p>
                <h3 className="mt-3 text-2xl font-semibold">{product.name}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{product.shortDesc}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
