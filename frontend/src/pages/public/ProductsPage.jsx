import { useSelector } from 'react-redux';
import { fetchProducts } from '../../api/queries';
import { Loader } from '../../components/common/Loader';
import { ProductCard } from '../../components/common/ProductCard';
import { Reveal, RevealGroup, fadeUp } from '../../components/common/Reveal';
import { SectionHeading } from '../../components/common/SectionHeading';
import { Seo } from '../../components/common/Seo';
import { useFetch } from '../../hooks/useFetch';
import { motion } from 'framer-motion';

export function ProductsPage() {
  const user = useSelector((state) => state.auth.user);
  const { data, loading } = useFetch(fetchProducts, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <Seo title="Products | Himalayan Churpi" description="Premium Himalayan yak cheese dog chew collection." />
      <Reveal>
        <SectionHeading eyebrow="Product Range" title="Himalayan Dog Chews" description="Dynamic product catalogue with SEO-ready detail pages." />
      </Reveal>
      <div className="mt-10">
        {loading ? (
          <Loader />
        ) : (
          <RevealGroup className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {data?.map((product) => (
              <motion.div key={product.id} variants={fadeUp}>
                <ProductCard product={product} user={user} />
              </motion.div>
            ))}
          </RevealGroup>
        )}
      </div>
    </section>
  );
}
