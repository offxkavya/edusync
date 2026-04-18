"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  CheckCircle2, 
  PieChart, 
  ShieldCheck, 
  Zap, 
  Globe2, 
  GraduationCap, 
  Users, 
  Layout, 
  ChevronRight,
  Menu,
  X
} from "lucide-react";
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
        const routes = {
          ADMIN: "/admin/dashboard",
          FACULTY: "/faculty/dashboard",
          STUDENT: "/student/dashboard"
        };
        router.replace(routes[decoded.role]);
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#fdfdfe] text-slate-950 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* Navbar */}
      <header className="fixed top-0 w-full bg-white/70 backdrop-blur-xl border-b border-slate-100 z-[100]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Brand size="md" />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {["Features", "Enterprise", "Resources"].map((item) => (
              <Link 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
              >
                {item}
              </Link>
            ))}
            <div className="h-4 w-px bg-slate-200"></div>
            <Link href="/login" className="text-sm font-semibold text-slate-900">Log in</Link>
            <Link
              href="/signup"
              className="px-6 py-2.5 rounded-full bg-slate-950 text-white text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-900"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 shadow-2xl p-8 flex flex-col gap-6"
            >
              <Link onClick={() => setIsMenuOpen(false)} href="#features" className="text-lg font-bold">Features</Link>
              <Link onClick={() => setIsMenuOpen(false)} href="#about" className="text-lg font-bold">About</Link>
              <Link onClick={() => setIsMenuOpen(false)} href="/login" className="text-lg font-bold">Log in</Link>
              <Link
                onClick={() => setIsMenuOpen(false)}
                href="/signup"
                className="w-full text-center px-6 py-4 rounded-2xl bg-slate-900 text-white font-bold"
              >
                Get Started
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">
        {/* Post-Modern Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-56 lg:pb-40 overflow-hidden">
          {/* Background Decorations */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
            <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-slate-900/[0.03] rounded-full blur-[120px] animate-pulse-slow"></div>
            <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-slate-900/[0.02] rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100/50 border border-slate-200 text-slate-600 text-[11px] font-black uppercase tracking-widest mb-10 backdrop-blur-sm"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-900"></span>
                </span>
                The Future of Learning Management
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-slate-950 leading-[0.9] mb-8"
              >
                Orchestrate <br />
                <span className="text-slate-400">Education</span> with <br />
                <span className="relative">
                  Precision.
                  <svg className="absolute -bottom-4 left-0 w-full h-3 text-slate-200 -z-10" viewBox="0 0 200 20" fill="none" preserveAspectRatio="none">
                    <path d="M0 15C50 5 150 5 200 15" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
                  </svg>
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg sm:text-xl leading-relaxed text-slate-500 mb-12 max-w-2xl font-medium"
              >
                EduSync is the high-performance infrastructure for modern academic institutions. A unified ecosystem for students, faculty, and administration.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
              >
                <Link
                  href="/signup"
                  className="w-full sm:w-auto px-10 py-5 rounded-full bg-slate-950 text-white font-bold hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/20 text-center flex items-center justify-center gap-2 group"
                >
                  Get Started for Free
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#features"
                  className="w-full sm:w-auto px-10 py-5 rounded-full border border-slate-200 bg-white text-slate-900 font-bold hover:bg-slate-50 transition-all text-center flex items-center justify-center gap-2"
                >
                  Explore Platform
                </Link>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 0.6 }}
                className="mt-20 pt-10 border-t border-slate-100 w-full max-w-xl"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Built for Innovative Institutions</p>
                <div className="flex justify-between items-center px-4 grayscale opacity-60">
                   <span className="text-xl font-black italic tracking-tighter">VERSO</span>
                   <span className="text-xl font-black tracking-widest">KINETIC</span>
                   <span className="text-xl font-bold font-serif italic">Nova</span>
                   <span className="text-xl font-medium uppercase tracking-[0.2em]">Orizon</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Dynamic Interface Showcase */}
        <section className="py-20 bg-slate-50 overflow-hidden relative">
           <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
              <div className="relative mx-auto max-w-5xl rounded-[32px] overflow-hidden border border-slate-200 bg-white shadow-[0_32px_128px_-32px_rgba(0,0,0,0.1)] group">
                 <div className="h-14 border-b border-slate-100 bg-slate-50/50 flex items-center px-6 gap-3">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                      <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                    </div>
                    <div className="h-6 w-48 bg-slate-200/50 rounded-full mx-auto"></div>
                 </div>
                 <div className="aspect-[16/10] bg-white p-10 flex gap-10">
                    <div className="w-64 border-r border-slate-50 space-y-8 pr-10">
                       <div className="h-8 w-24 bg-slate-100 rounded-lg"></div>
                       <div className="space-y-4">
                          {[1,2,3,4,5].map(i => (
                             <div key={i} className={`h-4 w-full rounded flex items-center gap-3 ${i===1 ? 'bg-slate-900/10' : 'bg-slate-50'}`}>
                                <div className="w-4 h-4 rounded ml-2 bg-slate-200"></div>
                             </div>
                          ))}
                       </div>
                    </div>
                    <div className="flex-1 space-y-10">
                       <div className="flex gap-6">
                          <div className="h-32 flex-1 rounded-3xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between">
                             <div className="w-8 h-8 rounded-full bg-white/10"></div>
                             <div className="h-4 w-1/2 bg-white/20 rounded"></div>
                          </div>
                          <div className="h-32 flex-1 rounded-3xl bg-slate-50 border border-slate-100 p-6 flex flex-col justify-between">
                             <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                             <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
                          </div>
                       </div>
                       <div className="flex-1 rounded-3xl bg-slate-50 border border-slate-100 p-8">
                          <div className="h-6 w-1/4 bg-slate-200 rounded mb-10"></div>
                          <div className="space-y-4">
                             {[1,2,3].map(i => (
                                <div key={i} className="h-4 w-full bg-slate-100 rounded-lg"></div>
                             ))}
                             <div className="h-4 w-2/3 bg-slate-100 rounded-lg"></div>
                          </div>
                       </div>
                    </div>
                 </div>
                 {/* Floating Label */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-700 group-hover:scale-110">
                    <div className="px-8 py-4 bg-white shadow-2xl rounded-2xl border border-slate-100 flex items-center gap-4">
                       <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center text-white">
                          <GraduationCap size={24} />
                       </div>
                       <div className="text-left">
                          <p className="text-xs font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Live Dashboard</p>
                          <p className="text-lg font-bold text-slate-950 leading-none">EduSync Core UI</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
           <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white to-transparent -z-10"></div>
        </section>

        {/* Feature Grid - Non-Linear */}
        <section id="features" className="py-32 lg:py-48 bg-white overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
              <div className="lg:col-span-4 sticky top-40">
                <p className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6">Core Infrastructure</p>
                <h2 className="text-5xl font-black text-slate-950 leading-[0.9] mb-8">
                  Built for the <br /> modern <br /> <span className="text-slate-400 italic font-serif">ecosystem.</span>
                </h2>
                <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10">
                  We've engineered every component to ensure maximum reliability and institutional continuity.
                </p>
                <div className="flex flex-col gap-6">
                   <div className="flex items-center gap-4 text-slate-900 font-bold">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center"><CheckCircle2 size={14} /></div>
                      Institutional Resilience
                   </div>
                   <div className="flex items-center gap-4 text-slate-900 font-bold">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center"><CheckCircle2 size={14} /></div>
                      Grade-One Security
                   </div>
                   <div className="flex items-center gap-4 text-slate-900 font-bold">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center"><CheckCircle2 size={14} /></div>
                      Real-Time Synchronization
                   </div>
                </div>
              </div>

              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <FeatureMetric 
                  icon={<GraduationCap />}
                  title="Academic Portal"
                  value="100%"
                  desc="Unified student access to coursework, grades, and attendance."
                />
                <FeatureMetric 
                  icon={<Users />}
                  title="Faculty Stack"
                  value="24/7"
                  desc="Precision tools for educators to manage large-scale cohorts."
                />
                <FeatureMetric 
                  icon={<PieChart />}
                  title="Neural Analytics"
                  value="Real-time"
                  desc="Data-driven insights into institutional engagement metrics."
                />
                <FeatureMetric 
                  icon={<ShieldCheck />}
                  title="Sovereign Data"
                  value="AES-256"
                  desc="Security that meets the world's most rigorous standards."
                />
                <FeatureMetric 
                  icon={<Zap />}
                  title="Instant Sync"
                  value="<50ms"
                  desc="Asynchronous processing ensures zero operational latency."
                />
                <FeatureMetric 
                  icon={<Globe2 />}
                  title="Edge Network"
                  value="Global"
                  desc="Distributed infrastructure for low-latency worldwide access."
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Minimalist */}
        <section className="py-40 bg-slate-950 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-30">
             <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/[0.03] rounded-full blur-[150px]"></div>
             <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[120px]"></div>
          </div>
          <div className="mx-auto max-w-4xl px-6 text-center">
             <motion.div 
               whileInView={{ opacity: 1, scale: 1 }}
               initial={{ opacity: 0, scale: 0.9 }}
               className="flex flex-col items-center"
             >
                <div className="w-20 h-20 bg-white rounded-3xl mb-12 flex items-center justify-center shadow-2xl">
                   <Brand size="lg" theme="dark" className="!gap-0" />
                </div>
                <h2 className="text-4xl sm:text-6xl font-black text-white leading-none mb-10">
                  Ready to upgrade your institutional stack?
                </h2>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                   <Link
                    href="/signup"
                    className="px-12 py-6 rounded-full bg-white text-slate-950 font-black text-lg hover:bg-slate-100 transition-all flex items-center gap-3 group"
                  >
                    Start Deployment
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </Link>
                  <Link href="#contact" className="text-white font-bold border-b-2 border-white/20 hover:border-white transition-all pb-1">
                    Request Demo
                  </Link>
                </div>
             </motion.div>
          </div>
        </section>
      </main>

      {/* Footer - Professional & Dense */}
      <footer className="bg-white border-t border-slate-100 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 lg:gap-20 mb-20">
            <div className="col-span-2">
              <Brand size="md" className="mb-8" />
              <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs">
                Orchestrating academic excellence through precision engineering and human-centric design.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-950 mb-6">Product</h4>
              <ul className="space-y-4 text-sm font-semibold text-slate-500">
                <li><Link href="#" className="hover:text-slate-950 transition-colors">Infrastructure</Link></li>
                <li><Link href="#" className="hover:text-slate-950 transition-colors">Analytics</Link></li>
                <li><Link href="#" className="hover:text-slate-950 transition-colors">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-950 mb-6">Company</h4>
              <ul className="space-y-4 text-sm font-semibold text-slate-500">
                <li><Link href="#" className="hover:text-slate-950 transition-colors">Institutional</Link></li>
                <li><Link href="#" className="hover:text-slate-950 transition-colors">Research</Link></li>
                <li><Link href="#" className="hover:text-slate-950 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-950 mb-6">Legal</h4>
              <ul className="space-y-4 text-sm font-semibold text-slate-500">
                <li><Link href="#" className="hover:text-slate-950 transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-slate-950 transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-slate-950 transition-colors">Trust</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs font-bold text-slate-400">
              &copy; {new Date().getFullYear()} EduSync Systems Inc. All rights reserved.
            </p>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
               <span className="flex items-center gap-2 cursor-pointer hover:text-slate-950"><Globe2 size={12}/> Global (EN)</span>
               <span className="cursor-pointer hover:text-slate-950">System Status: Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureMetric({ icon, title, value, desc }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-10 rounded-[40px] bg-slate-50 border border-slate-100 flex flex-col items-start text-left group transition-all hover:bg-white hover:shadow-2xl hover:shadow-slate-900/5 hover:border-slate-200"
    >
      <div className="w-14 h-14 rounded-2xl bg-white shadow-lg shadow-slate-900/5 mb-10 flex items-center justify-center text-slate-900 group-hover:bg-slate-950 group-hover:text-white transition-all">
        {icon}
      </div>
      <div>
        <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-2 leading-none">{title}</p>
        <p className="text-4xl font-black text-slate-950 tracking-tighter mb-4 leading-none">{value}</p>
        <p className="text-slate-500 font-medium text-sm leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}
