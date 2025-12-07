"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { getAuthToken } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function FacultyCoursesPage() {
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

    return (
        <DashboardLayout role="FACULTY">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-white">My Courses</h1>
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
                                <div className="text-right">
                                    <p className="text-sm text-slate-300">
                                        {course.enrollments?.length || 0} Students
                                    </p>
                                    <Link
                                        href={`/faculty/courses/${course.id}`}
                                        className="text-xs text-blue-400 hover:text-blue-300"
                                    >
                                        Manage Course →
                                    </Link>
                                </div>
                            </div>
                        ))}
                        {courses.length === 0 && (
                            <p className="text-center text-slate-500 py-8">No courses assigned.</p>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
