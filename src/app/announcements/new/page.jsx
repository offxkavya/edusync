"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { getAuthToken, decodeToken } from "@/lib/auth-client";

export default function NewAnnouncementPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState("STUDENT");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedToken = getAuthToken();
    if (!storedToken) {
      router.push("/login");
      return;
    }

    const decoded = decodeToken(storedToken);
    if (!["ADMIN", "FACULTY"].includes(decoded?.role)) {
      router.push("/announcements");
      return;
    }

    setToken(storedToken);
    setUserRole(decoded?.role);
  }, [router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");
    setError("");

    try {
      const response = await fetch("/api/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, body, audience }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Failed to create announcement");
        return;
      }

      setStatus("Announcement published successfully!");
      // Short delay to show success message
      setTimeout(() => {
        router.push("/announcements");
      }, 1500);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  if (!token || !userRole) {
    return (
      <DashboardLayout role={userRole}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin h-12 w-12 border-b-2 border-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={userRole}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Create Announcement</h1>
            <p className="text-muted-foreground mt-1">Share news and updates with your students or faculty.</p>
          </div>
          <Link
            href="/announcements"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition underline-offset-4 hover:underline"
          >
            Cancel
          </Link>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g. Mid-term Exam Schedule"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Message</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                rows={6}
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                placeholder="Write the detailed content of your announcement here..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Audience</label>
              <div className="relative">
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                >
                  <option value="">All Roles</option>
                  <option value="STUDENT">Students</option>
                  <option value="FACULTY">Faculty</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200">
                {error}
              </div>
            )}

            {status && (
              <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-600 border border-emerald-200">
                {status}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-primary px-8 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Publish Announcement
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
