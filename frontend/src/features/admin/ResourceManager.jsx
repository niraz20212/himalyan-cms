import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { createAdminResource, deleteAdminResource, fetchAdminResource } from '../../api/queries';
import { Button } from '../../components/common/Button';

export function ResourceManager({ title, resource, sampleJson }) {
  const [items, setItems] = useState([]);
  const [value, setValue] = useState(sampleJson);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await fetchAdminResource(resource);
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [resource]);

  const createItem = async () => {
    const payload = JSON.parse(value);
    await createAdminResource(resource, payload);
    toast.success(`${title} created`);
    load();
  };

  const removeItem = async (id) => {
    await deleteAdminResource(resource, id);
    toast.success(`${title} deleted`);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-[var(--line)] bg-white/85 p-6">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">JSON-based content manager scaffold. Replace with field-specific forms as the CMS evolves.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-[var(--line)] bg-white/85 p-6">
          <textarea value={value} onChange={(event) => setValue(event.target.value)} rows="18" className="w-full rounded-2xl border border-[var(--line)] p-4 font-mono text-sm" />
          <Button onClick={createItem} className="mt-4">Create {title}</Button>
        </div>
        <div className="space-y-4">
          {loading ? (
            <div className="rounded-[2rem] border border-[var(--line)] bg-white/85 p-6">Loading...</div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="rounded-[2rem] border border-[var(--line)] bg-white/85 p-6">
                <pre className="overflow-auto whitespace-pre-wrap text-sm text-[var(--muted)]">{JSON.stringify(item, null, 2)}</pre>
                <button className="mt-4 text-sm text-red-600" onClick={() => removeItem(item.id)}>Delete</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
