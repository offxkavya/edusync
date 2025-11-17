"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AUTH_STORAGE_KEY = "token";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const isJson = response.headers
        .get("content-type")
        ?.includes("application/json");
      const data = isJson ? await response.json() : null;

      if (!response.ok) {
        const message = data?.message || data?.error || "Signup failed";
        setError(message);
        return;
      }

      if (data?.token) {
        window.localStorage.setItem(AUTH_STORAGE_KEY, data.token);
        router.push("/profile");
        return;
      }

      setSuccessMessage("Account created successfully. Please sign in.");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
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
        <section className="relative hidden flex-1 overflow-hidden bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-slate-900/60 px-12 py-16 backdrop-blur-xl lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.3),_transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(147,51,234,0.2),_transparent_60%)]" />
          
          <div className="relative z-10 flex flex-col justify-between">
            <div className="space-y-6 animate-in fade-in slide-in-from-left duration-700">
              <div className="inline-block rounded-full bg-blue-500/20 px-4 py-2 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-300">
                  Built for modern tutoring
                </p>
              </div>
              <h2 className="text-5xl font-bold text-white leading-tight">
                Join EduSync
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  today.
                </span>
              </h2>
              <p className="max-w-md text-base text-blue-100/90 leading-relaxed">
                Give your learners clarity and accountability. EduSync connects
                weekly goals, assignments, and feedback in one streamlined flow.
              </p>
            </div>
            
            <div className="space-y-4 rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
              <div className="flex items-center gap-2">
                <div className="h-1 w-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">
                  A better onboarding experience
                </p>
              </div>
              <ul className="space-y-3 text-sm text-blue-100/90">
                <li className="flex items-center gap-3">
                  <span className="text-blue-400">✓</span>
                  <span>Invite co-tutors and guardians instantly</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-blue-400">✓</span>
                  <span>Keep sessions aligned with progress analytics</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-blue-400">✓</span>
                  <span>Automate nudges to keep every learner on track</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="flex w-full flex-1 flex-col justify-center px-6 py-16 sm:px-10 lg:px-20">
          <div className="w-full max-w-md mx-auto">
            <div className="space-y-5 text-left animate-in fade-in slide-in-from-right duration-700">
              <div className="inline-block rounded-full bg-blue-500/20 px-4 py-2 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-300">
                  Create your account
                </p>
              </div>
              <h1 className="text-4xl font-bold text-white sm:text-5xl leading-tight">
                Start syncing your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  learning journeys
                </span>
              </h1>
              <p className="text-base text-slate-300 leading-relaxed">
                Set up your profile to manage cohorts, track progress, and keep
                everyone aligned.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-12 space-y-6 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-slate-200"
                >
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 shadow-lg backdrop-blur-sm transition-all duration-200 focus:border-blue-500 focus:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-slate-600"
                  placeholder="Jordan Smith"
                />
              </div>

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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 shadow-lg backdrop-blur-sm transition-all duration-200 focus:border-blue-500 focus:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-blue-500/30 hover:border-slate-600"
                  placeholder="Create a secure password"
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

              {successMessage && (
                <div className="rounded-xl border border-emerald-500/50 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300 backdrop-blur-sm animate-in fade-in slide-in-from-top duration-300">
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>{successMessage}</span>
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
                      Creating account…
                    </>
                  ) : (
                    <>
                      Create account
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </>
                  )}
                </span>
              </button>
            </form>

            <p className="mt-10 text-center text-sm text-slate-400 animate-in fade-in duration-700 delay-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-blue-400 transition-all duration-200 hover:text-blue-300 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}