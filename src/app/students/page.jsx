"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { getAuthToken, decodeToken } from "@/lib/auth-client";

export default function StudentsPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    department: "",
    semester: "",
  });

  useEffect(() => {
    const storedToken = getAuthToken();
    if (!storedToken) {
      router.push("/login");
      return;
    }
    
    const decoded = decodeToken(storedToken);
    if (!["ADMIN", "FACULTY"].includes(decoded?.role)) {
      router.push("/dashboard");
      return;
    }
    
    setToken(storedToken);
    setUserRole(decoded?.role);
  }, [router]);

  useEffect(() => {
    if (!token) return;

    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.department) params.append("department", filters.department);
    if (filters.semester) params.append("semester", filters.semester);

    fetch(`/api/students?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStudents(data.data || []))
      .catch((err) => console.error(err));
  }, [token, filters]);

  if (!token || !userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin h-12 w-12 text-blue-500" />
      </div>
    );
  }

  return (
    <DashboardLayout role={userRole}>
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
            Directory
          </p>
          <h1 className="text-3xl font-semibold">Student Management</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <input
            type="search"
            placeholder="Search by name, email, enrollment"
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />
          <input
            type="text"
            placeholder="Department"
            value={filters.department}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, department: e.target.value }))
            }
            className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />
          <input
            type="number"
            min={1}
            placeholder="Semester"
            value={filters.semester}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, semester: e.target.value }))
            }
            className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
          <table className="min-w-full divide-y divide-white/10 text-left text-sm">
            <thead>
              <tr className="text-slate-400">
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Enrollment</th>
                <th className="px-4 py-3 font-semibold">Department</th>
                <th className="px-4 py-3 font-semibold">Semester</th>
                <th className="px-4 py-3 font-semibold">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-white/5">
                  <td className="px-4 py-3">{student.name}</td>
                  <td className="px-4 py-3 text-slate-300">
                    {student.studentProfile?.enrollmentNo}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {student.studentProfile?.department}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {student.studentProfile?.semester}
                  </td>
                  <td className="px-4 py-3 text-slate-300">{student.email}</td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-slate-500"
                  >
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}


