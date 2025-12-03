"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken, decodeToken } from "@/lib/auth-client";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      return;
    }

    // Decode token to get role and redirect
    const decoded = decodeToken(token);
    if (decoded?.role) {
      if (decoded.role === "ADMIN") {
        router.replace("/admin/dashboard");
      } else if (decoded.role === "FACULTY") {
        router.replace("/faculty/dashboard");
      } else if (decoded.role === "STUDENT") {
        router.replace("/student/dashboard");
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="text-center space-y-6">
        <div className="animate-spin h-12 w-12 text-blue-500 mx-auto" />
        <p className="text-slate-400">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}


