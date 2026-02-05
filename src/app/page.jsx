"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken, decodeToken } from "@/lib/auth-client";
import Brand from "@/components/Brand";

export default function Home() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <div className="min-h-screen bg-white text-[#0f172a] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navbar */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-[100]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Brand size="lg" />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Features</Link>
            <Link href="#about" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">About</Link>
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Log in</Link>
            <Link
              href="/signup"
              className="px-5 py-2.5 rounded-full bg-[#020617] text-white text-sm font-semibold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-blue-600 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Mobile Menu Backdrop */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 shadow-xl p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-5 duration-200">
            <Link onClick={() => setIsMenuOpen(false)} href="#features" className="text-lg font-semibold text-slate-900 border-b border-slate-50 pb-2">Features</Link>
            <Link onClick={() => setIsMenuOpen(false)} href="#about" className="text-lg font-semibold text-slate-900 border-b border-slate-50 pb-2">About</Link>
            <Link onClick={() => setIsMenuOpen(false)} href="/login" className="text-lg font-semibold text-slate-900 border-b border-slate-50 pb-2">Log in</Link>
            <Link
              onClick={() => setIsMenuOpen(false)}
              href="/signup"
              className="w-full text-center px-6 py-4 rounded-xl bg-blue-600 text-white font-bold shadow-lg mt-2"
            >
              Get Started
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative pt-12 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[80%] lg:w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60" />
            <div className="absolute bottom-[20%] right-[-10%] w-[60%] lg:w-[30%] h-[30%] bg-indigo-50 rounded-full blur-[100px] opacity-50" />
          </div>

          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] sm:text-xs font-bold mb-6 lg:mb-8 uppercase tracking-wider">
                  🚀 Next Generation Education
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-slate-950 leading-[1.1] mb-6 lg:mb-8">
                  Empowering the future of <span className="text-blue-600">learning.</span>
                </h1>
                <p className="text-lg sm:text-xl leading-relaxed text-slate-600 mb-8 lg:mb-10 max-w-2xl mx-auto lg:mx-0">
                  Knowva is an all-in-one ecosystem designed to bridge the gap between students, faculty, and administration with seamless collaboration tools.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link
                    href="/signup"
                    className="w-full sm:w-auto px-8 py-4 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 text-center"
                  >
                    Start for free
                  </Link>
                  <Link
                    href="#features"
                    className="w-full sm:w-auto px-8 py-4 rounded-full border border-slate-200 bg-white text-slate-900 font-bold hover:bg-slate-50 transition-all text-center"
                  >
                    See how it works
                  </Link>
                </div>

                <div className="mt-12 flex items-center justify-center lg:justify-start gap-4 grayscale opacity-50">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Trusted by leading institutions</span>
                </div>
              </div>

              <div className="flex-1 relative order-1 lg:order-2 w-full max-w-lg lg:max-w-none">
                <div className="relative z-10 rounded-3xl border border-slate-100 bg-white p-2 sm:p-4 shadow-2xl overflow-hidden group">
                  <div className="aspect-[4/3] bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-700">
                    <Brand size="lg" className="scale-125 sm:scale-150 opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent" />
                    {/* Mock UI Elements */}
                    <div className="absolute top-4 left-4 right-4 h-6 rounded bg-slate-200/50" />
                    <div className="absolute top-14 left-4 w-2/3 h-4 rounded bg-slate-200/50" />
                    <div className="absolute top-22 left-4 right-4 h-20 rounded bg-slate-100/50" />
                  </div>
                </div>
                {/* Decorative floating elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl animate-pulse" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl animate-pulse delay-700" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Bento Grid Layout */}
        <section id="features" className="py-24 bg-white/40 backdrop-blur-sm border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16 lg:mb-24">
              <h2 className="text-blue-600 font-bold tracking-tight uppercase text-xs sm:text-sm mb-4">Core Ecosystem</h2>
              <p className="text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl mb-6">
                Redefining the <br className="hidden sm:block" /> institutional <span className="text-blue-600">standard.</span>
              </p>
              <p className="text-lg leading-relaxed text-slate-600 max-w-xl mx-auto">
                Discover a suite of tools designed to harmonize education through precision engineering and human-centric design.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 grid-rows-none md:grid-rows-2 gap-4 h-auto md:h-[600px]">
              {/* Feature 1: Large Bento Card */}
              <div className="md:col-span-3 md:row-span-2 group relative bg-white p-8 lg:p-12 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden flex flex-col justify-between">
                <div className="relative z-10">
                  <div className="mb-8 w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <UserIcon />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-950 mb-6 group-hover:text-blue-600 transition-colors">
                    Student Portal
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-lg max-w-md">
                    A comprehensive cockpit for the modern learner. From real-time grades to interactive course materials, everything is accessible in a single, unified interface.
                  </p>
                </div>
                {/* Visual decoration for the large card */}
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700" />
                <div className="relative z-10 mt-8 flex gap-2">
                  <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase">Live Tracking</span>
                  <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase">Interactive</span>
                </div>
              </div>

              {/* Feature 2: Wide Bento Card */}
              <div className="md:col-span-3 md:row-span-1 group bg-indigo-600 p-8 rounded-[2rem] shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col sm:flex-row items-center gap-8 overflow-hidden">
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Faculty Tools
                  </h3>
                  <p className="text-indigo-100 leading-relaxed text-sm">
                    Empowering educators with automated grading and seamless attendance workflows.
                  </p>
                </div>
                <div className="w-20 h-20 shrink-0 bg-white/10 rounded-2xl flex items-center justify-center text-white backdrop-blur-md">
                  <div className="w-10 h-10"><AcademicCapIcon /></div>
                </div>
              </div>

              {/* Feature 3: Small Bento Card A */}
              <div className="md:col-span-1 md:row-span-1 group bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 text-blue-600 mb-4 h-12 w-12"><ChartBarIcon /></div>
                <h4 className="font-bold text-slate-950 text-sm">Analytics</h4>
              </div>

              {/* Feature 4: Small Bento Card B */}
              <div className="md:col-span-2 md:row-span-1 group bg-slate-950 p-8 rounded-[2rem] shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col justify-end relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20 text-white">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="20" fill="currentColor" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Admin Control</h3>
                <p className="text-slate-400 text-xs">High-level institutional management.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 lg:py-24 bg-blue-600">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-6 lg:mb-8">
              Ready to modernize your campus experience?
            </h2>
            <p className="text-blue-100 text-lg lg:text-xl mb-10 lg:mb-12">
              Join hundreds of institutions already shaping the future of education with Knowva.
            </p>
            <Link
              href="/signup"
              className="inline-block px-8 py-4 lg:px-10 lg:py-5 rounded-full bg-white text-blue-600 font-black text-lg hover:bg-blue-50 transition-all shadow-2xl hover:scale-105 active:scale-95"
            >
              Get Started Now
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8 lg:mb-12">
            <Brand size="md" />
            <div className="flex gap-8 text-sm font-medium text-slate-500">
              <Link href="#" className="hover:text-blue-600">Privacy</Link>
              <Link href="#" className="hover:text-blue-600">Terms</Link>
              <Link href="#" className="hover:text-blue-600">Contact</Link>
            </div>
          </div>
          <div className="border-t border-slate-50 pt-8 text-center md:text-left">
            <p className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} Knowva Inc. Designed for the future of education.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    indigo: "bg-indigo-50 text-indigo-600",
    slate: "bg-slate-100 text-slate-900",
  };

  return (
    <div className="group bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
      <div className={`mb-6 sm:mb-8 w-14 h-14 rounded-2xl flex items-center justify-center ${colorMap[color] || colorMap.blue}`}>
        <div className="w-7 h-7">{icon}</div>
      </div>
      <h3 className="text-xl font-bold text-slate-950 mb-3 sm:mb-4 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
        {description}
      </p>
    </div>
  );
}

// Simple icons
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
)

const AcademicCapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.499 5.24 50.552 50.552 0 00-2.658.814m-15.482 0A50.55 50.55 0 0112 13.489a50.55 50.55 0 0112-4.152M2.25 12h19.5" />
  </svg>
)

const ChartBarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
)

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
)

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)
