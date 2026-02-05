"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getAuthToken, clearAuthToken, decodeToken } from "@/lib/auth-client";
import Brand from "@/components/Brand";

export default function DashboardLayout({ children, role }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
      if (decoded.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (decoded.role === "FACULTY") {
        router.push("/faculty/dashboard");
      } else if (decoded.role === "STUDENT") {
        router.push("/student/dashboard");
      }
    }
  }, [router, role]);

  const handleLogout = () => {
    clearAuthToken();
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium animate-pulse">Synchronizing Knowva...</p>
        </div>
      </div>
    );
  }

  const navItems = [];
  if (user.role === "ADMIN") {
    navItems.push(
      { href: "/admin/dashboard", label: "Overview", icon: <DashboardIcon /> },
      { href: "/students", label: "Student Base", icon: <StudentsIcon /> },
      { href: "/admin/faculty", label: "Faculty Hub", icon: <FacultyIcon /> },
      { href: "/admin/courses", label: "Curriculum", icon: <CoursesIcon /> },
      { href: "/announcements", label: "Global News", icon: <AnnouncementsIcon /> },
      { href: "/profile", label: "Settings", icon: <ProfileIcon /> }
    );
  } else if (user.role === "FACULTY") {
    navItems.push(
      { href: "/faculty/dashboard", label: "Overview", icon: <DashboardIcon /> },
      { href: "/faculty/students", label: "My Students", icon: <StudentsIcon /> },
      { href: "/faculty/courses", label: "Course Load", icon: <CoursesIcon /> },
      { href: "/faculty/attendance", label: "Attendance", icon: <AttendanceIcon /> },
      { href: "/faculty/marks", label: "Gradebook", icon: <MarksIcon /> },
      { href: "/announcements", label: "Newsfeed", icon: <AnnouncementsIcon /> },
      { href: "/profile", label: "My Profile", icon: <ProfileIcon /> }
    );
  } else if (user.role === "STUDENT") {
    navItems.push(
      { href: "/student/dashboard", label: "My Dashboard", icon: <DashboardIcon /> },
      { href: "/student/courses", label: "My Learning", icon: <CoursesIcon /> },
      { href: "/student/attendance", label: "Records", icon: <AttendanceIcon /> },
      { href: "/student/marks", label: "My Grades", icon: <MarksIcon /> },
      { href: "/announcements", label: "Board", icon: <AnnouncementsIcon /> },
      { href: "/profile", label: "Student ID", icon: <ProfileIcon /> }
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <header className="h-20 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-[60]">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Brand size="md" />
            </Link>
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest hidden sm:inline-block">
              {user.role} Control
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold uppercase">
                {user.name.charAt(0)}
              </div>
              <span className="text-sm font-semibold text-slate-700">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full text-sm font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all active:scale-95"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 border-r border-slate-200 bg-white hidden lg:flex flex-col">
          <div className="flex-1 overflow-y-auto py-8 px-6">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 ml-4">Main Menu</p>
            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200 translate-x-1"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                  >
                    <div className={`${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"} transition-colors shrink-0`}>
                      {item.icon}
                    </div>
                    <span className="text-sm font-bold">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Support</p>
              <p className="text-xs text-slate-500 leading-relaxed">Need help? Contact our tech desk anytime.</p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 relative">
          <div className="mx-auto max-w-6xl relative z-10">
            {children}
          </div>

          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/20 rounded-full blur-[100px] -z-10 pointer-events-none" />
        </main>
      </div>
    </div>
  );
}

// Custom Icons for refined look
const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
);
const StudentsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);
const FacultyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
);
const CoursesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
);
const AnnouncementsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
);
const ProfileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const AttendanceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11"></polyline></svg>
);
const MarksIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);
