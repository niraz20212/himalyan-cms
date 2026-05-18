import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { clearRegisterState, requestRegisterCodeThunk, verifyRegisterCodeThunk } from '../../store/slices/authSlice';

export function UserSignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { register: registerVerify, handleSubmit: handleVerifySubmit } = useForm();

  useEffect(() => {
    if (auth.token) {
      navigate(auth.user?.role === 'USER' ? '/' : '/admin');
    }
  }, [auth.token, auth.user, navigate]);

  useEffect(() => () => dispatch(clearRegisterState()), [dispatch]);

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center px-4 py-14 md:px-6">
      <div className="grid w-full gap-8 md:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-[var(--line)] bg-[linear-gradient(145deg,#fff8ef_0%,#ead7bb_48%,#d0b08b_100%)] p-8 shadow-[0_20px_60px_rgba(185,130,71,0.14)]">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">User Signup</p>
          <h1 className="mt-4 text-4xl font-semibold">Create Your Account</h1>
          <p className="mt-4 text-[var(--muted)]">Signup now includes email verification. First request the code, then enter the 6-digit code sent to your email to finish registration.</p>
          <div className="mt-8 grid gap-3">
            {['Request verification code', 'Verify with 6-digit email code', 'Return to homepage after successful signup'].map((item) => (
              <div key={item} className="rounded-2xl border border-black/5 bg-white/40 px-4 py-3 text-sm text-[var(--text)]">
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <form onSubmit={handleSubmit((values) => dispatch(requestRegisterCodeThunk(values)))} className="rounded-[2rem] border border-[var(--line)] bg-white/90 p-8 shadow-[0_18px_50px_rgba(41,73,54,0.08)]">
            <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">Step 1</p>
            <h2 className="mt-3 text-3xl font-semibold">Fill Details And Send OTP</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                {...register('name', { required: 'Please enter your first name.' })}
                placeholder="First name"
                className="mt-6 w-full rounded-2xl border border-[var(--line)] px-4 py-3"
              />
              <input
                {...register('lastName', { required: 'Please enter your last name.' })}
                placeholder="Last name"
                className="mt-6 w-full rounded-2xl border border-[var(--line)] px-4 py-3"
              />
            </div>
            <div className="mt-4 space-y-4">
              <input
                {...register('email', {
                  required: 'Please enter your email address.',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email address.',
                  },
                })}
                placeholder="Email"
                className="w-full rounded-2xl border border-[var(--line)] px-4 py-3"
              />
              <input
                {...register('password', {
                  required: 'Please enter a password.',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 8 characters.',
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
                    message: 'Password must include uppercase, lowercase, number, and special character.',
                  },
                })}
                type="password"
                placeholder="Password"
                className="w-full rounded-2xl border border-[var(--line)] px-4 py-3"
              />
              {errors.name ? <p className="text-sm text-red-600">{errors.name.message}</p> : null}
              {errors.lastName ? <p className="text-sm text-red-600">{errors.lastName.message}</p> : null}
              {errors.email ? <p className="text-sm text-red-600">{errors.email.message}</p> : null}
              {errors.password ? <p className="text-sm text-red-600">{errors.password.message}</p> : null}
              {!auth.registerEmail && auth.error ? <p className="text-sm text-red-600">{auth.error}</p> : null}
              {auth.registerEmail ? <p className="text-sm text-[var(--brand)]">Verification code sent to {auth.registerEmail}</p> : null}
              <Button type="submit" className="w-full">{auth.loading && !auth.registerEmail ? 'Sending OTP...' : 'Send OTP'}</Button>
            </div>
          </form>

          {auth.registerEmail ? (
            <form
              onSubmit={handleVerifySubmit((values) => dispatch(verifyRegisterCodeThunk({ email: auth.registerEmail, code: values.code })))}
              className="rounded-[2rem] border border-[var(--line)] bg-white/90 p-8 shadow-[0_18px_50px_rgba(41,73,54,0.08)]"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--accent)]">Step 2</p>
              <h2 className="mt-3 text-3xl font-semibold">Enter OTP</h2>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-[var(--line)] bg-[#fcfaf5] px-4 py-3 text-sm text-[var(--muted)]">
                  OTP sent to: {auth.registerEmail}
                </div>
                <input {...registerVerify('code')} placeholder="Enter 6-digit OTP" className="w-full rounded-2xl border border-[var(--line)] px-4 py-3" />
                {auth.error ? (
                  <p className="text-sm text-red-600">
                    {auth.error.toLowerCase().includes('invalid verification code') ? 'Please enter the correct OTP.' : auth.error}
                  </p>
                ) : null}
                <Button type="submit" className="w-full">{auth.loading ? 'Verifying OTP...' : 'Verify OTP'}</Button>
              </div>
              <p className="mt-4 text-sm text-[var(--muted)]">
                Already registered? <Link to="/login" className="text-[var(--brand)]">Login</Link>
              </p>
            </form>
          ) : null}
        </div>
      </div>
    </section>
  );
}
