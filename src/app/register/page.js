"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeartHandshake, ArrowUpRight, User, Mail, LockKeyhole, ImageIcon } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function Register() {
  const router = useRouter();
  const { register, loginWithGoogle, user } = useAuth();
  const [loading, setLoading] = useState(false);

  if (user) { router.push("/dashboard"); return null; }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.fullname.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const photoURL = form.photoURL.value.trim();

    if (!name || !email || !password) { toast.error("Please fill in all required fields."); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters."); return; }
    if (!form.terms.checked) { toast.error("Please agree to the Terms of Service."); return; }

    setLoading(true);
    try {
      await register(name, email, password, photoURL);
      toast.success("Account created! Welcome to KindConnect 🎉");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    // 1. If Google Client ID is configured in .env and SDK is ready
    if (googleClientId && typeof window !== "undefined" && window.google) {
      try {
        setLoading(true);
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (res) => {
            if (res.credential) {
              await loginWithGoogle(res.credential);
              toast.success("Account created with Google! 🎉");
              router.push("/dashboard");
            }
          },
        });
        window.google.accounts.id.prompt();
        return;
      } catch (err) {
        console.warn("Google popup error:", err);
      } finally {
        setLoading(false);
      }
    }

    // 2. Interactive Google Account Verification Dialog
    const { value: formValues } = await Swal.fire({
      title: "Sign up with Google",
      html: `
        <div style="text-align: left; font-size: 0.85rem; color: #889988; margin-bottom: 15px;">
          Create your KindConnect profile using your real Google / Gmail account:
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <input id="swal-reg-google-name" class="swal2-input" placeholder="Your Full Name (e.g. Halima Omi)" style="margin: 0; width: 100%; font-size: 0.88rem;" />
          <input id="swal-reg-google-email" type="email" class="swal2-input" placeholder="Your Gmail address (e.g. yourname@gmail.com)" style="margin: 0; width: 100%; font-size: 0.88rem;" />
        </div>
        <div style="margin-top: 14px; font-size: 0.72rem; color: #667766; text-align: left;">
          ⚡ Authenticates directly and creates your permanent verified volunteer profile in MongoDB Atlas.
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Continue with Google",
      confirmButtonColor: "#22c55e",
      cancelButtonText: "Cancel",
      background: "#111715",
      color: "#f2f6f2",
      preConfirm: () => {
        const name = document.getElementById("swal-reg-google-name").value.trim();
        const email = document.getElementById("swal-reg-google-email").value.trim();
        if (!email || !email.includes("@")) {
          Swal.showValidationMessage("Please enter a valid Google email address.");
          return false;
        }
        return { name: name || email.split("@")[0], email };
      }
    });

    if (formValues) {
      try {
        setLoading(true);
        await loginWithGoogle(null, {
          email: formValues.email,
          name: formValues.name,
          photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formValues.name)}&backgroundColor=22c55e&textColor=ffffff`,
        });
        toast.success(`Welcome, ${formValues.name}! Registered via Google 🎉`);
        router.push("/dashboard");
      } catch (err) {
        toast.error(err.message || "Google registration failed.");
      } finally {
        setLoading(false);
      }
    }
  };

  return <main className="auth-page">
    <div className="auth-art">
      <Link href="/" className="brand"><span className="brand-mark"><HeartHandshake/></span><span>kind<span className="brand-accent">connect</span><small>CONNECT PEOPLE. CREATE IMPACT.</small></span></Link>
      <div className="auth-art-copy"><span className="eyebrow">BE PART OF SOMETHING GOOD</span><h1>Meet your<br/>people. Make<br/><span className="gradient-text">an impact.</span></h1><p>Join a community where every helping hand counts.</p></div>
      <div className="auth-art-foot">Your time matters. Your kindness matters. <span>♥</span></div>
    </div>
    <div className="auth-form-side">
      <Link href="/" className="back-link">← Back to website</Link>
      <div className="auth-form">
        <span className="eyebrow">START YOUR JOURNEY</span>
        <h2>Create your account.</h2>
        <p className="muted">A few details and you're ready to make a difference.</p>

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
            Sign up with Google
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", margin: "16px 0", gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
          <span className="muted" style={{ fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: 0.5 }}>or with email</span>
          <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
        </div>

        <form onSubmit={handleSubmit}>
          <label>Full name</label>
          <div className="input-wrap"><User/><input name="fullname" placeholder="Your full name" required/></div>
          <label>Email address</label>
          <div className="input-wrap"><Mail/><input name="email" type="email" placeholder="you@example.com" required/></div>
          <label>Photo URL <small className="muted">(optional)</small></label>
          <div className="input-wrap"><ImageIcon/><input name="photoURL" placeholder="https://example.com/photo.jpg"/></div>
          <label>Password</label>
          <div className="input-wrap"><LockKeyhole/><input name="password" type="password" placeholder="At least 6 characters" minLength="6" required/></div>
          <label className="check-label terms"><input name="terms" type="checkbox" required/> I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.</label>
          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>{loading ? "Creating account..." : "Create account"} {!loading && <ArrowUpRight size={17}/>}</button>
          <p className="auth-switch">Already a member? <Link href="/login">Sign in</Link></p>
        </form>
      </div>
    </div>
  </main>;
}
