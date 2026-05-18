import { Link, useParams } from 'react-router-dom';
import { fetchMyOrder } from '../../api/queries';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { Seo } from '../../components/common/Seo';
import { useFetch } from '../../hooks/useFetch';

export function OrderDetailPage() {
  const { id } = useParams();
  const { data, loading } = useFetch(() => fetchMyOrder(id), [id]);

  if (loading) {
    return <div className="mx-auto max-w-5xl px-4 py-14"><Loader /></div>;
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-14 md:px-6">
      <Seo title="Order Detail | Himalayan Churpi" description="Detailed user order record." />
      <div className="rounded-[2rem] border border-[var(--line)] bg-white/85 p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">Order Detail</p>
            <h1 className="mt-3 text-4xl font-semibold">{data?.product?.name}</h1>
          </div>
          <div className="rounded-full bg-[#efe3d0] px-4 py-2 text-sm font-semibold text-[var(--brand)]">
            {data?.status}
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Detail label="Order Type" value={data?.orderType} />
          <Detail label="Quantity" value={data?.quantity || 'Not specified'} />
          <Detail label="Country" value={data?.country || 'Not specified'} />
          <Detail label="Phone" value={data?.phone || 'Not specified'} />
          <Detail label="Shipping Address" value={data?.shippingAddress} />
          <Detail label="Created At" value={data?.createdAt ? new Date(data.createdAt).toLocaleString() : '-'} />
        </div>
        <div className="mt-6 rounded-[1.5rem] border border-[var(--line)] p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Notes</p>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[var(--muted)]">{data?.notes || 'No extra notes provided.'}</p>
        </div>
        <div className="mt-6 flex gap-3">
          <Button as={Link} to="/account/orders">Back To Orders</Button>
          <Button as={Link} to={`/products/${data?.product?.slug}`} className="bg-white text-[var(--brand)] hover:bg-[#f4ecdd]">
            View Product
          </Button>
        </div>
      </div>
    </section>
  );
}

function Detail({ label, value }) {
  return (
    <div className="rounded-2xl border border-[var(--line)] p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-base">{value}</p>
    </div>
  );
}
