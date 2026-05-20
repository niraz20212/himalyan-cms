import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { fetchAdminHomepage, updateAdminHomepage, uploadMediaFile } from '../../api/queries';
import { Button } from '../../components/common/Button';
import { resolveMediaUrl } from '../../utils/media';

const createDefaultState = () => ({
  title: 'Home',
  summary: '',
  seo: {
    metaTitle: '',
    metaDescription: '',
    keywords: '',
  },
  hero: {
    eyebrow: '',
    title: '',
    description: '',
    imageUrl: '',
    primaryCtaLabel: '',
    primaryCtaHref: '',
    secondaryCtaLabel: '',
    secondaryCtaHref: '',
    highlights: ['', '', ''],
  },
  trust: {
    stats: [
      { label: '', value: '' },
      { label: '', value: '' },
      { label: '', value: '' },
      { label: '', value: '' },
    ],
  },
  story: {
    eyebrow: '',
    title: '',
    description: '',
    imageUrl: '',
    highlights: ['', '', ''],
  },
  featured: {
    eyebrow: '',
    title: '',
    description: '',
  },
  process: {
    eyebrow: '',
    title: '',
    description: '',
    imageUrl: '',
    steps: [
      { title: '', description: '' },
      { title: '', description: '' },
      { title: '', description: '' },
    ],
  },
  market: {
    eyebrow: '',
    title: '',
    description: '',
    cards: [
      { title: '', description: '' },
      { title: '', description: '' },
      { title: '', description: '' },
    ],
  },
  cta: {
    eyebrow: '',
    title: '',
    description: '',
    imageUrl: '',
    primaryCtaLabel: '',
    primaryCtaHref: '',
    secondaryCtaLabel: '',
    secondaryCtaHref: '',
  },
});

const mapSectionContent = (sections) => {
  const state = createDefaultState();
  const sectionMap = Object.fromEntries((sections || []).map((section) => [section.sectionKey, section.content || {}]));

  if (sectionMap.hero) {
    state.hero = {
      eyebrow: sectionMap.hero.eyebrow || '',
      title: sectionMap.hero.title || '',
      description: sectionMap.hero.description || '',
      imageUrl: sectionMap.hero.imageUrl || '',
      primaryCtaLabel: sectionMap.hero.primaryCta?.label || '',
      primaryCtaHref: sectionMap.hero.primaryCta?.href || '',
      secondaryCtaLabel: sectionMap.hero.secondaryCta?.label || '',
      secondaryCtaHref: sectionMap.hero.secondaryCta?.href || '',
      highlights: normalizeStringArray(sectionMap.hero.highlights, 3),
    };
  }

  if (sectionMap.trust) {
    state.trust = {
      stats: normalizeObjectArray(sectionMap.trust.stats, { label: '', value: '' }, 4),
    };
  }

  if (sectionMap.story) {
    state.story = {
      eyebrow: sectionMap.story.eyebrow || '',
      title: sectionMap.story.title || '',
      description: sectionMap.story.description || '',
      imageUrl: sectionMap.story.imageUrl || '',
      highlights: normalizeStringArray(sectionMap.story.highlights, 3),
    };
  }

  if (sectionMap.featured) {
    state.featured = {
      eyebrow: sectionMap.featured.eyebrow || '',
      title: sectionMap.featured.title || '',
      description: sectionMap.featured.description || '',
    };
  }

  if (sectionMap.process) {
    state.process = {
      eyebrow: sectionMap.process.eyebrow || '',
      title: sectionMap.process.title || '',
      description: sectionMap.process.description || '',
      imageUrl: sectionMap.process.imageUrl || '',
      steps: normalizeObjectArray(sectionMap.process.steps, { title: '', description: '' }, 3),
    };
  }

  if (sectionMap.market) {
    state.market = {
      eyebrow: sectionMap.market.eyebrow || '',
      title: sectionMap.market.title || '',
      description: sectionMap.market.description || '',
      cards: normalizeObjectArray(sectionMap.market.cards, { title: '', description: '' }, 3),
    };
  }

  if (sectionMap.cta) {
    state.cta = {
      eyebrow: sectionMap.cta.eyebrow || '',
      title: sectionMap.cta.title || '',
      description: sectionMap.cta.description || '',
      imageUrl: sectionMap.cta.imageUrl || '',
      primaryCtaLabel: sectionMap.cta.primaryCta?.label || '',
      primaryCtaHref: sectionMap.cta.primaryCta?.href || '',
      secondaryCtaLabel: sectionMap.cta.secondaryCta?.label || '',
      secondaryCtaHref: sectionMap.cta.secondaryCta?.href || '',
    };
  }

  return state;
};

