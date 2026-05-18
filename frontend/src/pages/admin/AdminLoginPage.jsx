import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { loginThunk } from '../../store/slices/authSlice';

export function AdminLoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: 'admin@himalayanchurpi.com',
      password: 'Admin@123',
    },
  });
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (auth.token) navigate('/admin');
  }, [auth.token, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={handleSubmit((values) => dispatch(loginThunk(values)))} className="w-full max-w-md rounded-[2rem] border border-[var(--line)] bg-white/85 p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">Secure Access</p>
        <h1 className="mt-3 text-3xl font-semibold">Admin Login</h1>
        <div className="mt-6 space-y-4">
          <input {...register('email')} className="w-full rounded-2xl border border-[var(--line)] px-4 py-3" />
          <input {...register('password')} type="password" className="w-full rounded-2xl border border-[var(--line)] px-4 py-3" />
          {auth.error ? <p className="text-sm text-red-600">{auth.error}</p> : null}
          <Button type="submit" className="w-full">{auth.loading ? 'Signing in...' : 'Sign in'}</Button>
        </div>
      </form>
    </div>
  );
}
