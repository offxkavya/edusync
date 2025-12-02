"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { getAuthToken } from "@/lib/auth-client";

export default function FacultyDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    pendingAttendance: 0,
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

      // Fetch courses
      const coursesRes = await fetch("/api/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setCourses(coursesData.data || []);
        setStats((prev) => ({ ...prev, totalCourses: coursesData.data?.length || 0 }));
        
        // Count total students across all courses
        const totalStudents = coursesData.data?.reduce((sum, course) => sum + (course.enrollments?.length || 0), 0) || 0;
        setStats((prev) => ({ ...prev, totalStudents }));
      }

      // Fetch students
      const studentsRes = await fetch("/api/students?limit=10", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        setStudents(studentsData.data || []);
      }

      // Fetch announcements
      const announcementsRes = await fetch("/api/announcements");
      if (announcementsRes.ok) {
        const announcementsData = await announcementsRes.json();
        setAnnouncements(announcementsData.data || []);
        setStats((prev) => ({ ...prev, totalAnnouncements: announcementsData.data?.length || 0 }));
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="FACULTY">
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
    <DashboardLayout role="FACULTY">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{profile?.name}</span>
          </h1>
          <p className="text-slate-400">
            {profile?.facultyProfile?.department} • {profile?.facultyProfile?.specialization}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="My Courses" value={stats.totalCourses} icon="📚" color="blue" />
          <StatCard title="Total Students" value={stats.totalStudents} icon="👥" color="purple" />
          <StatCard title="Pending Tasks" value={stats.pendingAttendance} icon="📋" color="orange" />
          <StatCard title="Announcements" value={stats.totalAnnouncements} icon="📢" color="emerald" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/faculty/attendance" className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 hover:bg-slate-800/50 transition text-center">
            <div className="text-4xl mb-3">✅</div>
            <p className="font-semibold text-white">Mark Attendance</p>
            <p className="text-xs text-slate-400 mt-1">Record today's attendance</p>
          </Link>
          <Link href="/faculty/marks" className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 hover:bg-slate-800/50 transition text-center">
            <div className="text-4xl mb-3">📝</div>
            <p className="font-semibold text-white">Upload Marks</p>
            <p className="text-xs text-slate-400 mt-1">Add assessment scores</p>
          </Link>
          <Link href="/faculty/students" className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 hover:bg-slate-800/50 transition text-center">
            <div className="text-4xl mb-3">👥</div>
            <p className="font-semibold text-white">View Students</p>
            <p className="text-xs text-slate-400 mt-1">Manage your students</p>
          </Link>
          <Link href="/announcements/new" className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 hover:bg-slate-800/50 transition text-center">
            <div className="text-4xl mb-3">📢</div>
            <p className="font-semibold text-white">Post Announcement</p>
            <p className="text-xs text-slate-400 mt-1">Share updates</p>
          </Link>
        </div>

        {/* My Courses */}
        <div className="rounded-2xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">My Courses</h2>
            <Link href="/faculty/courses" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              View all →
            </Link>
          </div>
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <div key={course.id} className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4 hover:bg-slate-800/50 transition">
                  <h3 className="font-semibold text-white mb-1">{course.title}</h3>
                  <p className="text-xs text-slate-400 mb-2">{course.code}</p>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-sm text-slate-300">{course.enrollments?.length || 0} Students</p>
                    <Link href={`/faculty/courses/${course.id}`} className="text-blue-400 hover:text-blue-300 text-xs">
                      Manage →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-8">No courses assigned yet</p>
          )}
        </div>

        {/* Recent Students */}
        {students.length > 0 && (
          <div className="rounded-2xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Recent Students</h2>
              <Link href="/faculty/students" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
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
                  <p className="text-sm text-slate-300">{student.studentProfile?.enrollmentNo}</p>
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

