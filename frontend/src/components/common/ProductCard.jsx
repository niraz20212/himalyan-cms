import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import { resolveMediaUrl } from '../../utils/media';

export function ProductCard({ product, user, showActions = true }) {
  if (!product) return null;

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-[2rem] border border-white/65 bg-white/92 shadow-[0_18px_48px_rgba(40,68,49,0.08)]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(212,168,116,0.22),transparent)]" />
      <div className="absolute right-4 top-4 z-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/88 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--brand)] shadow-[0_10px_30px_rgba(36,58,45,0.12)] backdrop-blur">
          <Sparkles size={14} className="text-[var(--accent)]" />
          Premium chew
        </div>
      </div>

      <Link to={`/products/${product.slug}`} className="block">
        <div className="relative overflow-hidden">
          {product.imageUrl ? (
            <img
              src={resolveMediaUrl(product.imageUrl)}
              alt={product.name}
              className="h-64 w-full object-cover transition duration-700 group-hover:scale-[1.06]"
            />
          ) : (
            <div className="grid-radial flex h-64 w-full items-center justify-center bg-[#efe1cc] text-sm font-semibold text-[var(--brand)]">
              No Product Image
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,transparent,rgba(15,27,21,0.72))]" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-white/78">
                {product.category?.name || 'Premium Chew'}
              </p>
              <h3 className="mt-2 text-3xl font-semibold leading-none text-white">
                {product.name}
              </h3>
            </div>
            <div className="rounded-full bg-white/16 p-3 text-white backdrop-blur transition group-hover:bg-white/24">
              <ArrowUpRight size={18} />
            </div>
          </div>
        </div>
      </Link>

      <div className="p-5">
        <p className="line-clamp-3 text-sm leading-7 text-[var(--muted)]">
          {product.shortDesc}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {(product.specifications ? Object.entries(product.specifications) : [])
            .slice(0, 2)
            .map(([key, value]) => (
              <span
                key={key}
                className="rounded-full bg-[#f3e5d1] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand)]"
              >
                {key}: {String(value)}
              </span>
            ))}
        </div>

        {showActions ? (
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
        ) : null}
      </div>
    </motion.article>
  );
}
