import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { fetchAdminResource, updateAdminResource } from '../../api/queries';
import { Button } from '../../components/common/Button';

const orderTypes = ['RETAIL', 'WHOLESALE', 'SAMPLE'];
const statuses = ['NEW', 'REVIEWING', 'QUOTED', 'CONFIRMED', 'SHIPPED', 'COMPLETED', 'CANCELLED'];
const pageSize = 6;

export function AdminOrdersPage() {
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [page, setPage] = useState(1);

  const loadOrders = async () => {
    setLoading(true);
    const data = await fetchAdminResource('orders');
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const status = searchParams.get('status');
    const country = searchParams.get('country');
    const orderType = searchParams.get('orderType');

    return orders.filter((order) => {
      if (status === 'PENDING' && !['NEW', 'REVIEWING', 'QUOTED'].includes(order.status)) {
        return false;
      }
      if (status && status !== 'PENDING' && status !== order.status) {
        return false;
      }
      if (country && (order.country || 'Unspecified') !== country) {
        return false;
      }
      if (orderType && order.orderType !== orderType) {
        return false;
      }
      return true;
    });
  }, [orders, searchParams]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const paginatedOrders = useMemo(
    () => filteredOrders.slice((page - 1) * pageSize, page * pageSize),
    [filteredOrders, page],
  );
  const selectedOrder = filteredOrders.find((order) => order.id === selectedOrderId) || null;

  const updateField = (orderId, field, value) => {
    setOrders((current) => current.map((order) => (order.id === orderId ? { ...order, [field]: value } : order)));
  };

  const saveOrder = async (order) => {
    await updateAdminResource('orders', order.id, {
      orderType: order.orderType,
      status: order.status,
      shippingAddress: order.shippingAddress,
      quantity: order.quantity,
      country: order.country,
      phone: order.phone,
      notes: order.notes,
    });
    toast.success('Order updated');
    loadOrders();
  };

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    setPage(1);
    setSelectedOrderId(null);
  }, [searchParams]);

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
        <div className="rounded-[2rem] border border-[var(--line)] bg-white/85 p-6">
          <h2 className="text-2xl font-semibold">Orders</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Browse orders in a clean list, open any order with the view button, and update type, status, or shipping details.
          </p>
          {(searchParams.get('status') || searchParams.get('country') || searchParams.get('orderType')) ? (
            <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
              {searchParams.get('status') ? <span className="rounded-full bg-[#efe3d0] px-3 py-2">Status: {searchParams.get('status')}</span> : null}
              {searchParams.get('country') ? <span className="rounded-full bg-[#efe3d0] px-3 py-2">Country: {searchParams.get('country')}</span> : null}
              {searchParams.get('orderType') ? <span className="rounded-full bg-[#efe3d0] px-3 py-2">Type: {searchParams.get('orderType')}</span> : null}
            </div>
          ) : null}
        </div>

      {loading ? (
        <div className="rounded-[2rem] border border-[var(--line)] bg-white/85 p-6">Loading...</div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            {paginatedOrders.length ? (
              paginatedOrders.map((order) => (
                <div key={order.id} className="rounded-[2rem] border border-[var(--line)] bg-white/90 p-6 shadow-[0_10px_30px_rgba(41,73,54,0.04)]">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.25em] text-[var(--accent)]">{order.orderType}</p>
                      <h3 className="mt-2 text-2xl font-semibold">{order.product?.name || 'Unnamed Product'}</h3>
                      <p className="mt-2 text-sm text-[var(--muted)]">
                        {`${order.user?.name || ''} ${order.user?.lastName || ''}`.trim()} • {order.user?.email || 'No email'}
                      </p>
                    </div>
                    <div className="rounded-full bg-[#efe3d0] px-4 py-2 text-sm font-semibold text-[var(--brand)]">
                      {order.status}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    <SummaryCard label="Quantity" value={order.quantity || 'Not set'} />
                    <SummaryCard label="Country" value={order.country || 'Not set'} />
                    <SummaryCard label="Created" value={formatDate(order.createdAt)} />
                  </div>

                  <div className="mt-5 flex gap-3">
                    <Button onClick={() => setSelectedOrderId(order.id)}>View</Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[2rem] border border-[var(--line)] bg-white/85 p-6 text-[var(--muted)]">
                No orders available for this selection.
              </div>
            )}

            <div className="flex items-center justify-between rounded-[2rem] border border-[var(--line)] bg-white/85 p-4">
              <p className="text-sm text-[var(--muted)]">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page === 1}
                  className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold text-[var(--brand)] disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  disabled={page === totalPages}
                  className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold text-[var(--brand)] disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[var(--line)] bg-white/90 p-6 shadow-[0_18px_50px_rgba(41,73,54,0.05)]">
            {selectedOrder ? (
              <>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-[var(--accent)]">Order Detail</p>
                    <h3 className="mt-2 text-2xl font-semibold">{selectedOrder.product?.name}</h3>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      Order by {`${selectedOrder.user?.name || ''} ${selectedOrder.user?.lastName || ''}`.trim()}
                    </p>
                  </div>
                  <button onClick={() => setSelectedOrderId(null)} className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold text-[var(--brand)]">
                    Close
                  </button>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <ReadOnlyField label="User Email" value={selectedOrder.user?.email || ''} />
                  <ReadOnlyField label="Product" value={selectedOrder.product?.name || ''} />
                  <SelectField label="Order Type" value={selectedOrder.orderType} options={orderTypes} onChange={(value) => updateField(selectedOrder.id, 'orderType', value)} />
                  <SelectField label="Status" value={selectedOrder.status} options={statuses} onChange={(value) => updateField(selectedOrder.id, 'status', value)} />
                  <EditableField label="Quantity" value={selectedOrder.quantity || ''} onChange={(value) => updateField(selectedOrder.id, 'quantity', value)} />
                  <EditableField label="Country" value={selectedOrder.country || ''} onChange={(value) => updateField(selectedOrder.id, 'country', value)} />
                  <EditableField label="Phone" value={selectedOrder.phone || ''} onChange={(value) => updateField(selectedOrder.id, 'phone', value)} />
                  <ReadOnlyField label="Created At" value={formatDate(selectedOrder.createdAt)} />
                </div>

                <div className="mt-4 grid gap-4">
                  <TextAreaField label="Shipping Address" value={selectedOrder.shippingAddress || ''} onChange={(value) => updateField(selectedOrder.id, 'shippingAddress', value)} />
                  <TextAreaField label="Notes" value={selectedOrder.notes || ''} onChange={(value) => updateField(selectedOrder.id, 'notes', value)} />
                </div>

                <Button onClick={() => saveOrder(selectedOrder)} className="mt-5">
                  Save Order
                </Button>
              </>
            ) : (
              <div className="flex min-h-[300px] items-center justify-center rounded-[1.75rem] border border-dashed border-[var(--line)] bg-[#fcfaf5] p-6 text-center text-[var(--muted)]">
                Select an order and click <span className="mx-1 font-semibold text-[var(--brand)]">View</span> to see all information.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[#fcfaf5] p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-sm">{value}</p>
    </div>
  );
}

function ReadOnlyField({ label, value }) {
  return (
    <label className="block">
      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{label}</p>
      <input value={value} readOnly className="w-full rounded-2xl border border-[var(--line)] bg-[#f7f3ea] px-4 py-3" />
    </label>
  );
}

function EditableField({ label, value, onChange }) {
  return (
    <label className="block">
      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{label}</p>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-[var(--line)] px-4 py-3" />
    </label>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <label className="block">
      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{label}</p>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-[var(--line)] px-4 py-3">
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({ label, value, onChange }) {
  return (
    <label className="block">
      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{label}</p>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows="4" className="w-full rounded-2xl border border-[var(--line)] px-4 py-3" />
    </label>
  );
}

function formatDate(value) {
  return value ? new Date(value).toLocaleString() : 'Not available';
}
