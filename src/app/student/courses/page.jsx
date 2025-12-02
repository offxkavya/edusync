"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { getAuthToken } from "@/lib/auth-client";

export default function StudentCourses() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      return;
    }
    fetchCourses(token);
  }, [router]);

  const fetchCourses = async (token) => {
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

  if (loading) {
    return (
      <DashboardLayout role="STUDENT">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin h-12 w-12 text-blue-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="STUDENT">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">My Courses</h1>
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 hover:bg-slate-800/50 transition">
                <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                <p className="text-sm text-slate-400 mb-4">{course.code}</p>
                <p className="text-slate-300 mb-2">{course.description || "No description"}</p>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-slate-400">Faculty: {course.faculty?.user?.name || "TBA"}</p>
                  <p className="text-sm text-blue-400">{course.credits} Credits</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-center py-12">No courses enrolled</p>
        )}
      </div>
    </DashboardLayout>
  );
}

