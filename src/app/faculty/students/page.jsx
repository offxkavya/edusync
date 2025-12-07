"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { getAuthToken } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function FacultyStudentsPage() {
    const router = useRouter();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            router.push("/login");
            return;
        }
        fetchStudents(token);
    }, [router]);

    const fetchStudents = async (token) => {
        try {
            const res = await fetch("/api/students?limit=100", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setStudents(data.data || []);
            }
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="FACULTY">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-white">My Students</h1>
                </div>

                {loading ? (
                    <div className="text-center text-slate-400">Loading students...</div>
                ) : (
                    <div className="grid gap-4">
                        {students.map((student) => (
                            <div
                                key={student.id}
                                className="p-4 rounded-xl border border-slate-700/50 bg-slate-800/30 flex justify-between items-center"
                            >
                                <div>
                                    <h3 className="font-semibold text-white">{student.name}</h3>
                                    <p className="text-sm text-slate-400">
                                        {student.studentProfile?.department} • Sem {student.studentProfile?.semester}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-slate-300">
                                        {student.studentProfile?.enrollmentNo}
                                    </p>
                                    <Link
                                        href={`/faculty/students/${student.id}`}
                                        className="text-xs text-blue-400 hover:text-blue-300"
                                    >
                                        View Details →
                                    </Link>
                                </div>
                            </div>
                        ))}
                        {students.length === 0 && (
                            <p className="text-center text-slate-500 py-8">No students found.</p>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
