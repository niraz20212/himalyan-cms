import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAdminResource } from '../../api/queries';

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    orders: [],
    products: [],
    inquiries: [],
    exportCountries: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [orders, products, inquiries, exportCountries] = await Promise.all([
        fetchAdminResource('orders'),
        fetchAdminResource('products'),
        fetchAdminResource('inquiries'),
        fetchAdminResource('exportCountries'),
      ]);

      setData({ orders, products, inquiries, exportCountries });
      setLoading(false);
    };

    load();
  }, []);

  const metrics = useMemo(() => {
    const totalOrders = data.orders.length;
    const pendingOrders = data.orders.filter((order) => ['NEW', 'REVIEWING', 'QUOTED'].includes(order.status)).length;
    const completedOrders = data.orders.filter((order) => order.status === 'COMPLETED').length;
    const uniqueCustomers = new Set(data.orders.map((order) => order.userId)).size;
    const publishedProducts = data.products.filter((product) => product.published).length;
    const openInquiries = data.inquiries.filter((inquiry) => inquiry.status === 'NEW').length;

    const countryMap = data.orders.reduce((accumulator, order) => {
      const country = order.country || 'Unspecified';
      accumulator[country] = (accumulator[country] || 0) + 1;
      return accumulator;
    }, {});

    const orderTypeMap = data.orders.reduce((accumulator, order) => {
      accumulator[order.orderType] = (accumulator[order.orderType] || 0) + 1;
      return accumulator;
    }, {});

    const countriesByOrders = Object.entries(countryMap)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);

    const topOrderType = Object.entries(orderTypeMap).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    const topCountry = countriesByOrders[0]?.country || 'N/A';

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      uniqueCustomers,
      publishedProducts,
      openInquiries,
      countriesByOrders,
      topOrderType,
      topCountry,
      exportCountriesCount: data.exportCountries.length,
    };
  }, [data]);

  const cards = [
    { label: 'Total Orders', value: metrics.totalOrders, help: 'All submitted orders', href: '/admin/orders' },
    { label: 'Pending Orders', value: metrics.pendingOrders, help: 'Need review or quotation', href: '/admin/orders?status=PENDING' },
    { label: 'Completed Orders', value: metrics.completedOrders, help: 'Finished order pipeline', href: '/admin/orders?status=COMPLETED' },
    { label: 'Active Customers', value: metrics.uniqueCustomers, help: 'Unique ordering users', href: '/admin/orders?view=customers' },
    { label: 'Published Products', value: metrics.publishedProducts, help: 'Live catalogue count', href: '/admin/products' },
    { label: 'Open Inquiries', value: metrics.openInquiries, help: 'Unread or new inquiries', href: '/admin/inquiries' },
  ];

  const maxCountryOrders = metrics.countriesByOrders[0]?.count || 1;

  if (loading) {
    return <div className="rounded-[1.75rem] border border-[var(--line)] bg-white/85 p-6">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.href}
            className="rounded-[1.75rem] border border-[var(--line)] bg-white/90 p-6 shadow-[0_12px_30px_rgba(41,73,54,0.04)] transition hover:-translate-y-1 hover:border-[#cbb18e]"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">{card.label}</p>
            <p className="mt-3 text-4xl font-semibold text-[var(--brand)]">{card.value}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">{card.help}</p>
            <p className="mt-4 text-sm font-semibold text-[var(--brand)]">Open page</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-[var(--line)] bg-white/90 p-6 shadow-[0_18px_50px_rgba(41,73,54,0.05)]">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">Orders By Country</p>
          <h2 className="mt-2 text-2xl font-semibold">Countries With Most Orders</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Live bar graph based on current order submissions.</p>

          <div className="mt-6 space-y-4">
            {metrics.countriesByOrders.length ? (
              metrics.countriesByOrders.slice(0, 8).map((item) => (
                <button
                  key={item.country}
                  onClick={() => navigate(`/admin/orders?country=${encodeURIComponent(item.country)}`)}
                  className="block w-full text-left"
                >
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-[var(--brand)]">{item.country}</span>
                    <span className="text-[var(--muted)]">{item.count} orders</span>
                  </div>
                  <div className="h-4 rounded-full bg-[#efe6d6]">
                    <div
                      className="h-4 rounded-full bg-[linear-gradient(90deg,#294936_0%,#b98247_100%)]"
                      style={{ width: `${(item.count / maxCountryOrders) * 100}%` }}
                    />
                  </div>
                </button>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-[var(--line)] bg-[#fcfaf5] p-5 text-sm text-[var(--muted)]">
                No order data yet for the country chart.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-[var(--line)] bg-white/90 p-6 shadow-[0_18px_50px_rgba(41,73,54,0.05)]">
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">Top Signals</p>
            <div className="mt-5 grid gap-4">
              <InsightCard
                label="Top Order Country"
                value={metrics.topCountry}
                href={metrics.topCountry !== 'N/A' ? `/admin/orders?country=${encodeURIComponent(metrics.topCountry)}` : '/admin/orders'}
              />
              <InsightCard
                label="Most Common Order Type"
                value={metrics.topOrderType}
                href={metrics.topOrderType !== 'N/A' ? `/admin/orders?orderType=${encodeURIComponent(metrics.topOrderType)}` : '/admin/orders'}
              />
              <InsightCard label="Export Countries Listed" value={metrics.exportCountriesCount} href="/admin/exportCountries" />
            </div>
          </div>

          <div className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface-dark)] p-6 text-white">
            <p className="text-sm uppercase tracking-[0.3em] text-[#d7b28f]">Added For Operations</p>
            <div className="mt-4 space-y-3 text-sm text-white/80">
              <p>Order volume is tracked live from the orders resource.</p>
              <p>Country demand is visible without exporting spreadsheets.</p>
              <p>Dashboard cards now reflect real order, inquiry, and catalogue totals.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightCard({ label, value, href }) {
  return (
    <Link to={href} className="rounded-[1.5rem] border border-[var(--line)] bg-[#fcfaf5] p-5 transition hover:-translate-y-1">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[var(--brand)]">{value}</p>
      <p className="mt-3 text-sm font-semibold text-[var(--brand)]">Open page</p>
    </Link>
  );
}
