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
    <div className="min-h-screen bg-background text-primary flex flex-col font-sans">
      {/* Header */}
      <header className="h-20 border-b border-border bg-white/80 backdrop-blur-md sticky top-0 z-[60]">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Brand size="md" />
            </Link>
            <div className="h-6 w-px bg-border hidden sm:block"></div>
            <span className="text-xs font-bold text-secondary uppercase tracking-widest hidden sm:inline-block">
              {user.role} Control
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-50 border border-border shadow-sm relative">
              <div className="absolute top-0 right-0 w-3 h-3 bg-accent rounded-full border-2 border-white -mr-1 -mt-1 scale-110 animate-pulse"></div>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-[10px] text-white font-bold uppercase shadow-lg shadow-primary/20">
                {user.name.charAt(0)}
              </div>
              <span className="text-sm font-bold text-primary">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-full text-xs font-black uppercase tracking-tighter text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all active:scale-95 border border-transparent hover:border-red-100"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 border-r border-border bg-white hidden lg:flex flex-col">
          <div className="flex-1 overflow-y-auto py-10 px-6">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-8 ml-4">Main Menu</p>
            <nav className="space-y-3">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 group ${isActive
                      ? "bg-primary text-white shadow-xl shadow-primary/30 translate-x-1"
                      : "text-slate-500 hover:bg-accent/5 hover:text-accent hover:translate-x-1"
                      }`}
                  >
                    <div className={`${isActive ? "text-white" : "text-slate-400 group-hover:text-accent"} transition-colors shrink-0`}>
                      {item.icon}
                    </div>
                    <span className="text-sm font-bold tracking-tight">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            <div className="p-5 bg-accent/5 rounded-3xl border border-accent/20 relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-2">Support</p>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Need institutional help?<br />Contact our tech desk.</p>
              </div>
              {/* Subtle decoration */}
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-accent/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 relative bg-background/50">
          <div className="mx-auto max-w-6xl relative z-10">
            {children}
          </div>

          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
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
