"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { getAuthToken } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function AdminCoursesPage() {
    const router = useRouter();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        code: "",
        credits: 3,
        facultyId: "",
    });
    const [facultyList, setFacultyList] = useState([]);

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            router.push("/login");
            return;
        }
        fetchCourses(token);
        fetchFaculty(token);
    }, [router]);

    const fetchCourses = async (token) => {
        try {
            const res = await fetch("/api/courses?limit=100", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setCourses(data.data || []);
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFaculty = async (token) => {
        try {
            const res = await fetch("/api/faculty", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setFacultyList(data.data || []);
            }
        } catch (error) {
            console.error("Error fetching faculty:", error);
        }
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        setFormData({
            title: course.title,
            code: course.code,
            credits: course.credits,
            facultyId: course.facultyProfileId || (course.faculty?.id ? course.faculty.id : ""),
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this course?")) return;

        const token = getAuthToken();
        try {
            const res = await fetch(`/api/courses?id=${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                fetchCourses(token);
            } else {
                alert("Failed to delete course");
            }
        } catch (error) {
            console.error("Error deleting course:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = getAuthToken();
        try {
            const url = editingCourse ? "/api/courses" : "/api/courses";
            const method = editingCourse ? "PUT" : "POST";
            const body = editingCourse ? { ...formData, id: editingCourse.id } : formData;

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                setShowModal(false);
                setEditingCourse(null);
                setFormData({ title: "", code: "", credits: 3, facultyId: "" });
                fetchCourses(token);
            } else {
                const error = await res.json();
                alert(error.error || "Failed to save course");
            }
        } catch (error) {
            console.error("Error saving course:", error);
            alert("Failed to save course");
        }
    };

    const openCreateModal = () => {
        setEditingCourse(null);
        setFormData({ title: "", code: "", credits: 3, facultyId: "" });
        setShowModal(true);
    };

    return (
        <DashboardLayout role="ADMIN">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-white">Manage Courses</h1>
                    <button
                        onClick={openCreateModal}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
                    >
                        Add Course
                    </button>
                </div>

                {loading ? (
                    <div className="text-center text-slate-400">Loading courses...</div>
                ) : (
                    <div className="grid gap-4">
                        {courses.map((course) => (
                            <div
                                key={course.id}
                                className="p-4 rounded-xl border border-slate-700/50 bg-slate-800/30 flex justify-between items-center"
                            >
                                <div>
                                    <h3 className="font-semibold text-white">{course.title}</h3>
                                    <p className="text-sm text-slate-400">
                                        {course.code} • {course.credits} Credits
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-sm text-slate-300">
                                            {course.faculty?.user?.name || "No Faculty Assigned"}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {course.enrollments?.length || 0} Students
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(course)}
                                            className="p-2 text-slate-400 hover:text-blue-400 transition"
                                            title="Edit"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(course.id)}
                                            className="p-2 text-slate-400 hover:text-red-400 transition"
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {courses.length === 0 && (
                            <p className="text-center text-slate-500 py-8">No courses found.</p>
                        )}
                    </div>
                )}

                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md">
                            <h2 className="text-xl font-bold text-white mb-4">
                                {editingCourse ? "Edit Course" : "Add New Course"}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Course Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Course Code</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Credits</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                                        value={formData.credits}
                                        onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Faculty</label>
                                    <select
                                        required
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                                        value={formData.facultyId}
                                        onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                                    >
                                        <option value="">Select Faculty</option>
                                        {facultyList.map((f) => (
                                            <option key={f.id} value={f.id}>
                                                {f.user.name} ({f.department})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 text-slate-300 hover:text-white"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                                    >
                                        {editingCourse ? "Save Changes" : "Create Course"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
