"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { getAuthToken } from "@/lib/auth-client";

export default function FacultyAttendance() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  const handleCourseSelect = async (courseId) => {
    const token = getAuthToken();
    const course = courses.find((c) => c.id === courseId);
    setSelectedCourse(course);
    
    // Fetch enrolled students
    if (course?.enrollments) {
      setStudents(course.enrollments.map((e) => e.student));
      // Initialize attendance records
      const initialRecords = {};
      course.enrollments.forEach((e) => {
        initialRecords[e.student.id] = "PRESENT";
      });
      setAttendanceRecords(initialRecords);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceRecords((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async () => {
    if (!selectedCourse) return;
    const token = getAuthToken();
    setSubmitting(true);

    try {
      const records = Object.entries(attendanceRecords).map(([studentId, status]) => ({
        studentId: parseInt(studentId),
        status,
      }));

      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: selectedCourse.id,
          date,
          records,
        }),
      });

      if (res.ok) {
        alert("Attendance recorded successfully!");
        setAttendanceRecords({});
        setSelectedCourse(null);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to record attendance");
      }
    } catch (error) {
      console.error("Error recording attendance:", error);
      alert("Failed to record attendance");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="FACULTY">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin h-12 w-12 text-blue-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="FACULTY">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Mark Attendance</h1>

        {!selectedCourse ? (
          <div className="space-y-4">
            <p className="text-slate-400">Select a course to mark attendance</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => handleCourseSelect(course.id)}
                  className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 hover:bg-slate-800/50 transition text-left"
                >
                  <h3 className="font-semibold text-white mb-1">{course.title}</h3>
                  <p className="text-xs text-slate-400 mb-2">{course.code}</p>
                  <p className="text-sm text-slate-300">{course.enrollments?.length || 0} Students</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedCourse.title}</h2>
                <p className="text-slate-400">{selectedCourse.code}</p>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Change Course
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white"
              />
            </div>

            <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Students</h3>
              <div className="space-y-3">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-900/50 p-4">
                    <div>
                      <p className="font-medium text-white">{student.user?.name}</p>
                      <p className="text-sm text-slate-400">{student.enrollmentNo}</p>
                    </div>
                    <select
                      value={attendanceRecords[student.id] || "PRESENT"}
                      onChange={(e) => handleStatusChange(student.id, e.target.value)}
                      className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
                    >
                      <option value="PRESENT">Present</option>
                      <option value="ABSENT">Absent</option>
                      <option value="LATE">Late</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white hover:from-blue-500 hover:to-purple-500 transition disabled:opacity-50"
            >
              {submitting ? "Recording..." : "Record Attendance"}
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

