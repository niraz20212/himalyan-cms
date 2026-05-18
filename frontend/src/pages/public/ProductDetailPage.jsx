import { useParams } from 'react-router-dom';
import { fetchProduct } from '../../api/queries';
import { Loader } from '../../components/common/Loader';
import { Seo } from '../../components/common/Seo';
import { useFetch } from '../../hooks/useFetch';

export function ProductDetailPage() {
  const { slug } = useParams();
  const { data, loading } = useFetch(() => fetchProduct(slug), [slug]);

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-14"><Loader /></div>;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <Seo title={data?.seo?.metaTitle || data?.name} description={data?.seo?.metaDescription || data?.shortDesc} />
      <div className="grid gap-8 md:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[2rem] border border-[var(--line)] bg-white/80 p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">{data?.category?.name}</p>
          <h1 className="mt-4 text-4xl font-semibold md:text-6xl">{data?.name}</h1>
          <p className="mt-6 text-lg leading-8 text-[var(--muted)]">{data?.description}</p>
        </div>
        <div className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface-dark)] p-8 text-white">
          <h2 className="text-2xl font-semibold">Specifications</h2>
          <div className="mt-6 space-y-3 text-sm text-white/80">
            {Object.entries(data?.specifications || {}).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-4 border-b border-white/10 pb-3">
                <span className="capitalize">{key}</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
