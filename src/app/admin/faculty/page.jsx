"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { getAuthToken, decodeToken } from "@/lib/auth-client";

export default function AdminFaculty() {
  const router = useRouter();
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
  });

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      return;
    }

    const decoded = decodeToken(token);
    if (decoded?.role !== "ADMIN") {
      router.push("/admin/dashboard");
      return;
    }

    fetchFaculty(token);
  }, [router, filters]);

  const fetchFaculty = async (token) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);

      const res = await fetch(`/api/faculty?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setFaculty(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching faculty:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="ADMIN">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin h-12 w-12 text-blue-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="ADMIN">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Faculty Management</h1>
        </div>

        <div>
          <input
            type="search"
            placeholder="Search by name or email"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full max-w-md rounded-xl border border-slate-700/50 bg-slate-800/30 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        {faculty.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {faculty.map((member) => (
              <div key={member.id} className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 hover:bg-slate-800/50 transition">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{member.name}</h3>
                    <p className="text-sm text-slate-400 mt-1">{member.email}</p>
                  </div>
                </div>

                {member.facultyProfile && (
                  <div className="space-y-2 mt-4 pt-4 border-t border-slate-700/50">
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Employee Code</p>
                      <p className="text-white font-medium">{member.facultyProfile.employeeCode}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Department</p>
                      <p className="text-white font-medium">{member.facultyProfile.department}</p>
                    </div>
                    {member.facultyProfile.specialization && (
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wide">Specialization</p>
                        <p className="text-white font-medium">{member.facultyProfile.specialization}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-slate-700/50">
                  <p className="text-xs text-slate-500">
                    User ID: {member.id}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-xl border border-slate-700/50 bg-slate-800/30">
            <p className="text-slate-400 text-lg">No faculty members found</p>
            <p className="text-slate-500 text-sm mt-2">
              {filters.search ? "Try a different search term" : "Faculty members will appear here"}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

