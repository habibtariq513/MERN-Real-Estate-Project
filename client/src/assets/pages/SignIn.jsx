import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { signInFailure, signInStart, signInSuccess } from '../../redux/user/userSlice';
import OAuth from '../../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const {loading, error} = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } 
    catch (error) {
      dispatch(signInFailure(error.message));
    }

  };

  return (
    <main className="min-h-[calc(100vh-72px)] bg-slate-50 lg:grid lg:grid-cols-2">
      <section className="relative hidden min-h-[calc(100vh-72px)] overflow-hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1800&q=85"
          alt="Welcoming modern home at sunset"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-slate-950/10" />
        <div className="absolute bottom-0 left-0 right-0 p-12 xl:p-16">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">
            Welcome to Sahand Estate
          </p>
          <h2 className="max-w-xl text-4xl font-bold leading-tight text-white xl:text-5xl">
            The right place can change everything.
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-white/80">
            Sign in to continue discovering homes and opportunities tailored
            to the way you want to live.
          </p>
        </div>
      </section>

      <section className="flex min-h-[calc(100vh-72px)] items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
              Your next chapter starts here
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Welcome back
            </h1>
            <p className="mt-3 text-slate-500">
              Sign in to save homes and searches and pick up where you left off.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8"
          >
            <div className="flex flex-col gap-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              {error && (
                <p
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-emerald-700 px-5 py-3.5 font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-wider text-slate-400">
                <span className="h-px flex-1 bg-slate-200" />
                Or continue with
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              <OAuth />
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            New to Sahand Estate?{' '}
            <Link
              to="/sign-up"
              className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
