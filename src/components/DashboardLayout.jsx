"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getAuthToken, clearAuthToken, decodeToken } from "@/lib/auth-client";

export default function DashboardLayout({ children, role }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);

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
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const navItems = [];
  if (user.role === "ADMIN") {
    navItems.push(
      { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
      { href: "/students", label: "Students", icon: "👥" },
      { href: "/admin/faculty", label: "Faculty", icon: "👨‍🏫" },
      { href: "/admin/courses", label: "Courses", icon: "📚" },
      { href: "/announcements", label: "Announcements", icon: "📢" },
      { href: "/profile", label: "Profile", icon: "👤" }
    );
  } else if (user.role === "FACULTY") {
    navItems.push(
      { href: "/faculty/dashboard", label: "Dashboard", icon: "📊" },
      { href: "/faculty/students", label: "My Students", icon: "👥" },
      { href: "/faculty/courses", label: "My Courses", icon: "📚" },
      { href: "/faculty/attendance", label: "Attendance", icon: "✅" },
      { href: "/faculty/marks", label: "Marks", icon: "📝" },
      { href: "/announcements", label: "Announcements", icon: "📢" },
      { href: "/profile", label: "Profile", icon: "👤" }
    );
  } else if (user.role === "STUDENT") {
    navItems.push(
      { href: "/student/dashboard", label: "Dashboard", icon: "📊" },
      { href: "/student/courses", label: "My Courses", icon: "📚" },
      { href: "/student/attendance", label: "Attendance", icon: "✅" },
      { href: "/student/marks", label: "Marks", icon: "📝" },
      { href: "/announcements", label: "Announcements", icon: "📢" },
      { href: "/profile", label: "Profile", icon: "👤" }
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-900/30 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4 sm:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              EduSync
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400 capitalize">{user.role}</span>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-800/50 bg-slate-900/30 backdrop-blur-xl min-h-[calc(100vh-73px)] p-6">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  pathname === item.href
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                    : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