const normalizeStringArray = (items, minCount) => {
  const values = Array.isArray(items) ? items.map((item) => item || '') : [];
  while (values.length < minCount) values.push('');
  return values;
};

const normalizeObjectArray = (items, template, minCount) => {
  const values = Array.isArray(items) ? items.map((item) => ({ ...template, ...(item || {}) })) : [];
  while (values.length < minCount) values.push({ ...template });
  return values;
};

const sectionOrder = ['hero', 'trust', 'story', 'featured', 'process', 'market', 'cta'];
const sectionNames = {
  hero: 'Hero',
  trust: 'Trust Strip',
  story: 'Brand Story',
  featured: 'Featured Products Intro',
  process: 'Process',
  market: 'Market Positioning',
  cta: 'Closing CTA',
};

export function AdminHomepagePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(createDefaultState());

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminHomepage();
      setForm({
        ...createDefaultState(),
        title: data.title || 'Home',
        summary: data.summary || '',
        seo: {
          metaTitle: data.seo?.metaTitle || '',
          metaDescription: data.seo?.metaDescription || '',
          keywords: data.seo?.keywords || '',
        },
        ...mapSectionContent(data.sections),
      });
    } catch (error) {
      toast.error(error?.message || 'Unable to load homepage');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateSection = (section, key, value) => {
    setForm((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: value,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAdminHomepage(buildPayload(form));
      toast.success('Homepage updated');
      load();
    } catch (error) {
      toast.error(error?.message || 'Unable to save homepage');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="rounded-[2rem] border border-[var(--line)] bg-white/90 p-6">Loading homepage editor...</div>;
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <div className="rounded-[2rem] border border-[var(--line)] bg-white/90 p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">Homepage CMS</p>
          <h2 className="mt-3 text-3xl font-semibold text-[var(--brand)]">Manage The Front Page</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)]">
            Update hero images, section copy, trust stats, process steps, market cards, and closing CTA from one screen.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <EditorCard title="Page Settings" eyebrow="SEO And Page Meta">
              <TextField label="Page title" value={form.title} onChange={(value) => setForm((current) => ({ ...current, title: value }))} />
              <TextAreaField label="Page summary" value={form.summary} onChange={(value) => setForm((current) => ({ ...current, summary: value }))} rows={3} />
              <TextField label="SEO title" value={form.seo.metaTitle} onChange={(value) => setForm((current) => ({ ...current, seo: { ...current.seo, metaTitle: value } }))} />
              <TextAreaField label="SEO description" value={form.seo.metaDescription} onChange={(value) => setForm((current) => ({ ...current, seo: { ...current.seo, metaDescription: value } }))} rows={3} />
              <TextField label="SEO keywords" value={form.seo.keywords} onChange={(value) => setForm((current) => ({ ...current, seo: { ...current.seo, keywords: value } }))} />
            </EditorCard>

            <EditorCard title="Hero Section" eyebrow="Top Banner">
              <TextField label="Eyebrow" value={form.hero.eyebrow} onChange={(value) => updateSection('hero', 'eyebrow', value)} />
              <TextAreaField label="Main title" value={form.hero.title} onChange={(value) => updateSection('hero', 'title', value)} rows={3} />
              <TextAreaField label="Description" value={form.hero.description} onChange={(value) => updateSection('hero', 'description', value)} rows={4} />
              <ImageField label="Hero image" value={form.hero.imageUrl} onChange={(value) => updateSection('hero', 'imageUrl', value)} />
              <div className="grid gap-4 md:grid-cols-2">
                <TextField label="Primary button label" value={form.hero.primaryCtaLabel} onChange={(value) => updateSection('hero', 'primaryCtaLabel', value)} />
                <TextField label="Primary button link" value={form.hero.primaryCtaHref} onChange={(value) => updateSection('hero', 'primaryCtaHref', value)} />
                <TextField label="Secondary button label" value={form.hero.secondaryCtaLabel} onChange={(value) => updateSection('hero', 'secondaryCtaLabel', value)} />
                <TextField label="Secondary button link" value={form.hero.secondaryCtaHref} onChange={(value) => updateSection('hero', 'secondaryCtaHref', value)} />
              </div>
              <StringListEditor
                label="Hero highlights"
                items={form.hero.highlights}
                onChange={(items) => updateSection('hero', 'highlights', items)}
                addLabel="Add Highlight"
              />
            </EditorCard>

            <EditorCard title="Trust Strip" eyebrow="Metrics">
              <StatsEditor
                items={form.trust.stats}
                onChange={(items) => updateSection('trust', 'stats', items)}
              />
            </EditorCard>

            <EditorCard title="Brand Story" eyebrow="Mid Page">
              <TextField label="Eyebrow" value={form.story.eyebrow} onChange={(value) => updateSection('story', 'eyebrow', value)} />
              <TextAreaField label="Title" value={form.story.title} onChange={(value) => updateSection('story', 'title', value)} rows={3} />
              <TextAreaField label="Description" value={form.story.description} onChange={(value) => updateSection('story', 'description', value)} rows={4} />
              <ImageField label="Story image" value={form.story.imageUrl} onChange={(value) => updateSection('story', 'imageUrl', value)} />
              <StringListEditor
                label="Story highlights"
                items={form.story.highlights}
                onChange={(items) => updateSection('story', 'highlights', items)}
                addLabel="Add Story Highlight"
              />
            </EditorCard>
          </div>

          <div className="space-y-6">
            <EditorCard title="Featured Products Intro" eyebrow="Product Section Heading">
              <TextField label="Eyebrow" value={form.featured.eyebrow} onChange={(value) => updateSection('featured', 'eyebrow', value)} />
              <TextAreaField label="Title" value={form.featured.title} onChange={(value) => updateSection('featured', 'title', value)} rows={3} />
              <TextAreaField label="Description" value={form.featured.description} onChange={(value) => updateSection('featured', 'description', value)} rows={4} />
            </EditorCard>

            <EditorCard title="Factory Process" eyebrow="Process Section">
              <TextField label="Eyebrow" value={form.process.eyebrow} onChange={(value) => updateSection('process', 'eyebrow', value)} />
              <TextAreaField label="Title" value={form.process.title} onChange={(value) => updateSection('process', 'title', value)} rows={3} />
              <TextAreaField label="Description" value={form.process.description} onChange={(value) => updateSection('process', 'description', value)} rows={4} />
              <ImageField label="Process image" value={form.process.imageUrl} onChange={(value) => updateSection('process', 'imageUrl', value)} />
              <ObjectListEditor
                label="Process steps"
                items={form.process.steps}
                onChange={(items) => updateSection('process', 'steps', items)}
                addLabel="Add Step"
                fields={[
                  { key: 'title', label: 'Step title' },
                  { key: 'description', label: 'Step description', type: 'textarea' },
                ]}
              />
            </EditorCard>

            <EditorCard title="Market Positioning" eyebrow="Why Buyers Choose Us">
              <TextField label="Eyebrow" value={form.market.eyebrow} onChange={(value) => updateSection('market', 'eyebrow', value)} />
              <TextAreaField label="Title" value={form.market.title} onChange={(value) => updateSection('market', 'title', value)} rows={3} />
              <TextAreaField label="Description" value={form.market.description} onChange={(value) => updateSection('market', 'description', value)} rows={4} />
              <ObjectListEditor
                label="Market cards"
                items={form.market.cards}
                onChange={(items) => updateSection('market', 'cards', items)}
                addLabel="Add Card"
                fields={[
                  { key: 'title', label: 'Card title' },
                  { key: 'description', label: 'Card description', type: 'textarea' },
                ]}
              />
            </EditorCard>

            <EditorCard title="Closing CTA" eyebrow="Bottom Banner">
              <TextField label="Eyebrow" value={form.cta.eyebrow} onChange={(value) => updateSection('cta', 'eyebrow', value)} />
              <TextAreaField label="Title" value={form.cta.title} onChange={(value) => updateSection('cta', 'title', value)} rows={3} />
              <TextAreaField label="Description" value={form.cta.description} onChange={(value) => updateSection('cta', 'description', value)} rows={4} />
              <ImageField label="CTA image" value={form.cta.imageUrl} onChange={(value) => updateSection('cta', 'imageUrl', value)} />
              <div className="grid gap-4 md:grid-cols-2">
                <TextField label="Primary button label" value={form.cta.primaryCtaLabel} onChange={(value) => updateSection('cta', 'primaryCtaLabel', value)} />
                <TextField label="Primary button link" value={form.cta.primaryCtaHref} onChange={(value) => updateSection('cta', 'primaryCtaHref', value)} />
                <TextField label="Secondary button label" value={form.cta.secondaryCtaLabel} onChange={(value) => updateSection('cta', 'secondaryCtaLabel', value)} />
                <TextField label="Secondary button link" value={form.cta.secondaryCtaHref} onChange={(value) => updateSection('cta', 'secondaryCtaHref', value)} />
              </div>
            </EditorCard>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[var(--line)] bg-white/90 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-[var(--accent)]">Sections Saved</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {sectionOrder.map((key) => (
              <span key={key} className="rounded-full bg-[#efe3d0] px-4 py-2 text-sm font-semibold text-[var(--brand)]">
                {sectionNames[key]}
              </span>
            ))}
          </div>
          <div className="mt-6">
            <Button onClick={handleSave}>{saving ? 'Saving Homepage...' : 'Save Homepage'}</Button>
          </div>
        </div>
      </div>
    </>
  );
}

