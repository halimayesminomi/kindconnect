"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeartHandshake, ArrowUpRight, Mail, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import toast from "react-hot-toast";

export default function Login() {
  const router = useRouter();
  const { login, user } = useAuth();
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
