"use client";

import { useAuth } from "@/components/auth-provider";
import { DashboardShell } from "@/components/dashboard";
import { useState } from "react";
import { ShieldCheck, LockKeyhole, ArrowRight, Eye, EyeOff, User, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";

export default function Layout({ children }) {
  const { user, loading } = useAuth();
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [localAdmin, setLocalAdmin] = useState(null);

  const activeAdmin = (user && user.role === "admin") ? user : localAdmin;

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!adminUser.trim() || !adminPass) {
      toast.error("Please provide both Admin Name and Password.");
      return;
    }

    setAuthLoading(true);
    try {
      const res = await api.adminAuth({ username: adminUser.trim(), password: adminPass });
      if (res.token) {
        localStorage.setItem("kindconnect_token", res.token);
        localStorage.removeItem("kindconnect_demo_user");
        setLocalAdmin(res.user);
        toast.success("স্বাগতম ওমি! অ্যাডমিন প্যানেল সফলভাবে আনলক হয়েছে 🎉");
        window.location.reload();
      }
    } catch (err) {
      toast.error(err.message || "ভুল অ্যাডমিন ক্রেডেনশিয়াল। শুধুমাত্র অ্যাডমিন 'omi' এবং সঠিক পাসওয়ার্ড দিয়ে প্রবেশ করা যাবে।");
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--bg)", color: "var(--text)" }}>
        <p>Verifying Admin Privileges...</p>
      </div>
    );
  }

  // If already authenticated as admin, render full panel
  if (activeAdmin && activeAdmin.role === "admin") {
    return <DashboardShell user={activeAdmin}>{children}</DashboardShell>;
  }

  // Restricted Access Gate for anyone else
  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at 50% 20%, rgba(34, 197, 94, 0.08), transparent 70%), var(--bg)",
      display: "grid",
      placeItems: "center",
      padding: "24px",
      color: "var(--text)"
    }}>
      <div style={{
        maxWidth: 440,
        width: "100%",
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: "20px",
        padding: "36px 30px",
        boxShadow: "0 20px 45px rgba(0,0,0,0.25)",
        textAlign: "center"
      }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "rgba(34, 197, 94, 0.12)",
          color: "var(--green)",
          display: "grid",
          placeItems: "center",
          margin: "0 auto 18px",
          border: "2px solid rgba(34, 197, 94, 0.25)"
        }}>
          <ShieldCheck size={32} />
        </div>

        <h2 style={{ fontSize: "1.45rem", fontWeight: 800, marginBottom: 8, letterSpacing: "-0.02em" }}>
          KindConnect Admin Portal
        </h2>
        <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 26, lineHeight: 1.5 }}>
          এই সেকশনটি শুধুমাত্র অনুমোদিত প্ল্যাটফর্ম অ্যাডমিনের জন্য সংরক্ষিত। প্রবেশ করতে অ্যাডমিন নাম ও পাসওয়ার্ড দিন।
        </p>

        <form onSubmit={handleAdminLogin} style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 700, display: "block", marginBottom: 6, color: "var(--muted)" }}>
              Admin Name / Username
            </label>
            <div style={{ position: "relative" }}>
              <User size={18} style={{ position: "absolute", left: 14, top: 13, color: "var(--muted)" }} />
              <input
                type="text"
                value={adminUser}
                onChange={(e) => setAdminUser(e.target.value)}
                placeholder="Enter admin name (e.g. omi)"
                required
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 42px",
                  borderRadius: "10px",
                  background: "var(--bg)",
                  border: "1px solid var(--line)",
                  color: "var(--text)",
                  fontSize: "0.9rem",
                  outline: "none"
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 700, display: "block", marginBottom: 6, color: "var(--muted)" }}>
              Admin Security Password
            </label>
            <div style={{ position: "relative" }}>
              <LockKeyhole size={18} style={{ position: "absolute", left: 14, top: 13, color: "var(--muted)" }} />
              <input
                type={showPass ? "text" : "password"}
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                placeholder="Enter admin password"
                required
                style={{
                  width: "100%",
                  padding: "12px 42px 12px 42px",
                  borderRadius: "10px",
                  background: "var(--bg)",
                  border: "1px solid var(--line)",
                  color: "var(--text)",
                  fontSize: "0.9rem",
                  outline: "none"
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: 13,
                  background: "none",
                  border: "none",
                  color: "var(--muted)",
                  cursor: "pointer"
                }}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="btn btn-primary"
            style={{
              width: "100%",
              marginTop: 10,
              padding: "13px",
              fontWeight: 700,
              fontSize: "0.95rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8
            }}
          >
            {authLoading ? "ভেরিফাই করা হচ্ছে..." : "Unlock Admin Panel"} {!authLoading && <ArrowRight size={17} />}
          </button>
        </form>

        <div style={{ marginTop: 22, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
          <Link href="/" style={{ fontSize: "0.82rem", color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <ArrowLeft size={14} /> সাধারণ ওয়েবসাইটে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
