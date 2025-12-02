"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { getAuthToken } from "@/lib/auth-client";

export default function StudentAttendance() {
  const router = useRouter();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      return;
    }
    fetchAttendance(token);
  }, [router]);

  const fetchAttendance = async (token) => {
    try {
      const res = await fetch("/api/attendance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setAttendance(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="STUDENT">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin h-12 w-12 text-blue-500" />
        </div>
      </DashboardLayout>
    );
  }

  // Group attendance by course
  const attendanceByCourse = attendance.reduce((acc, record) => {
    const courseName = record.course?.title || "Unknown";
    if (!acc[courseName]) acc[courseName] = [];
    acc[courseName].push(record);
    return acc;
  }, {});

  const getStatusColor = (status) => {
    switch (status) {
      case "PRESENT":
        return "text-emerald-400 bg-emerald-500/20";
      case "ABSENT":
        return "text-red-400 bg-red-500/20";
      case "LATE":
        return "text-yellow-400 bg-yellow-500/20";
      default:
        return "text-slate-400 bg-slate-500/20";
    }
  };

  return (
    <DashboardLayout role="STUDENT">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">My Attendance</h1>
        {Object.keys(attendanceByCourse).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(attendanceByCourse).map(([courseName, records]) => {
              const present = records.filter((r) => r.status === "PRESENT").length;
              const percentage = Math.round((present / records.length) * 100);
              return (
                <div key={courseName} className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">{courseName}</h2>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">{percentage}%</p>
                      <p className="text-sm text-slate-400">{present}/{records.length} Present</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {records.map((record, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-900/50 p-3">
                        <p className="text-slate-300">{new Date(record.date).toLocaleDateString()}</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-slate-400 text-center py-12">No attendance records yet</p>
        )}
      </div>
    </DashboardLayout>
  );
}

