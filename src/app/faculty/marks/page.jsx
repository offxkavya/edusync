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
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Upload Marks</h1>
          <p className="text-muted-foreground mt-1">Record grades and assessment scores.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Course Selection */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">1. Select Course</h2>
            <div className="grid gap-3">
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => handleCourseSelect(course.id)}
                  className={`w-full rounded-xl border p-4 text-left transition shadow-sm ${selectedCourse?.id === course.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border bg-card hover:bg-muted/50"
                    }`}
                >
                  <h3 className={`font-semibold ${selectedCourse?.id === course.id ? "text-primary" : "text-foreground"}`}>{course.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">{course.code}</p>
                </button>
              ))}
              {courses.length === 0 && <p className="text-muted-foreground italic">No courses available.</p>}
            </div>
          </div>

          {/* Marks Form */}
          <div className="space-y-4">
            <h2 className={`text-xl font-semibold ${!selectedCourse ? "text-muted-foreground" : "text-foreground"}`}>2. Record Marks</h2>
            {selectedCourse ? (
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Student</label>
                    <select
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                    <label className="block text-sm font-medium text-foreground mb-2">Assessment Type</label>
                    <select
                      value={formData.assessment}
                      onChange={(e) => setFormData({ ...formData, assessment: e.target.value })}
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select type</option>
                      <option value="QUIZ">Quiz</option>
                      <option value="ASSIGNMENT">Assignment</option>
                      <option value="MIDTERM">Midterm</option>
                      <option value="FINAL">Final</option>
                      <option value="PROJECT">Project</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Score</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.score}
                        onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Max Score</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.maxScore}
                        onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })}
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="100.00"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary/90 transition disabled:opacity-50 shadow-sm"
                    >
                      {submitting ? "Recording..." : "Record Marks"}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="h-48 rounded-xl border border-dashed border-border flex items-center justify-center bg-muted/20">
                <p className="text-muted-foreground text-sm">Please select a course first</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
