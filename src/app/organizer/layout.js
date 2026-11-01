"use client";

import { useAuth } from "@/components/auth-provider";
import { DashboardShell } from "@/components/dashboard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Layout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading]);

  if (loading) return <div style={{minHeight:"100vh",display:"grid",placeItems:"center",background:"var(--bg)",color:"var(--text)"}}><p>Loading...</p></div>;
  if (!user) return null;

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
