"use client";

import { Award, Download, LockKeyhole, Sparkles, CheckCircle2, Printer } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { api } from "@/lib/api";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";

export default function Certificates() {
  const { user } = useAuth();
  const [joinedCount, setJoinedCount] = useState(0);
  const [attendance, setAttendance] = useState({ totalPoints: 0, attendedCount: 0, records: [] });
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    api.getMyRegistrations()
      .then(res => setJoinedCount((res.data || []).length))
      .catch(() => {});

    api.getMyAttendance()
      .then(res => {
        const data = res.data || { totalPoints: 0, attendedCount: 0, records: [] };
        setAttendance(data);
        if (data.records.length > 0) {
          setSelectedCert(data.records[0]);
        }
      })
      .catch(() => {});
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const displayName = user?.name || "KindConnect Volunteer";

  return <>
    <div className="dash-heading">
      <div>
        <span className="eyebrow">YOUR MILESTONES</span>
        <h1>Certificates & badges</h1>
        <p className="muted">Recognizing your verified contributions to local communities.</p>
      </div>
      <div style={{ background: "rgba(183, 243, 107, 0.15)", border: "1px solid var(--green)", borderRadius: 12, padding: "8px 16px", display: "flex", alignItems: "center", gap: 8 }}>
        <Sparkles size={18} color="var(--green)" />
        <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--green)" }}>{attendance.totalPoints} Points Earned</span>
      </div>
    </div>

    {/* Badges */}
    <div className="badge-grid">
      <div className={`achievement-card ${joinedCount >= 1 ? "featured" : "locked"}`}>
        <div className="achievement-icon"><Award/></div>
        <span className="eyebrow">FIRST STEP</span>
        <h3>First Event</h3>
        <p className="muted">Join your first community event to unlock this badge.</p>
        <span className={`status-pill ${joinedCount >= 1 ? "status-green" : ""}`}>{joinedCount >= 1 ? "Unlocked" : "Join 1 event"}</span>
      </div>
      <div className={`achievement-card ${attendance.attendedCount >= 1 ? "featured" : "locked"}`}>
        <div className="achievement-icon purple"><Sparkles/></div>
        <span className="eyebrow">VERIFIED ATTENDANCE</span>
        <h3>Verified Volunteer</h3>
        <p className="muted">Check in via QR code at any community event.</p>
        <span className={`status-pill ${attendance.attendedCount >= 1 ? "status-green" : ""}`}>{attendance.attendedCount >= 1 ? "Unlocked" : "1 check-in required"}</span>
      </div>
      <div className={`achievement-card ${attendance.totalPoints >= 150 ? "featured" : "locked"}`}>
        <div className="achievement-icon"><LockKeyhole/></div>
        <span className="eyebrow">NEXT MILESTONE</span>
        <h3>Impact Champion</h3>
        <p className="muted">Reach 150 verified impact points to earn this badge.</p>
        <span className={`status-pill ${attendance.totalPoints >= 150 ? "status-green" : ""}`}>{attendance.totalPoints >= 150 ? "Unlocked" : `${Math.max(0, 150 - attendance.totalPoints)} points to go`}</span>
      </div>
    </div>

    {/* Certificate Generator */}
    <div style={{ marginTop: 40 }}>
      <div className="panel-heading" style={{ marginBottom: 18 }}>
        <div>
          <h3>Digital Volunteer Certificates</h3>
          <p className="muted">Verifiable certificates awarded upon recorded event attendance.</p>
        </div>
      </div>

      {attendance.records.length === 0 ? (
        <div className="panel certificate-placeholder">
          <Award/>
          <div>
            <h3>Your certificates will be generated here.</h3>
            <p className="muted">Check in via the QR Attendance tab at an event you joined to generate your verified certificate.</p>
          </div>
          <button className="btn btn-outline" disabled><Download size={15}/> No verified check-ins yet</button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
          {/* Printable Certificate Frame */}
          <div style={{
            background: "linear-gradient(135deg, #152219 0%, #0d1611 100%)",
            border: "2px solid #b7f36b",
            borderRadius: 20,
            padding: "50px 40px",
            textAlign: "center",
            position: "relative",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          }}>
            <div style={{ position: "absolute", top: 20, left: 24, fontSize: ".7rem", letterSpacing: "2px", color: "var(--green)", fontWeight: 800 }}>
              KINDCONNECT OFFICIAL VERIFICATION
            </div>
            <div style={{ position: "absolute", top: 20, right: 24 }}>
              <span className="status-pill status-green" style={{ gap: 6 }}>
                <CheckCircle2 size={13} /> Verified on Blockchain/DB
              </span>
            </div>

            <Award size={48} style={{ color: "var(--green)", margin: "20px auto 10px" }} />
            <h2 style={{ fontSize: "1.8rem", letterSpacing: "3px", textTransform: "uppercase", margin: "10px 0 6px", fontFamily: "var(--font-heading)" }}>
              Certificate of Community Service
            </h2>
            <p className="muted" style={{ fontSize: ".82rem" }}>This certificate is proudly awarded to</p>

            <h1 style={{ fontSize: "2.6rem", color: "#ffffff", margin: "14px 0", fontWeight: 800 }}>
              {displayName}
            </h1>

            <p style={{ maxWidth: 600, margin: "0 auto 20px", fontSize: ".9rem", color: "#c8d4cb", lineHeight: 1.8 }}>
              In grateful recognition of your voluntary service and dedicated contribution to{" "}
              <b style={{ color: "var(--green)" }}>{selectedCert?.eventId?.title || "Community Development Initiative"}</b>.
              Your compassion and action have created positive, lasting impact.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: 40, marginTop: 30, borderTop: "1px solid rgba(183, 243, 107, 0.2)", paddingTop: 20 }}>
              <div>
                <small className="muted" style={{ display: "block", fontSize: ".68rem" }}>Date Verified</small>
                <b style={{ fontSize: ".85rem" }}>{new Date(selectedCert?.checkInTime || Date.now()).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</b>
              </div>
              <div>
                <small className="muted" style={{ display: "block", fontSize: ".68rem" }}>Verification ID</small>
                <b style={{ fontSize: ".85rem", letterSpacing: "1px", color: "var(--green)" }}>{selectedCert?._id ? `KC-CERT-${selectedCert._id.slice(-8).toUpperCase()}` : "KC-VERIFIED"}</b>
              </div>
              <div>
                <small className="muted" style={{ display: "block", fontSize: ".68rem" }}>Impact Points</small>
                <b style={{ fontSize: ".85rem" }}>+{selectedCert?.pointsAwarded || 50} Points</b>
              </div>
            </div>

            <div style={{ marginTop: 28, display: "flex", justifyContent: "center", gap: 12 }}>
              <button onClick={handlePrint} className="btn btn-primary" style={{ padding: "10px 20px" }}>
                <Printer size={16} /> Print / Save Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </>;
}
