"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeartHandshake, ArrowUpRight, Mail, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import toast from "react-hot-toast";

export default function Login() {
  const router = useRouter();
  const { login, loginWithGoogle, user } = useAuth();
  const [loading, setLoading] = useState(false);

  if (user) { router.push("/dashboard"); return null; }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value;

    if (!email || !password) { toast.error("Please fill in all fields."); return; }

    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back! 🎉");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.message || "Login failed. Please try again.");
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
          callback: async (tokenRes) => {
            if (tokenRes.error) {
              setLoading(false);
              if (tokenRes.error !== "popup_closed_by_user") {
                toast.error("Google login cancelled.");
              }
              return;
            }
            try {
              // Fetch genuine profile directly from Google servers
              const googleProfileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${tokenRes.access_token}` },
              });
              const profile = await googleProfileRes.json();
              if (!profile.email) {
                throw new Error("No verified email returned from Google.");
              }

              // Save to MongoDB Atlas & issue KindConnect JWT
              await loginWithGoogle(null, {
                email: profile.email,
                name: profile.name,
                photoURL: profile.picture,
              });

              toast.success(`Welcome, ${profile.name || profile.email}! Signed in via Google 🎉`);
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
        console.error("Google Client Error:", err);
        toast.error("Could not open Google account chooser.");
      }
    } else {
      toast.error("Google service is loading. Please try again in 2 seconds.");
    }
  };

  return <main className="auth-page">
    <div className="auth-art">
      <Link href="/" className="brand"><span className="brand-mark"><HeartHandshake/></span><span>kind<span className="brand-accent">connect</span><small>CONNECT PEOPLE. CREATE IMPACT.</small></span></Link>
      <div className="auth-art-copy"><span className="eyebrow">WELCOME BACK</span><h1>Your next<br/>good thing<br/><span className="gradient-text">starts here.</span></h1><p>Pick up where you left off. Your community is waiting.</p></div>
      <div className="auth-art-foot">Small actions. Stronger communities. <span>♥</span></div>
    </div>
    <div className="auth-form-side">
      <Link href="/" className="back-link">← Back to website</Link>
      <div className="auth-form">
        <span className="eyebrow">YOUR IMPACT SPACE</span>
        <h2>Welcome back.</h2>
        <p className="muted">Sign in to continue making a difference.</p>

        {/* Social Login Button */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "20px 0 16px 0" }}>
          <button
            type="button"
            className="btn btn-outline btn-block"
            onClick={handleGoogleAuth}
            disabled={loading}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 600 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"/><path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"/><path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.1 7.5 23 12 23z"/></svg>
            Continue with Google
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", margin: "16px 0", gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
          <span className="muted" style={{ fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: 0.5 }}>or with email</span>
          <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
        </div>

        <form onSubmit={handleSubmit}>
          <label>Email address</label>
          <div className="input-wrap"><Mail/><input name="email" type="email" placeholder="you@example.com" required/></div>
          <label>Password</label>
          <div className="input-wrap"><LockKeyhole/><input name="password" type="password" placeholder="Enter your password" required/></div>
          <div className="form-between"><label className="check-label"><input type="checkbox"/> Remember me</label><a href="#">Forgot password?</a></div>
          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"} {!loading && <ArrowUpRight size={17}/>}</button>
          <p className="auth-switch">New to KindConnect? <Link href="/register">Create an account</Link></p>
        </form>
      </div>
    </div>
  </main>;
}
