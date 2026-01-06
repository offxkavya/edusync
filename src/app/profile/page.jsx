"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAuthToken, clearAuthToken } from "@/lib/auth-client";
import DashboardLayout from "@/components/DashboardLayout";

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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading your profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error && !user) {
    return (
      <DashboardLayout>
        <div className="rounded-xl border border-red-500/20 bg-red-50 text-red-700 p-6 text-center max-w-md mx-auto mt-10">
          <p className="mb-4">{error}</p>
          <Link
            href="/login"
            className="inline-block rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
          >
            Go to Login
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              My Profile
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your personal information and settings.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary ring-4 ring-background">
                    {getInitials(user?.name || "")}
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center" title="Active">
                    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left space-y-1">
                  <h2 className="text-2xl font-bold text-foreground">
                    {user?.name}
                  </h2>
                  <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs font-semibold text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    {formatRole(user?.role)}
                  </div>
                  <p className="text-muted-foreground text-sm pt-2">
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg border border-border bg-muted/50">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">User ID</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">#{user?.id}</p>
                </div>
                <div className="p-4 rounded-lg border border-border bg-muted/50">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Account Status</p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-semibold text-foreground">Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Role Specific Details */}
            {user?.studentProfile && (
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-4">Student Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Enrollment No.</label>
                    <p className="mt-1 text-base font-medium text-foreground">{user.studentProfile.enrollmentNo}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Department</label>
                    <p className="mt-1 text-base font-medium text-foreground">{user.studentProfile.department}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Semester</label>
                    <p className="mt-1 text-base font-medium text-foreground">{user.studentProfile.semester}</p>
                  </div>
                  {(user.studentProfile.guardianName || user.studentProfile.guardianPhone) && (
                    <div className="sm:col-span-2 p-4 rounded-lg bg-muted/30 border border-border">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Guardian Info</label>
                      <p className="mt-2 text-sm font-medium text-foreground">{user.studentProfile.guardianName}</p>
                      <p className="text-sm text-muted-foreground">{user.studentProfile.guardianPhone}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {user?.facultyProfile && (
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-4">Faculty Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Employee Code</label>
                    <p className="mt-1 text-base font-medium text-foreground">{user.facultyProfile.employeeCode}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Department</label>
                    <p className="mt-1 text-base font-medium text-foreground">{user.facultyProfile.department}</p>
                  </div>
                  {(user.facultyProfile.specialization) && (
                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Specialization</label>
                      <p className="mt-1 text-base font-medium text-foreground">{user.facultyProfile.specialization}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Account Actions */}
            {/* Placeholder for future detailed edit/settings */}
          </div>

          {/* Sidebar Info - Quick Stats */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-primary/5 p-6">
              <h3 className="text-sm font-semibold text-primary mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 rounded-lg bg-background border border-border text-sm font-medium text-foreground hover:bg-muted transition">
                  Change Password
                </button>
                <button className="w-full text-left px-4 py-2 rounded-lg bg-background border border-border text-sm font-medium text-foreground hover:bg-muted transition">
                  Notification Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