function buildPayload(form) {
  return {
    title: form.title,
    summary: form.summary,
    seo: {
      metaTitle: form.seo.metaTitle,
      metaDescription: form.seo.metaDescription,
      keywords: form.seo.keywords,
    },
    sections: [
      {
        sectionKey: 'hero',
        name: sectionNames.hero,
        order: 1,
        content: {
          eyebrow: form.hero.eyebrow,
          title: form.hero.title,
          description: form.hero.description,
          imageUrl: form.hero.imageUrl,
          primaryCta: { label: form.hero.primaryCtaLabel, href: form.hero.primaryCtaHref },
          secondaryCta: { label: form.hero.secondaryCtaLabel, href: form.hero.secondaryCtaHref },
          highlights: form.hero.highlights.filter(Boolean),
        },
      },
      {
        sectionKey: 'trust',
        name: sectionNames.trust,
        order: 2,
        content: {
          stats: form.trust.stats.filter((item) => item.label || item.value),
        },
      },
      {
        sectionKey: 'story',
        name: sectionNames.story,
        order: 3,
        content: {
          eyebrow: form.story.eyebrow,
          title: form.story.title,
          description: form.story.description,
          imageUrl: form.story.imageUrl,
          highlights: form.story.highlights.filter(Boolean),
        },
      },
      {
        sectionKey: 'featured',
        name: sectionNames.featured,
        order: 4,
        content: {
          eyebrow: form.featured.eyebrow,
          title: form.featured.title,
          description: form.featured.description,
        },
      },
      {
        sectionKey: 'process',
        name: sectionNames.process,
        order: 5,
        content: {
          eyebrow: form.process.eyebrow,
          title: form.process.title,
          description: form.process.description,
          imageUrl: form.process.imageUrl,
          steps: form.process.steps.filter((item) => item.title || item.description),
        },
      },
      {
        sectionKey: 'market',
        name: sectionNames.market,
        order: 6,
        content: {
          eyebrow: form.market.eyebrow,
          title: form.market.title,
          description: form.market.description,
          cards: form.market.cards.filter((item) => item.title || item.description),
        },
      },
      {
        sectionKey: 'cta',
        name: sectionNames.cta,
        order: 7,
        content: {
          eyebrow: form.cta.eyebrow,
          title: form.cta.title,
          description: form.cta.description,
          imageUrl: form.cta.imageUrl,
          primaryCta: { label: form.cta.primaryCtaLabel, href: form.cta.primaryCtaHref },
          secondaryCta: { label: form.cta.secondaryCtaLabel, href: form.cta.secondaryCtaHref },
        },
      },
    ],
  };
}

