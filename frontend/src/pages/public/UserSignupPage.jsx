import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { registerThunk } from '../../store/slices/authSlice';

export function UserSignupPage() {
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
        <div className="rounded-[2rem] border border-[var(--line)] bg-[linear-gradient(145deg,#fff8ef_0%,#ead7bb_48%,#d0b08b_100%)] p-8 shadow-[0_20px_60px_rgba(185,130,71,0.14)]">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">User Signup</p>
          <h1 className="mt-4 text-4xl font-semibold">Create Your Account</h1>
          <p className="mt-4 text-[var(--muted)]">Signup requires first name, last name, email, and password. New accounts are created with the `USER` role and return to the main page after signup.</p>
          <div className="mt-8 grid gap-3">
            {['Go straight to the homepage after signup', 'Access account and orders', 'Start product order requests quickly'].map((item) => (
              <div key={item} className="rounded-2xl border border-black/5 bg-white/40 px-4 py-3 text-sm text-[var(--text)]">
                {item}
              </div>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit((values) => dispatch(registerThunk(values)))} className="rounded-[2rem] border border-[var(--line)] bg-white/90 p-8 shadow-[0_18px_50px_rgba(41,73,54,0.08)]">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">Create Access</p>
          <h2 className="mt-3 text-3xl font-semibold">Sign Up</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <input {...register('name')} placeholder="First name" className="mt-6 w-full rounded-2xl border border-[var(--line)] px-4 py-3" />
            <input {...register('lastName')} placeholder="Last name" className="mt-6 w-full rounded-2xl border border-[var(--line)] px-4 py-3" />
          </div>
          <div className="mt-4 space-y-4">
            <input {...register('email')} placeholder="Email" className="w-full rounded-2xl border border-[var(--line)] px-4 py-3" />
            <input {...register('password')} type="password" placeholder="Password" className="w-full rounded-2xl border border-[var(--line)] px-4 py-3" />
            {auth.error ? <p className="text-sm text-red-600">{auth.error}</p> : null}
            <Button type="submit" className="w-full">{auth.loading ? 'Creating account...' : 'Sign Up'}</Button>
          </div>
          <p className="mt-4 text-sm text-[var(--muted)]">
            Already registered? <Link to="/login" className="text-[var(--brand)]">Login</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
