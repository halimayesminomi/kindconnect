"use client";

import { useEffect, useState } from "react";
import { QrCode, CheckCircle2, Award, CalendarDays, Users, Sparkles, ArrowUpRight } from "lucide-react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function AttendancePage() {
  const [code, setCode] = useState("");
  const [checkingIn, setCheckingIn] = useState(false);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [selectedJoinedId, setSelectedJoinedId] = useState("");
  
  // Attendance history & points
  const [myAttendance, setMyAttendance] = useState({ totalPoints: 0, attendedCount: 0, records: [] });
  
  // Organizer QR generation
  const [myCreatedEvents, setMyCreatedEvents] = useState([]);
  const [selectedCreatedId, setSelectedCreatedId] = useState("");
  const [qrData, setQrData] = useState(null);
  const [attendees, setAttendees] = useState([]);

  const loadData = () => {
    // 1. Load user's joined events
    api.getMyRegistrations()
      .then(res => {
        const regs = res.data || [];
        setJoinedEvents(regs.map(r => r.eventId).filter(Boolean));
        if (regs.length > 0 && regs[0].eventId) {
          setSelectedJoinedId(regs[0].eventId._id);
          setCode(`KC-${regs[0].eventId._id.slice(-6).toUpperCase()}`);
        }
      })
      .catch(() => {});

    // 2. Load my attendance stats & history
    api.getMyAttendance()
      .then(res => setMyAttendance(res.data || { totalPoints: 0, attendedCount: 0, records: [] }))
      .catch(() => {});

    // 3. Load events created by user (for organizer QR view)
    api.getMyEvents()
      .then(res => {
        const evs = res.data || [];
        setMyCreatedEvents(evs);
        if (evs.length > 0) {
          setSelectedCreatedId(evs[0]._id);
          loadQrForEvent(evs[0]._id);
        }
      })
      .catch(() => {});
  };

  useEffect(loadData, []);

  const loadQrForEvent = async (eventId) => {
    if (!eventId) return;
    try {
      const res = await api.getCheckInCode(eventId);
      setQrData(res.data);
      // Also load event attendees
      const attRes = await api.getEventAttendees(eventId);
      setAttendees(attRes.data || []);
    } catch (err) {
      setQrData(null);
    }
  };

  const handleEventSelectChange = (eventId) => {
    setSelectedJoinedId(eventId);
    setCode(`KC-${eventId.slice(-6).toUpperCase()}`);
  };

  const handleCreatedEventChange = (eventId) => {
    setSelectedCreatedId(eventId);
    loadQrForEvent(eventId);
  };

  const handleCheckIn = async (e) => {
    e.preventDefault();
    if (!selectedJoinedId) {
      toast.error("Please select an event to check in.");
      return;
    }
    if (!code.trim()) {
      toast.error("Please enter the check-in code.");
      return;
    }

    setCheckingIn(true);
    try {
      const res = await api.checkInAttendance(selectedJoinedId, code.trim());
      toast.success(res.message || "Attendance recorded! +50 Points 🎉");
      loadData();
    } catch (err) {
      toast.error(err.message || "Check-in failed.");
    } finally {
      setCheckingIn(false);
    }
  };

  return <>
    <div className="dash-heading">
      <div>
        <span className="eyebrow">VERIFIED PARTICIPATION</span>
        <h1>QR Attendance & Check-In</h1>
        <p className="muted">Record verified attendance, earn impact points, and manage event check-ins.</p>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ background: "rgba(183, 243, 107, 0.15)", border: "1px solid var(--green)", borderRadius: 12, padding: "8px 16px", display: "flex", alignItems: "center", gap: 8 }}>
          <Sparkles size={18} color="var(--green)" />
          <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--green)" }}>{myAttendance.totalPoints} Impact Points</span>
        </div>
      </div>
    </div>

    <div className="dash-columns">
      {/* Volunteer Check-In Panel */}
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h3>Volunteer Event Check-In</h3>
            <p className="muted">Enter your event check-in code or scan the organizer's QR code.</p>
          </div>
          <span className="status-pill status-green">+50 pts per check-in</span>
        </div>

        {joinedEvents.length === 0 ? (
          <div style={{ padding: "30px 10px", textAlign: "center" }}>
            <CalendarDays size={32} style={{ color: "var(--muted)", margin: "0 auto 12px" }} />
            <p className="muted">You must join an event before you can check in.</p>
          </div>
        ) : (
          <form onSubmit={handleCheckIn} style={{ display: "grid", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: ".76rem", fontWeight: 700, marginBottom: 7 }}>Select your joined event</label>
              <select 
                value={selectedJoinedId} 
                onChange={(e) => handleEventSelectChange(e.target.value)}
                style={{ width: "100%", height: 48, padding: "0 13px", border: "1px solid var(--line)", borderRadius: 9, background: "var(--panel)", color: "var(--text)", fontSize: ".83rem", outline: "none" }}
              >
                {joinedEvents.map(e => (
                  <option key={e._id} value={e._id}>{e.title} ({new Date(e.date).toLocaleDateString()})</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: ".76rem", fontWeight: 700, marginBottom: 7 }}>Event Check-In Code</label>
              <div className="input-wrap">
                <QrCode size={18} />
                <input 
                  value={code} 
                  onChange={(e) => setCode(e.target.value)} 
                  placeholder="e.g. KC-2907" 
                  style={{ textTransform: "uppercase", fontWeight: 700, letterSpacing: "1px" }}
                  required 
                />
              </div>
              <small className="muted" style={{ display: "block", marginTop: 6, fontSize: ".7rem" }}>
                Tip: The code is displayed by the event organizer or embedded in the QR code.
              </small>
            </div>

            <button className="btn btn-primary btn-block" type="submit" disabled={checkingIn}>
              {checkingIn ? "Verifying..." : "Confirm Attendance & Earn 50 Points"} <ArrowUpRight size={17} />
            </button>
          </form>
        )}

        {/* Attendance Records */}
        <div style={{ marginTop: 32, borderTop: "1px solid var(--line)", paddingTop: 20 }}>
          <b style={{ fontSize: ".85rem", display: "block", marginBottom: 12 }}>Your Verified Attendances ({myAttendance.attendedCount})</b>
          {myAttendance.records.length === 0 ? (
            <p className="muted" style={{ fontSize: ".76rem" }}>No attendances recorded yet.</p>
          ) : (
            <div style={{ display: "grid", gap: 8 }}>
              {myAttendance.records.map(rec => (
                <div key={rec._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", border: "1px solid var(--line)", borderRadius: 9, background: "rgba(255,255,255,0.02)" }}>
                  <div>
                    <b style={{ fontSize: ".8rem" }}>{rec.eventId?.title || "Event Attendance"}</b>
                    <small className="muted" style={{ display: "block", fontSize: ".68rem" }}>
                      Checked in on {new Date(rec.checkInTime).toLocaleString()}
                    </small>
                  </div>
                  <span className="status-pill status-green">+{rec.pointsAwarded} pts</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Organizer QR Panel */}
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h3>Organizer Check-In QR Station</h3>
            <p className="muted">Display on a screen or print for volunteer check-in.</p>
          </div>
        </div>

        {myCreatedEvents.length === 0 ? (
          <div style={{ padding: "40px 10px", textAlign: "center" }}>
            <p className="muted">Create an event to generate its attendance QR code.</p>
          </div>
        ) : (
          <div>
            <label style={{ display: "block", fontSize: ".76rem", fontWeight: 700, marginBottom: 7 }}>Select created event</label>
            <select 
              value={selectedCreatedId} 
              onChange={(e) => handleCreatedEventChange(e.target.value)}
              style={{ width: "100%", height: 48, padding: "0 13px", border: "1px solid var(--line)", borderRadius: 9, background: "var(--panel)", color: "var(--text)", fontSize: ".83rem", outline: "none", marginBottom: 20 }}
            >
              {myCreatedEvents.map(e => (
                <option key={e._id} value={e._id}>{e.title}</option>
              ))}
            </select>

            {qrData && (
              <div style={{ textAlign: "center", background: "#ffffff", padding: "24px", borderRadius: 16, color: "#14200f", margin: "10px 0 20px" }}>
                <img src={qrData.qrDataUrl} alt="Check-In QR Code" style={{ width: 220, height: 220, display: "block", margin: "0 auto" }} />
                <div style={{ marginTop: 14 }}>
                  <small style={{ color: "#666", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", fontSize: ".7rem" }}>Event Check-In Code</small>
                  <b style={{ display: "block", fontSize: "1.6rem", letterSpacing: "2px", color: "#14200f", margin: "4px 0" }}>{qrData.checkInCode}</b>
                  <span style={{ fontSize: ".75rem", color: "#444" }}>Scan QR code or type code in the volunteer portal</span>
                </div>
              </div>
            )}

            {/* Live Attendees */}
            <div style={{ borderTop: "1px solid var(--line)", paddingTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <b style={{ fontSize: ".82rem" }}>Live Checked-in Attendees ({attendees.length})</b>
                <button onClick={() => loadQrForEvent(selectedCreatedId)} style={{ background: "transparent", border: "none", color: "var(--green)", fontSize: ".72rem", cursor: "pointer", fontWeight: 700 }}>
                  Refresh
                </button>
              </div>
              {attendees.length === 0 ? (
                <p className="muted" style={{ fontSize: ".74rem" }}>No attendees checked in yet.</p>
              ) : (
                <div style={{ maxHeight: 180, overflowY: "auto", display: "grid", gap: 6 }}>
                  {attendees.map(a => (
                    <div key={a._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", border: "1px solid var(--line)", borderRadius: 8, fontSize: ".74rem" }}>
                      <span><b>{a.userName}</b> <span className="muted">({a.userEmail})</span></span>
                      <small className="muted">{new Date(a.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  </>;
}
