"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken, decodeToken } from "@/lib/auth-client";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      const decoded = decodeToken(token);
      if (decoded?.role) {
        if (decoded.role === "ADMIN") {
          router.replace("/admin/dashboard");
        } else if (decoded.role === "FACULTY") {
          router.replace("/faculty/dashboard");
        } else if (decoded.role === "STUDENT") {
          router.replace("/student/dashboard");
        }
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.15),transparent_50%)]" />
      
      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-8">
        <header className="flex items-center justify-between mb-16">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            EduSync
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800 transition"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 transition"
            >
              Get Started
            </Link>
          </div>
        </header>

        <main className="text-center space-y-8 py-20">
          <h2 className="text-5xl md:text-6xl font-bold leading-tight">
            EduSync
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              College Management System
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Streamline college operations with a centralized platform for students, faculty, and administrators.
            Manage attendance, marks, courses, and announcements all in one place.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-500 hover:to-purple-500 transition shadow-lg"
            >
              Create Account
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 rounded-xl border border-slate-700 bg-slate-800/50 text-white font-semibold hover:bg-slate-800 transition"
            >
              Sign In
            </Link>
          </div>
        </main>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          <FeatureCard
            icon="👥"
            title="Student Management"
            description="Comprehensive student profiles with enrollment tracking and academic records"
          />
          <FeatureCard
            icon="👨‍🏫"
            title="Faculty Dashboard"
            description="Easy attendance marking, marks upload, and course management tools"
          />
          <FeatureCard
            icon="📊"
            title="Admin Control"
            description="Full system oversight with analytics, user management, and course administration"
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 backdrop-blur-sm">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  );
}
