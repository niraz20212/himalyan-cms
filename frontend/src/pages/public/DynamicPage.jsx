import { useParams } from 'react-router-dom';
import { fetchPage } from '../../api/queries';
import { Loader } from '../../components/common/Loader';
import { Seo } from '../../components/common/Seo';
import { useFetch } from '../../hooks/useFetch';

export function DynamicPage() {
  const { slug } = useParams();
  const { data, loading } = useFetch(() => fetchPage(slug), [slug]);

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-14"><Loader /></div>;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <Seo title={data?.seo?.metaTitle || data?.title} description={data?.seo?.metaDescription || data?.summary} />
      <div className="rounded-[2rem] border border-[var(--line)] bg-white/80 p-8">
        <h1 className="text-4xl font-semibold md:text-6xl">{data?.title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted)]">{data?.summary}</p>
      </div>
      <div className="mt-8 space-y-6">
        {data?.sections?.map((section) => (
          <div key={section.id} className="rounded-[1.75rem] border border-[var(--line)] bg-white/70 p-6">
            <h2 className="text-2xl font-semibold">{section.name}</h2>
            <pre className="mt-4 overflow-auto whitespace-pre-wrap text-sm text-[var(--muted)]">{JSON.stringify(section.content, null, 2)}</pre>
          </div>
        ))}
      </div>
    </section>
  );
}
