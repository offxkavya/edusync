"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAuthToken, clearAuthToken } from "@/lib/auth-client";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      return;
    }

    fetchUserProfile(token);
  }, [router]);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch("/api/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          clearAuthToken();
          router.push("/login");
          return;
        }
        setError(data.error || "Failed to fetch profile");
        return;
      }

      setUser(data.user);
    } catch (err) {
      setError("Unable to fetch profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-slate-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="rounded-xl border border-red-500/50 bg-red-500/10 px-6 py-4 text-red-300">
            {error}
          </div>
          <Link
            href="/login"
            className="inline-block rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatRole = (role) => {
    if (!role) return "Member";
    return role.charAt(0) + role.slice(1).toLowerCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.15),transparent_50%)]" />
      
      <div className="relative">
        {/* Header */}
        <header className="border-b border-slate-800/50 bg-slate-900/30 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-6 py-4 sm:px-8">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                EduSync
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                Sign out
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
            {/* Welcome Section */}
            <div className="text-center space-y-3">
              <h1 className="text-4xl font-bold text-white sm:text-5xl">
                Welcome back,
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  {user?.name}
                </span>
              </h1>
              <p className="text-slate-400 text-lg">
                Here&apos;s your profile information
              </p>
            </div>

            {/* Profile Card */}
            <div className="mx-auto max-w-4xl">
              <div className="rounded-2xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-xl shadow-2xl overflow-hidden">
                {/* Profile Header */}
                <div className="relative bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-slate-900/40 px-8 py-12">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.2),_transparent_70%)]" />
                  <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-6">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-xl ring-4 ring-slate-800">
                        {getInitials(user?.name || "")}
                      </div>
                      <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-emerald-500 border-4 border-slate-900 flex items-center justify-center">
                        <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Name and Title */}
                    <div className="flex-1 text-center sm:text-left pb-2">
                      <h2 className="text-3xl font-bold text-white mb-2">
                        {user?.name}
                      </h2>
                      <p className="text-blue-300 font-medium">
                        {formatRole(user?.role)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* User ID Card */}
                    <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 backdrop-blur-sm hover:bg-slate-800/50 transition">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                          <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                          </svg>
                        </div>
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
                          User ID
                        </h3>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        #{user?.id}
                      </p>
                    </div>

                    {/* Email Card */}
                    <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 backdrop-blur-sm hover:bg-slate-800/50 transition">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          <svg className="h-5 w-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
                          Email Address
                        </h3>
                      </div>
                      <p className="text-lg font-medium text-white break-all">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  {/* Full Name Card */}
                  <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 backdrop-blur-sm hover:bg-slate-800/50 transition">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <svg className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
                        Full Name
                      </h3>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {user?.name}
                    </p>
                  </div>

                  {/* Account Status */}
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                          <svg className="h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-emerald-300 uppercase tracking-wide">
                            Account Status
                          </h3>
                          <p className="text-lg font-medium text-white mt-1">
                            Verified & Active
                          </p>
                        </div>
                      </div>
                      <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                  </div>

                  {user?.studentProfile && (
                    <div className="grid gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 sm:grid-cols-2">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-slate-400">
                          Enrollment Number
                        </p>
                        <p className="mt-2 text-xl font-semibold text-white">
                          {user.studentProfile.enrollmentNo}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-slate-400">
                          Department
                        </p>
                        <p className="mt-2 text-xl font-semibold text-white">
                          {user.studentProfile.department}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-slate-400">
                          Semester
                        </p>
                        <p className="mt-2 text-xl font-semibold text-white">
                          {user.studentProfile.semester}
                        </p>
                      </div>
                      {(user.studentProfile.guardianName ||
                        user.studentProfile.guardianPhone) && (
                        <div>
                          <p className="text-xs uppercase tracking-widest text-slate-400">
                            Guardian
                          </p>
                          <p className="mt-2 text-sm text-slate-200">
                            {user.studentProfile.guardianName}
                          </p>
                          <p className="text-sm text-slate-400">
                            {user.studentProfile.guardianPhone}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {user?.facultyProfile && (
                    <div className="grid gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 sm:grid-cols-2">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-slate-400">
                          Employee Code
                        </p>
                        <p className="mt-2 text-xl font-semibold text-white">
                          {user.facultyProfile.employeeCode}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-slate-400">
                          Department
                        </p>
                        <p className="mt-2 text-xl font-semibold text-white">
                          {user.facultyProfile.department}
                        </p>
                      </div>
                      {user.facultyProfile.specialization && (
                        <div className="sm:col-span-2">
                          <p className="text-xs uppercase tracking-widest text-slate-400">
                            Specialization
                          </p>
                          <p className="mt-2 text-xl font-semibold text-white">
                            {user.facultyProfile.specialization}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

