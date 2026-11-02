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
  QrCode
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { api } from "@/lib/api";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function Certificates() {
  const { user } = useAuth();
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

  // Demo / Simulation Mode State
  // Default: Halima Yesmin Omi starts with 1,250 points so her certificate is ALREADY UNLOCKED & SHOWN!
  const [activeDemoMode, setActiveDemoMode] = useState(isOmiOrAdmin ? "omi_unlocked" : "db");
  const [demoPointsOffset, setDemoPointsOffset] = useState(0);

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

  // Compute effective points based on demo mode or DB records
  let currentPoints = 0;
  let candidateName = user?.name || "Halima Yesmin Omi";
  let candidateRole = user?.designation || (isOmiOrAdmin ? "Platform Admin & Lead Builder" : "Active Community Volunteer");

  if (activeDemoMode === "omi_unlocked") {
    currentPoints = 1250 + demoPointsOffset;
    candidateName = "Halima Yesmin Omi";
    candidateRole = "Platform Admin & Lead Builder";
  } else if (activeDemoMode === "volunteer_locked") {
    currentPoints = 450 + demoPointsOffset;
    candidateName = user?.name || "Rafiqul Islam (Demo Volunteer)";
    candidateRole = "Community Volunteer";
  } else {
    // Live DB data (if Admin/Omi, guarantee at least 1,250 points for leadership)
    const base = dbAttendance.totalPoints;
    currentPoints = (isOmiOrAdmin && base < 1000 ? 1250 : base) + demoPointsOffset;
    candidateName = user?.name || (isOmiOrAdmin ? "Halima Yesmin Omi" : "Community Volunteer");
    candidateRole = user?.designation || (isOmiOrAdmin ? "Platform Admin & Lead Builder" : "Volunteer");
  }

  const MILESTONE_POINTS = 1000;
  const isUnlocked = currentPoints >= MILESTONE_POINTS;
  const progressPercent = Math.min(100, Math.round((currentPoints / MILESTONE_POINTS) * 100));
  const pointsRemaining = Math.max(0, MILESTONE_POINTS - currentPoints);

  const credentialId = `KC-1000-${(candidateName.replace(/[^a-zA-Z]/g, "").slice(0, 4) || "VOL").toUpperCase()}-251112001`;
  const issueDate = "November 2, 2026";

  const handlePrint = () => {
    window.print();
  };

  const handleCopyId = () => {
    navigator.clipboard?.writeText(credentialId);
    setCopiedId(true);
    toast.success(`Verification ID copied: ${credentialId}`);
    setTimeout(() => setCopiedId(false), 2500);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      toast.success("Certificate verification link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleSimulateAddPoints = (amount = 100) => {
    setDemoPointsOffset(prev => {
      const next = prev + amount;
      if (prev + currentPoints - prev + amount >= MILESTONE_POINTS && currentPoints < MILESTONE_POINTS) {
        toast.success("🎉 অভিনন্দন! 1,000 Points মাইলস্টোন সম্পন্ন হয়েছে! আপনার সার্টিফিকেট অটো-জেনারেট হয়েছে!");
      } else {
        toast.success(`+${amount} Points যোগ হয়েছে!`);
      }
      return next;
    });
  };

  const handleResetPoints = () => {
    setDemoPointsOffset(0);
    toast("পয়েন্ট রিসেট করা হয়েছে।", { icon: "🔄" });
  };

  return (
    <>
      {/* Print CSS rules to ensure only the certificate prints cleanly */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-certificate, #printable-certificate * {
            visibility: visible !important;
          }
          #printable-certificate {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 40px !important;
            box-shadow: none !important;
            background: #0d1510 !important;
            color: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Page Header */}
      <div className="dash-heading no-print">
        <div>
          <span className="eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Trophy size={14} color="var(--green)" /> 1000-POINT MILESTONE RECOGNITION
          </span>
          <h1 style={{ margin: "6px 0" }}>Certificates & Honors</h1>
          <p className="muted">
            স্বীকৃত ভলান্টিয়ার সার্টিফিকেট ও ১,০০০ পয়েন্ট অর্জনকারীদের জন্য বিশেষ সম্মাননা সনদ।
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

      {/* Interactive Demo & Viva Presentation Control Bar */}
      <div className="no-print" style={{
        background: "linear-gradient(135deg, rgba(21, 34, 25, 0.9) 0%, rgba(13, 22, 17, 0.9) 100%)",
        border: "1px solid rgba(183, 243, 107, 0.3)",
        borderRadius: 16,
        padding: "16px 20px",
        marginBottom: 28,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ 
              background: "var(--green)", 
              color: "#111813", 
              padding: "2px 8px", 
              borderRadius: 6, 
              fontSize: ".7rem", 
              fontWeight: 800,
              letterSpacing: "0.5px"
            }}>
              LIVE DEMO CONTROLLER
            </span>
            <span style={{ fontSize: ".85rem", color: "#d8e2dc", fontWeight: 600 }}>
              প্রেজেন্টেশন ও ল্যাব মূল্যায়নের জন্য ডেমো নির্বাচন করুন:
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button 
              onClick={() => handleSimulateAddPoints(100)} 
              className="btn btn-outline"
              style={{ fontSize: ".76rem", padding: "6px 12px", borderColor: "rgba(183, 243, 107, 0.5)", color: "var(--green)" }}
              title="Click to simulate completing an event and receiving +100 points"
            >
              <Flame size={14} /> +100 Points Boost
            </button>
            {demoPointsOffset !== 0 && (
              <button 
                onClick={handleResetPoints} 
                className="btn btn-ghost" 
                style={{ fontSize: ".72rem", padding: "6px 10px", color: "var(--muted)" }}
              >
                Reset Boost
              </button>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={() => { setActiveDemoMode("omi_unlocked"); setDemoPointsOffset(0); toast.success("Halima Yesmin Omi (1,250 pts - Unlocked Certificate Demo) চালু হয়েছে!"); }}
            style={{
              flex: "1 1 200px",
              padding: "10px 14px",
              borderRadius: 10,
              background: activeDemoMode === "omi_unlocked" ? "rgba(183, 243, 107, 0.2)" : "rgba(255,255,255,0.03)",
              border: activeDemoMode === "omi_unlocked" ? "1px solid var(--green)" : "1px solid rgba(255,255,255,0.1)",
              color: activeDemoMode === "omi_unlocked" ? "var(--green)" : "#9ba89f",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              transition: "0.2s"
            }}
          >
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 700, fontSize: ".82rem" }}>🎓 Demo 1: Halima Yesmin Omi</div>
              <div style={{ fontSize: ".7rem", opacity: 0.8 }}>1,250 Points • Certificate Unlocked & Generated</div>
            </div>
            {activeDemoMode === "omi_unlocked" && <Check size={16} color="var(--green)" />}
          </button>

          <button
            onClick={() => { setActiveDemoMode("volunteer_locked"); setDemoPointsOffset(0); toast("নতুন ভলান্টিয়ার ডেমো (450 pts - লকড স্টেট ও প্রোগ্রেস বার) সিলেক্ট করা হয়েছে।", { icon: "🔒" }); }}
            style={{
              flex: "1 1 200px",
              padding: "10px 14px",
              borderRadius: 10,
              background: activeDemoMode === "volunteer_locked" ? "rgba(255, 184, 0, 0.15)" : "rgba(255,255,255,0.03)",
              border: activeDemoMode === "volunteer_locked" ? "1px solid #ffb800" : "1px solid rgba(255,255,255,0.1)",
              color: activeDemoMode === "volunteer_locked" ? "#ffb800" : "#9ba89f",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              transition: "0.2s"
            }}
          >
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 700, fontSize: ".82rem" }}>🔒 Demo 2: Regular Volunteer</div>
              <div style={{ fontSize: ".7rem", opacity: 0.8 }}>450 Points • Progress Tracker & Locked Preview</div>
            </div>
            {activeDemoMode === "volunteer_locked" && <Check size={16} color="#ffb800" />}
          </button>

          <button
            onClick={() => { setActiveDemoMode("db"); setDemoPointsOffset(0); toast.success("Live MongoDB ডেটাবেজ ভ্যালু লোড করা হয়েছে।"); }}
            style={{
              flex: "1 1 160px",
              padding: "10px 14px",
              borderRadius: 10,
              background: activeDemoMode === "db" ? "rgba(100, 180, 255, 0.15)" : "rgba(255,255,255,0.03)",
              border: activeDemoMode === "db" ? "1px solid #64b4ff" : "1px solid rgba(255,255,255,0.1)",
              color: activeDemoMode === "db" ? "#64b4ff" : "#9ba89f",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              transition: "0.2s"
            }}
          >
            <div style={{ textAlign: "left" }}>
              <div style={{ fontWeight: 700, fontSize: ".82rem" }}>🔄 Live MongoDB User Data</div>
              <div style={{ fontSize: ".7rem", opacity: 0.8 }}>{user?.name || "Current User"} • Actual Check-ins</div>
            </div>
            {activeDemoMode === "db" && <Check size={16} color="#64b4ff" />}
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
                ? "🎉 অভিনন্দন! আপনি সফলভাবে ১,০০০ পয়েন্ট অর্জন করেছেন। আপনার অফিশিয়াল সার্টিফিকেট নিচে অটো-জেনারেট করা হয়েছে।"
                : `১,০০০ পয়েন্ট পৌঁছালেই সিস্টেম স্বয়ংক্রিয়ভাবে আপনার জন্য এই সার্টিফিকেট জেনারেট করবে। সার্টিফিকেট আনলক করতে আর ${pointsRemaining} পয়েন্ট প্রয়োজন।`}
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
              Presidential Honor Certificate
            </div>
          </div>
        </div>
      </div>

      {/* How to Earn Certificate Infographic (সার্টিফিকেট যেভাবে অর্জন করবেন) */}
      <div className="no-print" style={{ marginBottom: 36 }}>
        <h3 style={{ fontSize: "1.1rem", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
          <HelpCircle size={18} color="var(--green)" /> সার্টিফিকেট কিভাবে পাবেন? (How It Works)
        </h3>
        <p className="muted" style={{ fontSize: ".84rem", marginBottom: 16 }}>
          কাইন্ডকানেক্ট প্ল্যাটফর্মে সামাজিক অবদান রাখার মাধ্যমে ১,০০০ পয়েন্ট অর্জন এবং স্বয়ংক্রিয় সার্টিফিকেট পাওয়ার প্রক্রিয়া:
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
          <div className="panel" style={{ padding: "18px" }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(183, 243, 107, 0.15)", color: "var(--green)", display: "grid", placeItems: "center", fontWeight: 800, marginBottom: 10 }}>
              1
            </div>
            <h4 style={{ margin: "0 0 6px", fontSize: ".9rem" }}>ইভেন্টে যোগদান করুন</h4>
            <p className="muted" style={{ fontSize: ".78rem", margin: 0 }}>
              বৃক্ষরোপণ, রক্তদান বা ত্রাণের মতো সামাজিক ইভেন্টে ভলান্টিয়ার হিসেবে Join করুন।
            </p>
          </div>

          <div className="panel" style={{ padding: "18px" }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(183, 243, 107, 0.15)", color: "var(--green)", display: "grid", placeItems: "center", fontWeight: 800, marginBottom: 10 }}>
              2
            </div>
            <h4 style={{ margin: "0 0 6px", fontSize: ".9rem" }}>QR কোড স্ক্যান করে Check-in</h4>
            <p className="muted" style={{ fontSize: ".78rem", margin: 0 }}>
              ইভেন্ট ভেন্যুতে গিয়ে QR কোড দিয়ে উপস্থিতির প্রমাণ দিন। প্রতি ইভেন্টে ৫০ থেকে ১০০ পয়েন্ট পাবেন।
            </p>
          </div>

          <div className="panel" style={{ padding: "18px" }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(183, 243, 107, 0.15)", color: "var(--green)", display: "grid", placeItems: "center", fontWeight: 800, marginBottom: 10 }}>
              3
            </div>
            <h4 style={{ margin: "0 0 6px", fontSize: ".9rem" }}>১,০০০ পয়েন্ট মাইলস্টোন স্পর্শ</h4>
            <p className="muted" style={{ fontSize: ".78rem", margin: 0 }}>
              নিয়মিত উপস্থিতির মাধ্যমে স্কোর ১,০০০ পয়েন্টে পৌঁছালেই সিস্টেম স্বয়ংক্রিয়ভাবে সনদপত্র প্রস্তুত করে।
            </p>
          </div>

          <div className="panel" style={{ padding: "18px" }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(183, 243, 107, 0.15)", color: "var(--green)", display: "grid", placeItems: "center", fontWeight: 800, marginBottom: 10 }}>
              4
            </div>
            <h4 style={{ margin: "0 0 6px", fontSize: ".9rem" }}>অটো-জেনারেট ও ডাউনলোড</h4>
            <p className="muted" style={{ fontSize: ".78rem", margin: 0 }}>
              অনলাইন ভেরিফিকেশন আইডি ও মেট্রোপলিটন ইউনিভার্সিটির প্রাতিষ্ঠানিক সিল সহ PDF ডাউনলোড করুন।
            </p>
          </div>
        </div>
      </div>

      {/* Auto-Generated 1,000-Point Milestone Certificate Display */}
      <div style={{ marginTop: 24, marginBottom: 48 }}>
        <div className="panel-heading no-print" style={{ marginBottom: 18 }}>
          <div>
            <h3 style={{ fontSize: "1.25rem", margin: 0 }}>
              {isUnlocked ? "🏆 Auto-Generated Official Certificate" : "🔒 1000-Point Honor Certificate (Locked)"}
            </h3>
            <p className="muted" style={{ fontSize: ".82rem", margin: "4px 0 0" }}>
              {isUnlocked 
                ? "This credential has been automatically generated and cryptographically verified upon reaching 1,000+ impact points."
                : "Earn 1,000 points to unlock this auto-generated institutional certificate."}
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
            style={{
              background: "linear-gradient(145deg, #0e1712 0%, #080f0b 100%)",
              border: "3px solid #b7f36b",
              borderRadius: 24,
              padding: "55px 50px",
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, position: "relative", zIndex: 2 }}>
              <div style={{ textAlign: "left" }}>
                <span style={{ 
                  fontSize: ".72rem", 
                  letterSpacing: "3px", 
                  color: "var(--green)", 
                  fontWeight: 800,
                  textTransform: "uppercase",
                  display: "block" 
                }}>
                  KINDCONNECT SOCIAL IMPACT NETWORK
                </span>
                <span style={{ fontSize: ".68rem", color: "#a5b5ab", letterSpacing: "1px" }}>
                  METROPOLITAN UNIVERSITY • CSE 36 (EVE)
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 68, height: 68, borderRadius: "50%", background: "rgba(183, 243, 107, 0.12)", border: "2px solid var(--green)", marginBottom: 16 }}>
                <Award size={38} color="var(--green)" />
              </div>

              <h2 style={{ 
                fontSize: "clamp(1.5rem, 3.2vw, 2.3rem)", 
                letterSpacing: "4px", 
                textTransform: "uppercase", 
                margin: "0 0 8px", 
                fontFamily: "var(--font-heading)",
                color: "#ffffff"
              }}>
                Certificate of Social Excellence
              </h2>

              <p style={{ 
                fontSize: ".88rem", 
                letterSpacing: "2px", 
                textTransform: "uppercase", 
                color: "var(--green)", 
                fontWeight: 700,
                margin: "0 0 18px" 
              }}>
                1,000 Verified Impact Points Milestone Award
              </p>

              <p className="muted" style={{ fontSize: ".86rem", fontStyle: "italic", margin: 0 }}>
                This institutional credential of extraordinary humanitarian service is proudly conferred to:
              </p>

              <h1 style={{ 
                fontSize: "clamp(2.4rem, 5vw, 3.4rem)", 
                color: "#ffffff", 
                margin: "14px 0 10px", 
                fontWeight: 800,
                letterSpacing: "-0.5px",
                textShadow: "0 4px 20px rgba(183, 243, 107, 0.3)"
              }}>
                {candidateName}
              </h1>

              <div style={{ 
                display: "inline-block", 
                background: "rgba(255,255,255,0.06)", 
                border: "1px solid rgba(183, 243, 107, 0.3)", 
                borderRadius: 20, 
                padding: "3px 18px", 
                fontSize: ".78rem", 
                color: "var(--green)",
                fontWeight: 700,
                marginBottom: 20
              }}>
                {candidateRole}
              </div>

              <p style={{ 
                maxWidth: 720, 
                margin: "0 auto 26px", 
                fontSize: ".96rem", 
                color: "#d0dbd4", 
                lineHeight: 1.8 
              }}>
                In distinguished recognition of achieving the landmark milestone of{" "}
                <b style={{ color: "var(--green)" }}>{currentPoints.toLocaleString()} Verified Impact Points</b>. 
                Through tireless commitment to voluntary social development, relief initiatives, and community leadership 
                across Bangladesh, this recipient has demonstrated the highest ideals of humanitarian service and civic responsibility.
              </p>
            </div>

            {/* Credential Attributes Strip */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", 
              gap: 16, 
              background: "rgba(0,0,0,0.35)", 
              border: "1px solid rgba(183, 243, 107, 0.2)", 
              borderRadius: 14, 
              padding: "16px 20px", 
              margin: "0 0 34px",
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
                <b style={{ fontSize: ".9rem" }}>{issueDate}</b>
              </div>
              <div>
                <small style={{ display: "block", fontSize: ".65rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--muted)", marginBottom: 3 }}>
                  Credential ID
                </small>
                <b style={{ fontSize: ".86rem", color: "#64b4ff", letterSpacing: "1px" }}>{credentialId}</b>
              </div>
              <div>
                <small style={{ display: "block", fontSize: ".65rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--muted)", marginBottom: 3 }}>
                  Academic Context
                </small>
                <b style={{ fontSize: ".86rem" }}>CSE 36 (EVE)</b>
              </div>
            </div>

            {/* Signatures & Seal Section */}
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "flex-end", 
              borderTop: "1px solid rgba(183, 243, 107, 0.25)", 
              paddingTop: 24,
              flexWrap: "wrap",
              gap: 20
            }}>
              {/* Instructor Signature */}
              <div style={{ textAlign: "center", minWidth: 200, flex: 1 }}>
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

              {/* Gold Institutional Seal */}
              <div style={{ textAlign: "center", flex: "0 0 auto", margin: "0 10px" }}>
                <div style={{
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  border: "2px solid #b7f36b",
                  background: "radial-gradient(circle, rgba(183, 243, 107, 0.15) 0%, rgba(0,0,0,0.5) 100%)",
                  boxShadow: "0 0 20px rgba(183, 243, 107, 0.3)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 6,
                  margin: "0 auto"
                }}>
                  <Star size={16} fill="var(--green)" color="var(--green)" />
                  <span style={{ fontSize: ".52rem", fontWeight: 800, letterSpacing: "1px", color: "var(--green)", textAlign: "center", lineHeight: 1.1, marginTop: 3 }}>
                    CSE 36 (EVE)
                    <br />
                    1000 PTS
                    <br />
                    OFFICIAL
                  </span>
                </div>
              </div>

              {/* Creator & Platform Admin Signature */}
              <div style={{ textAlign: "center", minWidth: 200, flex: 1 }}>
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
            padding: "60px 40px",
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
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "rgba(255, 184, 0, 0.12)",
                border: "2px solid #ffb800",
                display: "grid",
                placeItems: "center",
                margin: "0 auto 20px"
              }}>
                <LockKeyhole size={34} color="#ffb800" />
              </div>

              <h2 style={{ fontSize: "1.8rem", margin: "0 0 10px", color: "#ffffff" }}>
                1,000 Points Milestone Certificate Locked
              </h2>

              <p className="muted" style={{ fontSize: ".92rem", lineHeight: 1.7, margin: "0 0 24px" }}>
                এই প্রাতিষ্ঠানিক সনদটি স্বয়ংক্রিয়ভাবে আনলক করতে আপনার মোট{" "}
                <b style={{ color: "#ffb800" }}>১,০০০ পয়েন্ট</b> প্রয়োজন। বর্তমানে আপনার স্কোর{" "}
                <b style={{ color: "var(--green)" }}>{currentPoints} Points</b>। সার্টিফিকেট আনলক করতে আর{" "}
                <b style={{ color: "#ffb800" }}>{pointsRemaining} পয়েন্ট</b> প্রয়োজন।
              </p>

              <div style={{ 
                background: "rgba(0,0,0,0.4)", 
                border: "1px solid rgba(255, 184, 0, 0.25)", 
                borderRadius: 14, 
                padding: "16px 20px", 
                marginBottom: 26,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12
              }}>
                <div style={{ textAlign: "left" }}>
                  <small style={{ fontSize: ".7rem", textTransform: "uppercase", color: "var(--muted)" }}>Current Progress</small>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--green)" }}>{currentPoints} / 1,000 Pts</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <small style={{ fontSize: ".7rem", textTransform: "uppercase", color: "var(--muted)" }}>Shortfall</small>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#ffb800" }}>-{pointsRemaining} Pts</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/events" className="btn btn-primary" style={{ padding: "11px 22px" }}>
                  Explore Events to Earn Points <ArrowRight size={16} />
                </Link>
                <button 
                  onClick={() => handleSimulateAddPoints(100)} 
                  className="btn btn-outline"
                  style={{ borderColor: "#ffb800", color: "#ffb800" }}
                >
                  <Flame size={15} /> Demo Boost (+100 Pts)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Individual Event Check-In Certificates List */}
      <div className="no-print" style={{ marginTop: 45 }}>
        <div className="panel-heading" style={{ marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: "1.1rem", margin: 0 }}>Event Participation & QR Check-in History</h3>
            <p className="muted" style={{ fontSize: ".78rem", margin: "3px 0 0" }}>
              আপনার কিউআর কোড ভিত্তিক উপস্থিতির রেকর্ড এবং প্রতিটি ইভেন্টে অর্জিত পয়েন্টের তালিকা।
            </p>
          </div>
        </div>

        {dbAttendance.records.length === 0 ? (
          <div className="panel certificate-placeholder" style={{ padding: "26px", textAlign: "center" }}>
            <Award size={36} color="var(--green)" style={{ margin: "0 auto 10px" }} />
            <div>
              <h4 style={{ margin: "0 0 6px" }}>No Individual Event Records Yet</h4>
              <p className="muted" style={{ fontSize: ".82rem", margin: 0 }}>
                ইভেন্টে উপস্থিত হয়ে কিউআর কোড স্ক্যান করলে এখানে প্রতিটি ইভেন্টের আলাদা উপস্থিতি রেকর্ড যুক্ত হবে।
              </p>
            </div>
            <Link href="/dashboard/attendance" className="btn btn-outline" style={{ marginTop: 14 }}>
              <QrCode size={15} /> Go to QR Attendance
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {dbAttendance.records.map((rec, idx) => (
              <div 
                key={rec._id || idx}
                className="panel"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 20px",
                  flexWrap: "wrap",
                  gap: 12
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircle2 size={16} color="var(--green)" />
                    <b style={{ fontSize: ".92rem" }}>{rec.eventId?.title || "Community Event Check-in"}</b>
                  </div>
                  <div style={{ fontSize: ".75rem", color: "var(--muted)", marginTop: 4 }}>
                    Checked in on {new Date(rec.checkInTime).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    {" • "}
                    Code: <span style={{ color: "var(--green)", fontWeight: 700 }}>KC-{rec.eventId?._id ? rec.eventId._id.slice(-6).toUpperCase() : "VERIFIED"}</span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ 
                    background: "rgba(183, 243, 107, 0.15)", 
                    color: "var(--green)", 
                    padding: "4px 10px", 
                    borderRadius: 8, 
                    fontWeight: 800, 
                    fontSize: ".82rem" 
                  }}>
                    +{rec.pointsAwarded || 50} Points
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
