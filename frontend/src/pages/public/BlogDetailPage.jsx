import { useParams } from 'react-router-dom';
import { fetchBlog } from '../../api/queries';
import { Loader } from '../../components/common/Loader';
import { Seo } from '../../components/common/Seo';
import { useFetch } from '../../hooks/useFetch';

export function BlogDetailPage() {
  const { slug } = useParams();
  const { data, loading } = useFetch(() => fetchBlog(slug), [slug]);

  if (loading) return <div className="mx-auto max-w-4xl px-4 py-14"><Loader /></div>;

  return (
    <article className="mx-auto max-w-4xl px-4 py-14">
      <Seo title={data?.seo?.metaTitle || data?.title} description={data?.seo?.metaDescription || data?.excerpt} />
      <h1 className="text-4xl font-semibold md:text-6xl">{data?.title}</h1>
      <p className="mt-4 text-lg leading-8 text-[var(--muted)]">{data?.excerpt}</p>
      <div className="prose mt-8 max-w-none rounded-[2rem] border border-[var(--line)] bg-white/80 p-8" dangerouslySetInnerHTML={{ __html: data?.content || '' }} />
    </article>
  );
}
