import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';

export function HeroSection({ section }) {
  const content = section?.content || {};
  return (
    <section className="overflow-hidden px-4 pt-14 md:px-6 md:pt-20">
      <div className="mx-auto grid max-w-7xl items-center gap-8 rounded-[2rem] border border-white/50 bg-[linear-gradient(135deg,#faf6ee_0%,#f1e5d2_45%,#d8c0a0_100%)] p-8 shadow-[0_20px_80px_rgba(31,56,41,0.12)] md:grid-cols-[1.2fr_0.8fr] md:p-12">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">{content.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight md:text-7xl">{content.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{content.description}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button as={Link} to={content.primaryCta?.href || '/products'}>
              {content.primaryCta?.label || 'Explore'}
            </Button>
            <Button as={Link} to={content.secondaryCta?.href || '/contact'} className="bg-white text-[var(--brand)] hover:bg-[#f4ecdd]">
              {content.secondaryCta?.label || 'Contact'}
            </Button>
          </div>
        </motion.div>
        <div className="rounded-[2rem] border border-white/60 bg-[rgba(24,49,38,0.92)] p-8 text-white">
          <p className="text-sm uppercase tracking-[0.3em] text-[#d7b28f]">Export Quality</p>
          <div className="mt-6 space-y-5">
            {['Traditional Himalayan recipe', 'High-protein dog chew nutrition', 'Private label and wholesale ready'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
