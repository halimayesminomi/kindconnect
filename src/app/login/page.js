"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeartHandshake, ArrowUpRight, Mail, LockKeyhole, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { useSite } from "@/components/site-provider";
import { validateRealEmail } from "@/lib/email-validator";
import toast from "react-hot-toast";

// Helper to ensure Google GIS script is safely and dynamically loaded
const ensureGoogleClient = () => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("Browser environment required"));
    if (window.google?.accounts?.oauth2) return resolve(window.google);
    const existing = document.getElementById("google-gis-script");
    if (existing) {
      existing.addEventListener("load", () => resolve(window.google));
      existing.addEventListener("error", () => reject(new Error("Failed to load Google Identity Services")));
      return;
    }
    const script = document.createElement("script");
    script.id = "google-gis-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error("Failed to load Google Identity Services"));
    document.head.appendChild(script);
  });
};

export default function Login() {
  const router = useRouter();
  const { login, loginWithGoogle, user } = useAuth();
  const { lang, toggleLang, t } = useSite();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value;

    if (!email || !password) {
      toast.error(lang === "bn" ? "সবগুলো ফিল্ড পূরণ করুন।" : "Please fill in all fields.");
      return;
    }

    // If identifier is an email, strictly validate it's not a disposable/fake email
    if (email.includes("@")) {
      const emailValidation = validateRealEmail(email);
      if (!emailValidation.isValid) {
        toast.error(lang === "bn" ? (emailValidation.errorBn || emailValidation.error) : emailValidation.error);
        return;
      }
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      if (res?.isLocal) {
        toast.success(`Welcome back, ${res.user.name}! 🎉`);
      } else {
        toast.success(lang === "bn" ? `স্বাগতম! সফলভাবে লগইন হয়েছে 🎉` : "Welcome back! 🎉");
      }
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "195070843145-52dp2o0qmpj4gch9rdc4k9k0un7do7nu.apps.googleusercontent.com";

    setLoading(true);
    try {
      const google = await ensureGoogleClient();
      const client = google.accounts.oauth2.initTokenClient({
        client_id: googleClientId,
        scope: "email profile openid",
        prompt: "select_account", // Explicitly launches Google Account Chooser popup
        callback: async (tokenRes) => {
          if (tokenRes.error) {
            setLoading(false);
            if (tokenRes.error === "popup_closed_by_user") {
              toast.error(lang === "bn" ? "গুগল সাইন-ইন পপ-আপ বাতিল করা হয়েছে।" : "Google sign-in popup cancelled.");
            } else {
              toast.error(lang === "bn" ? "গুগল অথেন্টিকেশন এরর: " + tokenRes.error : "Google Auth Error: " + tokenRes.error);
            }
            return;
          }

          try {
            const googleProfileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
              headers: { Authorization: `Bearer ${tokenRes.access_token}` },
            });
            const profile = await googleProfileRes.json();
            if (!profile.email) {
              throw new Error(lang === "bn" ? "গুগল থেকে আসল ইমেইল তথ্য পাওয়া যায়নি।" : "No verified email returned from Google.");
            }

            const cleanGoogleEmail = profile.email.toLowerCase().trim();
            const emailCheck = validateRealEmail(cleanGoogleEmail, { requireGmail: true });
            if (!emailCheck.isValid) {
              throw new Error(emailCheck.errorBn || emailCheck.error);
            }

            await loginWithGoogle(tokenRes.access_token, {
              email: cleanGoogleEmail,
              name: profile.name || cleanGoogleEmail.split("@")[0],
              photoURL: profile.picture,
            });

            toast.success(lang === "bn" ? `স্বাগতম ${profile.name || cleanGoogleEmail}! গুগল দিয়ে সফলভাবে লগইন হয়েছে 🎉` : `Welcome ${profile.name || cleanGoogleEmail}! Signed in via Google 🎉`);
            router.push("/dashboard");
          } catch (err) {
            toast.error(err.message || "Failed to complete Google sign in.");
          } finally {
            setLoading(false);
          }
        },
      });

      client.requestAccessToken({ prompt: "select_account" });
    } catch (err) {
      setLoading(false);
      toast.error(lang === "bn" ? "গুগল সার্ভিস শুরু করতে সমস্যা: " + err.message : "Google Client Error: " + err.message);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-art">
        <Link href="/" className="brand">
          <span className="brand-mark"><HeartHandshake/></span>
          <span>kind<span className="brand-accent">connect</span><small>CONNECT PEOPLE. CREATE IMPACT.</small></span>
        </Link>
        <div className="auth-art-copy">
          <span className="eyebrow">{lang === "bn" ? "স্বাগতম" : "WELCOME BACK"}</span>
          <h1>{lang === "bn" ? <>আপনার পরবর্তী<br/>মহৎ কাজ<br/><span className="gradient-text">এখানেই শুরু।</span></> : <>Your next<br/>good thing<br/><span className="gradient-text">starts here.</span></>}</h1>
          <p>{lang === "bn" ? "যেখান থেকে থেমেছিলেন সেখান থেকেই শুরু করুন। আপনার সম্প্রদায় অপেক্ষা করছে।" : "Pick up where you left off. Your community is waiting."}</p>
        </div>
        <div className="auth-art-foot">{lang === "bn" ? "ছোট ছোট পদক্ষেপ। শক্তিশালী সমাজ।" : "Small actions. Stronger communities."} <span>♥</span></div>
      </div>
      <div className="auth-form-side">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <Link href="/" className="back-link" style={{ margin: 0 }}>← {t("backToWebsite")}</Link>
          <button
            type="button"
            onClick={toggleLang}
            className="btn btn-ghost"
            style={{ padding: "4px 10px", fontSize: "0.78rem", borderRadius: 8, border: "1px solid var(--line)" }}
          >
            {lang === "en" ? "বাং" : "EN"}
          </button>
        </div>
        <div className="auth-form">
          <span className="eyebrow">{lang === "bn" ? "আপনার সামাজিক প্রভাবের স্থান" : "YOUR IMPACT SPACE"}</span>
          <h2>{t("signInTitle")}</h2>
          <p className="muted">{t("signInSubtitle")}</p>

          {/* Social Login Button with Google Popup */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "20px 0 16px 0" }}>
            <button
              type="button"
              className="btn btn-outline btn-block"
              onClick={handleGoogleAuth}
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                fontWeight: 700,
                padding: "13px 18px",
                borderRadius: 12,
                border: "1.5px solid var(--line)",
                background: "var(--panel)",
                boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"/>
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"/>
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.1 7.5 23 12 23z"/>
              </svg>
              <span>{lang === "bn" ? "Google অ্যাকাউন্ট দিয়ে সাইন ইন করুন (পপ-আপ)" : "Continue with Google (Popup)"}</span>
            </button>
            <div style={{ textAlign: "center" }}>
              <small className="muted" style={{ fontSize: "0.72rem" }}>
                {lang === "bn" ? "⚡ গুগল পপ-আপ থেকে আপনার আসল Gmail সিলেক্ট করে নিরাপদে সাইন ইন করুন" : "⚡ Select your genuine Gmail in the popup"}
              </small>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", margin: "16px 0", gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
            <span className="muted" style={{ fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: 0.5 }}>
              {lang === "bn" ? "অথবা ইমেইল / ইউজারনেম দিয়ে" : "or with email / username"}
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
          </div>

          <form onSubmit={handleSubmit}>
            <label>{t("emailOrUsername")} *</label>
            <div className="input-wrap">
              <Mail size={17} />
              <input
                name="email"
                type="text"
                placeholder={lang === "bn" ? "আপনার আসল Gmail বা অ্যাডমিন ইউজারনেম (omi)" : "you@gmail.com or username (e.g. omi)"}
                required
                autoCapitalize="none"
                autoCorrect="off"
              />
            </div>

            <label style={{ marginTop: 14 }}>{t("passwordLabel")} *</label>
            <div className="input-wrap" style={{ position: "relative" }}>
              <LockKeyhole size={17} />
              <input 
                name="password" 
                type={showPassword ? "text" : "password"} 
                placeholder={lang === "bn" ? "পাসওয়ার্ড দিন" : "Enter your password"} 
                required
                style={{ flex: 1, paddingRight: 32 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--muted)",
                  cursor: "pointer",
                  padding: "4px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            <div className="form-between" style={{ margin: "14px 0" }}>
              <label className="check-label"><input type="checkbox"/> {t("rememberMe")}</label>
              <Link href="/contact" className="muted" style={{ fontSize: "0.75rem" }}>{t("forgotPass")}</Link>
            </div>

            <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
              {loading ? (lang === "bn" ? "সাইন ইন হচ্ছে..." : "Signing in...") : t("signInAction")}
              {!loading && <ArrowUpRight size={17}/>}
            </button>

            <p className="auth-switch" style={{ marginTop: 22 }}>
              {t("newToKindConnect")} <Link href="/register">{t("signUpAction")}</Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
