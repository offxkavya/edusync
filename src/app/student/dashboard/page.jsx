"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  FileText, 
  CalendarCheck, 
  BellRing, 
  ChevronRight, 
  TrendingUp, 
  Clock, 
  User,
  ArrowUpRight
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { getAuthToken } from "@/lib/auth-client";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

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
          <div className="text-center space-y-6">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full mx-auto" 
            />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Interface...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="STUDENT">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-12"
      >
        {/* Header Section */}
        <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-950 mb-3">
              Welcome back, <span className="text-slate-400">{profile?.name.split(' ')[0]}</span>
            </h1>
            <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
              <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 uppercase tracking-wider text-[10px]">
                {profile?.studentProfile?.department}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-slate-400" />
                Semester {profile?.studentProfile?.semester}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
            Last updated Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Active Courses" 
            value={stats.totalCourses} 
            icon={<BookOpen size={20} />} 
            trend="+2 this term" 
          />
          <StatCard 
            title="Performance Index" 
            value={`${stats.averageMarks}%`} 
            icon={<TrendingUp size={20} />} 
            trend="Upper Quartile" 
            positive
          />
          <StatCard 
            title="Attendance" 
            value={`${stats.attendancePercentage}%`} 
            icon={<CalendarCheck size={20} />} 
            trend="Institutional Target: 85%" 
          />
          <StatCard 
            title="Updates Received" 
            value={stats.totalAnnouncements} 
            icon={<BellRing size={20} />} 
            trend="3 priority notes" 
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content: Courses */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-950 tracking-tight">Active Curriculum</h2>
              <Link href="/student/courses" className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-950 transition-colors">
                Explore All <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.slice(0, 4).map((course, idx) => (
                  <motion.div 
                    key={course.id}
                    variants={item}
                    whileHover={{ y: -5 }}
                    className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-900/5 transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight size={20} className="text-slate-300" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{course.code}</p>
                    <h3 className="text-lg font-bold text-slate-950 mb-6 leading-tight group-hover:text-slate-900">{course.title}</h3>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                        <div className="w-6 h-6 rounded-full bg-slate-950 flex items-center justify-center text-[10px] text-white">
                          {course.faculty?.user?.name.charAt(0) || "T"}
                        </div>
                        {course.faculty?.user?.name || "TBA"}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-slate-50 text-slate-400">
                        {course.credits} Credits
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center bg-slate-50/50">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No active enrollment found</p>
              </div>
            )}
          </div>

          {/* Sidebar Area: Recent Activity & Announcements */}
          <div className="space-y-10">
             {/* Recent Marks */}
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold font-heading text-slate-950">Analytics</h2>
                  <Link href="/student/marks" className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 hover:border-slate-900 hover:text-slate-950 transition-all">Report Card</Link>
                </div>
                {marks.length > 0 ? (
                  <div className="rounded-3xl border border-slate-100 bg-white overflow-hidden shadow-sm">
                    <div className="divide-y divide-slate-50">
                      {marks.slice(0, 4).map((mark) => (
                        <div key={`${mark.courseId}-${mark.assessment}`} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 font-bold text-xs">
                                {mark.course?.code.substring(0,2)}
                             </div>
                             <div>
                                <p className="text-xs font-bold text-slate-950 line-clamp-1">{mark.course?.title}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest tracking-tight">{mark.assessment}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-sm font-black text-slate-950">{mark.score}/{mark.maxScore}</p>
                             <div className="flex items-center gap-1 justify-end">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
                                <span className="text-[10px] font-black text-slate-950">{Math.round((mark.score / mark.maxScore) * 100)}%</span>
                             </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center bg-slate-50/50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No recent data</p>
                  </div>
                )}
             </div>

             {/* Announcements */}
             <div className="space-y-6">
                <h2 className="text-xl font-bold font-heading text-slate-950">Broadcasts</h2>
                <div className="space-y-4">
                  {announcements.slice(0, 3).map((announcement) => (
                    <motion.div 
                      key={announcement.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-6 rounded-3xl bg-slate-950 text-white shadow-xl shadow-slate-900/10 relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                        <BellRing size={40} />
                      </div>
                      <h3 className="font-bold text-sm mb-2 relative z-10">{announcement.title}</h3>
                      <p className="text-[11px] text-slate-400 font-medium mb-4 relative z-10 line-clamp-2 leading-relaxed">
                        {announcement.body}
                      </p>
                      <div className="flex items-center gap-3 relative z-10">
                         <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
                            {announcement.author?.name.charAt(0)}
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                            {new Date(announcement.createdAt).toLocaleDateString()}
                         </span>
                      </div>
                    </motion.div>
                  ))}
                  <Link href="/announcements" className="block w-full text-center py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-950 transition-colors">
                    View Comprehensive Board
                  </Link>
                </div>
             </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, icon, trend, positive = false }) {
  return (
    <motion.div 
      variants={item}
      whileHover={{ y: -5 }}
      className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-900/5 transition-all"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-white shadow-lg shadow-slate-900/20">
          {icon}
        </div>
        {positive && (
           <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-950">
             <ArrowUpRight size={16} />
           </div>
        )}
      </div>
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2 leading-none">{title}</p>
        <p className="text-4xl font-black text-slate-950 tracking-tighter mb-4 leading-none">{value}</p>
        <div className="flex items-center gap-1.5">
           <div className={`w-1.5 h-1.5 rounded-full ${positive ? 'bg-slate-900' : 'bg-slate-200'}`}></div>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{trend}</p>
        </div>
      </div>
    </motion.div>
  );
}
