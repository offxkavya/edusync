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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-foreground">Loading...</div>
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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50 shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">Knowva</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground capitalize hidden sm:inline-block">{user.role.toLowerCase()}</span>
              <button
                onClick={handleLogout}
                className="rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card hidden lg:block">
          <nav className="space-y-1 p-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all ${isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 sm:p-8 bg-secondary/20">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
