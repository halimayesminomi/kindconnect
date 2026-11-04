"use client";

import { 
  Award, 
  Download, 
  LockKeyhole, 
  Sparkles, 
  CheckCircle2, 
  Printer, 
  Trophy, 
  Share2, 
  Copy, 
  Check, 
  Star, 
  Flame, 
  ShieldCheck, 
  HelpCircle,
  ArrowRight,
  QrCode,
  Edit3,
  RotateCcw,
  User,
  Calendar,
  X,
  FileBadge
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useSite } from "@/components/site-provider";
import { api } from "@/lib/api";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function Certificates() {
  const { user } = useAuth();
  const { lang, t } = useSite();
  const [joinedCount, setJoinedCount] = useState(0);
  const [dbAttendance, setDbAttendance] = useState({ totalPoints: 0, attendedCount: 0, records: [] });
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Determine if logged in user is Halima Yesmin Omi / Admin
  const isOmiOrAdmin = 
    user?.role === "admin" || 
    user?.username === "omi" || 
    user?.email?.toLowerCase().includes("omi") ||
    user?.name?.toLowerCase().includes("omi");

  // Name customization state: defaults strictly to logged-in user's name
  const realUserName = (user?.name || "").trim();
  const [customName, setCustomName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const candidateName = customName.trim() || realUserName || "KindConnect Volunteer";

  // Mode: "db" (real database score), "unlocked_1000" (milestone 1,250 pts), "locked_progress" (450 pts)
  // Default to unlocked for admin or if user has >= 1000 pts; otherwise "db"
  const [activeMode, setActiveMode] = useState("db");
  const [demoPointsOffset, setDemoPointsOffset] = useState(0);

  // Selected single event certificate for modal view
  const [selectedEventCert, setSelectedEventCert] = useState(null);

  useEffect(() => {
    api.getMyRegistrations()
      .then(res => setJoinedCount((res.data || []).length))
      .catch(() => {});

    api.getMyAttendance()
      .then(res => {
        const data = res.data || { totalPoints: 0, attendedCount: 0, records: [] };
        setDbAttendance(data);
      })
      .catch(() => {});
  }, []);

  // Compute points according to mode
  const dbBasePoints = dbAttendance.totalPoints || 0;
  let currentPoints = 0;

  if (activeMode === "unlocked_1000") {
    currentPoints = 1250 + demoPointsOffset;
  } else if (activeMode === "locked_progress") {
    currentPoints = 450 + demoPointsOffset;
  } else {
    // Real DB mode
    currentPoints = (isOmiOrAdmin && dbBasePoints < 1000 ? 1250 : dbBasePoints) + demoPointsOffset;
  }

  const MILESTONE_POINTS = 1000;
  const isUnlocked = currentPoints >= MILESTONE_POINTS;
  const progressPercent = Math.min(100, Math.round((currentPoints / MILESTONE_POINTS) * 100));
  const pointsRemaining = Math.max(0, MILESTONE_POINTS - currentPoints);

  // Dynamic Unique Certificate ID tailored to this exact user
  const userSeed = user?._id 
    ? user._id.toString().slice(-6).toUpperCase() 
    : (user?.email ? user.email.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toUpperCase() : "USR2026");
  const nameSlug = (candidateName.replace(/[^a-zA-Z]/g, "").slice(0, 4) || "VOL").toUpperCase();
  const credentialId = `KC-HONOR-${nameSlug}-${userSeed}-2026`;

  // Candidate designation/role
  const candidateRole = user?.designation || (isOmiOrAdmin 
    ? (lang === "bn" ? "প্ল্যাটফর্ম অ্যাডমিন ও লিড বিল্ডার" : "Platform Admin & Lead Builder")
    : user?.role === "organizer"
      ? (lang === "bn" ? "কমিউনিটি অর্গানাইজার" : "Community Organizer")
      : (lang === "bn" ? "সার্টিফাইড সোশ্যাল ভলান্টিয়ার" : "Certified Humanitarian Volunteer"));

  const issueDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "November 2, 2026";

  const verificationUrl = `https://kindconnect-7hc1.vercel.app/dashboard/certificates?id=${credentialId}&user=${encodeURIComponent(candidateName)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=130x130&color=b7f36b&bgcolor=0e1712&data=${encodeURIComponent(verificationUrl)}`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyId = () => {
    navigator.clipboard?.writeText(credentialId);
    setCopiedId(true);
    toast.success(`ইউনিক সার্টিফিকেট আইডি কপি হয়েছে: ${credentialId}`);
    setTimeout(() => setCopiedId(false), 2500);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(verificationUrl);
      setCopiedLink(true);
      toast.success("সার্টিফিকেট ভেরিফিকেশন লিংক কপি করা হয়েছে!");
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleSimulateAddPoints = (amount = 100) => {
    setDemoPointsOffset(prev => {
      const next = prev + amount;
      const willBePoints = currentPoints + amount;
      if (willBePoints >= MILESTONE_POINTS && currentPoints < MILESTONE_POINTS) {
        toast.success(`🎉 অভিনন্দন ${candidateName}! ১,০০০ পয়েন্ট সম্পন্ন হয়েছে এবং আপনার নামাঙ্কিত অফিশিয়াল সার্টিফিকেট অটো-জেনারেট হয়েছে!`);
      } else {
        toast.success(`+${amount} Points যোগ হয়েছে! মোট: ${willBePoints} Pts`);
      }
      return next;
    });
  };

  const handleResetPoints = () => {
    setDemoPointsOffset(0);
    toast("পয়েন্ট রিসেট করা হয়েছে।", { icon: "🔄" });
  };

  // Default sample attendance records if user is new, so they can immediately see and print event certificates
  const displayRecords = dbAttendance.records.length > 0 ? dbAttendance.records : [
    {
      _id: "demo-rec-01",
      eventId: {
        _id: "6724a1b2c3d4e5f601a2b3c4",
        title: "Tree Plantation & Urban Green Drive 2026",
        category: "Environment",
        location: "Metropolitan University Campus & Tilagarh Eco Park, Sylhet"
      },
      checkInTime: new Date(Date.now() - 86400000 * 4),
      pointsAwarded: 100
    },
    {
      _id: "demo-rec-02",
      eventId: {
        _id: "6724a1b2c3d4e5f601a2b3c5",
        title: "Emergency Winter Clothes & Warm Blanket Distribution",
        category: "Relief",
        location: "Surma Riverbank & Zindabazar, Sylhet"
      },
      checkInTime: new Date(Date.now() - 86400000 * 2),
      pointsAwarded: 100
    }
  ];

  return (
    <>
      {/* Print CSS rules to ensure only the certificate prints cleanly */}
      <style jsx global>{`
        @page {
          size: A4 landscape;
          margin: 0mm !important;
        }

        @media print {
          /* Remove browser margins and default header/footer completely */
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #0d1510 !important;
            width: 100vw !important;
            height: 100vh !important;
            overflow: hidden !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Hide ALL site layout, navigation, sidebars and headers */
          body * {
            visibility: hidden !important;
          }

          .no-print, 
          header, 
          nav, 
          aside, 
          .dash-topbar, 
          .dash-heading, 
          .btn, 
          .help-card, 
          .sidebar, 
          .workspace-label, 
          .side-links,
          .site-header,
          .site-footer {
            display: none !important;
          }

          /* Show ONLY the certificate element */
          .printable-sheet, .printable-sheet * {
            visibility: visible !important;
          }

          .printable-sheet {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            max-width: 100vw !important;
            max-height: 100vh !important;
            margin: 0 !important;
            padding: 36px 48px !important;
            box-sizing: border-box !important;
            border: 3px solid #b7f36b !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            background: #0d1510 !important;
            color: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            z-index: 9999999 !important;
          }
        }
      `}</style>

      {/* Page Header */}
      <div className="dash-heading no-print">
        <div>
          <span className="eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Trophy size={14} color="var(--green)" /> PERSONALIZED CERTIFICATE & MILESTONE AWARDS
          </span>
          <h1 style={{ margin: "6px 0" }}>Certificates & Honors</h1>
          <p className="muted">
            প্রতিটি ভলান্টিয়ারের নিজস্ব নাম ও ইউনিক ভেরিফিকেশন আইডি যুক্ত অফিসিয়াল সার্টিফিকেট পোর্টাল।
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ 
            background: isUnlocked ? "rgba(183, 243, 107, 0.15)" : "rgba(255, 184, 0, 0.12)", 
            border: `1px solid ${isUnlocked ? "var(--green)" : "#ffb800"}`, 
            borderRadius: 14, 
            padding: "10px 18px", 
            display: "flex", 
            alignItems: "center", 
            gap: 10 
          }}>
            <Sparkles size={20} color={isUnlocked ? "var(--green)" : "#ffb800"} />
            <div>
              <div style={{ fontSize: ".65rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--muted)" }}>
                Verified Score
              </div>
              <span style={{ fontWeight: 800, fontSize: "1.1rem", color: isUnlocked ? "var(--green)" : "#ffb800" }}>
                {currentPoints.toLocaleString()} Points
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recipient Profile & Name Customization Bar */}
      <div className="no-print" style={{
        background: "linear-gradient(135deg, rgba(20, 32, 24, 0.95) 0%, rgba(12, 20, 15, 0.95) 100%)",
        border: "1px solid rgba(183, 243, 107, 0.35)",
        borderRadius: 16,
        padding: "18px 22px",
        marginBottom: 24,
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "rgba(183, 243, 107, 0.18)",
              border: "1.5px solid var(--green)",
              color: "var(--green)",
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
              fontSize: "1rem"
            }}>
              <User size={22} />
            </div>
            <div>
              <div style={{ fontSize: ".72rem", color: "var(--green)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>
                সার্টিফিকেট প্রাপক (Certificate Recipient)
              </div>
              <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#ffffff", display: "flex", alignItems: "center", gap: 8 }}>
                {candidateName}
                <span style={{
                  background: "rgba(183, 243, 107, 0.12)",
                  border: "1px solid rgba(183, 243, 107, 0.3)",
                  color: "var(--green)",
                  fontSize: "0.65rem",
                  padding: "2px 8px",
                  borderRadius: 12,
                  fontWeight: 700
                }}>
                  {candidateRole}
                </span>
              </div>
              <div style={{ fontSize: ".74rem", color: "var(--muted)", marginTop: 2 }}>
                ইউনিক আইডি: <b style={{ color: "#64b4ff", letterSpacing: "0.5px" }}>{credentialId}</b>
                {" • "} ইমেইল: {user?.email || "verified@kindconnect.org"}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            {isEditingName ? (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="text"
                  placeholder="আপনার পূর্ণ নাম টাইপ করুন..."
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 10,
                    background: "rgba(0,0,0,0.4)",
                    border: "1px solid var(--green)",
                    color: "#ffffff",
                    fontSize: ".85rem",
                    minWidth: 220
                  }}
                  autoFocus
                />
                <button
                  onClick={() => setIsEditingName(false)}
                  className="btn btn-primary"
                  style={{ padding: "8px 14px", fontSize: ".78rem" }}
                >
                  <Check size={14} /> সংরক্ষণ
                </button>
                <button
                  onClick={() => { setCustomName(""); setIsEditingName(false); }}
                  className="btn btn-ghost"
                  style={{ padding: "8px 10px", fontSize: ".78rem" }}
                  title="রিসেট"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingName(true)}
                className="btn btn-outline"
                style={{ fontSize: ".78rem", padding: "8px 14px", borderColor: "rgba(183, 243, 107, 0.4)", color: "var(--green)" }}
                title="সার্টিফিকেটে প্রদর্শিত নাম পরিবর্তন বা কাস্টমাইজ করতে ক্লিক করুন"
              >
                <Edit3 size={14} /> নাম পরিবর্তন / কাস্টমাইজ
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Mode & Points Presentation Controller */}
      <div className="no-print" style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid var(--line)",
        borderRadius: 14,
        padding: "14px 18px",
        marginBottom: 28,
        display: "flex",
        flexDirection: "column",
        gap: 12
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ 
              background: "var(--green)", 
              color: "#111813", 
              padding: "2px 8px", 
              borderRadius: 6, 
              fontSize: ".68rem", 
              fontWeight: 800,
              letterSpacing: "0.5px"
            }}>
              EVALUATION CONTROLS
            </span>
            <span style={{ fontSize: ".82rem", color: "var(--muted)", fontWeight: 600 }}>
              ল্যাব উপস্থাপনা ও মূল্যায়নের জন্য মোড নির্বাচন করুন:
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button 
              onClick={() => handleSimulateAddPoints(100)} 
              className="btn btn-outline"
              style={{ fontSize: ".75rem", padding: "5px 12px", borderColor: "rgba(183, 243, 107, 0.5)", color: "var(--green)" }}
              title="ইভেন্ট উপস্থিতির মাধ্যমে +100 পয়েন্ট যোগ করুন"
            >
              <Flame size={14} /> +100 Points Boost
            </button>
            {demoPointsOffset !== 0 && (
              <button 
                onClick={handleResetPoints} 
                className="btn btn-ghost" 
                style={{ fontSize: ".72rem", padding: "5px 10px", color: "var(--muted)" }}
              >
                Reset Boost
              </button>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {/* Option 1: Live DB Score */}
          <button
            onClick={() => { setActiveMode("db"); setDemoPointsOffset(0); toast.success(`আপনার আসল অ্যাকাউন্ট ডাটা লোড হয়েছে: ${candidateName}`); }}
            style={{
              flex: "1 1 200px",
              padding: "10px 14px",
              borderRadius: 10,
              background: activeMode === "db" ? "rgba(100, 180, 255, 0.15)" : "rgba(255,255,255,0.03)",
              border: activeMode === "db" ? "1px solid #64b4ff" : "1px solid rgba(255,255,255,0.1)",
              color: activeMode === "db" ? "#64b4ff" : "#9ba89f",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              transition: "0.2s"
            }}
          >
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 700, fontSize: ".82rem" }}>👤 আমার প্রোফাইল ও আসল ডাটা</div>
              <div style={{ fontSize: ".7rem", opacity: 0.8 }}>{candidateName} • ডেটাবেজ চেক-ইন</div>
            </div>
            {activeMode === "db" && <Check size={16} color="#64b4ff" />}
          </button>

          {/* Option 2: 1,000 Points Unlocked for this User */}
          <button
            onClick={() => { setActiveMode("unlocked_1000"); setDemoPointsOffset(0); toast.success(`🎉 ${candidateName}-এর জন্য ১,০০০ পয়েন্ট মাইলস্টোন সার্টিফিকেট সম্পূর্ণ আনলক করা হয়েছে!`); }}
            style={{
              flex: "1 1 200px",
              padding: "10px 14px",
              borderRadius: 10,
              background: activeMode === "unlocked_1000" ? "rgba(183, 243, 107, 0.2)" : "rgba(255,255,255,0.03)",
              border: activeMode === "unlocked_1000" ? "1px solid var(--green)" : "1px solid rgba(255,255,255,0.1)",
              color: activeMode === "unlocked_1000" ? "var(--green)" : "#9ba89f",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              transition: "0.2s"
            }}
          >
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 700, fontSize: ".82rem" }}>🏆 ১,০০০ পয়েন্ট সার্টিফিকেট আনলক</div>
              <div style={{ fontSize: ".7rem", opacity: 0.8 }}>১,২৫০ পয়েন্ট • {candidateName}-এর নামে সনদ প্রস্তুত</div>
            </div>
            {activeMode === "unlocked_1000" && <Check size={16} color="var(--green)" />}
          </button>

          {/* Option 3: Locked Preview */}
          <button
            onClick={() => { setActiveMode("locked_progress"); setDemoPointsOffset(0); toast("লকড স্টেট ও প্রোগ্রেস ট্র্যাকার ভিউ সিলেক্ট করা হয়েছে।", { icon: "🔒" }); }}
            style={{
              flex: "1 1 200px",
              padding: "10px 14px",
              borderRadius: 10,
              background: activeMode === "locked_progress" ? "rgba(255, 184, 0, 0.15)" : "rgba(255,255,255,0.03)",
              border: activeMode === "locked_progress" ? "1px solid #ffb800" : "1px solid rgba(255,255,255,0.1)",
              color: activeMode === "locked_progress" ? "#ffb800" : "#9ba89f",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              transition: "0.2s"
            }}
          >
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 700, fontSize: ".82rem" }}>🔒 প্রোগ্রেস ও লকড প্রিভিউ</div>
              <div style={{ fontSize: ".7rem", opacity: 0.8 }}>৪৫০ পয়েন্ট • ঘাটতি ও মাইলস্টোন ট্র্যাকার</div>
            </div>
            {activeMode === "locked_progress" && <Check size={16} color="#ffb800" />}
          </button>
        </div>
      </div>

      {/* 1,000 Points Milestone Eligibility & Progress Card */}
      <div className="panel no-print" style={{ marginBottom: 32, padding: "24px 28px", border: "1px solid rgba(183, 243, 107, 0.25)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14, marginBottom: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Trophy size={20} color="var(--green)" />
              <h3 style={{ margin: 0, fontSize: "1.2rem" }}>1,000 Points Honor Certificate Milestone</h3>
            </div>
            <p className="muted" style={{ margin: 0, fontSize: ".85rem" }}>
              {isUnlocked 
                ? `🎉 অভিনন্দন ${candidateName}! আপনি সফলভাবে ১,০০০ পয়েন্ট অর্জন করেছেন। আপনার অফিশিয়াল সার্টিফিকেট নিচে প্রস্তুত করা হয়েছে।`
                : `${candidateName}, ১,০০০ পয়েন্ট পৌঁছালেই সিস্টেম স্বয়ংক্রিয়ভাবে আপনার জন্য এই সার্টিফিকেট জেনারেট করবে। সার্টিফিকেট আনলক করতে আর ${pointsRemaining} পয়েন্ট প্রয়োজন।`}
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <span style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: 6,
              background: isUnlocked ? "rgba(183, 243, 107, 0.2)" : "rgba(255, 255, 255, 0.08)",
              color: isUnlocked ? "var(--green)" : "#d8e2dc",
              padding: "6px 14px",
              borderRadius: 20,
              fontSize: ".82rem",
              fontWeight: 700
            }}>
              {isUnlocked ? <CheckCircle2 size={16} /> : <LockKeyhole size={14} />}
              {isUnlocked ? "Certificate Unlocked & Ready" : `${pointsRemaining} Points Needed`}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ margin: "20px 0 10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".78rem", fontWeight: 700, marginBottom: 8, color: "#d8e2dc" }}>
            <span>Current: {currentPoints.toLocaleString()} Points</span>
            <span style={{ color: isUnlocked ? "var(--green)" : "#ffb800" }}>{progressPercent}% Completed</span>
            <span>Target: 1,000 Points</span>
          </div>
          <div style={{
            width: "100%",
            height: 14,
            background: "rgba(255,255,255,0.06)",
            borderRadius: 8,
            overflow: "hidden",
            position: "relative",
            border: "1px solid rgba(255,255,255,0.08)"
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: "100%",
              background: isUnlocked 
                ? "linear-gradient(90deg, #5ebd3e 0%, #b7f36b 100%)" 
                : "linear-gradient(90deg, #e59819 0%, #ffb800 100%)",
              borderRadius: 8,
              transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: isUnlocked ? "0 0 12px rgba(183, 243, 107, 0.6)" : "0 0 12px rgba(255, 184, 0, 0.4)"
            }} />
          </div>
        </div>

        {/* Milestone Steps Markers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginTop: 20 }}>
          <div style={{ 
            padding: "10px 14px", 
            borderRadius: 10, 
            background: currentPoints >= 150 ? "rgba(183, 243, 107, 0.08)" : "rgba(255,255,255,0.02)",
            border: currentPoints >= 150 ? "1px solid rgba(183, 243, 107, 0.3)" : "1px solid rgba(255,255,255,0.06)" 
          }}>
            <div style={{ fontSize: ".7rem", color: currentPoints >= 150 ? "var(--green)" : "var(--muted)", fontWeight: 700 }}>
              STAGE 1 • 150 PTS {currentPoints >= 150 && "✓"}
            </div>
            <div style={{ fontSize: ".82rem", fontWeight: 600 }}>Active Volunteer Badge</div>
          </div>

          <div style={{ 
            padding: "10px 14px", 
            borderRadius: 10, 
            background: currentPoints >= 500 ? "rgba(183, 243, 107, 0.08)" : "rgba(255,255,255,0.02)",
            border: currentPoints >= 500 ? "1px solid rgba(183, 243, 107, 0.3)" : "1px solid rgba(255,255,255,0.06)" 
          }}>
            <div style={{ fontSize: ".7rem", color: currentPoints >= 500 ? "var(--green)" : "var(--muted)", fontWeight: 700 }}>
              STAGE 2 • 500 PTS {currentPoints >= 500 && "✓"}
            </div>
            <div style={{ fontSize: ".82rem", fontWeight: 600 }}>Impact Builder Badge</div>
          </div>

          <div style={{ 
            padding: "10px 14px", 
            borderRadius: 10, 
            background: isUnlocked ? "rgba(183, 243, 107, 0.15)" : "rgba(255,255,255,0.02)",
            border: isUnlocked ? "1px solid var(--green)" : "1px solid rgba(255,255,255,0.06)" 
          }}>
            <div style={{ fontSize: ".7rem", color: isUnlocked ? "var(--green)" : "#ffb800", fontWeight: 800 }}>
              STAGE 3 • 1,000 PTS {isUnlocked ? "🏆 UNLOCKED" : "🔒 LOCKED"}
            </div>
            <div style={{ fontSize: ".82rem", fontWeight: 700, color: isUnlocked ? "#ffffff" : "var(--muted)" }}>
              Social Excellence Certificate
            </div>
          </div>
        </div>
      </div>

      {/* Auto-Generated 1,000-Point Milestone Certificate Display */}
      <div style={{ marginTop: 24, marginBottom: 48 }}>
        <div className="panel-heading no-print" style={{ marginBottom: 18 }}>
          <div>
            <h3 style={{ fontSize: "1.25rem", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              {isUnlocked ? "🏆 Official Certificate of Social Excellence" : "🔒 1000-Point Honor Certificate (Locked)"}
              <span style={{ fontSize: ".75rem", background: "rgba(183, 243, 107, 0.15)", color: "var(--green)", padding: "2px 8px", borderRadius: 8 }}>
                Awarded to: {candidateName}
              </span>
            </h3>
            <p className="muted" style={{ fontSize: ".82rem", margin: "4px 0 0" }}>
              {isUnlocked 
                ? `${candidateName}-এর জন্য তৈরি অফিশিয়াল ভেরিফায়েড সার্টিফিকেট। এটি পিডিএফ ফরম্যাটে ডাউনলোড ও সরাসরি প্রিন্ট করা যাবে।`
                : "১,০০০ পয়েন্ট অর্জন করলে স্বয়ংক্রিয়ভাবে আপনার এই প্রাতিষ্ঠানিক সনদটি আনলক হবে।"}
            </p>
          </div>
          {isUnlocked && (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={handlePrint} className="btn btn-primary" style={{ padding: "9px 18px", fontSize: ".84rem" }}>
                <Printer size={16} /> Print / Save PDF
              </button>
              <button onClick={handleCopyId} className="btn btn-outline" style={{ padding: "9px 14px", fontSize: ".84rem" }}>
                {copiedId ? <Check size={16} color="var(--green)" /> : <Copy size={16} />}
                {copiedId ? "ID Copied" : "Copy ID"}
              </button>
              <button onClick={handleShare} className="btn btn-ghost" style={{ padding: "9px 14px", fontSize: ".84rem" }}>
                <Share2 size={16} />
              </button>
            </div>
          )}
        </div>

        {isUnlocked ? (
          /* ============================================================== */
          /* UNLOCKED & AUTO-GENERATED OFFICIAL CERTIFICATE                 */
          /* ============================================================== */
          <div 
            id="printable-certificate"
            className={`printable-sheet ${selectedEventCert ? "no-print" : ""}`}
            style={{
              background: "linear-gradient(145deg, #0e1712 0%, #080f0b 100%)",
              border: "3px solid #b7f36b",
              borderRadius: 24,
              padding: "50px 48px",
              position: "relative",
              boxShadow: "0 25px 70px rgba(0,0,0,0.65), 0 0 35px rgba(183, 243, 107, 0.15)",
              overflow: "hidden",
              color: "#ffffff"
            }}
          >
            {/* Inner Gold-Emerald Dashed Border */}
            <div style={{
              position: "absolute",
              inset: 14,
              border: "1px dashed rgba(183, 243, 107, 0.35)",
              borderRadius: 16,
              pointerEvents: "none"
            }} />

            {/* Corner Decorative Accents */}
            <div style={{ position: "absolute", top: 22, left: 22, color: "var(--green)", fontSize: "1.2rem", fontWeight: 800 }}>✦</div>
            <div style={{ position: "absolute", top: 22, right: 22, color: "var(--green)", fontSize: "1.2rem", fontWeight: 800 }}>✦</div>
            <div style={{ position: "absolute", bottom: 22, left: 22, color: "var(--green)", fontSize: "1.2rem", fontWeight: 800 }}>✦</div>
            <div style={{ position: "absolute", bottom: 22, right: 22, color: "var(--green)", fontSize: "1.2rem", fontWeight: 800 }}>✦</div>

            {/* Top Verification Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, position: "relative", zIndex: 2 }}>
              <div style={{ textAlign: "left" }}>
                <span style={{ 
                  fontSize: ".75rem", 
                  letterSpacing: "3px", 
                  color: "var(--green)", 
                  fontWeight: 800,
                  textTransform: "uppercase",
                  display: "block" 
                }}>
                  KINDCONNECT SOCIAL IMPACT NETWORK
                </span>
                <span style={{ fontSize: ".68rem", color: "#a5b5ab", letterSpacing: "1px" }}>
                  METROPOLITAN UNIVERSITY • DEPARTMENT OF CSE
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  background: "rgba(183, 243, 107, 0.15)",
                  border: "1px solid var(--green)",
                  color: "var(--green)",
                  borderRadius: 20,
                  padding: "4px 14px",
                  fontSize: ".7rem",
                  fontWeight: 800,
                  letterSpacing: "1px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6
                }}>
                  <ShieldCheck size={14} /> 1000 PTS VERIFIED ON DATABASE
                </span>
              </div>
            </div>

            {/* Certificate Core Body */}
            <div style={{ textAlign: "center", position: "relative", zIndex: 2, margin: "10px 0 25px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 68, height: 68, borderRadius: "50%", background: "rgba(183, 243, 107, 0.12)", border: "2px solid var(--green)", marginBottom: 14 }}>
                <Award size={38} color="var(--green)" />
              </div>

              <h2 style={{ 
                fontSize: "clamp(1.5rem, 3.2vw, 2.3rem)", 
                letterSpacing: "4px", 
                textTransform: "uppercase", 
                margin: "0 0 6px", 
                fontFamily: "var(--font-heading)",
                color: "#ffffff"
              }}>
                Certificate of Social Excellence
              </h2>

              <p style={{ 
                fontSize: ".86rem", 
                letterSpacing: "2px", 
                textTransform: "uppercase", 
                color: "var(--green)", 
                fontWeight: 700,
                margin: "0 0 16px" 
              }}>
                1,000 Verified Impact Points Milestone Award
              </p>

              <p className="muted" style={{ fontSize: ".88rem", fontStyle: "italic", margin: 0 }}>
                This institutional credential of extraordinary humanitarian service is proudly conferred to:
              </p>

              {/* RECIPIENT NAME (Prominently displayed) */}
              <h1 style={{ 
                fontSize: "clamp(2.3rem, 5vw, 3.3rem)", 
                color: "#ffffff", 
                margin: "12px 0 8px", 
                fontWeight: 800,
                letterSpacing: "-0.5px",
                textShadow: "0 4px 25px rgba(183, 243, 107, 0.35)"
              }}>
                {candidateName}
              </h1>

              <div style={{ 
                display: "inline-block", 
                background: "rgba(255,255,255,0.06)", 
                border: "1px solid rgba(183, 243, 107, 0.3)", 
                borderRadius: 20, 
                padding: "4px 18px", 
                fontSize: ".8rem", 
                color: "var(--green)",
                fontWeight: 700,
                marginBottom: 18
              }}>
                {candidateRole}
              </div>

              <p style={{ 
                maxWidth: 720, 
                margin: "0 auto 22px", 
                fontSize: ".95rem", 
                color: "#d0dbd4", 
                lineHeight: 1.8 
              }}>
                In distinguished recognition of achieving the landmark milestone of{" "}
                <b style={{ color: "var(--green)" }}>{currentPoints.toLocaleString()} Verified Impact Points</b>. 
                Through tireless commitment to voluntary social development, grassroots emergency relief, and community leadership 
                across Bangladesh, <b style={{ color: "#ffffff" }}>{candidateName}</b> has demonstrated exemplary dedication to the ideals of humanitarian service and civic responsibility.
              </p>
            </div>

            {/* Credential Attributes Strip */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", 
              gap: 14, 
              background: "rgba(0,0,0,0.35)", 
              border: "1px solid rgba(183, 243, 107, 0.2)", 
              borderRadius: 14, 
              padding: "14px 18px", 
              margin: "0 0 28px",
              textAlign: "center"
            }}>
              <div>
                <small style={{ display: "block", fontSize: ".65rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--muted)", marginBottom: 3 }}>
                  Verified Points
                </small>
                <b style={{ fontSize: "1.05rem", color: "var(--green)" }}>{currentPoints.toLocaleString()} PTS</b>
              </div>
              <div>
                <small style={{ display: "block", fontSize: ".65rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--muted)", marginBottom: 3 }}>
                  Issue Date
                </small>
                <b style={{ fontSize: ".88rem" }}>{issueDate}</b>
              </div>
              <div>
                <small style={{ display: "block", fontSize: ".65rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--muted)", marginBottom: 3 }}>
                  Unique Credential ID
                </small>
                <b style={{ fontSize: ".85rem", color: "#64b4ff", letterSpacing: "0.5px" }}>{credentialId}</b>
              </div>
              <div>
                <small style={{ display: "block", fontSize: ".65rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--muted)", marginBottom: 3 }}>
                  Academic Context
                </small>
                <b style={{ fontSize: ".85rem" }}>CSE 36 (EVE) • MU</b>
              </div>
            </div>

            {/* Signatures & Seal Section with QR Verification */}
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "flex-end", 
              borderTop: "1px solid rgba(183, 243, 107, 0.25)", 
              paddingTop: 22,
              flexWrap: "wrap",
              gap: 18
            }}>
              {/* Instructor Signature */}
              <div style={{ textAlign: "center", minWidth: 180, flex: 1 }}>
                <div style={{ 
                  fontFamily: "'Playfair Display', serif, cursive", 
                  fontSize: "1.25rem", 
                  color: "#e2ede5", 
                  marginBottom: 6,
                  fontStyle: "italic" 
                }}>
                  Abu Jafar Md. Jakaria
                </div>
                <div style={{ width: 170, height: 1.5, background: "rgba(183, 243, 107, 0.4)", margin: "0 auto 6px" }} />
                <b style={{ fontSize: ".82rem", display: "block", color: "#ffffff" }}>Mr. Abu Jafar Md. Jakaria</b>
                <small className="muted" style={{ fontSize: ".68rem", display: "block" }}>
                  Course Instructor • Metropolitan University
                </small>
              </div>

              {/* Center: Institutional Gold Seal & Live QR Code */}
              <div style={{ textAlign: "center", flex: "0 0 auto", display: "flex", alignItems: "center", gap: 14 }}>
                {/* QR Code */}
                <div style={{ textAlign: "center" }}>
                  <img 
                    src={qrCodeUrl} 
                    alt="Certificate QR Verification" 
                    style={{ width: 72, height: 72, borderRadius: 8, border: "1.5px solid rgba(183, 243, 107, 0.4)", display: "block", margin: "0 auto 4px" }} 
                  />
                  <small style={{ fontSize: ".55rem", color: "var(--green)", letterSpacing: "0.5px", fontWeight: 700 }}>
                    SCAN TO VERIFY
                  </small>
                </div>

                {/* Seal */}
                <div style={{
                  width: 82,
                  height: 82,
                  borderRadius: "50%",
                  border: "2px solid #b7f36b",
                  background: "radial-gradient(circle, rgba(183, 243, 107, 0.18) 0%, rgba(0,0,0,0.5) 100%)",
                  boxShadow: "0 0 20px rgba(183, 243, 107, 0.3)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 6
                }}>
                  <Star size={14} fill="var(--green)" color="var(--green)" />
                  <span style={{ fontSize: ".48rem", fontWeight: 800, letterSpacing: "1px", color: "var(--green)", textAlign: "center", lineHeight: 1.1, marginTop: 2 }}>
                    CSE 36 (EVE)
                    <br />
                    1000 PTS
                    <br />
                    OFFICIAL SEAL
                  </span>
                </div>
              </div>

              {/* Creator & Platform Admin Signature */}
              <div style={{ textAlign: "center", minWidth: 180, flex: 1 }}>
                <div style={{ 
                  fontFamily: "'Playfair Display', serif, cursive", 
                  fontSize: "1.25rem", 
                  color: "#e2ede5", 
                  marginBottom: 6,
                  fontStyle: "italic" 
                }}>
                  Halima Yesmin Omi
                </div>
                <div style={{ width: 170, height: 1.5, background: "rgba(183, 243, 107, 0.4)", margin: "0 auto 6px" }} />
                <b style={{ fontSize: ".82rem", display: "block", color: "#ffffff" }}>Halima Yesmin Omi</b>
                <small className="muted" style={{ fontSize: ".68rem", display: "block" }}>
                  Platform Admin & Creator • KindConnect
                </small>
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* LOCKED STATE PREVIEW (WHEN CURRENT POINTS < 1,000)             */
          /* ============================================================== */
          <div style={{
            position: "relative",
            background: "linear-gradient(145deg, #0f1612 0%, #080d0a 100%)",
            border: "2px dashed rgba(255, 184, 0, 0.35)",
            borderRadius: 24,
            padding: "50px 36px",
            textAlign: "center",
            overflow: "hidden"
          }}>
            {/* Blurred Mock Background */}
            <div style={{
              position: "absolute",
              inset: 0,
              filter: "blur(7px)",
              opacity: 0.15,
              background: "radial-gradient(circle, #b7f36b 10%, transparent 60%)",
              pointerEvents: "none"
            }} />

            <div style={{ position: "relative", zIndex: 3, maxWidth: 580, margin: "0 auto" }}>
              <div style={{
                width: 68,
                height: 68,
                borderRadius: "50%",
                background: "rgba(255, 184, 0, 0.12)",
                border: "2px solid #ffb800",
                display: "grid",
                placeItems: "center",
                margin: "0 auto 16px"
              }}>
                <LockKeyhole size={32} color="#ffb800" />
              </div>

              <h2 style={{ fontSize: "1.65rem", margin: "0 0 8px", color: "#ffffff" }}>
                1,000 Points Milestone Certificate Locked
              </h2>

              <p className="muted" style={{ fontSize: ".9rem", lineHeight: 1.6, margin: "0 0 20px" }}>
                <b style={{ color: "#ffffff" }}>{candidateName}</b>, এই প্রাতিষ্ঠানিক সনদটি স্বয়ংক্রিয়ভাবে আনলক করতে আপনার মোট{" "}
                <b style={{ color: "#ffb800" }}>১,০০০ পয়েন্ট</b> প্রয়োজন। বর্তমানে আপনার স্কোর{" "}
                <b style={{ color: "var(--green)" }}>{currentPoints} Points</b>। সার্টিফিকেট আনলক করতে আর{" "}
                <b style={{ color: "#ffb800" }}>{pointsRemaining} পয়েন্ট</b> প্রয়োজন।
              </p>

              <div style={{ 
                background: "rgba(0,0,0,0.4)", 
                border: "1px solid rgba(255, 184, 0, 0.25)", 
                borderRadius: 14, 
                padding: "14px 18px", 
                marginBottom: 22,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12
              }}>
                <div style={{ textAlign: "left" }}>
                  <small style={{ fontSize: ".7rem", textTransform: "uppercase", color: "var(--muted)" }}>প্রাপক (Recipient)</small>
                  <div style={{ fontSize: "1rem", fontWeight: 800, color: "#ffffff" }}>{candidateName}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <small style={{ fontSize: ".7rem", textTransform: "uppercase", color: "var(--muted)" }}>Shortfall</small>
                  <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#ffb800" }}>-{pointsRemaining} Pts</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/events" className="btn btn-primary" style={{ padding: "10px 20px", fontSize: ".85rem" }}>
                  ইভেন্টে অংশ নিয়ে পয়েন্ট অর্জন করুন <ArrowRight size={15} />
                </Link>
                <button 
                  onClick={() => handleSimulateAddPoints(100)} 
                  className="btn btn-outline"
                  style={{ borderColor: "#ffb800", color: "#ffb800", fontSize: ".85rem" }}
                >
                  <Flame size={15} /> Demo Boost (+100 Pts)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* INDIVIDUAL EVENT CERTIFICATES LIST                             */}
      {/* ============================================================== */}
      <div className="no-print" style={{ marginTop: 45, marginBottom: 50 }}>
        <div className="panel-heading" style={{ marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: "1.2rem", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <FileBadge size={19} color="var(--green)" /> ইভেন্টভিত্তিক সার্টিফিকেট ও উপস্থিতি (Event Certificates)
            </h3>
            <p className="muted" style={{ fontSize: ".82rem", margin: "4px 0 0" }}>
              {candidateName}-এর চেক-ইন করা প্রতিটি ইভেন্টের আলাদা সার্টিফিকেট। যে কোনো ইভেন্টের সনদে ক্লিক করে তা প্রিন্ট বা সংরক্ষণ করুন।
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          {displayRecords.map((rec, idx) => {
            const eventTitle = rec.eventId?.title || "Community Service Event";
            const eventCategory = rec.eventId?.category || "Community";
            const eventLocation = rec.eventId?.location || "Sylhet, Bangladesh";
            const checkInDateStr = rec.checkInTime 
              ? new Date(rec.checkInTime).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              : "Recent";
            const eventCertId = `KC-EVT-${rec.eventId?._id ? rec.eventId._id.slice(-6).toUpperCase() : `0${idx+1}`}-${userSeed}`;

            return (
              <div 
                key={rec._id || idx}
                className="panel"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "18px 22px",
                  flexWrap: "wrap",
                  gap: 14,
                  border: "1px solid var(--line)"
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircle2 size={18} color="var(--green)" />
                    <b style={{ fontSize: ".98rem" }}>{eventTitle}</b>
                    <span style={{ 
                      background: "rgba(183, 243, 107, 0.12)", 
                      color: "var(--green)", 
                      fontSize: ".68rem", 
                      padding: "2px 8px", 
                      borderRadius: 6, 
                      fontWeight: 700 
                    }}>
                      {eventCategory}
                    </span>
                  </div>
                  <div style={{ fontSize: ".78rem", color: "var(--muted)", marginTop: 5 }}>
                    প্রাপক: <b style={{ color: "#ffffff" }}>{candidateName}</b>
                    {" • "} তারিখ: {checkInDateStr}
                    {" • "} আইডি: <span style={{ color: "#64b4ff", fontWeight: 700 }}>{eventCertId}</span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ 
                    background: "rgba(183, 243, 107, 0.15)", 
                    color: "var(--green)", 
                    padding: "5px 12px", 
                    borderRadius: 8, 
                    fontWeight: 800, 
                    fontSize: ".82rem" 
                  }}>
                    +{rec.pointsAwarded || 100} Points
                  </span>

                  <button 
                    onClick={() => setSelectedEventCert({ ...rec, eventCertId, eventTitle, eventCategory, eventLocation, checkInDateStr })}
                    className="btn btn-outline"
                    style={{ fontSize: ".8rem", padding: "7px 14px", display: "inline-flex", alignItems: "center", gap: 6 }}
                  >
                    <Award size={15} color="var(--green)" /> সার্টিফিকেট দেখুন
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* SINGLE EVENT CERTIFICATE MODAL VIEW                           */}
      {/* ============================================================== */}
      {selectedEventCert && (
        <div 
          className="modal-print-wrapper"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 20
          }}
        >
          <div 
            id="printable-event-certificate"
            className="printable-sheet"
            style={{
              maxWidth: 780,
              width: "100%",
              maxHeight: "92vh",
              overflowY: "auto",
              background: "linear-gradient(145deg, #0e1712 0%, #080f0b 100%)",
              border: "2px solid var(--green)",
              borderRadius: 20,
              padding: "36px 32px",
              position: "relative",
              boxShadow: "0 25px 80px rgba(0,0,0,0.9)",
              color: "#ffffff"
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedEventCert(null)}
              className="no-print"
              style={{
                position: "absolute",
                top: 18,
                right: 18,
                background: "rgba(255,255,255,0.08)",
                border: "none",
                color: "#ffffff",
                width: 32,
                height: 32,
                borderRadius: "50%",
                cursor: "pointer",
                display: "grid",
                placeItems: "center"
              }}
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <span style={{ fontSize: ".72rem", letterSpacing: "2.5px", color: "var(--green)", fontWeight: 800, textTransform: "uppercase" }}>
                KINDCONNECT COMMUNITY SERVICE CREDENTIAL
              </span>
              <h2 style={{ fontSize: "1.65rem", margin: "6px 0 4px", color: "#ffffff", textTransform: "uppercase", letterSpacing: "1px" }}>
                Certificate of Event Participation
              </h2>
              <p className="muted" style={{ fontSize: ".82rem", margin: 0, fontStyle: "italic" }}>
                This is to officially certify that
              </p>
            </div>

            {/* Candidate Name in Event Certificate */}
            <div style={{ textAlign: "center", margin: "14px 0 16px" }}>
              <h1 style={{ fontSize: "2.4rem", fontWeight: 800, margin: 0, color: "#ffffff", textShadow: "0 2px 18px rgba(183, 243, 107, 0.4)" }}>
                {candidateName}
              </h1>
              <span style={{ display: "inline-block", background: "rgba(183, 243, 107, 0.12)", color: "var(--green)", fontSize: ".75rem", padding: "2px 14px", borderRadius: 12, fontWeight: 700, marginTop: 6 }}>
                {candidateRole}
              </span>
            </div>

            {/* Event Description */}
            <p style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 20px", fontSize: ".9rem", color: "#d0dbd4", lineHeight: 1.7 }}>
              has successfully volunteered and contributed active community service in the initiative{" "}
              <b style={{ color: "var(--green)" }}>{selectedEventCert.eventTitle}</b> organized in {selectedEventCert.eventLocation}.
            </p>

            {/* Event Attributes */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
              background: "rgba(0,0,0,0.4)",
              border: "1px solid rgba(183, 243, 107, 0.2)",
              borderRadius: 12,
              padding: "12px 16px",
              marginBottom: 24,
              textAlign: "center"
            }}>
              <div>
                <small style={{ fontSize: ".65rem", color: "var(--muted)", textTransform: "uppercase" }}>Event Date</small>
                <b style={{ display: "block", fontSize: ".85rem", marginTop: 2 }}>{selectedEventCert.checkInDateStr}</b>
              </div>
              <div>
                <small style={{ fontSize: ".65rem", color: "var(--muted)", textTransform: "uppercase" }}>Certificate ID</small>
                <b style={{ display: "block", fontSize: ".82rem", color: "#64b4ff", marginTop: 2 }}>{selectedEventCert.eventCertId}</b>
              </div>
              <div>
                <small style={{ fontSize: ".65rem", color: "var(--muted)", textTransform: "uppercase" }}>Points Awarded</small>
                <b style={{ display: "block", fontSize: ".85rem", color: "var(--green)", marginTop: 2 }}>+{selectedEventCert.pointsAwarded || 100} PTS</b>
              </div>
            </div>

            {/* Signatures */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "1px solid rgba(183, 243, 107, 0.2)", paddingTop: 16 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontStyle: "italic", fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#e2ede5" }}>
                  Abu Jafar Md. Jakaria
                </div>
                <div style={{ width: 140, height: 1, background: "rgba(183, 243, 107, 0.4)", margin: "4px auto" }} />
                <small style={{ fontSize: ".68rem", color: "var(--muted)" }}>Course Instructor • MU</small>
              </div>

              <div style={{ textAlign: "center" }}>
                <div style={{ fontStyle: "italic", fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#e2ede5" }}>
                  Halima Yesmin Omi
                </div>
                <div style={{ width: 140, height: 1, background: "rgba(183, 243, 107, 0.4)", margin: "4px auto" }} />
                <small style={{ fontSize: ".68rem", color: "var(--muted)" }}>Platform Admin • KindConnect</small>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="no-print" style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 24 }}>
              <button 
                onClick={() => handlePrint()} 
                className="btn btn-primary"
                style={{ padding: "8px 18px", fontSize: ".84rem" }}
              >
                <Printer size={15} /> প্রিন্ট / Save PDF
              </button>
              <button 
                onClick={() => setSelectedEventCert(null)} 
                className="btn btn-outline"
                style={{ padding: "8px 16px", fontSize: ".84rem" }}
              >
                বন্ধ করুন (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
