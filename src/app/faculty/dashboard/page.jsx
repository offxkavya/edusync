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
            <div className="animate-spin h-10 w-10 text-primary border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="FACULTY">
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
            Welcome, {profile?.name}
          </h1>
          <p className="text-muted-foreground">
            {profile?.facultyProfile?.department} • {profile?.facultyProfile?.specialization}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="My Courses" value={stats.totalCourses} icon="📚" />
          <StatCard title="Total Students" value={stats.totalStudents} icon="👥" />
          <StatCard title="Pending Tasks" value={stats.pendingAttendance} icon="📋" />
          <StatCard title="Announcements" value={stats.totalAnnouncements} icon="📢" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionLink href="/faculty/attendance" icon="✅" title="Mark Attendance" description="Record today's attendance" />
          <QuickActionLink href="/faculty/marks" icon="📝" title="Upload Marks" description="Add assessment scores" />
          <QuickActionLink href="/faculty/students" icon="👥" title="View Students" description="Manage your students" />
          <QuickActionLink href="/announcements/new" icon="📢" title="Post Announcement" description="Share updates" />
        </div>

        {/* My Courses */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">My Courses</h2>
            <Link href="/faculty/courses" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              View all →
            </Link>
          </div>
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-foreground mb-1">{course.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{course.code}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">{course.enrollments?.length || 0} Students</p>
                    <Link href={`/faculty/courses/${course.id}`} className="text-xs font-semibold text-primary hover:underline">
                      Manage →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-8 text-center bg-muted/50">
              <p className="text-muted-foreground">No courses assigned yet</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Students */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Recent Students</h2>
              <Link href="/faculty/students" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                View all →
              </Link>
            </div>
            {students.length > 0 ? (
              <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="divide-y divide-border">
                  {students.slice(0, 5).map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium text-foreground">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.studentProfile?.department} • Sem {student.studentProfile?.semester}</p>
                      </div>
                      <p className="text-sm text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">{student.studentProfile?.enrollmentNo}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-8 text-center bg-muted/50 h-full flex items-center justify-center">
                <p className="text-muted-foreground">No students found</p>
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
        <span className="text-2xl p-2 rounded-lg bg-primary/10">{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </div>
  );
}

function QuickActionLink({ href, icon, title, description }) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-6 text-center hover:bg-muted/50 hover:border-primary/50 transition-all shadow-sm group">
      <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform">{icon}</div>
      <p className="font-semibold text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </Link>
  );
}
