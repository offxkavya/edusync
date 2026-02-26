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
            <div className="animate-spin h-10 w-10 text-primary border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="STUDENT">
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
            Welcome back, {profile?.name}
          </h1>
          <p className="text-muted-foreground">
            {profile?.studentProfile?.department} • Semester {profile?.studentProfile?.semester}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="My Courses" value={stats.totalCourses} icon={<CoursesIcon />} />
          <StatCard title="Average Marks" value={`${stats.averageMarks}%`} icon={<MarksIcon />} />
          <StatCard title="Attendance" value={`${stats.attendancePercentage}%`} icon={<AttendanceIcon />} />
          <StatCard title="Announcements" value={stats.totalAnnouncements} icon={<AnnouncementsIcon />} />
        </div>

        {/* My Courses */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">My Courses</h2>
            <Link href="/student/courses" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              View all →
            </Link>
          </div>
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.slice(0, 6).map((course) => (
                <div key={course.id} className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-foreground mb-1">{course.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{course.code}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{course.faculty?.user?.name || "TBA"}</span>
                    <span className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                      {course.credits} Credits
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-8 text-center bg-muted/50">
              <p className="text-muted-foreground">No courses enrolled yet</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Marks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Recent Marks</h2>
              <Link href="/student/marks" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                View all →
              </Link>
            </div>
            {marks.length > 0 ? (
              <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="divide-y divide-border">
                  {marks.slice(0, 5).map((mark) => (
                    <div key={`${mark.courseId}-${mark.assessment}`} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium text-foreground">{mark.course?.title}</p>
                        <p className="text-sm text-muted-foreground">{mark.assessment}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">{mark.score}/{mark.maxScore}</p>
                        <p className="text-xs text-muted-foreground">{Math.round((mark.score / mark.maxScore) * 100)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-8 text-center bg-muted/50 h-full flex items-center justify-center">
                <p className="text-muted-foreground">No marks released yet</p>
              </div>
            )}
          </div>

          {/* Recent Announcements */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Latest Announcements</h2>
              <Link href="/announcements" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                View all →
              </Link>
            </div>
            {announcements.length > 0 ? (
              <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="divide-y divide-border">
                  {announcements.slice(0, 3).map((announcement) => (
                    <div key={announcement.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <h3 className="font-semibold text-foreground mb-1">{announcement.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{announcement.body}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <span>{announcement.author?.name}</span>
                        <span>•</span>
                        <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-8 text-center bg-muted/50 h-full flex items-center justify-center">
                <p className="text-muted-foreground">No announcements yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-primary p-2 rounded-lg bg-primary/5 w-10 h-10 flex items-center justify-center border border-primary/10">{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </div>
  );
}

const CoursesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
);
const MarksIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);
const AttendanceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11"></polyline></svg>
);
const AnnouncementsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
);
