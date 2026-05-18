import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { fetchProducts } from '../../api/queries';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { SectionHeading } from '../../components/common/SectionHeading';
import { Seo } from '../../components/common/Seo';
import { useFetch } from '../../hooks/useFetch';
import { resolveMediaUrl } from '../../utils/media';

export function ProductsPage() {
  const user = useSelector((state) => state.auth.user);
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
              <div key={product.id} className="rounded-[1.75rem] border border-[var(--line)] bg-white/80 p-6">
                <Link to={`/products/${product.slug}`}>
                  {product.imageUrl ? (
                    <img
                      src={resolveMediaUrl(product.imageUrl)}
                      alt={product.name}
                      className="mb-4 h-56 w-full rounded-[1.25rem] object-cover"
                    />
                  ) : (
                    <div className="mb-4 flex h-56 w-full items-center justify-center rounded-[1.25rem] bg-[#efe6d6] text-sm font-semibold text-[var(--brand)]">
                      No Product Image
                    </div>
                  )}
                  <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">{product.category?.name}</p>
                  <h3 className="mt-3 text-2xl font-semibold">{product.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{product.shortDesc}</p>
                </Link>
                <div className="mt-6 flex gap-3">
                  <Button as={Link} to={`/products/${product.slug}`} className="px-4 py-2">
                    View Details
                  </Button>
                  <Button
                    as={Link}
                    to={user ? `/account/order?product=${product.slug}` : '/login'}
                    className="bg-white px-4 py-2 text-[var(--brand)] hover:bg-[#f4ecdd]"
                  >
                    {user ? 'Order' : 'Login To Order'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
