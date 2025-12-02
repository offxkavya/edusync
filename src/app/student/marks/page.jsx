"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { getAuthToken } from "@/lib/auth-client";

export default function StudentMarks() {
  const router = useRouter();
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      return;
    }
    fetchMarks(token);
  }, [router]);

  const fetchMarks = async (token) => {
    try {
      const res = await fetch("/api/marks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setMarks(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching marks:", error);
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

  // Group marks by course
  const marksByCourse = marks.reduce((acc, mark) => {
    const courseName = mark.course?.title || "Unknown";
    if (!acc[courseName]) acc[courseName] = [];
    acc[courseName].push(mark);
    return acc;
  }, {});

  return (
    <DashboardLayout role="STUDENT">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">My Marks</h1>
        {Object.keys(marksByCourse).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(marksByCourse).map(([courseName, courseMarks]) => (
              <div key={courseName} className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6">
                <h2 className="text-xl font-bold text-white mb-4">{courseName}</h2>
                <div className="space-y-3">
                  {courseMarks.map((mark, idx) => {
                    const percentage = Math.round((mark.score / mark.maxScore) * 100);
                    return (
                      <div key={idx} className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-900/50 p-4">
                        <div>
                          <p className="font-medium text-white">{mark.assessment}</p>
                          <p className="text-sm text-slate-400">{new Date(mark.recordedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-white">{mark.score}/{mark.maxScore}</p>
                          <p className={`text-sm ${percentage >= 70 ? "text-emerald-400" : percentage >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                            {percentage}%
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-center py-12">No marks recorded yet</p>
        )}
      </div>
    </DashboardLayout>
  );
}

