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
  const [audience, setAudience] = useState("");
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
      setTimeout(() => {
        router.push("/announcements");
      }, 1500);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  if (!token || !userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin h-12 w-12 text-blue-500" />
      </div>
    );
  }

  return (
    <DashboardLayout role={userRole}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Create Announcement</h1>
            <p className="text-slate-400 mt-1">Share updates and important information</p>
          </div>
          <Link
            href="/announcements"
            className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
          >
            ← Back
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 backdrop-blur-sm"
        >
          <div className="space-y-2">
            <label className="text-sm text-slate-200">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-700/50 bg-slate-900/30 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
              placeholder="Exam week schedule"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-200">Message</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={4}
              className="w-full rounded-xl border border-slate-700/50 bg-slate-900/30 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
              placeholder="Share details, logistics, or instructions..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-200">Audience (optional)</label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full rounded-xl border border-slate-700/50 bg-slate-900/30 px-4 py-3 text-sm text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="">All Roles</option>
              <option value="STUDENT">Students</option>
              <option value="FACULTY">Faculty</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm text-red-300">
              {error}
            </p>
          )}
          {status && (
            <p className="rounded-lg border border-emerald-500/50 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
              {status}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white hover:from-blue-500 hover:to-purple-500 transition"
          >
            Publish Announcement
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}


