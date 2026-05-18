import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { createAdminResource, deleteAdminResource, fetchAdminResource, updateAdminResource, uploadMediaFile } from '../../api/queries';
import { Button } from '../../components/common/Button';
import { resolveMediaUrl } from '../../utils/media';

export function ResourceManager({ title, resource, config }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(createInitialState(config));

  const fields = config?.fields || [];
  const description = config?.description || 'Manage content with simple forms.';
  const listTitle = config?.listTitle || `${title} list`;

  const editingItem = useMemo(
    () => items.find((item) => item.id === editingId) || null,
    [items, editingId],
  );

  const load = async () => {
    setLoading(true);
    const data = await fetchAdminResource(resource);
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    setFormData(createInitialState(config));
    setEditingId(null);
    load();
  }, [resource]);

  const handleChange = (name, value) => {
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData(createInitialState(config, item));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData(createInitialState(config));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const payload = buildPayload(fields, formData);
      if (editingId) {
        await updateAdminResource(resource, editingId, payload);
        toast.success(`${title} updated`);
      } else {
        await createAdminResource(resource, payload);
        toast.success(`${title} created`);
      }
      handleCancel();
      load();
    } catch (error) {
      toast.error(error?.message || 'Unable to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteAdminResource(resource, id);
    toast.success(`${title} deleted`);
    if (editingId === id) {
      handleCancel();
    }
    load();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-[var(--line)] bg-white/85 p-6">
        <h2 className="text-2xl font-semibold capitalize">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-[var(--line)] bg-white/90 p-6 shadow-[0_18px_50px_rgba(41,73,54,0.05)]">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-[var(--accent)]">
                {editingId ? 'Edit Item' : 'Create New'}
              </p>
              <h3 className="mt-2 text-2xl font-semibold">
                {editingId ? `Update ${title}` : `Add ${title}`}
              </h3>
            </div>
            {editingId ? (
              <button onClick={handleCancel} className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold text-[var(--brand)]">
                Cancel
              </button>
            ) : null}
          </div>

          <div className="space-y-4">
            {fields.map((field) => (
              <FieldRenderer
                key={field.name}
                field={field}
                value={formData[field.name]}
                onChange={(value) => handleChange(field.name, value)}
              />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={handleSubmit}>{saving ? 'Saving...' : editingId ? 'Save Changes' : `Create ${title}`}</Button>
            {config?.allowAdvancedJson ? (
              <details className="rounded-2xl border border-[var(--line)] bg-[#faf6ef] p-4 text-sm text-[var(--muted)]">
                <summary className="cursor-pointer font-semibold text-[var(--brand)]">Advanced JSON Preview</summary>
                <pre className="mt-3 overflow-auto whitespace-pre-wrap">{JSON.stringify(buildPayload(fields, formData), null, 2)}</pre>
              </details>
            ) : null}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[2rem] border border-[var(--line)] bg-white/85 p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-[var(--accent)]">Published Items</p>
            <h3 className="mt-2 text-2xl font-semibold capitalize">{listTitle}</h3>
          </div>

          {loading ? (
            <div className="rounded-[2rem] border border-[var(--line)] bg-white/85 p-6">Loading...</div>
          ) : items.length ? (
            items.map((item) => (
              <div key={item.id} className="rounded-[2rem] border border-[var(--line)] bg-white/90 p-6 shadow-[0_10px_30px_rgba(41,73,54,0.04)]">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-[var(--accent)]">
                      {resolvePrimaryMeta(config, item)}
                    </p>
                    <h4 className="mt-2 text-2xl font-semibold">{resolvePrimaryTitle(config, item)}</h4>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                      {resolvePrimaryDescription(config, item)}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => handleEdit(item)} className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold text-[var(--brand)]">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600">
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {fields.slice(0, 4).map((field) => (
                    <div key={field.name} className="rounded-2xl border border-[var(--line)] bg-[#fcfaf5] p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{field.label}</p>
                      <p className="mt-2 text-sm text-[var(--text)]">{formatFieldValue(item[field.name], field)}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[2rem] border border-[var(--line)] bg-white/85 p-6 text-[var(--muted)]">
              No items added yet.
            </div>
          )}
        </div>
      </div>

      {editingItem && config?.allowAdvancedJson ? (
        <div className="rounded-[2rem] border border-[var(--line)] bg-white/85 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-[var(--accent)]">Advanced View</p>
          <pre className="mt-4 overflow-auto whitespace-pre-wrap text-sm text-[var(--muted)]">
            {JSON.stringify(editingItem, null, 2)}
          </pre>
        </div>
      ) : null}
    </div>
  );
}

function createInitialState(config, item = null) {
  return (config?.fields || []).reduce((accumulator, field) => {
    if (item) {
      accumulator[field.name] = getInitialFieldValue(item[field.name], field);
      return accumulator;
    }

    if (field.defaultValue !== undefined) {
      accumulator[field.name] = field.defaultValue;
      return accumulator;
    }

    accumulator[field.name] = field.type === 'checkbox' ? false : '';
    return accumulator;
  }, {});
}

function getInitialFieldValue(value, field) {
  if (field.type === 'json') {
    return value ? JSON.stringify(value, null, 2) : '';
  }
  if (field.type === 'checkbox') {
    return Boolean(value);
  }
  return value ?? '';
}

function buildPayload(fields, formData) {
  return fields.reduce((accumulator, field) => {
    let value = formData[field.name];

    if (field.type === 'number') {
      value = value === '' ? null : Number(value);
    }

    if (field.type === 'checkbox') {
      value = Boolean(value);
    }

    if (field.type === 'json') {
      value = value ? JSON.parse(value) : null;
    }

    if (field.optional && (value === '' || value === null)) {
      accumulator[field.name] = null;
      return accumulator;
    }

    accumulator[field.name] = value;
    return accumulator;
  }, {});
}

function resolvePrimaryTitle(config, item) {
  return item[config?.primaryTitle || 'title'] || item.name || item.title || item.key || 'Untitled';
}

function resolvePrimaryDescription(config, item) {
  const descriptionKey = config?.primaryDescription;
  const value = descriptionKey ? item[descriptionKey] : item.description || item.shortDesc || item.summary || item.email;
  if (!value) {
    return 'No additional description provided.';
  }
  return typeof value === 'object' ? JSON.stringify(value) : String(value);
}

function resolvePrimaryMeta(config, item) {
  const metaKey = config?.primaryMeta;
  const value = metaKey ? item[metaKey] : item.slug || item.code || item.status || item.location;
  return value ? String(value) : 'Item';
}

function formatFieldValue(value, field) {
  if (value === null || value === undefined || value === '') {
    return 'Not set';
  }
  if (field.type === 'checkbox') {
    return value ? 'Yes' : 'No';
  }
  if (field.type === 'json') {
    return JSON.stringify(value);
  }
  return String(value);
}

function FieldRenderer({ field, value, onChange }) {
  const commonClasses = 'mt-2 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3';
  const [uploading, setUploading] = useState(false);

  if (field.type === 'textarea') {
    return (
      <label className="block">
        <span className="text-sm font-semibold text-[var(--brand)]">{field.label}</span>
        <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{field.helpText}</p>
        <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={field.rows || 5} className={commonClasses} />
      </label>
    );
  }

  if (field.type === 'select') {
    return (
      <label className="block">
        <span className="text-sm font-semibold text-[var(--brand)]">{field.label}</span>
        <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{field.helpText}</p>
        <select value={value} onChange={(event) => onChange(event.target.value)} className={commonClasses}>
          {(field.options || []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.type === 'checkbox') {
    return (
      <label className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[#fcfaf5] px-4 py-4">
        <input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4" />
        <div>
          <span className="text-sm font-semibold text-[var(--brand)]">{field.label}</span>
          <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{field.helpText}</p>
        </div>
      </label>
    );
  }

  if (field.type === 'json') {
    return (
      <label className="block">
        <span className="text-sm font-semibold text-[var(--brand)]">{field.label}</span>
        <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{field.helpText}</p>
        <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={field.rows || 8} className={`${commonClasses} font-mono text-sm`} />
      </label>
    );
  }

  if (field.type === 'image') {
    const handleFileChange = async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        setUploading(true);
        const media = await uploadMediaFile(file);
        onChange(media.path || media.url);
        toast.success('Image uploaded');
      } catch (error) {
        toast.error(error?.response?.data?.message || error?.message || 'Image upload failed');
      } finally {
        setUploading(false);
      }
    };

    return (
      <label className="block">
        <span className="text-sm font-semibold text-[var(--brand)]">{field.label}</span>
        <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{field.helpText}</p>
        {value ? (
          <img src={resolveMediaUrl(value)} alt={field.label} className="mt-3 h-48 w-full rounded-2xl border border-[var(--line)] object-cover" />
        ) : (
          <div className="mt-3 flex h-48 w-full items-center justify-center rounded-2xl border border-dashed border-[var(--line)] bg-[#fcfaf5] text-sm text-[var(--muted)]">
            No image selected
          </div>
        )}
        <div className="mt-3 flex flex-wrap gap-3">
          <input type="file" accept="image/*" onChange={handleFileChange} className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm" />
          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Or paste image URL"
            className="min-w-[240px] flex-1 rounded-2xl border border-[var(--line)] bg-white px-4 py-3"
          />
        </div>
        {uploading ? <p className="mt-2 text-sm text-[var(--brand)]">Uploading image...</p> : null}
      </label>
    );
  }

  return (
    <label className="block">
      <span className="text-sm font-semibold text-[var(--brand)]">{field.label}</span>
      <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{field.helpText}</p>
      <input
        type={field.type || 'text'}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={commonClasses}
      />
    </label>
  );
}
