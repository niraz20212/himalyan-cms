import { Link } from 'react-router-dom';
import { fetchMyOrders } from '../../api/queries';
import { Loader } from '../../components/common/Loader';
import { Seo } from '../../components/common/Seo';
import { useFetch } from '../../hooks/useFetch';

export function MyOrdersPage() {
  const { data, loading } = useFetch(fetchMyOrders, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <Seo title="My Orders | Himalayan Churpi" description="User order details and history." />
      <div className="rounded-[2rem] border border-[var(--line)] bg-white/85 p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">My Orders</p>
        <h1 className="mt-4 text-4xl font-semibold">Order Details And History</h1>
      </div>
      <div className="mt-8">
        {loading ? (
          <Loader />
        ) : (
          <div className="grid gap-4">
            {data?.length ? (
              data.map((order) => (
                <Link key={order.id} to={`/account/orders/${order.id}`} className="rounded-[1.75rem] border border-[var(--line)] bg-white/85 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-[var(--accent)]">{order.orderType}</p>
                      <h2 className="mt-2 text-2xl font-semibold">{order.product?.name}</h2>
                    </div>
                    <div className="rounded-full bg-[#efe3d0] px-4 py-2 text-sm font-semibold text-[var(--brand)]">
                      {order.status}
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Quantity</p>
                      <p className="mt-2">{order.quantity || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Country</p>
                      <p className="mt-2">{order.country || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Shipping Address</p>
                      <p className="mt-2">{order.shippingAddress}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-[1.75rem] border border-[var(--line)] bg-white/85 p-6 text-[var(--muted)]">No orders submitted yet.</div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
