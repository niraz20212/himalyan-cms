import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, Globe2, PackageCheck, PawPrint, Sparkles, Truck } from 'lucide-react';
import { loadHomeThunk } from '../../store/slices/siteSlice';
import { Button } from '../../components/common/Button';
import { Seo } from '../../components/common/Seo';
import { SectionHeading } from '../../components/common/SectionHeading';
import { Loader } from '../../components/common/Loader';
import { ProductCard } from '../../components/common/ProductCard';
import { PopIn, Reveal, RevealGroup, fadeUp } from '../../components/common/Reveal';
import { resolveMediaUrl } from '../../utils/media';
import { Card } from '../../components/ui/card';
import { Spotlight } from '../../components/ui/spotlight';

const fallbackHome = {
  companyInfo: {
    companyName: 'Himalayan Churpi',
    description: 'Premium Nepali Himalayan churpi dog chews for global buyers.',
  },
  pages: {
    home: {
      seo: {
        metaTitle: 'Himalayan Churpi',
        metaDescription: 'Premium Nepali Himalayan churpi dog chews for export and wholesale.',
      },
      sections: [
        {
          sectionKey: 'hero',
          content: {
            eyebrow: 'Himalayan origin',
            title: 'Premium churpi dog chews from Nepal to the world.',
            description:
              'A modern export-ready brand experience for natural, long-lasting Himalayan dog chews crafted for wholesale, private label, and specialty pet markets.',
            primaryCta: { label: 'Explore Products', href: '/products' },
            secondaryCta: { label: 'Export Inquiry', href: '/contact' },
            highlights: ['Single ingredient', 'Wholesale ready', 'Naturally long lasting'],
          },
        },
        {
          sectionKey: 'trust',
          content: {
            stats: [
              { value: '100%', label: 'Natural' },
              { value: 'B2B', label: 'Export Ready' },
              { value: 'QC', label: 'Quality Checked' },
              { value: 'NP', label: 'Nepal Made' },
            ],
          },
        },
        {
          sectionKey: 'story',
          content: {
            eyebrow: 'Our Story',
            title: 'Rooted in Himalayan tradition, designed for modern pet markets.',
            description:
              'We connect authentic Nepali churpi craft with reliable export workflows for retailers, distributors, and pet brands.',
            highlights: ['Traditional recipe', 'Clean ingredient promise', 'Flexible supply', 'Brand-ready packaging'],
          },
        },
        {
          sectionKey: 'featured',
          content: {
            eyebrow: 'Products',
            title: 'Premium Himalayan Dog Chews',
            description: 'Featured products are loaded from the CMS when the backend is running.',
          },
        },
        {
          sectionKey: 'process',
          content: {
            eyebrow: 'Process',
            title: 'From mountain milk to market-ready chews.',
            description: 'A simple, traceable process helps every buyer understand product quality.',
            steps: [
              { title: 'Source', description: 'Milk is sourced through trusted Himalayan supply relationships.' },
              { title: 'Craft', description: 'Churpi is prepared with a traditional drying and curing approach.' },
              { title: 'Pack', description: 'Finished chews are checked, sorted, and prepared for wholesale dispatch.' },
            ],
          },
        },
        {
          sectionKey: 'market',
          content: {
            cards: [
              { title: 'Export Positioning', description: 'Built for distributors and specialty pet buyers.' },
              { title: 'Natural Promise', description: 'A clean chew story customers can understand quickly.' },
              { title: 'Private Label Fit', description: 'Flexible enough for brand and packaging programs.' },
              { title: 'Retail Friendly', description: 'Strong shelf story with premium Himalayan origin.' },
            ],
          },
        },
        {
          sectionKey: 'cta',
          content: {
            eyebrow: 'Start Buying',
            title: 'Ready to source premium Himalayan churpi?',
            description: 'Share your market, volume, and packaging needs and we will help you plan the next step.',
            primaryCta: { label: 'Contact Sales', href: '/contact' },
            secondaryCta: { label: 'Browse Products', href: '/products' },
          },
        },
      ],
    },
  },
  exportCountries: [],
  featuredProducts: [],
  testimonials: [],
  faqs: [],
};

