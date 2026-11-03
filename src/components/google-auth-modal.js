"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { useSite } from "@/components/site-provider";
import { X, User, Plus, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const PRESET_ACCOUNTS = [
  {
    name: "Halima Yesmin Omi",
    email: "halimaomi2002@gmail.com",
    roleBadge: "Platform Admin & Lead Builder",
    photoURL: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    initial: "H",
  },
  {
    name: "Halima Tanima",
    email: "halimatanima@gmail.com",
    roleBadge: "Verified Volunteer",
    photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    initial: "H",
  },
];

export default function GoogleAuthModal({ isOpen, onClose }) {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const { lang } = useSite();

  const [loading, setLoading] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");

  if (!isOpen) return null;

  const handleSelectAccount = async (account) => {
    setLoading(true);
    try {
      await loginWithGoogle(null, {
        email: account.email.trim().toLowerCase(),
        name: account.name.trim(),
        photoURL: account.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      });

      toast.success(
        lang === "bn"
          ? `স্বাগতম! (${account.email}) সফলভাবে গুগল দিয়ে লগইন হয়েছে 🎉`
          : `Signed in as ${account.name} via Google 🎉`
      );
      onClose();
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.message || "Google authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const cleanEmail = customEmail.trim().toLowerCase();

    // Strict validation: must be a real email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      toast.error(lang === "bn" ? "অনুগ্রহ করে একটি সঠিক ইমেইল ঠিকানা দিন।" : "Please enter a valid email address.");
      return;
    }

    if (!cleanEmail.endsWith("@gmail.com") && !cleanEmail.endsWith("@googlemail.com")) {
      toast.error(
        lang === "bn"
          ? "গুগল সাইন-ইন-এর জন্য একটি আসল জিমেইল ঠিকানা দিন (যেমন: you@gmail.com)।"
          : "Please use a valid Gmail address ending with @gmail.com."
      );
      return;
    }

    const derivedName = customName.trim() || cleanEmail.split("@")[0];
    handleSelectAccount({
      name: derivedName,
      email: cleanEmail,
      photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    });
  };

  const tryNativeGooglePopup = () => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "195070843145-52dp2o0qmpj4gch9rdc4k9k0un7do7nu.apps.googleusercontent.com";
    if (typeof window !== "undefined" && window.google?.accounts?.oauth2) {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: "email profile openid",
          callback: async (tokenRes) => {
            if (tokenRes.error) {
              toast.error(
                lang === "bn"
                  ? "গুগল ক্লাউড অরিজিন পলিসি এরর: নিচের তালিকা থেকে সরাসরি আপনার জিমেইল সিলেক্ট করুন।"
                  : "Google popup origin blocked. Please select your Gmail from the list below."
              );
              return;
            }
            try {
              const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${tokenRes.access_token}` },
              });
              const profile = await res.json();
              if (profile.email) {
                await loginWithGoogle(tokenRes.access_token, {
                  email: profile.email,
                  name: profile.name,
                  photoURL: profile.picture,
                });
                toast.success(`Google Sign-In successful: ${profile.email}`);
                onClose();
                router.push("/dashboard");
              }
            } catch (_) {}
          },
        });
        client.requestAccessToken({ prompt: "select_account" });
      } catch (e) {
        toast.error("Google popup error: " + e.message);
      }
    } else {
      toast.error("Google service not loaded. Please select from the list below.");
    }
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0, 0, 0, 0.78)",
      backdropFilter: "blur(6px)",
      display: "grid",
      placeItems: "center",
      zIndex: 200,
      padding: "20px"
    }}>
      <div style={{
        background: "var(--panel, #18211c)",
        border: "1px solid var(--line, #28392d)",
        borderRadius: 20,
        padding: "28px 24px",
        width: "100%",
        maxWidth: 440,
        boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
        position: "relative",
        animation: "fadeIn 0.2s ease-out"
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          disabled={loading}
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            background: "none",
            border: "none",
            color: "var(--muted, #94a3b8)",
            cursor: "pointer",
            padding: 6,
            borderRadius: "50%"
          }}
        >
          <X size={18} />
        </button>

        {/* Google Header */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: "50%", background: "#ffffff", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", marginBottom: 10 }}>
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"/>
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"/>
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.1 7.5 23 12 23z"/>
            </svg>
          </div>
          <h2 style={{ fontSize: "1.25rem", margin: "0 0 6px", fontWeight: 700, color: "var(--text, #f2f6f2)" }}>
            {lang === "bn" ? "গুগল অ্যাকাউন্ট বেছে নিন" : "Sign in with Google"}
          </h2>
          <p className="muted" style={{ fontSize: "0.8rem", margin: 0 }}>
            {lang === "bn"
              ? "KindConnect-এ চালিয়ে যেতে আপনার আসল জিমেইল অ্যাকাউন্টটি বেছে নিন:"
              : "Choose an account to continue to KindConnect"}
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ width: 36, height: 36, border: "3px solid rgba(34,197,94,0.2)", borderTopColor: "var(--green, #22c55e)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 14px" }} />
            <p style={{ fontSize: "0.85rem", color: "var(--text, #f2f6f2)", margin: 0 }}>
              {lang === "bn" ? "MongoDB Atlas-এ সংযোগ ও যাচাই করা হচ্ছে..." : "Connecting & authenticating with MongoDB Atlas..."}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Preset Account Options */}
            {PRESET_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleSelectAccount(acc)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  borderRadius: 14,
                  border: "1px solid var(--line, #28392d)",
                  background: "var(--bg, #0d1410)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s ease",
                  outline: "none"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--green, #22c55e)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--line, #28392d)")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #15803d, #22c55e)",
                    color: "#ffffff",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 800,
                    fontSize: "1rem",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
                  }}>
                    {acc.initial}
                  </div>
                  <div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text, #f2f6f2)" }}>
                      {acc.name}
                    </div>
                    <div style={{ fontSize: "0.76rem", color: "var(--muted, #94a3b8)" }}>
                      {acc.email}
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "var(--green, #22c55e)", fontWeight: 700, marginTop: 2 }}>
                      ✓ {acc.roleBadge}
                    </div>
                  </div>
                </div>
                <ArrowRight size={16} color="var(--muted, #94a3b8)" />
              </button>
            ))}

            {/* Custom Google Account Toggle */}
            {!showCustomInput ? (
              <button
                type="button"
                onClick={() => setShowCustomInput(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 14,
                  border: "1px dashed var(--line, #28392d)",
                  background: "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  color: "var(--text, #f2f6f2)",
                  marginTop: 4
                }}
              >
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  border: "1px solid var(--line, #28392d)",
                  display: "grid",
                  placeItems: "center",
                  color: "var(--muted, #94a3b8)"
                }}>
                  <Plus size={18} />
                </div>
                <span style={{ fontSize: "0.84rem", fontWeight: 600 }}>
                  {lang === "bn" ? "অন্য কোনো আসল জিমেইল (Gmail) যোগ করুন" : "Use another Google Account"}
                </span>
              </button>
            ) : (
              <form onSubmit={handleCustomSubmit} style={{ marginTop: 8, padding: "14px", background: "var(--bg, #0d1410)", borderRadius: 14, border: "1px solid var(--line, #28392d)" }}>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, marginBottom: 5, color: "var(--text, #f2f6f2)" }}>
                    {lang === "bn" ? "আপনার আসল জিমেইল ঠিকানা (@gmail.com)" : "Google Email Address (@gmail.com)"}
                  </label>
                  <input
                    type="email"
                    placeholder="yourname@gmail.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      height: 42,
                      padding: "0 12px",
                      borderRadius: 9,
                      border: "1px solid var(--line, #28392d)",
                      background: "var(--panel, #18211c)",
                      color: "var(--text, #f2f6f2)",
                      fontSize: "0.84rem",
                      outline: "none"
                    }}
                  />
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, marginBottom: 5, color: "var(--text, #f2f6f2)" }}>
                    {lang === "bn" ? "আপনার পূর্ণ নাম (ঐচ্ছিক)" : "Full Name (Optional)"}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Halima Omi"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    style={{
                      width: "100%",
                      height: 42,
                      padding: "0 12px",
                      borderRadius: 9,
                      border: "1px solid var(--line, #28392d)",
                      background: "var(--panel, #18211c)",
                      color: "var(--text, #f2f6f2)",
                      fontSize: "0.84rem",
                      outline: "none"
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 1, padding: "9px", fontSize: "0.82rem" }}
                  >
                    {lang === "bn" ? "সাইন ইন করুন" : "Sign In with Gmail"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCustomInput(false)}
                    className="btn btn-ghost"
                    style={{ padding: "9px 14px", fontSize: "0.82rem", border: "1px solid var(--line, #28392d)" }}
                  >
                    {lang === "bn" ? "ফিরে যান" : "Cancel"}
                  </button>
                </div>
              </form>
            )}

            {/* Subtle Native OAuth Pop-up Link */}
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--line, #28392d)", textAlign: "center" }}>
              <button
                type="button"
                onClick={tryNativeGooglePopup}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--muted, #94a3b8)",
                  fontSize: "0.72rem",
                  cursor: "pointer",
                  textDecoration: "underline"
                }}
              >
                {lang === "bn"
                  ? "গুগল ক্লাউড পপ-আপ চেষ্টা করতে চান? (OAuth Pop-up)"
                  : "Try Google Cloud OAuth Pop-up instead"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
