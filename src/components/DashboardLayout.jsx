"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  UserRoundCheck, 
  BookOpen, 
  BellRing, 
  UserCircle, 
  CalendarCheck, 
  FileText, 
  LogOut, 
  ChevronLeft, 
  Menu,
  HelpCircle
} from "lucide-react";
import { getAuthToken, clearAuthToken, decodeToken } from "@/lib/auth-client";
import Brand from "@/components/Brand";

export default function DashboardLayout({ children, role }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      return;
    }

    const decoded = decodeToken(token);
    if (!decoded || !decoded.role) {
      router.push("/login");
      return;
    }

    setUser(decoded);

    // Redirect if wrong role
    if (role && decoded.role !== role) {
      const routes = {
        ADMIN: "/admin/dashboard",
        FACULTY: "/faculty/dashboard",
        STUDENT: "/student/dashboard"
      };
      router.push(routes[decoded.role] || "/login");
    }
  }, [router, role]);

  const handleLogout = () => {
    clearAuthToken();
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfdfe]">
        <div className="flex flex-col items-center gap-6">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full"
          />
          <p className="text-slate-500 font-medium animate-pulse font-heading">Synchronizing EduSync...</p>
        </div>
      </div>
    );
  }

  const navItems = [];
  if (user.role === "ADMIN") {
    navItems.push(
      { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
      { href: "/students", label: "Student Base", icon: Users },
      { href: "/admin/faculty", label: "Faculty Hub", icon: UserRoundCheck },
      { href: "/admin/courses", label: "Curriculum", icon: BookOpen },
      { href: "/announcements", label: "Global News", icon: BellRing },
      { href: "/profile", label: "Settings", icon: UserCircle }
    );
  } else if (user.role === "FACULTY") {
    navItems.push(
      { href: "/faculty/dashboard", label: "Overview", icon: LayoutDashboard },
      { href: "/faculty/students", label: "My Students", icon: Users },
      { href: "/faculty/courses", label: "Course Load", icon: BookOpen },
      { href: "/faculty/attendance", label: "Attendance", icon: CalendarCheck },
      { href: "/faculty/marks", label: "Gradebook", icon: FileText },
      { href: "/announcements", label: "Newsfeed", icon: BellRing },
      { href: "/profile", label: "My Profile", icon: UserCircle }
    );
  } else if (user.role === "STUDENT") {
    navItems.push(
      { href: "/student/dashboard", label: "My Dashboard", icon: LayoutDashboard },
      { href: "/student/courses", label: "My Learning", icon: BookOpen },
      { href: "/student/attendance", label: "Records", icon: CalendarCheck },
      { href: "/student/marks", label: "My Grades", icon: FileText },
      { href: "/announcements", label: "Board", icon: BellRing },
      { href: "/profile", label: "Student ID", icon: UserCircle }
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfdfe] text-slate-950 flex font-sans overflow-hidden">
      {/* Sidebar - Desktop */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 88 }}
        className="hidden lg:flex flex-col border-r border-slate-200 bg-white relative z-50 overflow-hidden"
      >
        <div className="h-24 px-6 flex items-center justify-between overflow-hidden">
          <AnimatePresence mode="wait">
            {isSidebarOpen ? (
              <motion.div
                key="full-logo"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <Brand size="md" />
              </motion.div>
            ) : (
              <motion.div
                key="short-logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-white font-black"
              >
                E
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 px-3 py-6 overflow-y-auto">
          <p className={`text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 px-4 transition-opacity ${isSidebarOpen ? "opacity-100" : "opacity-0"}`}>
            Main Menu
          </p>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative overflow-hidden ${isActive
                    ? "bg-slate-950 text-white shadow-xl shadow-slate-900/10"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                >
                  <Icon size={20} className={`shrink-0 ${isActive ? "text-white" : "group-hover:text-slate-900"}`} />
                  {isSidebarOpen && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm font-semibold tracking-tight whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                  {isActive && !isSidebarOpen && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100">
           {isSidebarOpen ? (
             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <HelpCircle size={14} className="text-slate-400" />
                  Technical Support
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                  Need help with the platform?<br />Our desk is open 24/7.
                </p>
                <button className="w-full py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-100 transition-colors">
                  Contact Desk
                </button>
             </div>
           ) : (
             <button className="w-full aspect-square flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
                <HelpCircle size={20} />
             </button>
           )}
        </div>

        {/* Toggle Button */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-28 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-sm z-[60] transition-colors"
        >
          <ChevronLeft size={14} className={`transition-transform duration-300 ${isSidebarOpen ? "" : "rotate-180"}`} />
        </button>
      </motion.aside>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-24 border-b border-slate-100 bg-white/80 backdrop-blur-xl sticky top-0 z-40 shrink-0">
          <div className="h-full px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
              >
                <Menu size={24} />
              </button>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col">
                  <h1 className="text-xl font-bold text-slate-950 font-heading tracking-tight capitalize">
                    {pathname.split('/').pop()?.replace('-', ' ')}
                  </h1>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                    {user.role} Control Center
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-4 py-1.5 px-1.5 pr-4 rounded-full bg-slate-50 border border-slate-100">
                <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-xs text-white font-bold shadow-lg shadow-slate-900/20">
                  {user.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900 leading-none mb-0.5">{user.name}</span>
                  <span className="text-[10px] text-slate-500 font-medium leading-none">Standard Access</span>
                </div>
              </div>

              <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all group"
              >
                <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 lg:p-12 bg-[#fdfdfe] relative custom-scrollbar">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mx-auto max-w-7xl relative z-10"
          >
            {children}
          </motion.div>
          
          {/* Subtle Background Elements */}
          <div className="fixed top-1/4 right-0 w-[500px] h-[500px] bg-slate-900/[0.02] rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
          <div className="fixed bottom-0 left-1/4 w-[400px] h-[400px] bg-slate-900/[0.015] rounded-full blur-[100px] -z-10 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-[80%] max-w-xs bg-white z-[101] lg:hidden flex flex-col p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-10">
                <Brand size="md" />
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400">
                  <ChevronLeft size={24} />
                </button>
              </div>
              <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                        ? "bg-slate-950 text-white"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                    >
                      <Icon size={20} />
                      <span className="text-sm font-semibold">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
              <button
                onClick={handleLogout}
                className="mt-6 flex items-center justify-center gap-2 w-full py-4 rounded-xl text-sm font-bold text-red-600 bg-red-50"
              >
                <LogOut size={18} />
                Logout
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
