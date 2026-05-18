import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { loginThunk } from '../../store/slices/authSlice';

export function UserLoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    if (auth.token) {
      navigate(auth.user?.role === 'USER' ? '/' : '/admin');
    }
  }, [auth.token, auth.user, navigate]);

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center px-4 py-14 md:px-6">
      <div className="grid w-full gap-8 md:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-[var(--line)] bg-[linear-gradient(160deg,#183126_0%,#294936_55%,#48604d_100%)] p-8 text-white shadow-[0_20px_60px_rgba(24,49,38,0.24)]">
          <p className="text-sm uppercase tracking-[0.3em] text-[#d7b28f]">Customer Access</p>
          <h1 className="mt-4 text-4xl font-semibold">Login And Return To The Main Website</h1>
          <p className="mt-4 text-white/75"> Direct access to products, ordering, and account features.</p>
          <div className="mt-8 grid gap-3">
            {['Browse premium products', 'Place order requests', 'Track your submitted orders'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
                {item}
              </div>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit((values) => dispatch(loginThunk(values)))} className="rounded-[2rem] border border-[var(--line)] bg-white/90 p-8 shadow-[0_18px_50px_rgba(41,73,54,0.08)]">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">Welcome Back</p>
          <h2 className="mt-3 text-3xl font-semibold">User Login</h2>
          <div className="space-y-4">
            <input {...register('email')} placeholder="Email" className="mt-6 w-full rounded-2xl border border-[var(--line)] px-4 py-3" />
            <input {...register('password')} type="password" placeholder="Password" className="w-full rounded-2xl border border-[var(--line)] px-4 py-3" />
            {auth.error ? <p className="text-sm text-red-600">{auth.error}</p> : null}
            <Button type="submit" className="w-full">{auth.loading ? 'Signing in...' : 'Login'}</Button>
          </div>
          <p className="mt-4 text-sm text-[var(--muted)]">
            No account? <Link to="/signup" className="text-[var(--brand)]">Create one</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
