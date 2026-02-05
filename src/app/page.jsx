"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken, decodeToken } from "@/lib/auth-client";
import Brand from "@/components/Brand";

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
    <div className="min-h-screen bg-white text-[#0f172a] flex flex-col font-sans">
      {/* Navbar */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Brand size="lg" />
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
          <div className="md:hidden">
            {/* Mobile menu toggle would go here */}
            <Link href="/login" className="text-sm font-semibold text-blue-600">Login</Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60" />
            <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-50 rounded-full blur-[100px] opacity-50" />
          </div>

          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold mb-8 uppercase tracking-wider">
                  🚀 Next Generation Education
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-950 leading-[1.1] mb-8">
                  Empowering the future of <span className="text-blue-600">learning.</span>
                </h1>
                <p className="text-xl leading-relaxed text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0">
                  Knowva is an all-in-one ecosystem designed to bridge the gap between students, faculty, and administration with seamless collaboration tools.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link
                    href="/signup"
                    className="w-full sm:w-auto px-8 py-4 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0"
                  >
                    Start for free
                  </Link>
                  <Link
                    href="#features"
                    className="w-full sm:w-auto px-8 py-4 rounded-full border border-slate-200 bg-white text-slate-900 font-bold hover:bg-slate-50 transition-all"
                  >
                    See how it works
                  </Link>
                </div>

                <div className="mt-12 flex items-center justify-center lg:justify-start gap-4 grayscale opacity-50">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Trusted by leading institutions</span>
                </div>
              </div>

              <div className="flex-1 relative">
                <div className="relative z-10 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl overflow-hidden group">
                  <div className="aspect-[4/3] bg-slate-50 rounded-xl flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500">
                    <Brand size="lg" className="scale-150 opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent" />
                  </div>
                </div>
                {/* Decorative floating elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl animate-pulse" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl animate-pulse delay-700" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-slate-50/50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-20">
              <h2 className="text-blue-600 font-bold tracking-tight uppercase text-sm mb-4">Core Capabilities</h2>
              <p className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-6">
                Built for the modern institution
              </p>
              <p className="text-lg leading-relaxed text-slate-600">
                Forget bloated legacy software. Knowva delivers exactly what you need with an interface you'll actually love to use.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<UserIcon />}
                title="Student Portal"
                description="Everything for the student journey. Manage assignments, track grades, and stay on top of your schedule in one place."
                color="blue"
              />
              <FeatureCard
                icon={<AcademicCapIcon />}
                title="Faculty Tools"
                description="Powerful grading engines and attendance tracking. Focus more on teaching and less on administrative overhead."
                color="indigo"
              />
              <FeatureCard
                icon={<ChartBarIcon />}
                title="Admin Analytics"
                description="Data-driven decisions start here. Get high-level overviews of institutional performance and resource utilization."
                color="slate"
              />
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 bg-blue-600">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
              Ready to modernize your campus experience?
            </h2>
            <p className="text-blue-100 text-xl mb-12">
              Join hundreds of institutions already shaping the future of education with Knowva.
            </p>
            <Link
              href="/signup"
              className="inline-block px-10 py-5 rounded-full bg-white text-blue-600 font-black text-lg hover:bg-blue-50 transition-all shadow-2xl hover:scale-105 active:scale-95"
            >
              Get Started Now
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
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
    <div className="group bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
      <div className={`mb-8 w-14 h-14 rounded-2xl flex items-center justify-center ${colorMap[color] || colorMap.blue}`}>
        <div className="w-7 h-7">{icon}</div>
      </div>
      <h3 className="text-xl font-bold text-slate-950 mb-4 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      <p className="text-slate-600 leading-relaxed">
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

