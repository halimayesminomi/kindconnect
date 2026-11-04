"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("KindConnect Client Exception Caught:", error);
  }, [error]);

  const handleReset = () => {
    try {
      reset();
    } catch (_) {
      window.location.reload();
    }
  };

  return (
    <div style={{
      minHeight: "80vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      color: "var(--text, #f2f6f2)",
      background: "var(--bg, #0b110e)",
      textAlign: "center"
    }}>
      <div style={{
        maxWidth: 480,
        width: "100%",
        padding: "36px 28px",
        borderRadius: "18px",
        background: "var(--surface, #141c18)",
        border: "1px solid var(--line, #26312b)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.4)"
      }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "rgba(239, 68, 68, 0.15)",
          color: "#ef4444",
          display: "grid",
          placeItems: "center",
          margin: "0 auto 16px"
        }}>
          <AlertTriangle size={28} />
        </div>
        <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: 8 }}>
          সাময়িক সমস্যা দেখা দিয়েছে / Temporary Issue
        </h2>
        <p style={{ fontSize: "0.86rem", color: "var(--muted, #94a3b8)", marginBottom: 24, lineHeight: 1.5 }}>
          আমরা সিস্টেমটি স্বয়ংক্রিয়ভাবে সুরক্ষিত করেছি। পেজটি রিফ্রেশ করুন অথবা হোমপেজে ফিরে যান।
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={handleReset}
            className="btn btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              borderRadius: "12px",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            <RefreshCw size={15} /> আবার চেষ্টা করুন / Try Again
          </button>
          <Link
            href="/"
            className="btn btn-outline"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              borderRadius: "12px",
              fontSize: "0.85rem",
              fontWeight: 700,
              textDecoration: "none"
            }}
          >
            <Home size={15} /> হোমে ফিরুন / Home
          </Link>
        </div>
      </div>
    </div>
  );
}
