"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeartHandshake, ArrowUpRight, Mail, LockKeyhole, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { useSite } from "@/components/site-provider";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import GoogleAuthModal from "@/components/google-auth-modal";

export default function Login() {
  const router = useRouter();
  const { login, loginWithGoogle, loginAsDemo, user } = useAuth();
  const { lang, toggleLang, t } = useSite();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

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

    if (!email || !password) { toast.error("Please fill in all fields."); return; }

    setLoading(true);
    try {
      const res = await login(email, password);
      if (res?.isLocal) {
        toast.success(`Welcome back, ${res.user.name}! 🎉`);
      } else {
        toast.success("Welcome back! 🎉");
      }
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const promptManualGoogleEmail = async (errorMsg = "") => {
    setLoading(false);
    const result = await Swal.fire({
      title: lang === "bn" ? "গুগল অ্যাকাউন্ট সাইন-ইন" : "Sign in with Google Account",
      text: lang === "bn" 
        ? (errorMsg ? `${errorMsg}\n\nআপনার আসল জিমেইল ঠিকানাটি দিন:` : "আপনার আসল জিমেইল (Gmail) ঠিকানাটি প্রদান করুন:")
        : (errorMsg ? `${errorMsg}\n\nPlease enter your real Google email address:` : "Please enter your Gmail address:"),
      input: "email",
      inputPlaceholder: "you@gmail.com",
      showCancelButton: true,
      confirmButtonText: lang === "bn" ? "সাইন ইন করুন" : "Sign In",
      cancelButtonText: lang === "bn" ? "বাতিল" : "Cancel",
      confirmButtonColor: "#15803d",
      background: "#18211c",
      color: "#f2f6f2",
      inputValidator: (value) => {
        if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return lang === "bn" ? "অনুগ্রহ করে একটি সঠিক ইমেইল দিন" : "Please enter a valid email address";
        }
      }
    });

    if (result.isConfirmed && result.value) {
      const email = result.value.trim().toLowerCase();
      setLoading(true);
      try {
        await loginWithGoogle(null, {
          email,
          name: email.split("@")[0],
          photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
        });
        toast.success(lang === "bn" ? `স্বাগতম! (${email}) সফলভাবে লগইন হয়েছে 🎉` : `Welcome! (${email}) signed in via Google 🎉`);
        router.push("/dashboard");
      } catch (err) {
        toast.error(err.message || "Google sign in failed.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleAuth = () => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "195070843145-52dp2o0qmpj4gch9rdc4k9k0un7do7nu.apps.googleusercontent.com";

    if (typeof window !== "undefined" && window.google?.accounts?.oauth2) {
      setLoading(true);
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: "email profile openid",
          callback: async (tokenRes) => {
            if (tokenRes.error) {
              setLoading(false);
              if (tokenRes.error === "popup_closed_by_user") {
                toast.error(lang === "bn" ? "গুগল সাইন ইন বাতিল করা হয়েছে।" : "Google sign in cancelled.");
                return;
              }
              await promptManualGoogleEmail(lang === "bn" ? "গুগল পপ-আপ সুরক্ষা কারণে আটকে গেছে।" : "Google popup restricted by origin policy.");
              return;
            }
            try {
              const googleProfileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${tokenRes.access_token}` },
              });
              const profile = await googleProfileRes.json();
              if (!profile.email) {
                throw new Error("No verified email returned from Google.");
              }

              await loginWithGoogle(tokenRes.access_token, {
                email: profile.email,
                name: profile.name,
                photoURL: profile.picture,
              });

              toast.success(`${profile.name || profile.email} — সফলভাবে গুগল দিয়ে লগইন হয়েছে! 🎉`);
              router.push("/dashboard");
            } catch (err) {
              await promptManualGoogleEmail();
            } finally {
              setLoading(false);
            }
          },
        });
        client.requestAccessToken({ prompt: "select_account" });
      } catch (err) {
        promptManualGoogleEmail();
      }
    } else {
      promptManualGoogleEmail();
    }
  };

  return <main className="auth-page">
    <div className="auth-art">
      <Link href="/" className="brand"><span className="brand-mark"><HeartHandshake/></span><span>kind<span className="brand-accent">connect</span><small>CONNECT PEOPLE. CREATE IMPACT.</small></span></Link>
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

        {/* Social Login Button */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "20px 0 16px 0" }}>
          <button
            type="button"
            className="btn btn-outline btn-block"
            onClick={() => setShowGoogleModal(true)}
            disabled={loading}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 600 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"/><path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"/><path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.1 7.5 23 12 23z"/></svg>
            {t("continueWithGoogle")}
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", margin: "16px 0", gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
          <span className="muted" style={{ fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: 0.5 }}>{lang === "bn" ? "অথবা ইমেইল / ইউজারনেম দিয়ে" : "or with email / username"}</span>
          <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
        </div>

        <form onSubmit={handleSubmit}>
          <label>{t("emailOrUsername")}</label>
          <div className="input-wrap"><Mail/><input name="email" type="text" placeholder={lang === "bn" ? "ইমেইল বা ইউজারনেম (যেমন: omi)" : "you@example.com or username (e.g. omi)"} required autoCapitalize="none" autoCorrect="off"/></div>
          <label>{t("passwordLabel")}</label>
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
          <div className="form-between"><label className="check-label"><input type="checkbox"/> {t("rememberMe")}</label><a href="#">{t("forgotPass")}</a></div>
          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>{loading ? (lang === "bn" ? "সাইন ইন হচ্ছে..." : "Signing in...") : t("signInAction")} {!loading && <ArrowUpRight size={17}/>}</button>
          <p className="auth-switch">{t("newToKindConnect")} <Link href="/register">{t("signUpAction")}</Link></p>
        </form>

        {/* Instant Mobile / Offline Demo Access */}
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px dashed var(--line)", textAlign: "center" }}>
          <p className="muted" style={{ fontSize: "0.74rem", margin: "0 0 10px 0" }}>
            {lang === "bn" ? "মোবাইল বা দ্রুত পরীক্ষার জন্য ১-ক্লিকে প্রবেশ করুন:" : "Testing or evaluating from mobile? Explore with 1-click:"}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                loginAsDemo("admin");
                toast.success(lang === "bn" ? "স্বাগতম, হালিমা ইয়াসমিন ওমি (অ্যাডমিন)! 🎉" : "Welcome, Halima Yesmin Omi (Admin)! 🎉");
                router.push("/dashboard");
              }}
              style={{ fontSize: "0.72rem", padding: "8px 6px", borderColor: "var(--green)", color: "var(--green)", fontWeight: 700 }}
            >
              <ShieldCheck size={14} /> {lang === "bn" ? "ডেমো অ্যাডমিন (ওমি)" : "Demo Admin (Omi)"}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                loginAsDemo("volunteer");
                toast.success(lang === "bn" ? "স্বাগতম, শ্রাবণী দাস (ভলান্টিয়ার)! 🤝" : "Welcome, Shraboni Das (Volunteer)! 🤝");
                router.push("/dashboard");
              }}
              style={{ fontSize: "0.72rem", padding: "8px 6px", fontWeight: 600 }}
            >
              {lang === "bn" ? "ডেমো ভলান্টিয়ার" : "Demo Volunteer"}
            </button>
          </div>
        </div>
      </div>
    </div>
    <GoogleAuthModal isOpen={showGoogleModal} onClose={() => setShowGoogleModal(false)} />
  </main>;
}
