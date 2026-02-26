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
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/10 selection:text-primary">
      {/* Navbar */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-border z-[100]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Brand size="md" />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Features</Link>
            <Link href="#about" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">About</Link>
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Log in</Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all shadow-sm active:scale-95"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Mobile Menu Backdrop */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-border shadow-md p-6 flex flex-col gap-4">
            <Link onClick={() => setIsMenuOpen(false)} href="#features" className="text-base font-medium text-slate-900 border-b border-slate-100 pb-3">Features</Link>
            <Link onClick={() => setIsMenuOpen(false)} href="#about" className="text-base font-medium text-slate-900 border-b border-slate-100 pb-3">About</Link>
            <Link onClick={() => setIsMenuOpen(false)} href="/login" className="text-base font-medium text-slate-900 border-b border-slate-100 pb-3">Log in</Link>
            <Link
              onClick={() => setIsMenuOpen(false)}
              href="/signup"
              className="w-full text-center px-4 py-3 rounded-md bg-primary text-primary-foreground font-medium shadow-sm mt-2"
            >
              Get Started
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-32 overflow-hidden bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-8 border border-slate-200">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  Institutional Management, Simplified
                </div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-slate-900 leading-[1.1] mb-6">
                  The infrastructure for <br className="hidden lg:block" />
                  <span className="text-primary">modern education.</span>
                </h1>
                <p className="text-lg sm:text-xl leading-relaxed text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0">
                  Knowva provides a complete, unified platform connecting students, faculty, and administration through precision engineering and intuitive design.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link
                    href="/signup"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all shadow-sm text-center"
                  >
                    Start for free
                  </Link>
                  <Link
                    href="#features"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-md border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-all text-center"
                  >
                    Explore Platform
                  </Link>
                </div>

                <div className="mt-14 pt-8 border-t border-slate-100 hidden lg:block">
                  <p className="text-sm text-slate-500 mb-4">Trusted by innovative institutions</p>
                  <div className="flex gap-8 opacity-40 grayscale">
                    {/* Placeholder logos */}
                    <div className="h-6 w-24 bg-slate-300 rounded"></div>
                    <div className="h-6 w-32 bg-slate-300 rounded"></div>
                    <div className="h-6 w-20 bg-slate-300 rounded"></div>
                  </div>
                </div>
              </div>

              <div className="flex-1 order-1 lg:order-2 w-full max-w-lg lg:max-w-none perspective-1000">
                <div className="relative rounded-2xl border border-border bg-white shadow-2xl overflow-hidden transform rotate-y-[-5deg] rotate-x-[5deg] transition-transform hover:rotate-0 duration-700">
                  {/* Mock UI Header */}
                  <div className="h-12 border-b border-border bg-slate-50 flex items-center px-4 gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                    </div>
                  </div>
                  {/* Mock UI Body */}
                  <div className="p-6 bg-white aspect-[4/3] flex flex-col gap-4">
                    <div className="flex gap-4">
                      <div className="h-24 flex-1 rounded-xl bg-slate-50 border border-slate-100 p-4">
                        <div className="h-3 w-1/3 bg-slate-200 rounded mb-4"></div>
                        <div className="h-8 w-1/2 bg-primary/20 rounded"></div>
                      </div>
                      <div className="h-24 flex-1 rounded-xl bg-slate-50 border border-slate-100 p-4">
                        <div className="h-3 w-1/3 bg-slate-200 rounded mb-4"></div>
                        <div className="h-8 w-1/2 bg-slate-200 rounded"></div>
                      </div>
                    </div>
                    <div className="flex-1 rounded-xl bg-slate-50 border border-slate-100 p-4">
                      <div className="h-4 w-1/4 bg-slate-200 rounded mb-6"></div>
                      <div className="space-y-3">
                        <div className="h-3 w-full bg-slate-100 rounded"></div>
                        <div className="h-3 w-full bg-slate-100 rounded"></div>
                        <div className="h-3 w-5/6 bg-slate-100 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Standard Grid */}
        <section id="features" className="py-24 bg-slate-50 border-t border-border">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16 lg:mb-20">
              <h2 className="text-primary font-semibold tracking-wide uppercase text-sm mb-3">Core Platform</h2>
              <p className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl mb-4">
                Everything you need to manage education.
              </p>
              <p className="text-lg text-slate-600 max-w-xl mx-auto">
                A highly secure, reliable, and scalable foundation built for the needs of students, faculty, and administrators.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<StudentIcon />}
                title="Student Gateway"
                description="A streamlined portal for assignments, grades, attendance tracking, and frictionless communication with educators."
              />
              <FeatureCard
                icon={<FacultyIcon />}
                title="Faculty Operations"
                description="Powerful tools for automated grading pipelines, syllabus management, and real-time student performance analytics."
              />
              <FeatureCard
                icon={<AdminIcon />}
                title="Administrative Control"
                description="Centralized oversight for curriculum planning, role-based access control, and campus-wide announcements."
              />
              <FeatureCard
                icon={<AnalyticsIcon />}
                title="Actionable Insights"
                description="Data-driven dashboards that provide instant visibility into cohort metrics, attrition rates, and engagement."
              />
              <FeatureCard
                icon={<SecurityIcon />}
                title="Enterprise Security"
                description="Bank-grade encryption, secure session management, and robust infrastructure ensuring your data remains protected."
              />
              <FeatureCard
                icon={<IntegrationIcon />}
                title="Seamless Ecosystem"
                description="Designed to work harmoniously across all devices with instant synchronization and a responsive architecture."
              />
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 lg:py-24 bg-white border-t border-slate-100">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 mb-6">
              Ready to upgrade your infrastructure?
            </h2>
            <p className="text-slate-600 text-lg mb-10 max-w-2xl mx-auto">
              Join leading institutions deploying Knowva to orchestrate their academic environments with precision.
            </p>
            <Link
              href="/signup"
              className="inline-block px-8 py-4 rounded-md bg-primary text-white font-medium text-lg hover:bg-primary/90 transition-all shadow-sm"
            >
              Start Deployment
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <Brand size="sm" />
            <div className="flex gap-6 text-sm text-slate-500">
              <Link href="#" className="hover:text-slate-900 transition-colors">Documentation</Link>
              <Link href="#" className="hover:text-slate-900 transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} Knowva Systems. All rights reserved.
            </p>
            <div className="flex gap-4">
              {/* Social placeholders */}
              <div className="w-5 h-5 rounded bg-slate-300"></div>
              <div className="w-5 h-5 rounded bg-slate-300"></div>
              <div className="w-5 h-5 rounded bg-slate-300"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-8 rounded-xl border border-border shadow-sm hover:shadow-md transition-all">
      <div className="mb-6 w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 text-slate-700 flex items-center justify-center">
        <div className="w-6 h-6">{icon}</div>
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        {title}
      </h3>
      <p className="text-slate-600 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
}

// Clean SVG Icons
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
)

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const StudentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.499 5.24 50.552 50.552 0 00-2.658.814m-15.482 0A50.55 50.55 0 0112 13.489a50.55 50.55 0 0112-4.152M2.25 12h19.5" />
  </svg>
)

const FacultyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
)

const AdminIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
)

const AnalyticsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
)

const SecurityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
)

const IntegrationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
  </svg>
)
