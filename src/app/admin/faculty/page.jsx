"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { getAuthToken } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function AdminFacultyPage() {
    const router = useRouter();
    const [faculty, setFaculty] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            router.push("/login");
            return;
        }
        // Since we don't have a dedicated faculty list API yet, we'll just show a placeholder
        // or try to fetch from a generic users API if it existed.
        // For now, let's just set loading to false to show the empty state/placeholder.
        setLoading(false);
    }, [router]);

    return (
        <DashboardLayout role="ADMIN">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-white">Manage Faculty</h1>
                    <button
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition"
                    >
                        Add Faculty
                    </button>
                </div>

                <div className="p-8 text-center border border-dashed border-slate-700 rounded-xl bg-slate-800/20">
                    <p className="text-slate-400 mb-2">Faculty management is coming soon.</p>
                    <p className="text-sm text-slate-500">
                        You will be able to add, edit, and assign courses to faculty members here.
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
}
