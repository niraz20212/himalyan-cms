import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { submitInquiry } from '../../api/queries';
import { Button } from '../../components/common/Button';
import { Seo } from '../../components/common/Seo';

export function ContactPage() {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { type: 'DISTRIBUTOR' },
  });

  const onSubmit = async (values) => {
    await submitInquiry(values);
    toast.success('Inquiry submitted');
    reset();
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <Seo title="Contact | Himalayan Churpi" description="Distributor and wholesale inquiry form." />
      <Toaster position="top-right" />
      <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-[var(--line)] bg-[var(--surface-dark)] p-8 text-white">
          <p className="text-sm uppercase tracking-[0.3em] text-[#d7b28f]">Global Partnerships</p>
          <h1 className="mt-4 text-4xl font-semibold">Distributor & Wholesale Inquiries</h1>
          <p className="mt-4 text-white/75">Connect with our Nepal-based export team for pricing, samples, private label, and logistics support.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-[2rem] border border-[var(--line)] bg-white/80 p-8">
          <input {...register('name')} placeholder="Full name" className="w-full rounded-2xl border border-[var(--line)] px-4 py-3" />
          <input {...register('company')} placeholder="Company" className="w-full rounded-2xl border border-[var(--line)] px-4 py-3" />
          <input {...register('email')} placeholder="Email" className="w-full rounded-2xl border border-[var(--line)] px-4 py-3" />
          <input {...register('phone')} placeholder="Phone" className="w-full rounded-2xl border border-[var(--line)] px-4 py-3" />
          <input {...register('country')} placeholder="Country" className="w-full rounded-2xl border border-[var(--line)] px-4 py-3" />
          <select {...register('type')} className="w-full rounded-2xl border border-[var(--line)] px-4 py-3">
            <option value="DISTRIBUTOR">Distributor Inquiry</option>
            <option value="WHOLESALE">Wholesale Inquiry</option>
            <option value="CONTACT">General Contact</option>
          </select>
          <textarea {...register('message')} rows="5" placeholder="Tell us about your market and volume needs" className="w-full rounded-2xl border border-[var(--line)] px-4 py-3" />
          <Button type="submit">Send Inquiry</Button>
        </form>
      </div>
    </section>
  );
}
