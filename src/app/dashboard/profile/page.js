"use client";

import { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CalendarDays, 
  ShieldCheck, 
  Award, 
  Clock, 
  Sparkles, 
  Camera, 
  CheckCircle2, 
  LockKeyhole, 
  Edit3, 
  Save, 
  RefreshCw, 
  ArrowLeft,
  Heart,
  Eye,
  EyeOff
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useSite } from "@/components/site-provider";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";

// Curated professional avatars for instant 1-tap selection
const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80"
];

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { lang, t } = useSite();

  const [saving, setSaving] = useState(false);
  const [joinedCount, setJoinedCount] = useState(0);

  // Profile Form States
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  // Password Change States
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // Sync user data to form
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setBio(user.bio || "");
      setLocation(user.location || "Sylhet, Bangladesh");
      setPhotoURL(user.photoURL || "");
    }
  }, [user]);

  // Load joined events count
  useEffect(() => {
    api.getMyRegistrations()
      .then(res => setJoinedCount((res.data || []).length))
      .catch(() => {});
  }, []);

  const isAdmin = user?.role === "admin";
  const initials = user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error(lang === "bn" ? "দয়া করে আপনার নাম লিখুন।" : "Please enter your name.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
        location: location.trim(),
        photoURL: photoURL.trim(),
      };

      if (showPasswordSection && newPassword) {
        if (!currentPassword) {
          toast.error(lang === "bn" ? "পাসওয়ার্ড পরিবর্তনের জন্য বর্তমান পাসওয়ার্ড দিন।" : "Current password is required.");
          setSaving(false);
          return;
        }
        if (newPassword.length < 6) {
          toast.error(lang === "bn" ? "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" : "New password must be at least 6 characters.");
          setSaving(false);
          return;
        }
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      await updateProfile(payload);
      toast.success(lang === "bn" ? "প্রোফাইল সফলভাবে আপডেট করা হয়েছে! 🎉" : "Profile updated successfully! 🎉");
      setCurrentPassword("");
      setNewPassword("");
      setShowPasswordSection(false);
    } catch (err) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", paddingBottom: 50 }}>
      {/* Top Breadcrumb & Heading */}
      <div className="dash-heading" style={{ marginBottom: 20 }}>
        <div>
          <span className="eyebrow" style={{ color: "var(--green)", fontWeight: 800 }}>
            {lang === "bn" ? "অ্যাকাউন্ট ও প্রোফাইল ব্যবস্থাপনা" : "ACCOUNT & PROFILE SETTINGS"}
          </span>
          <h1 style={{ fontSize: "1.75rem", margin: "4px 0" }}>
            {lang === "bn" ? "আমার ব্যক্তিগত প্রোফাইল" : "My Volunteer Profile"}
          </h1>
          <p className="muted" style={{ fontSize: "0.82rem" }}>
            {lang === "bn" 
              ? "আপনার বায়ো, ফোন নম্বর, প্রোফাইল ছবি এবং অ্যাকাউন্টের তথ্যাদি পরিবর্তন ও সংরক্ষণ করুন।" 
              : "Manage your personal bio, phone number, avatar, and contact details across KindConnect."}
          </p>
        </div>
        <Link href="/dashboard" className="btn btn-outline" style={{ padding: "8px 16px", fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: 6 }}>
          <ArrowLeft size={15} /> <span>{lang === "bn" ? "ড্যাশবোর্ডে ফিরে যান" : "Back to Dashboard"}</span>
        </Link>
      </div>

      {/* Main Profile Header Banner Card */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(0, 0, 0, 0.25) 100%), var(--panel)",
          border: "1px solid var(--line)",
          borderRadius: 20,
          padding: "26px",
          marginBottom: 24,
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          {/* Avatar with Live Preview */}
          <div style={{ position: "relative" }}>
            {photoURL ? (
              <img
                src={photoURL}
                alt={name || "User Avatar"}
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid var(--green)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.3)"
                }}
              />
            ) : (
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  background: "rgba(34, 197, 94, 0.2)",
                  color: "var(--green)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "2rem",
                  fontWeight: 800,
                  border: "3px solid var(--green)",
                }}
              >
                {initials}
              </div>
            )}
            <span
              style={{
                position: "absolute",
                bottom: 4,
                right: 4,
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "var(--green)",
                border: "3px solid var(--panel)",
              }}
              title="Active Profile"
            />
          </div>

          {/* User Identity Details */}
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
              <h2 style={{ margin: 0, fontSize: "1.55rem", fontWeight: 800 }}>
                {user?.name || "KindConnect Member"}
              </h2>
              {isAdmin ? (
                <span
                  style={{
                    background: "#ef4444",
                    color: "#fff",
                    fontSize: "0.62rem",
                    fontWeight: 800,
                    padding: "3px 10px",
                    borderRadius: 20,
                    letterSpacing: "0.5px"
                  }}
                >
                  👑 PLATFORM ADMIN & BUILDER
                </span>
              ) : (
                <span
                  style={{
                    background: "rgba(34, 197, 94, 0.15)",
                    color: "var(--green)",
                    border: "1px solid rgba(34, 197, 94, 0.4)",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    padding: "2px 10px",
                    borderRadius: 20
                  }}
                >
                  🌱 {user?.designation || "Active Volunteer"}
                </span>
              )}
            </div>

            <p className="muted" style={{ fontSize: "0.82rem", margin: "0 0 10px", display: "flex", alignItems: "center", gap: 6 }}>
              <Mail size={14} color="var(--green)" /> {user?.email}
              {user?.phone && (
                <>
                  <span style={{ opacity: 0.4 }}>•</span>
                  <Phone size={14} color="var(--green)" /> {user.phone}
                </>
              )}
            </p>

            {/* Quick Impact Stats */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.78rem" }}>
                <Award size={15} color="var(--green)" />
                <b>{user?.points || 100}</b> <span className="muted">{lang === "bn" ? "পয়েন্ট" : "Points"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.78rem" }}>
                <Clock size={15} color="var(--green)" />
                <b>{user?.hoursVolunteered || 2}</b> <span className="muted">{lang === "bn" ? "ঘণ্টা সেবা" : "Hours"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.78rem" }}>
                <Heart size={15} color="#ef4444" />
                <b>{joinedCount}</b> <span className="muted">{lang === "bn" ? "ইভেন্টে যুক্ত" : "Joined"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.78rem" }}>
                <MapPin size={15} color="var(--green)" />
                <span className="muted">{user?.location || "Sylhet, Bangladesh"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form & Details Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
        
        {/* Form Container */}
        <div style={{ background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 18, padding: "26px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, paddingBottom: 14, borderBottom: "1px solid var(--line)" }}>
            <Edit3 size={18} color="var(--green)" />
            <h3 style={{ margin: 0, fontSize: "1.1rem" }}>
              {lang === "bn" ? "প্রোফাইল তথ্য ও বায়ো পরিবর্তন" : "Edit Profile Information & Bio"}
            </h3>
          </div>

          <form onSubmit={handleSaveProfile} style={{ display: "grid", gap: 18 }}>
            
            {/* Row 1: Full Name & Email */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: 6 }}>
                  {lang === "bn" ? "পূর্ণ নাম (Full Name)" : "Full Name"} *
                </label>
                <div style={{ position: "relative" }}>
                  <User size={16} color="var(--muted)" style={{ position: "absolute", left: 14, top: 14 }} />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "11px 14px 11px 40px",
                      borderRadius: 10,
                      border: "1px solid var(--line)",
                      background: "var(--bg)",
                      color: "var(--text)",
                      fontSize: "15px",
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: 6 }}>
                  {lang === "bn" ? "নিবন্ধিত ইমেইল (Email Address - অপরিবর্তনযোগ্য)" : "Email Address (Primary Identity)"}
                </label>
                <div style={{ position: "relative" }}>
                  <Mail size={16} color="var(--muted)" style={{ position: "absolute", left: 14, top: 14 }} />
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    style={{
                      width: "100%",
                      padding: "11px 14px 11px 40px",
                      borderRadius: 10,
                      border: "1px solid var(--line)",
                      background: "rgba(0,0,0,0.08)",
                      color: "var(--muted)",
                      fontSize: "15px",
                      outline: "none",
                      cursor: "not-allowed"
                    }}
                  />
                </div>
                <small className="muted" style={{ fontSize: "0.68rem", marginTop: 4, display: "block" }}>
                  নিরাপত্তা ও যাচাইয়ের স্বার্থে আপনার নিবন্ধিত ইমেইলটি অপরিবর্তনযোগ্য।
                </small>
              </div>
            </div>

            {/* Row 2: Phone Number & Location */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: 6 }}>
                  {lang === "bn" ? "মোবাইল ফোন নম্বর (Contact Phone)" : "Contact Phone Number"}
                </label>
                <div style={{ position: "relative" }}>
                  <Phone size={16} color="var(--muted)" style={{ position: "absolute", left: 14, top: 14 }} />
                  <input
                    type="tel"
                    placeholder="+880 1712-345678"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "11px 14px 11px 40px",
                      borderRadius: 10,
                      border: "1px solid var(--line)",
                      background: "var(--bg)",
                      color: "var(--text)",
                      fontSize: "15px",
                      outline: "none"
                    }}
                  />
                </div>
                <small className="muted" style={{ fontSize: "0.68rem", marginTop: 4, display: "block" }}>
                  জরুরি ত্রাণ বা ইভেন্ট সমন্বয়ের সময় সহ-ভলান্টিয়াররা আপনার সাথে যোগাযোগ করতে পারবেন।
                </small>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: 6 }}>
                  {lang === "bn" ? "ঠিকানা / শহর (Location)" : "Location / City"}
                </label>
                <div style={{ position: "relative" }}>
                  <MapPin size={16} color="var(--muted)" style={{ position: "absolute", left: 14, top: 14 }} />
                  <input
                    type="text"
                    placeholder="Sylhet, Bangladesh"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "11px 14px 11px 40px",
                      borderRadius: 10,
                      border: "1px solid var(--line)",
                      background: "var(--bg)",
                      color: "var(--text)",
                      fontSize: "15px",
                      outline: "none"
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Bio Textarea */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label style={{ fontSize: "0.78rem", fontWeight: 700 }}>
                  {lang === "bn" ? "বায়ো / আপনার সম্পর্কে কিছু লিখুন (Bio & Volunteering Interests)" : "About You / Bio"}
                </label>
                <small className="muted" style={{ fontSize: "0.7rem" }}>
                  {bio.length}/500
                </small>
              </div>
              <textarea
                rows={3}
                maxLength={500}
                placeholder={lang === "bn" ? "আপনার সমাজসেবামূলক আগ্রহ, অভিজ্ঞতা বা যে কাজে আপনি সাহায্য করতে ভালোবাসেন তা লিখুন..." : "Share a few words about your volunteer passions, background, and skills..."}
                value={bio}
                onChange={e => setBio(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: "1px solid var(--line)",
                  background: "var(--bg)",
                  color: "var(--text)",
                  fontSize: "15px",
                  outline: "none",
                  resize: "vertical"
                }}
              />
            </div>

            {/* Row 4: Profile Picture URL & Preset Avatars */}
            <div>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: 6 }}>
                {lang === "bn" ? "প্রোফাইল ছবির লিংক (Profile Picture URL)" : "Profile Picture Image Link"}
              </label>
              <div style={{ position: "relative" }}>
                <Camera size={16} color="var(--muted)" style={{ position: "absolute", left: 14, top: 14 }} />
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={photoURL}
                  onChange={e => setPhotoURL(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "11px 14px 11px 40px",
                    borderRadius: 10,
                    border: "1px solid var(--line)",
                    background: "var(--bg)",
                    color: "var(--text)",
                    fontSize: "15px",
                    outline: "none"
                  }}
                />
              </div>

              {/* Quick Select Presets */}
              <div style={{ marginTop: 10 }}>
                <small className="muted" style={{ fontSize: "0.72rem", display: "block", marginBottom: 6 }}>
                  {lang === "bn" ? "অথবা ১-ট্যাপে নিচের যেকোনো একটি অ্যাভাটার বেছে নিন:" : "Or select one of our curated volunteer avatars:"}
                </small>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <img
                      key={idx}
                      src={preset}
                      alt="Preset avatar"
                      onClick={() => setPhotoURL(preset)}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        objectFit: "cover",
                        cursor: "pointer",
                        border: photoURL === preset ? "3px solid var(--green)" : "2px solid var(--line)",
                        transform: photoURL === preset ? "scale(1.1)" : "scale(1)",
                        transition: "0.15s"
                      }}
                      title="Select this avatar"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Row 5: Change Password Toggle */}
            <div style={{ borderTop: "1px solid var(--line)", paddingTop: 14, marginTop: 6 }}>
              <button
                type="button"
                onClick={() => setShowPasswordSection(!showPasswordSection)}
                className="btn btn-ghost"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 12px",
                  fontSize: "0.78rem",
                  color: showPasswordSection ? "var(--green)" : "var(--muted)",
                  border: "1px dashed var(--line)",
                  borderRadius: 8
                }}
              >
                <LockKeyhole size={15} />
                <span>{showPasswordSection ? (lang === "bn" ? "পাসওয়ার্ড পরিবর্তন লুকান" : "Hide Password Change") : (lang === "bn" ? "পাসওয়ার্ড পরিবর্তন করতে চান? (ক্লিক করুন)" : "Change Account Password")}</span>
              </button>

              {showPasswordSection && (
                <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, background: "rgba(0,0,0,0.05)", padding: 16, borderRadius: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: 5 }}>
                      {lang === "bn" ? "বর্তমান পাসওয়ার্ড" : "Current Password"} *
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showCurrentPass ? "text" : "password"}
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        style={{
                          width: "100%",
                          padding: "10px 36px 10px 14px",
                          borderRadius: 8,
                          border: "1px solid var(--line)",
                          background: "var(--bg)",
                          color: "var(--text)",
                          fontSize: "14px",
                          outline: "none"
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        style={{ position: "absolute", right: 10, top: 10, background: "transparent", border: "none", color: "var(--muted)", cursor: "pointer" }}
                      >
                        {showCurrentPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, marginBottom: 5 }}>
                      {lang === "bn" ? "নতুন পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)" : "New Password (min 6 chars)"} *
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showNewPass ? "text" : "password"}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        style={{
                          width: "100%",
                          padding: "10px 36px 10px 14px",
                          borderRadius: 8,
                          border: "1px solid var(--line)",
                          background: "var(--bg)",
                          color: "var(--text)",
                          fontSize: "14px",
                          outline: "none"
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        style={{ position: "absolute", right: 10, top: 10, background: "transparent", border: "none", color: "var(--muted)", cursor: "pointer" }}
                      >
                        {showNewPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Action */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 10, borderTop: "1px solid var(--line)", paddingTop: 16 }}>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary"
                style={{
                  padding: "12px 28px",
                  fontSize: "0.88rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  borderRadius: 12,
                  fontWeight: 700
                }}
              >
                {saving ? (
                  <>
                    <RefreshCw size={16} className="spin" />
                    <span>{lang === "bn" ? "সংরক্ষণ হচ্ছে..." : "Saving..."}</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>{lang === "bn" ? "প্রোফাইল সংরক্ষণ করুন" : "Save Profile Changes"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
