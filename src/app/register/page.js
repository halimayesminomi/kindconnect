"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeartHandshake, ArrowUpRight, User, Mail, LockKeyhole, ImageIcon, Eye, EyeOff, ShieldCheck, CheckCircle2, UploadCloud, Camera, Smartphone, Laptop, Trash2, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/auth-provider";
import { useSite } from "@/components/site-provider";
import { validateRealEmail, validateRealName } from "@/lib/email-validator";
import { processImageFile } from "@/lib/image-utils";
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

export default function Register() {
  const router = useRouter();
  const { register, loginWithGoogle, user } = useAuth();
  const { lang, toggleLang, t } = useSite();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [photoURL, setPhotoURL] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    const toastId = toast.loading(lang === "bn" ? "ফোন/ল্যাপটপ থেকে ছবি প্রসেস করা হচ্ছে..." : "Processing photo...");
    try {
      const compressedDataUrl = await processImageFile(file, 400, 400, 0.85);
      setPhotoURL(compressedDataUrl);
      toast.success(lang === "bn" ? "প্রোফাইল ছবি সফলভাবে যুক্ত হয়েছে! 📷" : "Photo added successfully! 📷", { id: toastId });
    } catch (err) {
      toast.error(err.message || (lang === "bn" ? "ছবি আপলোডে ত্রুটি হয়েছে।" : "Failed to load photo."), { id: toastId });
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

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
    const formPhotoInput = form.photoURLInput?.value?.trim() || "";
    const finalPhotoURL = photoURL || formPhotoInput || "";

    if (!name || !email || !password) {
      toast.error(lang === "bn" ? "সবগুলো প্রয়োজনীয় ফিল্ড পূরণ করুন।" : "Please fill in all required fields.");
      return;
    }

    const nameValidation = validateRealName(name);
    if (!nameValidation.isValid) {
      toast.error(lang === "bn" ? (nameValidation.errorBn || nameValidation.error) : nameValidation.error);
      return;
    }

    // Strict validation enforcing genuine Gmail only (@gmail.com)
    const emailValidation = validateRealEmail(email, { requireGmail: true });
    if (!emailValidation.isValid) {
      toast.error(lang === "bn" ? (emailValidation.errorBn || emailValidation.error) : emailValidation.error);
      return;
    }

    if (password.length < 6) {
      toast.error(lang === "bn" ? "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" : "Password must be at least 6 characters.");
      return;
    }
    if (!form.terms.checked) {
      toast.error(lang === "bn" ? "অনুগ্রহ করে শর্তাবলীতে সম্মতি জানান।" : "Please agree to the Terms of Service.");
      return;
    }

    setLoading(true);
    try {
      const res = await register(name, email, password, finalPhotoURL);
      toast.success(lang === "bn" ? `অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! স্বাগতম ${name} 🎉` : "Account created! Welcome to KindConnect 🎉");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.message || "Registration failed. Please try again.");
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
              toast.error(lang === "bn" ? "গুগল সাইন-আপ পপ-আপ বাতিল করা হয়েছে।" : "Google sign-up popup cancelled.");
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

            toast.success(lang === "bn" ? `স্বাগতম ${profile.name || cleanGoogleEmail}! গুগল দিয়ে সফলভাবে অ্যাকাউন্ট তৈরি হয়েছে 🎉` : `Welcome ${profile.name || cleanGoogleEmail}! Signed up via Google 🎉`);
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
      toast.error(lang === "bn" ? "গুগল সার্ভিস শুরু করতে সমস্যা: " + err.message : "Google Auth Error: " + err.message);
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
          <span className="eyebrow">{lang === "bn" ? "আসল জিমেইল ভেরিফিকেশন" : "GENUINE GMAIL VERIFICATION"}</span>
          <h2>{t("signUpTitle")}</h2>
          <p className="muted">{t("signUpSubtitle")}</p>

          {/* Social Sign Up Button with Google Popup */}
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
              <span>{lang === "bn" ? "Google অ্যাকাউন্ট দিয়ে সাইন আপ করুন (পপ-আপ)" : "Sign up with Google (Popup)"}</span>
            </button>
            <div style={{ textAlign: "center" }}>
              <small className="muted" style={{ fontSize: "0.72rem" }}>
                {lang === "bn" ? "⚡ গুগল পপ-আপ থেকে আপনার আসল Gmail সিলেক্ট করে এক ক্লিকে যুক্ত হোন" : "⚡ Choose your authentic Gmail in the Google popup"}
              </small>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", margin: "16px 0", gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
            <span className="muted" style={{ fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: 0.5 }}>
              {lang === "bn" ? "অথবা আসল Gmail ফর্ম পূরণ করুন" : "or with authentic Gmail"}
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
          </div>

          <form onSubmit={handleSubmit}>
            <label>{t("fullNameLabel")} *</label>
            <div className="input-wrap">
              <User size={17} />
              <input name="fullname" placeholder={lang === "bn" ? "আপনার পুরো আসল নাম" : "Your full genuine name"} required/>
            </div>

            <label style={{ marginTop: 14 }}>{lang === "bn" ? "আসল Gmail অ্যাড্রেস (@gmail.com) *" : "Genuine Gmail (@gmail.com) *"}</label>
            <div className="input-wrap">
              <Mail size={17} />
              <input
                name="email"
                type="email"
                placeholder="yourname@gmail.com"
                required
                autoCapitalize="none"
                autoCorrect="off"
              />
            </div>
            <small className="muted" style={{ fontSize: "0.7rem", marginTop: 4, display: "block", color: "var(--green)" }}>
              🔒 {lang === "bn" ? "শুধুমাত্র আসল ও ভেরিফাইড @gmail.com বাধ্যতামূলক (ভুয়া ইমেইল ব্লক করা হবে)।" : "Only authentic @gmail.com accounts are accepted. Fake emails are blocked."}
            </small>

            {/* Native Mobile Gallery / Laptop Photo Upload */}
            <div style={{ marginTop: 16, background: "rgba(0,0,0,0.03)", border: "1px solid var(--line)", borderRadius: 12, padding: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 6 }}>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, margin: 0 }}>
                  {lang === "bn" ? "প্রোফাইল ছবি (মোবাইল গ্যালারি / ল্যাপটপ ফাইল)" : "Profile Photo (Gallery / Device Upload)"}
                </label>
                <div style={{ display: "flex", gap: 4 }}>
                  <span style={{ fontSize: "0.65rem", padding: "2px 6px", borderRadius: 4, background: "rgba(34, 197, 94, 0.12)", color: "var(--green)", fontWeight: 700 }}>
                    গ্যালারি
                  </span>
                  <span style={{ fontSize: "0.65rem", padding: "2px 6px", borderRadius: 4, background: "rgba(59, 130, 246, 0.12)", color: "#3b82f6", fontWeight: 700 }}>
                    ফাইল
                  </span>
                </div>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileSelected}
              />

              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                {photoURL ? (
                  <div style={{ position: "relative" }}>
                    <img
                      src={photoURL}
                      alt="Selected preview"
                      style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--green)" }}
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoURL("")}
                      style={{
                        position: "absolute",
                        top: -4,
                        right: -4,
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: "#ef4444",
                        color: "#fff",
                        border: "none",
                        display: "grid",
                        placeItems: "center",
                        cursor: "pointer",
                      }}
                      title="ছবি মুছুন"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      background: "rgba(0,0,0,0.06)",
                      border: "2px dashed var(--line)",
                      display: "grid",
                      placeItems: "center",
                      color: "var(--muted)"
                    }}
                  >
                    <Camera size={22} />
                  </div>
                )}

                <div style={{ flex: 1, minWidth: 180 }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="btn btn-outline"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      fontSize: "0.8rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      borderRadius: 8
                    }}
                  >
                    {uploadingPhoto ? (
                      <>
                        <Loader2 size={14} className="spin" />
                        <span>{lang === "bn" ? "প্রসেস হচ্ছে..." : "Processing..."}</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud size={15} />
                        <span>{lang === "bn" ? "📷 ফোন গ্যালারি বা ল্যাপটপ থেকে ছবি নিন" : "📷 Pick from Gallery / Laptop"}</span>
                      </>
                    )}
                  </button>
                  <small className="muted" style={{ fontSize: "0.68rem", display: "block", marginTop: 4 }}>
                    {photoURL ? (lang === "bn" ? "✓ ছবি যুক্ত হয়েছে!" : "✓ Photo selected!") : (lang === "bn" ? "ক্লিক করলেই ফোনের ফটো বা পিসির ফাইল সিলেক্ট হবে" : "Tap to open mobile camera/gallery or PC files")}
                  </small>
                </div>
              </div>

              {/* Optional Web Link Input Fallback */}
              {!photoURL && (
                <div style={{ marginTop: 10, position: "relative" }}>
                  <ImageIcon size={15} color="var(--muted)" style={{ position: "absolute", left: 10, top: 10 }} />
                  <input
                    name="photoURLInput"
                    placeholder={lang === "bn" ? "অথবা ছবির অনলাইন লিংক (ঐচ্ছিক)" : "Or online image URL (optional)"}
                    style={{
                      width: "100%",
                      padding: "8px 10px 8px 32px",
                      fontSize: "0.78rem",
                      borderRadius: 8,
                      border: "1px solid var(--line)",
                      background: "var(--bg)",
                      color: "var(--text)",
                      outline: "none"
                    }}
                  />
                </div>
              )}
            </div>

            <label style={{ marginTop: 14 }}>{t("passwordLabel")} *</label>
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

            <label className="check-label terms" style={{ marginTop: 14 }}>
              <input name="terms" type="checkbox" required/> {t("agreeTerms")}
            </label>

            <button className="btn btn-primary btn-block" type="submit" disabled={loading} style={{ marginTop: 16 }}>
              {loading ? (lang === "bn" ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "Creating account...") : (lang === "bn" ? "আসল Gmail দিয়ে অ্যাকাউন্ট তৈরি করুন" : t("signUpAction"))}
              {!loading && <ArrowUpRight size={17}/>}
            </button>

            <p className="auth-switch" style={{ marginTop: 20 }}>
              {t("alreadyMember")} <Link href="/login">{t("signInAction")}</Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
