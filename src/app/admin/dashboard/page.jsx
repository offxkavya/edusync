"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { getAuthToken } from "@/lib/auth-client";

export default function AdminDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [courses, setCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalCourses: 0,
    totalAnnouncements: 0,
  });

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      return;
    }

    fetchDashboardData(token);
  }, [router]);

  const fetchDashboardData = async (token) => {
    try {
      // Fetch profile
      const profileRes = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profileData = await profileRes.json();
      if (!profileRes.ok) throw new Error(profileData.error);
      setProfile(profileData.user);

      // Fetch students
      const studentsRes = await fetch("/api/students?limit=10", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        setStudents(studentsData.data || []);
        setStats((prev) => ({ ...prev, totalStudents: studentsData.pagination?.total || 0 }));
      }

      // Fetch courses
      const coursesRes = await fetch("/api/courses?limit=10", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setCourses(coursesData.data || []);
        setStats((prev) => ({ ...prev, totalCourses: coursesData.pagination?.total || 0 }));
      }

      // Fetch announcements
      const announcementsRes = await fetch("/api/announcements");
      if (announcementsRes.ok) {
        const announcementsData = await announcementsRes.json();
        setAnnouncements(announcementsData.data || []);
        setStats((prev) => ({ ...prev, totalAnnouncements: announcementsData.data?.length || 0 }));
      }

      // Fetch faculty count (would need a faculty API)
      // For now, we'll estimate or skip
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="ADMIN">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin h-12 w-12 text-blue-500 mx-auto" />
            <p className="text-slate-400">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="ADMIN">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-400">
            Welcome, <span className="text-white font-medium">{profile?.name}</span>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Students" value={stats.totalStudents} icon="👥" color="blue" />
          <StatCard title="Total Faculty" value={stats.totalFaculty} icon="👨‍🏫" color="purple" />
          <StatCard title="Total Courses" value={stats.totalCourses} icon="📚" color="emerald" />
          <StatCard title="Announcements" value={stats.totalAnnouncements} icon="📢" color="orange" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/students" className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 hover:bg-slate-800/50 transition text-center">
            <div className="text-4xl mb-3">👥</div>
            <p className="font-semibold text-white">Manage Students</p>
            <p className="text-xs text-slate-400 mt-1">View and edit students</p>
          </Link>
          <Link href="/admin/faculty" className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 hover:bg-slate-800/50 transition text-center">
            <div className="text-4xl mb-3">👨‍🏫</div>
            <p className="font-semibold text-white">Manage Faculty</p>
            <p className="text-xs text-slate-400 mt-1">View and edit faculty</p>
          </Link>
          <Link href="/admin/courses" className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 hover:bg-slate-800/50 transition text-center">
            <div className="text-4xl mb-3">📚</div>
            <p className="font-semibold text-white">Manage Courses</p>
            <p className="text-xs text-slate-400 mt-1">Create and assign courses</p>
          </Link>
          <Link href="/announcements/new" className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 hover:bg-slate-800/50 transition text-center">
            <div className="text-4xl mb-3">📢</div>
            <p className="font-semibold text-white">Post Announcement</p>
            <p className="text-xs text-slate-400 mt-1">Share updates</p>
          </Link>
        </div>

        {/* Recent Students */}
        {students.length > 0 && (
          <div className="rounded-2xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Recent Students</h2>
              <Link href="/students" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {students.slice(0, 5).map((student) => (
                <div key={student.id} className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
                  <div>
                    <p className="font-medium text-white">{student.name}</p>
                    <p className="text-sm text-slate-400">{student.studentProfile?.department} • Sem {student.studentProfile?.semester}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-300">{student.studentProfile?.enrollmentNo}</p>
                    <Link href={`/students/${student.id}`} className="text-xs text-blue-400 hover:text-blue-300">
                      View →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Courses */}
        {courses.length > 0 && (
          <div className="rounded-2xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Recent Courses</h2>
              <Link href="/admin/courses" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.slice(0, 6).map((course) => (
                <div key={course.id} className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4 hover:bg-slate-800/50 transition">
                  <h3 className="font-semibold text-white mb-1">{course.title}</h3>
                  <p className="text-xs text-slate-400 mb-2">{course.code}</p>
                  <p className="text-sm text-slate-300">{course.faculty?.user?.name || "TBA"}</p>
                  <p className="text-xs text-slate-500 mt-2">{course.enrollments?.length || 0} Students</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Announcements */}
        {announcements.length > 0 && (
          <div className="rounded-2xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Latest Announcements</h2>
              <Link href="/announcements" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                View all →
              </Link>
            </div>
            <div className="space-y-4">
              {announcements.slice(0, 3).map((announcement) => (
                <div key={announcement.id} className="border-b border-slate-700/50 pb-4 last:border-0">
                  <h3 className="font-semibold text-white mb-1">{announcement.title}</h3>
                  <p className="text-sm text-slate-300 mb-2">{announcement.body}</p>
                  <p className="text-xs text-slate-500">{announcement.author?.name} • {new Date(announcement.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
    purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30",
    emerald: "from-emerald-500/20 to-emerald-600/20 border-emerald-500/30",
    orange: "from-orange-500/20 to-orange-600/20 border-orange-500/30",
  };

  return (
    <div className={`rounded-xl border bg-gradient-to-br ${colorClasses[color]} p-6 backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-slate-400">{title}</p>
    </div>
  );
}

