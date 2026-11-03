"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeartHandshake, ArrowUpRight, User, Mail, LockKeyhole, ImageIcon, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { useSite } from "@/components/site-provider";
import { validateRealEmail, validateRealName } from "@/lib/email-validator";
import toast from "react-hot-toast";

export default function Register() {
  const router = useRouter();
  const { register, loginWithGoogle, loginAsDemo, user } = useAuth();
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
    const name = form.fullname.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const photoURL = form.photoURL.value.trim();

    if (!name || !email || !password) { toast.error("Please fill in all required fields."); return; }

    const nameValidation = validateRealName(name);
    if (!nameValidation.isValid) {
      toast.error(lang === "bn" ? (nameValidation.errorBn || nameValidation.error) : nameValidation.error);
      return;
    }

    const emailValidation = validateRealEmail(email);
    if (!emailValidation.isValid) {
      toast.error(lang === "bn" ? (emailValidation.errorBn || emailValidation.error) : emailValidation.error);
      return;
    }

    if (password.length < 6) { toast.error("Password must be at least 6 characters."); return; }
    if (!form.terms.checked) { toast.error("Please agree to the Terms of Service."); return; }

    setLoading(true);
    try {
      const res = await register(name, email, password, photoURL);
      toast.success(lang === "bn" ? `অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! স্বাগতম ${name} 🎉` : "Account created! Welcome to KindConnect 🎉");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
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
          prompt: "select_account",
          callback: async (tokenRes) => {
            if (tokenRes.error) {
              setLoading(false);
              if (tokenRes.error === "popup_closed_by_user") {
                toast.error(lang === "bn" ? "গুগল সাইন-আপ বাতিল করা হয়েছে।" : "Google sign-up cancelled.");
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
                throw new Error("No verified email returned from Google.");
              }

              await loginWithGoogle(tokenRes.access_token, {
                email: profile.email.toLowerCase(),
                name: profile.name || profile.email.split("@")[0],
                photoURL: profile.picture,
              });

              toast.success(lang === "bn" ? `স্বাগতম ${profile.name || profile.email}! গুগল দিয়ে সফলভাবে অ্যাকাউন্ট তৈরি হয়েছে 🎉` : `Welcome ${profile.name || profile.email}! Signed up via Google 🎉`);
              router.push("/dashboard");
            } catch (err) {
              toast.error(err.message || "Failed to complete Google sign up.");
            } finally {
              setLoading(false);
            }
          },
        });
        client.requestAccessToken({ prompt: "select_account" });
      } catch (err) {
        setLoading(false);
        toast.error("Google Client Error: " + (err.message || "Unknown error"));
      }
    } else {
      toast.error(lang === "bn" ? "গুগল সার্ভিস লোড হচ্ছে, ২ সেকেন্ড পর আবার চেষ্টা করুন।" : "Google service is loading, please try again in a moment.");
    }
  };

  return <main className="auth-page">
    <div className="auth-art">
      <Link href="/" className="brand"><span className="brand-mark"><HeartHandshake/></span><span>kind<span className="brand-accent">connect</span><small>CONNECT PEOPLE. CREATE IMPACT.</small></span></Link>
      <div className="auth-art-copy">
        <span className="eyebrow">{lang === "bn" ? "ভালো কিছুর অংশ হোন" : "BE PART OF SOMETHING GOOD"}</span>
        <h1>{lang === "bn" ? <>আপনার আপনজনদের খুঁজুন।<br/>প্রভাব<br/><span className="gradient-text">তৈরি করুন।</span></> : <>Meet your<br/>people. Make<br/><span className="gradient-text">an impact.</span></>}</h1>
        <p>{lang === "bn" ? "এমন একটি সম্প্রদায়ে যুক্ত হোন যেখানে প্রতিটি সহযোগিতার হাত মূল্যবান।" : "Join a community where every helping hand counts."}</p>
      </div>
      <div className="auth-art-foot">{lang === "bn" ? "আপনার সময় মূল্যবান। আপনার দয়া অমূল্য।" : "Your time matters. Your kindness matters."} <span>♥</span></div>
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
        <span className="eyebrow">{lang === "bn" ? "আপনার যাত্রা শুরু করুন" : "START YOUR JOURNEY"}</span>
        <h2>{t("signUpTitle")}</h2>
        <p className="muted">{t("signUpSubtitle")}</p>

        {/* Social Sign Up Button */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "20px 0 16px 0" }}>
          <button
            type="button"
            className="btn btn-outline btn-block"
            onClick={handleGoogleAuth}
            disabled={loading}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 600 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"/><path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"/><path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.1 7.5 23 12 23z"/></svg>
            {t("signUpWithGoogle")}
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", margin: "16px 0", gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
          <span className="muted" style={{ fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: 0.5 }}>{lang === "bn" ? "অথবা ইমেইল দিয়ে" : "or with email"}</span>
          <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
        </div>

        <form onSubmit={handleSubmit}>
          <label>{t("fullNameLabel")}</label>
          <div className="input-wrap"><User/><input name="fullname" placeholder={lang === "bn" ? "আপনার পুরো নাম" : "Your full name"} required/></div>
          <label>{t("emailOrUsername")}</label>
          <div className="input-wrap"><Mail/><input name="email" type="email" placeholder="you@example.com" required/></div>
          <label>{t("photoUrlLabel")}</label>
          <div className="input-wrap"><ImageIcon/><input name="photoURL" placeholder="https://example.com/photo.jpg"/></div>
          <label>{t("passwordLabel")}</label>
          <div className="input-wrap" style={{ position: "relative" }}>
            <LockKeyhole size={17} />
            <input 
              name="password" 
              type={showPassword ? "text" : "password"} 
              placeholder={lang === "bn" ? "কমপক্ষে ৬টি অক্ষর" : "At least 6 characters"} 
              minLength={6} 
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
          <label className="check-label terms"><input name="terms" type="checkbox" required/> {t("agreeTerms")}</label>
          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>{loading ? (lang === "bn" ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "Creating account...") : t("signUpAction")} {!loading && <ArrowUpRight size={17}/>}</button>
          <p className="auth-switch">{t("alreadyMember")} <Link href="/login">{t("signInAction")}</Link></p>
        </form>
      </div>
    </div>
  </main>;
}
