"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("KindConnect Global Fatal Exception Caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{
        margin: 0,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
        background: "#0b110e",
        color: "#f2f6f2",
        padding: "20px",
        textAlign: "center"
      }}>
        <div style={{
          maxWidth: 460,
          width: "100%",
          padding: "36px 28px",
          borderRadius: "18px",
          background: "#141c18",
          border: "1px solid #26312b",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
        }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: 8, color: "#b7f36b" }}>
            KindConnect
          </h2>
          <p style={{ fontSize: "0.88rem", color: "#94a3b8", marginBottom: 24, lineHeight: 1.5 }}>
            একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। অনুগ্রহ করে পেজটি রিফ্রেশ করুন।
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button
              onClick={() => {
                try { reset(); } catch (_) { window.location.href = "/"; }
              }}
              style={{
                background: "#b7f36b",
                color: "#0b110e",
                border: "none",
                padding: "10px 20px",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "0.86rem",
                cursor: "pointer"
              }}
            >
              রিফ্রেশ করুন / Refresh
            </button>
            <button
              onClick={() => { window.location.href = "/"; }}
              style={{
                background: "transparent",
                color: "#f2f6f2",
                border: "1px solid #26312b",
                padding: "10px 20px",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "0.86rem",
                cursor: "pointer"
              }}
            >
              হোমপেজ / Home
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
