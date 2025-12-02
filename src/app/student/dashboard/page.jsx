"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { getAuthToken } from "@/lib/auth-client";

export default function StudentDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [marks, setMarks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    averageMarks: 0,
    attendancePercentage: 0,
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
      }

      // Fetch marks
      const marksRes = await fetch("/api/marks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (marksRes.ok) {
        const marksData = await marksRes.json();
        setMarks(marksData.data || []);
        if (marksData.data?.length > 0) {
          const avg = marksData.data.reduce((sum, m) => sum + (m.score / m.maxScore) * 100, 0) / marksData.data.length;
          setStats((prev) => ({ ...prev, averageMarks: Math.round(avg) }));
        }
      }

      // Fetch attendance
      const attendanceRes = await fetch("/api/attendance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (attendanceRes.ok) {
        const attendanceData = await attendanceRes.json();
        setAttendance(attendanceData.data || []);
        if (attendanceData.data?.length > 0) {
          const present = attendanceData.data.filter((a) => a.status === "PRESENT").length;
          const percentage = (present / attendanceData.data.length) * 100;
          setStats((prev) => ({ ...prev, attendancePercentage: Math.round(percentage) }));
        }
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
      <DashboardLayout role="STUDENT">
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
    <DashboardLayout role="STUDENT">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{profile?.name}</span>
          </h1>
          <p className="text-slate-400">
            {profile?.studentProfile?.department} • Semester {profile?.studentProfile?.semester}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="My Courses" value={stats.totalCourses} icon="📚" color="blue" />
          <StatCard title="Average Marks" value={`${stats.averageMarks}%`} icon="📝" color="purple" />
          <StatCard title="Attendance" value={`${stats.attendancePercentage}%`} icon="✅" color="emerald" />
          <StatCard title="Announcements" value={stats.totalAnnouncements} icon="📢" color="orange" />
        </div>

        {/* My Courses */}
        <div className="rounded-2xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">My Courses</h2>
            <Link href="/student/courses" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              View all →
            </Link>
          </div>
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.slice(0, 6).map((course) => (
                <div key={course.id} className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4 hover:bg-slate-800/50 transition">
                  <h3 className="font-semibold text-white mb-1">{course.title}</h3>
                  <p className="text-xs text-slate-400 mb-2">{course.code}</p>
                  <p className="text-sm text-slate-300">{course.faculty?.user?.name || "TBA"}</p>
                  <p className="text-xs text-slate-500 mt-2">{course.credits} Credits</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-8">No courses enrolled yet</p>
          )}
        </div>

        {/* Recent Marks */}
        {marks.length > 0 && (
          <div className="rounded-2xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Recent Marks</h2>
              <Link href="/student/marks" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {marks.slice(0, 5).map((mark) => (
                <div key={`${mark.courseId}-${mark.assessment}`} className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
                  <div>
                    <p className="font-medium text-white">{mark.course?.title}</p>
                    <p className="text-sm text-slate-400">{mark.assessment}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">{mark.score}/{mark.maxScore}</p>
                    <p className="text-xs text-slate-400">{Math.round((mark.score / mark.maxScore) * 100)}%</p>
                  </div>
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

