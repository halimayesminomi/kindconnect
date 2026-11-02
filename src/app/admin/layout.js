"use client";

import { useAuth } from "@/components/auth-provider";
import { DashboardShell } from "@/components/dashboard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function Layout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "admin") {
        toast.error("Access denied. Admin privileges required.");
        router.push("/dashboard");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--bg)", color: "var(--text)" }}>
        <p>Verifying Admin Privileges...</p>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
