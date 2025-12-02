"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { getAuthToken, decodeToken } from "@/lib/auth-client";

export default function AnnouncementsPage() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      return;
    }

    const decoded = decodeToken(token);
    setUserRole(decoded?.role);

    fetchAnnouncements();
  }, [router]);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("/api/announcements");
      const data = await res.json();
      if (res.ok) {
        setAnnouncements(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role={userRole}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin h-12 w-12 text-blue-500" />
        </div>
      </DashboardLayout>
    );
  }

  // Determine which layout to use based on role
  const Layout = userRole ? DashboardLayout : ({ children }) => <div>{children}</div>;

  return (
    <Layout role={userRole}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Announcements</h1>
          {["ADMIN", "FACULTY"].includes(userRole) && (
            <Link
              href="/announcements/new"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-500 hover:to-purple-500 transition"
            >
              + New Announcement
            </Link>
          )}
        </div>

        {announcements.length > 0 ? (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 hover:bg-slate-800/50 transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-xl font-semibold text-white">{announcement.title}</h2>
                  {announcement.audience && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {announcement.audience}
                    </span>
                  )}
                </div>
                <p className="text-slate-300 mb-4 whitespace-pre-wrap">{announcement.body}</p>
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>
                    By {announcement.author?.name || "System"} • {new Date(announcement.createdAt).toLocaleDateString()}
                  </span>
                  {announcement.updatedAt !== announcement.createdAt && (
                    <span className="text-xs">Updated {new Date(announcement.updatedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-xl border border-slate-700/50 bg-slate-800/30">
            <p className="text-slate-400 text-lg mb-2">No announcements yet</p>
            <p className="text-slate-500 text-sm">
              {["ADMIN", "FACULTY"].includes(userRole)
                ? "Create your first announcement to get started"
                : "Check back later for updates"}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}