function EditorCard({ eyebrow, title, children }) {
  return (
    <section className="rounded-[2rem] border border-[var(--line)] bg-white/90 p-6 shadow-[0_18px_50px_rgba(41,73,54,0.05)]">
      <p className="text-sm uppercase tracking-[0.25em] text-[var(--accent)]">{eyebrow}</p>
      <h3 className="mt-2 text-2xl font-semibold text-[var(--brand)]">{title}</h3>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function TextField({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[var(--brand)]">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3" />
    </label>
  );
}

function TextAreaField({ label, value, onChange, rows = 4 }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[var(--brand)]">{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={rows} className="mt-2 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3" />
    </label>
  );
}

function ImageField({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const media = await uploadMediaFile(file);
      onChange(media.path || media.url);
      toast.success('Image uploaded');
    } catch (error) {
      toast.error(error?.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <span className="text-sm font-semibold text-[var(--brand)]">{label}</span>
      {value ? (
        <img src={resolveMediaUrl(value)} alt={label} className="mt-3 h-56 w-full rounded-[1.5rem] border border-[var(--line)] object-cover" />
      ) : (
        <div className="mt-3 flex h-56 w-full items-center justify-center rounded-[1.5rem] border border-dashed border-[var(--line)] bg-[#fcfaf5] text-sm text-[var(--muted)]">
          No image selected
        </div>
      )}
      <div className="mt-3 flex flex-wrap gap-3">
        <input type="file" accept="image/*" onChange={handleUpload} className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm" />
        <input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Or paste image path or URL" className="min-w-[240px] flex-1 rounded-2xl border border-[var(--line)] bg-white px-4 py-3" />
      </div>
      {uploading ? <p className="mt-2 text-sm text-[var(--brand)]">Uploading image...</p> : null}
    </div>
  );
}

function StringListEditor({ label, items, onChange, addLabel }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-[var(--brand)]">{label}</span>
        <button
          type="button"
          onClick={() => onChange([...items, ''])}
          className="rounded-full border border-[var(--line)] px-3 py-1 text-xs font-semibold text-[var(--brand)]"
        >
          {addLabel}
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={`${label}-${index}`} className="flex gap-3">
            <input
              value={item}
              onChange={(event) => onChange(items.map((current, currentIndex) => (currentIndex === index ? event.target.value : current)))}
              className="flex-1 rounded-2xl border border-[var(--line)] bg-white px-4 py-3"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, currentIndex) => currentIndex !== index))}
              className="rounded-2xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsEditor({ items, onChange }) {
  return (
    <ObjectListEditor
      label="Trust stats"
      items={items}
      onChange={onChange}
      addLabel="Add Stat"
      fields={[
        { key: 'label', label: 'Label' },
        { key: 'value', label: 'Value' },
      ]}
    />
  );
}

function ObjectListEditor({ label, items, onChange, addLabel, fields }) {
  const updateItem = (index, key, value) => {
    onChange(items.map((item, currentIndex) => (currentIndex === index ? { ...item, [key]: value } : item)));
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-[var(--brand)]">{label}</span>
        <button
          type="button"
          onClick={() => onChange([...items, fields.reduce((accumulator, field) => ({ ...accumulator, [field.key]: '' }), {})])}
          className="rounded-full border border-[var(--line)] px-3 py-1 text-xs font-semibold text-[var(--brand)]"
        >
          {addLabel}
        </button>
      </div>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={`${label}-${index}`} className="rounded-[1.5rem] border border-[var(--line)] bg-[#fcfaf5] p-4">
            <div className="space-y-3">
              {fields.map((field) =>
                field.type === 'textarea' ? (
                  <TextAreaField key={field.key} label={field.label} value={item[field.key] || ''} onChange={(value) => updateItem(index, field.key, value)} rows={3} />
                ) : (
                  <TextField key={field.key} label={field.label} value={item[field.key] || ''} onChange={(value) => updateItem(index, field.key, value)} />
                ),
              )}
            </div>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, currentIndex) => currentIndex !== index))}
              className="mt-4 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
