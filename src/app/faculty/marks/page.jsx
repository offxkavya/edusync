"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { getAuthToken } from "@/lib/auth-client";

export default function FacultyMarks() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: "",
    assessment: "",
    score: "",
    maxScore: "",
  });
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
    }
  };

  const handleCourseSelect = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    setSelectedCourse(course);
    if (course?.enrollments) {
      setStudents(course.enrollments.map((e) => e.student));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse) return;
    const token = getAuthToken();
    setSubmitting(true);

    try {
      const res = await fetch("/api/marks", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: selectedCourse.id,
          studentId: parseInt(formData.studentId),
          assessment: formData.assessment,
          score: parseFloat(formData.score),
          maxScore: parseFloat(formData.maxScore),
        }),
      });

      if (res.ok) {
        alert("Marks recorded successfully!");
        setFormData({
          studentId: "",
          assessment: "",
          score: "",
          maxScore: "",
        });
      } else {
        const data = await res.json();
        alert(data.error || "Failed to record marks");
      }
    } catch (error) {
      console.error("Error recording marks:", error);
      alert("Failed to record marks");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="FACULTY">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Upload Marks</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Course Selection */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Select Course</h2>
            <div className="space-y-2">
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => handleCourseSelect(course.id)}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    selectedCourse?.id === course.id
                      ? "border-blue-500 bg-blue-500/20"
                      : "border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50"
                  }`}
                >
                  <h3 className="font-semibold text-white">{course.title}</h3>
                  <p className="text-xs text-slate-400">{course.code}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Marks Form */}
          {selectedCourse && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Record Marks</h2>
              <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-700/50 bg-slate-800/30 p-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Student</label>
                  <select
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    required
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
                  >
                    <option value="">Select student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.user?.name} ({student.enrollmentNo})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Assessment Type</label>
                  <select
                    value={formData.assessment}
                    onChange={(e) => setFormData({ ...formData, assessment: e.target.value })}
                    required
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
                  >
                    <option value="">Select type</option>
                    <option value="QUIZ">Quiz</option>
                    <option value="ASSIGNMENT">Assignment</option>
                    <option value="MIDTERM">Midterm</option>
                    <option value="FINAL">Final</option>
                    <option value="PROJECT">Project</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Score</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.score}
                    onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                    required
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Max Score</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.maxScore}
                    onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })}
                    required
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white hover:from-blue-500 hover:to-purple-500 transition disabled:opacity-50"
                >
                  {submitting ? "Recording..." : "Record Marks"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

