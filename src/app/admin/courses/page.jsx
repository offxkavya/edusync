"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { getAuthToken, decodeToken } from "@/lib/auth-client";

export default function AdminCourses() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    credits: "3",
    department: "",
    semester: "1",
    facultyProfileId: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      return;
    }

    const decoded = decodeToken(token);
    if (decoded?.role !== "ADMIN") {
      router.push("/admin/dashboard");
      return;
    }

    fetchData(token);
    fetchFaculty(token);
  }, [router]);

  const fetchData = async (token) => {
    try {
      const res = await fetch("/api/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setCourses(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFaculty = async (token) => {
    try {
      const res = await fetch("/api/faculty", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setFaculty(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching faculty:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const token = getAuthToken();
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          credits: parseInt(formData.credits),
          semester: parseInt(formData.semester),
          facultyProfileId: formData.facultyProfileId ? parseInt(formData.facultyProfileId) : null,
        }),
      });

      if (res.ok) {
        setShowForm(false);
        setFormData({
          title: "",
          code: "",
          credits: "3",
          department: "",
          semester: "1",
          facultyProfileId: "",
        });
        fetchData(token);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create course");
      }
    } catch (error) {
      setError("Failed to create course");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="ADMIN">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin h-12 w-12 text-blue-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="ADMIN">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Course Management</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-500 hover:to-purple-500 transition"
          >
            {showForm ? "Cancel" : "+ New Course"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Create New Course</h2>
            
            {error && (
              <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2 text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Course Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
                  placeholder="Introduction to Computer Science"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Course Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
                  placeholder="CS101"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Department *</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
                  placeholder="Computer Science"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Semester *</label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Credits</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={formData.credits}
                  onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Assign Faculty (optional)</label>
                <select
                  value={formData.facultyProfileId}
                  onChange={(e) => setFormData({ ...formData, facultyProfileId: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
                >
                  <option value="">Select Faculty</option>
                  {faculty.map((f) => (
                    <option key={f.id} value={f.facultyProfile?.id || ""}>
                      {f.name} {f.facultyProfile ? `(${f.facultyProfile.employeeCode})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white hover:from-blue-500 hover:to-purple-500 transition disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Course"}
            </button>
          </form>
        )}

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 hover:bg-slate-800/50 transition">
                <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                <p className="text-sm text-slate-400 mb-4">{course.code}</p>
                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400">Department</p>
                    <p className="text-white font-medium">{course.department}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400">Semester</p>
                    <p className="text-white font-medium">{course.semester}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400">Faculty</p>
                    <p className="text-white">{course.faculty?.user?.name || "Not assigned"}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400">Credits</p>
                    <p className="text-white font-semibold">{course.credits}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-700/50">
                  <p className="text-xs text-slate-400">
                    {course.enrollments?.length || 0} Students enrolled
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-xl border border-slate-700/50 bg-slate-800/30">
            <p className="text-slate-400 text-lg">No courses found</p>
            <p className="text-slate-500 text-sm mt-2">Create your first course to get started</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

