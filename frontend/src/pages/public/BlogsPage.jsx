import { Link } from 'react-router-dom';
import { fetchBlogs } from '../../api/queries';
import { Loader } from '../../components/common/Loader';
import { SectionHeading } from '../../components/common/SectionHeading';
import { useFetch } from '../../hooks/useFetch';

export function BlogsPage() {
  const { data, loading } = useFetch(fetchBlogs, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <SectionHeading eyebrow="News & Insights" title="Stories From The Himalayan Supply Chain" description="Blog content is fully dynamic and editable from the admin dashboard." />
      <div className="mt-10">
        {loading ? (
          <Loader />
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {data?.map((blog) => (
              <Link key={blog.id} to={`/blogs/${blog.slug}`} className="rounded-[1.75rem] border border-[var(--line)] bg-white/80 p-6">
                <h3 className="text-2xl font-semibold">{blog.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{blog.excerpt}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
