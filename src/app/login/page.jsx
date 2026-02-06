"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken, saveAuthToken, decodeToken } from "@/lib/auth-client";
import Brand from "@/components/Brand";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const existingToken = getAuthToken();
    if (existingToken) {
      const decoded = decodeToken(existingToken);
      if (decoded?.role) {
        if (decoded.role === "ADMIN") {
          router.replace("/admin/dashboard");
        } else if (decoded.role === "FACULTY") {
          router.replace("/faculty/dashboard");
        } else if (decoded.role === "STUDENT") {
          router.replace("/student/dashboard");
        } else {
          router.replace("/dashboard");
        }
      }
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
        saveAuthToken(data.token);
        // Redirect based on role
        const role = data.user?.role;
        if (role === "ADMIN") {
          router.push("/admin/dashboard");
        } else if (role === "FACULTY") {
          router.push("/faculty/dashboard");
        } else if (role === "STUDENT") {
          router.push("/student/dashboard");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-1 bg-[#F5FEFE] font-sans">
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:flex-none lg:px-20 xl:px-24 bg-white shadow-2xl z-10 transition-all">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Link href="/" className="mb-12 block hover:opacity-80 transition-opacity">
              <Brand size="lg" />
            </Link>
            <h2 className="text-3xl font-extrabold tracking-tight text-primary mb-2">
              Welcome back.
            </h2>
            <p className="text-sm font-medium text-slate-500 mb-10">
              New to Knowva?{" "}
              <Link
                href="/signup"
                className="font-bold text-[#FF7A0F] hover:text-[#FF7A0F]/80 underline underline-offset-4 decoration-[#FF7A0F]/20 transition-all"
              >
                Create an account for free
              </Link>
            </p>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-400 ml-1"
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
                  className="block w-full rounded-2xl border-[#d1e9e9] bg-[#F5FEFE] py-3.5 shadow-sm focus:border-accent focus:ring-accent sm:text-sm px-4 text-primary transition-all outline-none"
                  placeholder="name@institution.edu"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-400 ml-1"
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
                  className="block w-full rounded-2xl border-[#d1e9e9] bg-[#F5FEFE] py-3.5 shadow-sm focus:border-accent focus:ring-accent sm:text-sm px-4 text-primary transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-between px-1">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-secondary"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm font-medium text-slate-600"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    href="#"
                    className="font-bold text-secondary hover:text-secondary/80 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {error && (
                <div className="rounded-2xl bg-red-50 p-4 border border-red-100 flex gap-3">
                  <svg className="h-5 w-5 text-red-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm font-bold text-red-700">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full justify-center rounded-2xl bg-primary px-6 py-4 text-sm font-bold text-white shadow-xl shadow-primary/20 hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
              >
                {isSubmitting ? "Authenticating..." : "Sign in to Dashboard"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="relative hidden w-0 flex-1 lg:block overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-[radial-gradient(#1e406d_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
        <div className="absolute inset-0 flex flex-col justify-center items-center p-20 text-center z-10">
          <div className="mb-12 w-24 h-24 rounded-[2rem] bg-secondary shadow-2xl shadow-secondary/50 flex items-center justify-center text-white scale-125">
            <Brand size="lg" theme="light" className="scale-150" />
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white mb-8 max-w-lg leading-tight">
            Precision <span className="text-secondary">management.</span>
          </h1>
          <p className="text-xl leading-relaxed text-[#F5FEFE]/80 max-w-md font-medium">
            Join the elite circle of institutions leveraging Knowva to harmonize administrative workflows and student engagement.
          </p>
        </div>
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-accent/10 rounded-full blur-[80px]" />
      </div>
    </div>
  );
}