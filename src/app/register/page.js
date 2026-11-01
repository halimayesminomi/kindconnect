"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeartHandshake, ArrowUpRight, User, Mail, LockKeyhole, ImageIcon } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import toast from "react-hot-toast";

export default function Register() {
  const router = useRouter();
  const { register, user } = useAuth();
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
