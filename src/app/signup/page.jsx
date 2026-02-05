"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken, saveAuthToken, decodeToken } from "@/lib/auth-client";
import Brand from "@/components/Brand";

const ROLE_OPTIONS = [
  { label: "Student", value: "STUDENT", description: "Access courses, marks, attendance" },
  { label: "Faculty", value: "FACULTY", description: "Manage classes, marks, announcements" },
  { label: "Admin", value: "ADMIN", description: "Oversee entire institution" },
];

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [role, setRole] = useState("STUDENT");
  const [studentProfile, setStudentProfile] = useState({
    enrollmentNo: "",
    department: "",
    semester: 1,
    guardianName: "",
    guardianPhone: "",
  });
  const [facultyProfile, setFacultyProfile] = useState({
    employeeCode: "",
    department: "",
    specialization: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const existingToken = getAuthToken();
    if (existingToken) {
      const decoded = decodeToken(existingToken);
      if (decoded?.role) {
        if (decoded.role === "ADMIN") {
          router.replace("/admin/dashboard");
        } else if (decoded.role === "FACULTY") {
          router.replace("/faculty/dashboard");
        } else if (decoded.role === "STUDENT") {
          router.replace("/student/dashboard");
        } else {
          router.replace("/dashboard");
        }
      }
    }
  }, [router]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStudentProfileChange = (event) => {
    const { name, value } = event.target;
    setStudentProfile((prev) => ({
      ...prev,
      [name]: name === "semester" ? Number(value) : value,
    }));
  };

  const handleFacultyProfileChange = (event) => {
    const { name, value } = event.target;
    setFacultyProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    const payload = {
      ...formData,
      role,
    };

    if (role === "STUDENT") {
      payload.studentProfile = studentProfile;
    }

    if (role === "FACULTY") {
      payload.facultyProfile = facultyProfile;
    }

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const isJson = response.headers
        .get("content-type")
        ?.includes("application/json");
      const data = isJson ? await response.json() : null;

      if (!response.ok) {
        const message = data?.message || data?.error || "Signup failed";
        setError(message);
        return;
      }

      if (data?.token) {
        saveAuthToken(data.token);
        // Redirect based on role
        const role = data.user?.role;
        if (role === "ADMIN") {
          router.push("/admin/dashboard");
        } else if (role === "FACULTY") {
          router.push("/faculty/dashboard");
        } else if (role === "STUDENT") {
          router.push("/student/dashboard");
        } else {
          router.push("/dashboard");
        }
        return;
      }

      setSuccessMessage("Account created successfully. Please sign in.");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-1 bg-slate-50 font-sans">
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:flex-none lg:px-20 xl:px-24 bg-white shadow-2xl z-10 transition-all">
        <div className="mx-auto w-full max-w-sm lg:w-[480px]">
          <div>
            <Link href="/" className="mb-10 block hover:opacity-80 transition-opacity">
              <Brand size="lg" />
            </Link>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 mb-2">
              Start your journey.
            </h2>
            <p className="text-sm font-medium text-slate-500 mb-8">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-accent hover:text-accent/80 underline underline-offset-4 decoration-accent/20 transition-all"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-3">
                <p className="block text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Joining as...</p>
                <div className="grid grid-cols-3 gap-3">
                  {ROLE_OPTIONS.map((option) => (
                    <button
                      type="button"
                      key={option.value}
                      onClick={() => setRole(option.value)}
                      className={`rounded-2xl px-3 py-3 text-sm font-bold transition-all border ${role === option.value
                        ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100"
                        : "bg-slate-50 text-slate-500 border-slate-100 hover:border-blue-200"
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 italic ml-1">
                  {ROLE_OPTIONS.find((r) => r.value === role)?.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full rounded-2xl border-[#d1e9e9] bg-[#F5FEFE] py-3.5 shadow-sm focus:border-accent focus:ring-accent sm:text-sm px-4 text-primary transition-all outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full rounded-2xl border-[#d1e9e9] bg-[#F5FEFE] py-3.5 shadow-sm focus:border-accent focus:ring-accent sm:text-sm px-4 text-primary transition-all outline-none"
                    placeholder="name@inst.edu"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-2xl border-[#d1e9e9] bg-[#F5FEFE] py-3.5 shadow-sm focus:border-accent focus:ring-accent sm:text-sm px-4 text-primary transition-all outline-none"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>

              {role === "STUDENT" && (
                <div className="rounded-[2rem] bg-slate-50 p-6 space-y-5 border border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Student Profile</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold uppercase text-slate-400 ml-1">Enrollment No.</label>
                      <input
                        type="text"
                        name="enrollmentNo"
                        value={studentProfile.enrollmentNo}
                        onChange={handleStudentProfileChange}
                        required
                        className="block w-full rounded-xl border-slate-200 bg-white py-2 shadow-sm focus:ring-blue-500 sm:text-xs px-3 text-slate-900 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold uppercase text-slate-400 ml-1">Semester</label>
                      <input
                        type="number"
                        min={1}
                        max={12}
                        name="semester"
                        value={studentProfile.semester}
                        onChange={handleStudentProfileChange}
                        required
                        className="block w-full rounded-xl border-slate-200 bg-white py-2 shadow-sm focus:ring-blue-500 sm:text-xs px-3 text-slate-900 outline-none"
                      />
                    </div>
                    <div className="col-span-2 space-y-1.5">
                      <label className="block text-[10px] font-bold uppercase text-slate-400 ml-1">Department</label>
                      <input
                        type="text"
                        name="department"
                        value={studentProfile.department}
                        onChange={handleStudentProfileChange}
                        required
                        className="block w-full rounded-xl border-slate-200 bg-white py-2 shadow-sm focus:ring-blue-500 sm:text-xs px-3 text-slate-900 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {role === "FACULTY" && (
                <div className="rounded-[2rem] bg-slate-50 p-6 space-y-5 border border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Faculty Profile</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold uppercase text-slate-400 ml-1">Employee Code</label>
                      <input
                        type="text"
                        name="employeeCode"
                        value={facultyProfile.employeeCode}
                        onChange={handleFacultyProfileChange}
                        required
                        className="block w-full rounded-xl border-slate-200 bg-white py-2 shadow-sm focus:ring-blue-500 sm:text-xs px-3 text-slate-900 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold uppercase text-slate-400 ml-1">Department</label>
                      <input
                        type="text"
                        name="department"
                        value={facultyProfile.department}
                        onChange={handleFacultyProfileChange}
                        required
                        className="block w-full rounded-xl border-slate-200 bg-white py-2 shadow-sm focus:ring-blue-500 sm:text-xs px-3 text-slate-900 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="rounded-2xl bg-red-50 p-4 border border-red-100 flex gap-3">
                  <svg className="h-5 w-5 text-red-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm font-semibold text-red-700">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full justify-center rounded-2xl bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-blue-200 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
              >
                {isSubmitting ? "Generating Credentials..." : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="relative hidden w-0 flex-1 lg:block overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
        <div className="absolute inset-0 flex flex-col justify-center items-center p-20 text-center z-10">
          <div className="mb-12 w-24 h-24 rounded-[2rem] bg-blue-600 shadow-2xl shadow-blue-500/50 flex items-center justify-center text-white scale-125">
            <Brand size="lg" className="scale-150" />
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white mb-8 max-w-lg leading-tight">
            The <span className="text-blue-500">standard</span> of excellence.
          </h1>
          <p className="text-xl leading-relaxed text-slate-400 max-w-md font-medium">
            Streamline your entire academic workflow. Engage students, manage faculty, and simplify every administrative detail with Knowva.
          </p>
        </div>
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-indigo-600/5 rounded-full blur-[80px]" />
      </div>
    </div>
  );
}