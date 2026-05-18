import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { createOrder, fetchExportCountries, fetchProducts } from '../../api/queries';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { Seo } from '../../components/common/Seo';
import { useFetch } from '../../hooks/useFetch';

export function OrderRequestPage() {
  const [searchParams] = useSearchParams();
  const auth = useSelector((state) => state.auth);
  const { data: products, loading } = useFetch(fetchProducts, []);
  const { data: countries, loading: countriesLoading } = useFetch(fetchExportCountries, []);
  const selectedProductSlug = searchParams.get('product');
  const selectedProduct = useMemo(
    () => products?.find((product) => product.slug === selectedProductSlug) || null,
    [products, selectedProductSlug],
  );

  const { register, handleSubmit, reset } = useForm({
    values: {
      name: auth.user?.name ? `${auth.user.name} ${auth.user.lastName || ''}`.trim() : '',
      email: auth.user?.email || '',
      company: '',
      phone: '',
      country: '',
      productId: selectedProduct?.id || '',
      quantity: '',
      orderType: 'RETAIL',
      shippingAddress: '',
      notes: selectedProduct ? `I would like to place an order request for ${selectedProduct.name}.` : '',
    },
  });

  const onSubmit = async (values) => {
    const order = await createOrder({
      productId: values.productId,
      orderType: values.orderType,
      quantity: values.quantity,
      shippingAddress: values.shippingAddress,
      country: values.country,
      phone: values.phone,
      notes: values.notes,
    });

    toast.success('Order request submitted');
    reset({
      name: values.name,
      email: values.email,
      phone: '',
      country: '',
      productId: values.productId,
      quantity: '',
      orderType: values.orderType,
      shippingAddress: '',
      notes: '',
    });
    window.location.href = `/account/orders/${order.id}`;
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <Seo title="Place Order | Himalayan Churpi" description="Authenticated product order request form." />
      <Toaster position="top-right" />
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface-dark)] p-8 text-white">
          <p className="text-sm uppercase tracking-[0.3em] text-[#d7b28f]">Order Request</p>
          <h1 className="mt-4 text-4xl font-semibold">Place A Product Order Request</h1>
          <p className="mt-4 text-white/75">
            Submit your preferred product, quantity, shipping address, and market details. The export team will follow up with pricing, MOQ, and logistics.
          </p>
          {selectedProduct ? (
            <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-[#d7b28f]">Selected Product</p>
              <h2 className="mt-3 text-2xl font-semibold">{selectedProduct.name}</h2>
              <p className="mt-2 text-sm text-white/70">{selectedProduct.shortDesc}</p>
              <Link to={`/products/${selectedProduct.slug}`} className="mt-4 inline-block text-sm text-[#f0d0af]">
                Review product details
              </Link>
            </div>
          ) : null}
        </div>
        <div className="rounded-[2rem] border border-[var(--line)] bg-white/85 p-8">
          {loading || countriesLoading ? (
            <Loader />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input {...register('name')} placeholder="Full name" className="w-full rounded-2xl border border-[var(--line)] px-4 py-3" />
                <input {...register('email')} placeholder="Email" className="w-full rounded-2xl border border-[var(--line)] px-4 py-3" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <input {...register('phone')} placeholder="Phone" className="w-full rounded-2xl border border-[var(--line)] px-4 py-3" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <select {...register('country')} className="w-full rounded-2xl border border-[var(--line)] px-4 py-3">
                  <option value="">Select country</option>
                  {countries?.map((country) => (
                    <option key={country.id} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
                <input {...register('quantity')} placeholder="Requested quantity" className="w-full rounded-2xl border border-[var(--line)] px-4 py-3" />
              </div>
              <select {...register('orderType')} className="w-full rounded-2xl border border-[var(--line)] px-4 py-3">
                <option value="RETAIL">Retail</option>
                <option value="WHOLESALE">Wholesale</option>
                <option value="SAMPLE">Sample</option>
              </select>
              <select {...register('productId')} className="w-full rounded-2xl border border-[var(--line)] px-4 py-3">
                <option value="">Select product</option>
                {products?.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              <textarea {...register('shippingAddress')} rows="4" placeholder="Shipping address" className="w-full rounded-2xl border border-[var(--line)] px-4 py-3" />
              <textarea {...register('notes')} rows="6" placeholder="Additional requirements" className="w-full rounded-2xl border border-[var(--line)] px-4 py-3" />
              <Button type="submit">Submit Order Request</Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
