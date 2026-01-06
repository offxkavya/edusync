"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken, saveAuthToken, decodeToken } from "@/lib/auth-client";

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
    <div className="flex min-h-screen flex-1">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-background">
        <div className="mx-auto w-full max-w-sm lg:w-[480px]">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-8">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">EduSync</span>
            </Link>
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-foreground">
              Create your account
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-10">
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Role Selection */}
                <div className="space-y-3">
                  <p className="text-sm font-medium leading-6 text-foreground">I am a...</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {ROLE_OPTIONS.map((option) => (
                      <button
                        type="button"
                        key={option.value}
                        onClick={() => setRole(option.value)}
                        className={`rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ${role === option.value
                            ? "bg-primary text-white ring-primary"
                            : "bg-white text-gray-900 ring-gray-300 hover:bg-gray-50"
                          } transition-all`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {ROLE_OPTIONS.find((r) => r.value === role)?.description}
                  </p>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium leading-6 text-foreground">
                    Full Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3 bg-white text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-foreground">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3 bg-white text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-foreground">
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3 bg-white text-gray-900"
                      minLength={6}
                    />
                  </div>
                </div>

                {role === "STUDENT" && (
                  <div className="rounded-lg bg-secondary/30 p-4 space-y-4 border border-border">
                    <h3 className="text-sm font-semibold text-foreground">Student Details</h3>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label className="block text-xs font-medium leading-6 text-foreground">Enrollment No.</label>
                        <input
                          type="text"
                          name="enrollmentNo"
                          value={studentProfile.enrollmentNo}
                          onChange={handleStudentProfileChange}
                          required
                          className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-xs sm:leading-6 px-2 bg-white text-gray-900"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-xs font-medium leading-6 text-foreground">Semester</label>
                        <input
                          type="number"
                          min={1}
                          max={12}
                          name="semester"
                          value={studentProfile.semester}
                          onChange={handleStudentProfileChange}
                          required
                          className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-xs sm:leading-6 px-2 bg-white text-gray-900"
                        />
                      </div>
                      <div className="sm:col-span-6">
                        <label className="block text-xs font-medium leading-6 text-foreground">Department</label>
                        <input
                          type="text"
                          name="department"
                          value={studentProfile.department}
                          onChange={handleStudentProfileChange}
                          required
                          className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-xs sm:leading-6 px-2 bg-white text-gray-900"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-xs font-medium leading-6 text-foreground">Guardian Name (Opt)</label>
                        <input
                          type="text"
                          name="guardianName"
                          value={studentProfile.guardianName}
                          onChange={handleStudentProfileChange}
                          className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-xs sm:leading-6 px-2 bg-white text-gray-900"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-xs font-medium leading-6 text-foreground">Guardian Phone (Opt)</label>
                        <input
                          type="tel"
                          name="guardianPhone"
                          value={studentProfile.guardianPhone}
                          onChange={handleStudentProfileChange}
                          className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-xs sm:leading-6 px-2 bg-white text-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {role === "FACULTY" && (
                  <div className="rounded-lg bg-secondary/30 p-4 space-y-4 border border-border">
                    <h3 className="text-sm font-semibold text-foreground">Faculty Details</h3>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label className="block text-xs font-medium leading-6 text-foreground">Employee Code</label>
                        <input
                          type="text"
                          name="employeeCode"
                          value={facultyProfile.employeeCode}
                          onChange={handleFacultyProfileChange}
                          required
                          className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-xs sm:leading-6 px-2 bg-white text-gray-900"
                          placeholder="EMP-123"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-xs font-medium leading-6 text-foreground">Department</label>
                        <input
                          type="text"
                          name="department"
                          value={facultyProfile.department}
                          onChange={handleFacultyProfileChange}
                          required
                          className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-xs sm:leading-6 px-2 bg-white text-gray-900"
                        />
                      </div>
                      <div className="sm:col-span-6">
                        <label className="block text-xs font-medium leading-6 text-foreground">Specialization</label>
                        <input
                          type="text"
                          name="specialization"
                          value={facultyProfile.specialization}
                          onChange={handleFacultyProfileChange}
                          className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-xs sm:leading-6 px-2 bg-white text-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="rounded-md bg-red-50 p-4 border border-red-200">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                      </div>
                    </div>
                  </div>
                )}

                {successMessage && (
                  <div className="rounded-md bg-green-50 p-4 border border-green-200">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">{successMessage}</h3>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                  >
                    {isSubmitting ? "Creating account..." : "Create account"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
          {/* Abstract pattern or solid color instead of gradient */}
          <div className="w-full h-full bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-50"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center p-12 text-center z-10">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-6 max-w-lg">
              Join the <span className="text-primary">future</span> of education management.
            </h1>
            <p className="text-lg leading-8 text-slate-600 max-w-md">
              Streamline your workflow, engage students, and simplify administration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}