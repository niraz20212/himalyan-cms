import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { fetchAdminResource, updateAdminResource } from '../../api/queries';
import { Button } from '../../components/common/Button';

const orderTypes = ['RETAIL', 'WHOLESALE', 'SAMPLE'];
const statuses = ['NEW', 'REVIEWING', 'QUOTED', 'CONFIRMED', 'SHIPPED', 'COMPLETED', 'CANCELLED'];

export function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    const data = await fetchAdminResource('orders');
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateField = async (orderId, field, value) => {
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

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div className="rounded-[2rem] border border-[var(--line)] bg-white/85 p-6">
        <h2 className="text-2xl font-semibold">Orders</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">Change order type, status, shipping address, and review user-submitted order details.</p>
      </div>
      {loading ? (
        <div className="rounded-[2rem] border border-[var(--line)] bg-white/85 p-6">Loading...</div>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="rounded-[2rem] border border-[var(--line)] bg-white/85 p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Field label="User" value={`${order.user?.name || ''} ${order.user?.lastName || ''}`.trim()} readOnly />
              <Field label="Email" value={order.user?.email || ''} readOnly />
              <Field label="Product" value={order.product?.name || ''} readOnly />
              <SelectField label="Order Type" value={order.orderType} options={orderTypes} onChange={(value) => updateField(order.id, 'orderType', value)} />
              <SelectField label="Status" value={order.status} options={statuses} onChange={(value) => updateField(order.id, 'status', value)} />
              <Field label="Quantity" value={order.quantity || ''} onChange={(value) => updateField(order.id, 'quantity', value)} />
              <Field label="Country" value={order.country || ''} onChange={(value) => updateField(order.id, 'country', value)} />
              <Field label="Phone" value={order.phone || ''} onChange={(value) => updateField(order.id, 'phone', value)} />
            </div>
            <div className="mt-4 grid gap-4">
              <TextAreaField label="Shipping Address" value={order.shippingAddress || ''} onChange={(value) => updateField(order.id, 'shippingAddress', value)} />
              <TextAreaField label="Notes" value={order.notes || ''} onChange={(value) => updateField(order.id, 'notes', value)} />
            </div>
            <Button onClick={() => saveOrder(order)} className="mt-5">Save Order</Button>
          </div>
        ))
      )}
    </div>
  );
}

function Field({ label, value, onChange, readOnly = false }) {
  return (
    <label className="block">
      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{label}</p>
      <input
        value={value}
        readOnly={readOnly}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        className="w-full rounded-2xl border border-[var(--line)] px-4 py-3"
      />
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
