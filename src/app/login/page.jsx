"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AUTH_STORAGE_KEY = "token";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const existingToken = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (existingToken) {
      router.replace("/profile");
    }
  }, [router]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const isJson = response.headers
        .get("content-type")
        ?.includes("application/json");
      const data = isJson ? await response.json() : null;

      if (!response.ok) {
        const message = data?.message || data?.error || "Login failed";
        setError(message);
        return;
      }

      if (data?.token) {
        window.localStorage.setItem(AUTH_STORAGE_KEY, data.token);
        router.push("/profile");
      }
    } catch (err) {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.15),transparent_50%)]" />
      
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col lg:flex-row">
        <section className="flex w-full flex-1 flex-col justify-center px-6 py-16 sm:px-10 lg:px-20">
          <div className="w-full max-w-md mx-auto">
            <div className="space-y-5 text-left animate-in fade-in slide-in-from-left duration-700">
              <div className="inline-block rounded-full bg-blue-500/20 px-4 py-2 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-300">
                  Welcome back
                </p>
              </div>
              <h1 className="text-4xl font-bold text-white sm:text-5xl leading-tight">
                Sign in to
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  EduSync
                </span>
              </h1>
              <p className="text-base text-slate-300 leading-relaxed">
                Access personalized learning dashboards, manage cohorts, and
                keep your tutoring sessions organized.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="mt-12 space-y-6 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-200"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 shadow-lg backdrop-blur-sm transition-all duration-200 focus:border-blue-500 focus:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-slate-600"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-200"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 shadow-lg backdrop-blur-sm transition-all duration-200 focus:border-blue-500 focus:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-slate-600"
                  placeholder="Enter your password"
                  minLength={6}
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-300 backdrop-blur-sm animate-in fade-in slide-in-from-top duration-300">
                  <div className="flex items-center gap-2">
                    <span>⚠</span>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3.5 text-sm font-semibold text-white shadow-xl transition-all duration-300 hover:from-blue-500 hover:to-purple-500 hover:shadow-2xl hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:from-blue-600 disabled:hover:to-purple-600"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign in
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </>
                  )}
                </span>
              </button>
            </form>

            <p className="mt-10 text-center text-sm text-slate-400 animate-in fade-in duration-700 delay-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-blue-400 transition-all duration-200 hover:text-blue-300 hover:underline"
              >
                Create one now
              </Link>
            </p>
          </div>
        </section>

        <aside className="relative hidden flex-1 overflow-hidden bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-slate-900/60 px-12 py-16 backdrop-blur-xl lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.3),_transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(147,51,234,0.2),_transparent_60%)]" />
          
          <div className="relative z-10 flex flex-col justify-between">
            <div className="space-y-6 animate-in fade-in slide-in-from-right duration-700">
              <div className="inline-block rounded-full bg-blue-500/20 px-4 py-2 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-300">
                  Learn without friction
                </p>
              </div>
              <h2 className="text-5xl font-bold text-white leading-tight">
                Your learning
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  journey starts here
                </span>
              </h2>
              <p className="max-w-md text-base text-blue-100/90 leading-relaxed">
                EduSync – A College Management and Automation System that unifies
                analytics, scheduling, and collaboration for administrators,
                educators, and students to stay aligned effortlessly.
              </p>
            </div>
            
            <div className="space-y-4 rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
              <div className="flex items-center gap-2">
                <div className="h-1 w-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">
                  Why teams choose EduSync
                </p>
              </div>
              <ul className="space-y-3 text-sm text-blue-100/90">
                <li className="flex items-center gap-3">
                  <span className="text-blue-400">✓</span>
                  <span>Smart scheduling for hybrid classrooms</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-blue-400">✓</span>
                  <span>Progress dashboards for every learner</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-blue-400">✓</span>
                  <span>Secure notes with guardian visibility controls</span>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}