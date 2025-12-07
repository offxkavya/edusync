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
  const [userId, setUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    audience: "STUDENT",
  });

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      return;
    }

    const decoded = decodeToken(token);
    setUserRole(decoded?.role);
    setUserId(decoded?.id);

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

  const handleEdit = (announcement) => {
    setEditingItem(announcement);
    setFormData({
      title: announcement.title,
      body: announcement.body,
      audience: announcement.audience || "STUDENT",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;

    const token = getAuthToken();
    try {
      const res = await fetch(`/api/announcements?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchAnnouncements();
      } else {
        alert("Failed to delete announcement");
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getAuthToken();

    try {
      const url = editingItem ? "/api/announcements" : "/api/announcements";
      const method = editingItem ? "PUT" : "POST";
      const body = editingItem ? { ...formData, id: editingItem.id } : formData;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setShowModal(false);
        setEditingItem(null);
        setFormData({ title: "", body: "", audience: "STUDENT" });
        fetchAnnouncements();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to save announcement");
      }
    } catch (error) {
      console.error("Error saving announcement:", error);
      alert("Failed to save announcement");
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({ title: "", body: "", audience: "STUDENT" });
    setShowModal(true);
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

  const Layout = userRole ? DashboardLayout : ({ children }) => <div>{children}</div>;

  return (
    <Layout role={userRole}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Announcements</h1>
          {["ADMIN", "FACULTY"].includes(userRole) && (
            <button
              onClick={openCreateModal}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-500 hover:to-purple-500 transition"
            >
              + New Announcement
            </button>
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
                  <div>
                    <h2 className="text-xl font-semibold text-white">{announcement.title}</h2>
                    {announcement.audience && (
                      <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        {announcement.audience}
                      </span>
                    )}
                  </div>
                  {/* Show actions if Admin or Author */}
                  {(userRole === "ADMIN" || (userRole === "FACULTY" && announcement.author?.id === userId)) && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(announcement)}
                        className="p-2 text-slate-400 hover:text-blue-400 transition"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(announcement.id)}
                        className="p-2 text-slate-400 hover:text-red-400 transition"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
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

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-white mb-4">
                {editingItem ? "Edit Announcement" : "New Announcement"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Message</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Audience</label>
                  <select
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    value={formData.audience}
                    onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                  >
                    <option value="STUDENT">Students Only</option>
                    <option value="FACULTY">Faculty Only</option>
                    <option value="ALL">Everyone</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                  >
                    {editingItem ? "Save Changes" : "Post Announcement"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

