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
          <div className="animate-spin h-12 w-12 border-b-2 border-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="FACULTY">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Mark Attendance</h1>
          <p className="text-muted-foreground mt-1">Record student attendance for your courses.</p>
        </div>

        {!selectedCourse ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Select a Course</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => handleCourseSelect(course.id)}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition text-left group"
                >
                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{course.title}</h3>
                  <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">{course.code}</p>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {course.enrollments?.length || 0}
                    </span>
                    <span className="text-sm text-muted-foreground">Students Enrolled</span>
                  </div>
                </button>
              ))}
            </div>
            {courses.length === 0 && (
              <div className="text-center py-12 rounded-xl border border-dashed border-border">
                <p className="text-muted-foreground">No courses found assigned to you.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{selectedCourse.title}</h2>
                <p className="text-muted-foreground">{selectedCourse.code}</p>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-4 py-2 rounded-lg border border-border bg-background text-sm font-medium text-foreground hover:bg-muted transition"
              >
                Change Course
              </button>
            </div>

            <div className="max-w-xs">
              <label className="block text-sm font-medium text-foreground mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-4">Student List</h3>
              <div className="space-y-2">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
                    <div>
                      <p className="font-medium text-foreground">{student.user?.name}</p>
                      <p className="text-sm text-muted-foreground font-mono">{student.enrollmentNo}</p>
                    </div>
                    <div className="relative">
                      <select
                        value={attendanceRecords[student.id] || "PRESENT"}
                        onChange={(e) => handleStatusChange(student.id, e.target.value)}
                        className={`rounded-lg border px-3 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${attendanceRecords[student.id] === "PRESENT" ? "border-emerald-200 bg-emerald-50 text-emerald-700 focus:ring-emerald-500" :
                            attendanceRecords[student.id] === "ABSENT" ? "border-red-200 bg-red-50 text-red-700 focus:ring-red-500" :
                              "border-yellow-200 bg-yellow-50 text-yellow-700 focus:ring-yellow-500"
                          }`}
                      >
                        <option value="PRESENT">Present</option>
                        <option value="ABSENT">Absent</option>
                        <option value="LATE">Late</option>
                      </select>
                    </div>
                  </div>
                ))}
                {students.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No students enrolled in this course.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={submitting || students.length === 0}
                className="w-full sm:w-auto rounded-lg bg-primary px-8 py-3 font-semibold text-white hover:bg-primary/90 transition disabled:opacity-50 shadow-sm"
              >
                {submitting ? "Recording..." : "Save Attendance"}
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