export function HomePage() {
  const dispatch = useDispatch();
  const { home, loading } = useSelector((state) => state.site);
  const user = useSelector((state) => state.auth.user);
  const [heroPointer, setHeroPointer] = useState({ x: 0.68, y: 0.42, active: false });

  useEffect(() => {
    if (!home) dispatch(loadHomeThunk());
  }, [dispatch, home]);

  const pageData = home || fallbackHome;

  const sectionMap = useMemo(() => {
    const sections = pageData?.pages?.home?.sections || [];
    return Object.fromEntries(sections.map((section) => [section.sectionKey, section.content || {}]));
  }, [pageData]);

  if (loading && !home) {
    return <div className="mx-auto max-w-7xl px-4 py-10"><Loader /></div>;
  }

  const hero = sectionMap.hero || {};
  const trust = sectionMap.trust || {};
  const story = sectionMap.story || {};
  const featured = sectionMap.featured || {};
  const process = sectionMap.process || {};
  const market = sectionMap.market || {};
  const cta = sectionMap.cta || {};
  const countries = pageData.exportCountries || [];
  const products = pageData.featuredProducts || [];
  const testimonials = pageData.testimonials || [];
  const faqs = pageData.faqs || [];
  const benefits = [
    ...(market.cards || []),
    ...(story.highlights || []).map((item) => ({ title: item, description: 'Admin-managed homepage highlight.' })),
  ].slice(0, 8);
  const heroHighlights = (hero.highlights || []).slice(0, 3);
  const trustStats = (trust.stats || []).slice(0, 4);
  const productPreview = products.slice(0, 5);
  const iconSet = [BadgeCheck, Globe2, PackageCheck, Truck, Sparkles, PawPrint, BadgeCheck, Globe2];
  const heroVisual = hero.imageUrl
    ? resolveMediaUrl(hero.imageUrl)
    : 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1400&q=80';
  const kibbleRain = Array.from({ length: 28 }, (_, index) => ({
    id: index,
    left: `${(index * 37) % 100}%`,
    delay: (index % 9) * 0.55,
    duration: 7 + (index % 6) * 0.7,
    size: 8 + (index % 4) * 3,
    drift: index % 2 ? 22 : -18,
  }));
  const dogLookX = (heroPointer.x - 0.5) * 34;
  const dogLookY = (heroPointer.y - 0.5) * 24;
  const dogTilt = (heroPointer.x - 0.5) * 4;

  return (
    <>
      <Seo
        title={pageData.pages?.home?.seo?.metaTitle || pageData.companyInfo?.companyName || 'Himalayan Churpi'}
        description={pageData.pages?.home?.seo?.metaDescription || pageData.companyInfo?.description}
      />

      <section
        className="hero-dog-cursor relative -mt-px overflow-hidden"
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          setHeroPointer({
            x: (event.clientX - rect.left) / rect.width,
            y: (event.clientY - rect.top) / rect.height,
            active: true,
          });
        }}
        onPointerLeave={() => setHeroPointer((current) => ({ ...current, active: false }))}
      >
        <Card className="alpine-shell min-h-[calc(100vh-5.5rem)] w-full overflow-hidden rounded-none border-0 bg-[#061b22] text-white shadow-none">
          <Spotlight className="-top-36 left-0 md:-top-24 md:left-64" fill="#f8fbff" />
          <div className="absolute inset-0 z-[0] bg-[linear-gradient(120deg,rgba(6,27,34,0.94)_0%,rgba(9,62,58,0.84)_48%,rgba(105,68,32,0.32)_100%)]" />
          <motion.div
            className="absolute -inset-8 z-[0] opacity-[0.38] will-change-transform"
            style={{
              backgroundImage: `url('${heroVisual}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center right',
            }}
            animate={{
              x: dogLookX,
              y: dogLookY,
              scale: heroPointer.active ? 1.08 : 1.04,
              rotate: dogTilt,
            }}
            transition={{ type: 'spring', stiffness: 90, damping: 24, mass: 0.7 }}
          />
          <div className="absolute inset-0 z-[0] bg-[radial-gradient(circle_at_74%_45%,rgba(255,208,138,0.18),transparent_28%),linear-gradient(90deg,rgba(6,27,34,0.74)_0%,rgba(6,27,34,0.55)_45%,rgba(6,27,34,0.2)_100%)]" />
          <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
            {kibbleRain.map((kibble) => (
              <motion.span
                key={kibble.id}
                className="absolute top-[-8%] rounded-[45%] bg-[#d69a4f] shadow-[0_0_18px_rgba(255,208,138,0.22)]"
                style={{
                  left: kibble.left,
                  width: kibble.size,
                  height: kibble.size * 0.72,
                }}
                initial={{ y: '-10vh', x: 0, rotate: 0, opacity: 0 }}
                animate={{
                  y: '112vh',
                  x: [0, kibble.drift, 0],
                  rotate: [0, 180, 360],
                  opacity: [0, 0.52, 0.34, 0],
                }}
                transition={{
                  duration: kibble.duration,
                  delay: kibble.delay,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            ))}
          </div>
          <motion.div
            className="pointer-events-none absolute z-30 h-10 w-10 rounded-[45%] border border-[#ffd08a]/50 bg-[#c78035] shadow-[0_10px_30px_rgba(255,208,138,0.28)]"
            animate={{
              left: `calc(${heroPointer.x * 100}% - 20px)`,
              top: `calc(${heroPointer.y * 100}% - 20px)`,
              rotate: heroPointer.active ? dogTilt * 8 : 0,
              scale: heroPointer.active ? 1 : 0,
              opacity: heroPointer.active ? 1 : 0,
            }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          >
            <span className="absolute left-2 top-2 h-2 w-2 rounded-full bg-[#8b4b1f]/70" />
            <span className="absolute right-2 top-3 h-1.5 w-1.5 rounded-full bg-[#8b4b1f]/60" />
            <span className="absolute bottom-2 left-4 h-1.5 w-2.5 rounded-full bg-[#ffe0ad]/45" />
          </motion.div>

          <div className="relative z-10 mx-auto grid min-h-[calc(100vh-5.5rem)] w-full max-w-7xl items-center px-4 py-10 md:px-6 lg:grid-cols-[0.95fr_1.05fr]">
            <Reveal className="px-2 py-8 md:px-4 lg:px-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.55 }}
                className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#ffd08a] backdrop-blur"
              >
                <Sparkles size={15} />
                Alpine sourced export chews
              </motion.div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#ffd08a]">{hero.eyebrow}</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[0.98] text-white md:text-7xl">
                {hero.title}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/76 md:text-lg">{hero.description}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button as={Link} to={hero.primaryCta?.href || '/products'} className="shimmer-line gap-2 bg-[#ffd08a] text-[#07313d] hover:bg-[#ffdcaa]">
                  {hero.primaryCta?.label || 'Explore Products'}
                  <ArrowRight size={16} />
                </Button>
                <Button as={Link} to={hero.secondaryCta?.href || '/contact'} className="border border-white/20 bg-white/10 text-white hover:bg-white/18">
                  {hero.secondaryCta?.label || 'Contact Us'}
                </Button>
              </div>
              <RevealGroup className="mt-8 grid gap-3 sm:grid-cols-3">
                {heroHighlights.map((item) => (
                  <motion.div
                    key={item}
                    variants={fadeUp}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(3,22,28,0.18)] backdrop-blur"
                  >
                    {item}
                  </motion.div>
                ))}
              </RevealGroup>
            </Reveal>

            <Reveal className="relative min-h-[440px] lg:min-h-[calc(100vh-5.5rem)]" delay={0.08}>
              <motion.div
                animate={{ y: [0, -12, 0], rotate: [-1, 1, -1] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute right-6 top-6 z-20 hidden rounded-full bg-white/14 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white shadow-[0_16px_40px_rgba(3,22,28,0.18)] backdrop-blur md:block"
              >
                Pet food grade
              </motion.div>
              <div className="absolute inset-0 z-10">
                <div className="relative h-full">
                  <motion.div
                    className="absolute right-10 top-20 hidden h-64 w-64 rounded-full border border-white/15 bg-[#ffd08a]/16 blur-2xl md:block"
                    animate={{ scale: [1, 1.14, 1], opacity: [0.34, 0.5, 0.34] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.div
                    animate={{ y: [0, -16, 0], rotate: [-3, 2, -3] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute left-8 top-20 max-w-[13rem] rounded-2xl border border-white/20 bg-white/18 p-4 shadow-[0_18px_45px_rgba(2,15,19,0.22)] backdrop-blur"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ffd08a] text-[#07313d]">
                      <PawPrint size={20} />
                    </div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#ffd08a]">Dog chew nutrition</p>
                    <p className="mt-2 text-lg font-semibold leading-tight text-white">Long-lasting natural churpi for happy chewers.</p>
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, 14, 0], rotate: [2, -2, 2] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute right-8 top-[19rem] hidden max-w-[13rem] rounded-2xl border border-white/20 bg-[#061b22]/58 p-4 shadow-[0_18px_45px_rgba(2,15,19,0.22)] backdrop-blur md:block"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-[#ffd08a]">Clean label</p>
                    <p className="mt-2 text-2xl font-semibold text-white">No filler story. Just premium Himalayan chew.</p>
                  </motion.div>
                  <div className="absolute bottom-28 left-8 flex flex-wrap gap-3">
                    {['Yak cheese', 'Hard chew', 'Export pack'].map((label, index) => (
                      <motion.div
                        key={label}
                        animate={{ y: [0, index % 2 ? -7 : 7, 0] }}
                        transition={{ duration: 4.8 + index, repeat: Infinity, ease: 'easeInOut' }}
                        className="rounded-xl border border-white/18 bg-white/14 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-[0_12px_28px_rgba(2,15,19,0.18)] backdrop-blur"
                      >
                        {label}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-x-4 bottom-5 z-20 grid gap-3 sm:grid-cols-3 lg:left-0 lg:right-8">
                {trustStats.slice(0, 3).map((item) => (
                  <motion.div
                    key={`${item.label}-${item.value}-hero`}
                    whileHover={{ y: -5 }}
                    className="rounded-2xl border border-white/15 bg-[#061b22]/55 p-4 text-white shadow-[0_16px_38px_rgba(3,22,28,0.22)] backdrop-blur"
                  >
                    <p className="text-2xl font-semibold">{item.value}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/72">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </div>
        </Card>
      </section>

      <section className="mx-auto mt-12 max-w-7xl px-4 md:px-6">
        <RevealGroup className="grid gap-4 md:grid-cols-4">
          {trustStats.map((item, index) => (
            <motion.div
              key={`${item.label}-${item.value}`}
              variants={fadeUp}
              whileHover={{ y: -8 }}
              className="glass-panel group rounded-2xl border border-white/65 p-6 shadow-[0_16px_40px_rgba(13,76,91,0.07)]"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0b5f73] text-white shadow-[0_12px_25px_rgba(11,95,115,0.18)] transition group-hover:rotate-3 group-hover:scale-105">
                {(() => {
                  const Icon = iconSet[index] || BadgeCheck;
                  return <Icon size={20} />;
                })()}
              </div>
              <p className="text-4xl font-semibold text-[var(--brand)]">{item.value}</p>
              <p className="mt-2 text-sm uppercase tracking-[0.22em] text-[var(--muted)]">{item.label}</p>
            </motion.div>
          ))}
        </RevealGroup>
      </section>

      <section className="section-wash mx-auto mt-20 max-w-7xl px-4 md:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal className="overflow-hidden rounded-[1.8rem] border border-[var(--line)] bg-[#0e3c49] shadow-[var(--shadow-strong)]">
            {story.imageUrl ? (
              <motion.img
                src={resolveMediaUrl(story.imageUrl)}
                alt={story.title}
                className="h-full min-h-[480px] w-full object-cover"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.5 }}
              />
            ) : (
              <div className="grid-radial flex min-h-[480px] items-center justify-center bg-[linear-gradient(145deg,#0e3c49_0%,#176a7d_55%,#9bc5bf_100%)] p-10 text-center text-white">
                <div>
                  <p className="text-sm uppercase tracking-[0.34em] text-[#ffd08a]">About Image</p>
                  <p className="mt-4 text-3xl font-semibold">Upload farmers, factory, or product storytelling imagery.</p>
                </div>
              </div>
            )}
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-sm uppercase tracking-[0.32em] text-[var(--accent)]">{story.eyebrow}</p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight text-[var(--brand)] md:text-5xl">
              {story.title}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)]">{story.description}</p>
            <RevealGroup className="mt-8 grid gap-4 sm:grid-cols-2">
              {(story.highlights || []).slice(0, 4).map((item) => (
                <motion.div key={item} variants={fadeUp} whileHover={{ x: 6 }} className="glass-panel rounded-2xl border border-[var(--line)] p-5 text-sm leading-7 text-[var(--text)]">
                  {item}
                </motion.div>
              ))}
            </RevealGroup>
            <RevealGroup className="mt-8 flex flex-wrap gap-3">
              {countries.slice(0, 6).map((country) => (
                <motion.span key={country.id} variants={fadeUp} whileHover={{ y: -4 }} className="rounded-full bg-[#def3f0] px-4 py-2 text-sm font-semibold text-[var(--brand)] shadow-[0_10px_25px_rgba(11,95,115,0.1)]">
                  {country.name}
                </motion.span>
              ))}
            </RevealGroup>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="What Sets Us Apart"
            title="Built On Purity, Himalayan Identity, And Export Quality"
            description="These differentiators are managed from the admin-controlled homepage content."
          />
        </Reveal>
        <RevealGroup className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {benefits.map((item, index) => (
            <motion.div
              key={`${item.title}-${index}`}
              variants={fadeUp}
              whileHover={{ y: -10, rotate: index % 2 ? -0.6 : 0.6 }}
              className="glass-panel group rounded-2xl border border-white/65 p-6 shadow-[0_18px_45px_rgba(13,76,91,0.06)]"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e9f7f4] text-[#0b5f73] transition group-hover:bg-[#0b5f73] group-hover:text-white">
                {(() => {
                  const Icon = iconSet[index] || Sparkles;
                  return <Icon size={22} />;
                })()}
              </div>
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--accent)]">Benefit {index + 1}</p>
              <h3 className="mt-3 text-2xl font-semibold text-[var(--brand)]">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.description}</p>
            </motion.div>
          ))}
        </RevealGroup>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-6">
        <Reveal>
          <SectionHeading
            eyebrow={featured.eyebrow || 'Discover Our Products'}
            title={featured.title || 'Premium Himalayan Dog Chews'}
            description={featured.description || 'Featured products are pulled dynamically from the CMS.'}
          />
        </Reveal>
        <RevealGroup className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {products.slice(0, 8).map((product) => (
            <motion.div key={product.id} variants={fadeUp}>
              <ProductCard product={product} user={user} showActions={false} />
            </motion.div>
          ))}
        </RevealGroup>
      </section>

      {productPreview.length ? (
        <section className="mx-auto mt-20 max-w-7xl px-4 md:px-6">
          <Reveal className="relative overflow-hidden rounded-[1.8rem] border border-white/60 bg-[#0c3f4d] p-6 text-white shadow-[var(--shadow-strong)] md:p-8">
            <div className="pointer-events-none absolute inset-0 opacity-70 product-flow" />
            <div className="relative z-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="flex flex-col justify-center">
                <p className="text-sm uppercase tracking-[0.32em] text-[#ffd08a]">Animated Product Field</p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-5xl">CMS products, moving like a premium export catalog.</h2>
                <p className="mt-5 max-w-xl text-base leading-8 text-white/76">
                  Featured products stay dynamic while the presentation feels more tactile and alive.
                </p>
              </div>
              <div className="relative min-h-[360px] overflow-hidden rounded-2xl border border-white/12 bg-white/8">
                {productPreview.map((product, index) => (
                  <motion.div
                    key={`${product.id}-float`}
                    className="absolute w-36 overflow-hidden rounded-2xl border border-white/20 bg-white/14 shadow-[0_18px_45px_rgba(3,22,28,0.28)] backdrop-blur"
                    initial={{ x: `${index * 22}%`, y: index % 2 ? 205 : 34, rotate: index % 2 ? 5 : -5 }}
                    animate={{
                      x: [`${index * 18}%`, `${index * 18 + 8}%`, `${index * 18}%`],
                      y: [index % 2 ? 205 : 34, index % 2 ? 178 : 64, index % 2 ? 205 : 34],
                      rotate: [index % 2 ? 5 : -5, index % 2 ? -2 : 3, index % 2 ? 5 : -5],
                    }}
                    transition={{ duration: 7 + index, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {product.imageUrl ? (
                      <img src={resolveMediaUrl(product.imageUrl)} alt={product.name} className="h-32 w-full object-cover" />
                    ) : (
                      <div className="grid-radial flex h-32 items-center justify-center bg-[#d9f0ec] text-xs font-semibold text-[#0c3f4d]">
                        Product
                      </div>
                    )}
                    <div className="p-3">
                      <p className="line-clamp-2 text-sm font-semibold leading-tight">{product.name}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>
      ) : null}

      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
          <Reveal className="glass-panel rounded-[1.8rem] border border-white/60 p-8 shadow-[0_18px_50px_rgba(13,76,91,0.07)]">
            <p className="text-sm uppercase tracking-[0.32em] text-[var(--accent)]">{process.eyebrow}</p>
            <h2 className="mt-4 text-3xl font-semibold text-[var(--brand)] md:text-5xl">{process.title}</h2>
            <p className="mt-5 text-base leading-8 text-[var(--muted)]">{process.description}</p>
            <RevealGroup className="mt-8 space-y-4">
              {(process.steps || []).map((step, index) => (
                <motion.div key={`${step.title}-${index}`} variants={fadeUp} whileHover={{ x: 8 }} className="rounded-2xl border border-[var(--line)] bg-[#f4fbfa] p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent)]">Step {index + 1}</p>
                  <h3 className="mt-2 text-xl font-semibold text-[var(--brand)]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{step.description}</p>
                </motion.div>
              ))}
            </RevealGroup>
          </Reveal>
          <Reveal className="overflow-hidden rounded-[1.8rem] border border-[var(--line)] bg-[#0e3c49] shadow-[var(--shadow-strong)]" delay={0.08}>
            {process.imageUrl ? (
              <motion.img src={resolveMediaUrl(process.imageUrl)} alt={process.title} className="h-full min-h-[460px] w-full object-cover" whileHover={{ scale: 1.04 }} transition={{ duration: 0.5 }} />
            ) : (
              <div className="grid-radial flex min-h-[460px] items-center justify-center bg-[linear-gradient(140deg,#0e3c49_0%,#176a7d_60%,#f7bd69_100%)] p-10 text-center text-white">
                <div>
                  <p className="text-sm uppercase tracking-[0.34em] text-[#ffd08a]">Process Visual</p>
                  <p className="mt-4 text-3xl font-semibold">Add a process image from the admin homepage editor.</p>
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <Reveal className="glass-panel rounded-[1.8rem] border border-white/60 p-8 shadow-[0_18px_50px_rgba(13,76,91,0.07)]">
            <SectionHeading
              eyebrow="Testimonials"
              title="Partner Feedback"
              description="Dynamic testimonials managed from the admin panel."
            />
            <RevealGroup className="mt-8 space-y-4">
              {testimonials.slice(0, 3).map((testimonial) => (
                <motion.div key={testimonial.id} variants={fadeUp} whileHover={{ y: -5 }} className="rounded-2xl border border-[var(--line)] bg-[#f4fbfa] p-5">
                  <p className="text-sm leading-7 text-[var(--text)]">"{testimonial.quote}"</p>
                  <p className="mt-4 text-sm font-semibold text-[var(--brand)]">{testimonial.name}</p>
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">{testimonial.title || testimonial.company}</p>
                </motion.div>
              ))}
            </RevealGroup>
          </Reveal>
          <Reveal className="glass-panel rounded-[1.8rem] border border-white/60 p-8 shadow-[0_18px_50px_rgba(13,76,91,0.07)]" delay={0.08}>
            <SectionHeading
              eyebrow="FAQ"
              title="Questions Buyers Ask"
              description="Keep these updated from the back office without touching code."
            />
            <RevealGroup className="mt-8 space-y-4">
              {faqs.slice(0, 4).map((faq) => (
                <motion.div key={faq.id} variants={fadeUp} whileHover={{ y: -5 }} className="rounded-2xl border border-[var(--line)] bg-[#f4fbfa] p-5">
                  <h3 className="text-lg font-semibold text-[var(--brand)]">{faq.question}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{faq.answer}</p>
                </motion.div>
              ))}
            </RevealGroup>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto my-20 max-w-7xl px-4 md:px-6">
        <Reveal className="overflow-hidden rounded-[1.8rem] border border-[var(--line)] bg-[linear-gradient(135deg,#07313d_0%,#0b5f73_55%,#f7bd69_100%)] shadow-[var(--shadow-strong)]">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-8 text-white md:p-12">
              <p className="text-sm uppercase tracking-[0.34em] text-[#ffd08a]">{cta.eyebrow}</p>
              <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight md:text-5xl">{cta.title}</h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/80">{cta.description}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button as={Link} to={cta.primaryCta?.href || '/contact'} className="bg-[#ffd08a] text-[#07313d] hover:bg-[#ffdcaa]">
                  {cta.primaryCta?.label || 'Contact Sales'}
                </Button>
                <Button as={Link} to={cta.secondaryCta?.href || '/products'} className="bg-white/10 text-white hover:bg-white/20">
                  {cta.secondaryCta?.label || 'Browse Products'}
                </Button>
              </div>
            </div>
            <div className="min-h-[320px]">
              {cta.imageUrl ? (
                <motion.img src={resolveMediaUrl(cta.imageUrl)} alt={cta.title} className="h-full w-full object-cover" animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />
              ) : (
                <div className="grid-radial flex h-full items-center justify-center bg-[linear-gradient(145deg,#0b5f73_0%,#9bc5bf_100%)] p-10 text-center text-white">
                  <div>
                    <p className="text-sm uppercase tracking-[0.34em] text-[#ffd08a]">Closing Visual</p>
                    <p className="mt-4 text-3xl font-semibold">Add a final brand image from admin.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
