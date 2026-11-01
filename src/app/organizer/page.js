"use client";

import Link from "next/link";
import { ArrowUpRight, CalendarDays, Users, ClipboardCheck, Plus, QrCode, BarChart3, CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/cards";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Organizer() {
  const [events, setEvents] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [outcomeData, setOutcomeData] = useState({ metric: "Trees Planted", count: "", notes: "" });

  useEffect(() => {
    api.getMyEvents().then(res => {
      const evs = res.data || [];
      setEvents(evs);
      if (evs.length > 0) setSelectedEventId(evs[0]._id);
    }).catch(() => {});
  }, []);

  const upcoming = events.filter(e => new Date(e.date) > new Date());
  const totalVolunteers = events.reduce((a, e) => a + (e.volunteersCount || 0), 0);
  const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!outcomeData.count) {
      toast.error("Please enter the count.");
      return;
    }
    toast.success("Impact report submitted for admin verification! 🎉");
    setShowReportModal(false);
    setOutcomeData({ metric: "Trees Planted", count: "", notes: "" });
  };

  return <>
    <div className="dash-heading">
      <div>
        <span className="eyebrow">ORGANIZER WORKSPACE</span>
        <h1>Your community, in motion.</h1>
        <p className="muted">Manage events, track volunteer participation, and submit verified outcomes.</p>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <Link href="/dashboard/attendance" className="btn btn-outline"><QrCode size={16}/> QR Station</Link>
        <Link href="/dashboard/create-event" className="btn btn-primary"><Plus size={16}/> New event</Link>
      </div>
    </div>

    <div className="stats-grid">
      <StatCard icon={CalendarDays} label="Active events" value={upcoming.length} change={`${events.length} total`}/>
      <StatCard icon={Users} label="Total volunteers" value={totalVolunteers} change="Across your events"/>
      <StatCard icon={ClipboardCheck} label="Attendance rate" value="94%" change="+4% this month"/>
      <StatCard icon={CalendarDays} label="Past events" value={events.length - upcoming.length} change="Completed"/>
    </div>

    {/* Quick Action Tools */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, margin: "20px 0" }}>
      <Link href="/dashboard/attendance" style={{ background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 14, padding: "20px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(183, 243, 107, 0.15)", color: "var(--green)", display: "grid", placeItems: "center" }}>
          <QrCode size={22} />
        </div>
        <div style={{ flex: 1 }}>
          <b style={{ fontSize: ".88rem", display: "block" }}>Display Check-in QR Station</b>
          <small className="muted" style={{ fontSize: ".72rem" }}>Open live attendance screen for volunteers on event day</small>
        </div>
        <ArrowUpRight size={18} color="var(--green)" />
      </Link>

      <button onClick={() => setShowReportModal(true)} style={{ background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 14, padding: "20px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer", textAlign: "left" }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(99, 203, 164, 0.15)", color: "#63cba4", display: "grid", placeItems: "center" }}>
          <BarChart3 size={22} />
        </div>
        <div style={{ flex: 1 }}>
          <b style={{ fontSize: ".88rem", display: "block", color: "var(--text)" }}>Submit Event Outcome</b>
          <small className="muted" style={{ fontSize: ".72rem" }}>Submit clothes collected, trees planted or meals served</small>
        </div>
        <Plus size={18} color="#63cba4" />
      </button>
    </div>

    {/* Event Overview Table */}
    <div className="panel table-panel">
      <div className="panel-heading">
        <div><h3>Your Opportunities</h3><p className="muted">Live overview of your created events.</p></div>
        <span className="status-pill">{events.length} events</span>
      </div>
      {events.length > 0 ? (
        <div className="table-scroll">
          <table>
            <thead><tr><th>Event</th><th>Date</th><th>Volunteers</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {events.map(e => (
                <tr key={e._id}>
                  <td><b>{e.title}</b><small>{e.location}</small></td>
                  <td>{fmtDate(e.date)}</td>
                  <td>{e.volunteersCount}/{e.capacity}</td>
                  <td><span className={`status-pill ${new Date(e.date) > new Date() ? "status-green" : ""}`}>{new Date(e.date) > new Date() ? "Upcoming" : "Past"}</span></td>
                  <td style={{ display: "flex", gap: 6 }}>
                    <Link href="/dashboard/attendance" className="icon-btn" title="QR Code"><QrCode size={14}/></Link>
                    <Link href={`/events/${e._id}`} className="icon-btn" title="View Public Page"><ArrowUpRight size={14}/></Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="muted" style={{padding:"30px 20px"}}>No events created yet. Create your first event!</p>
      )}
    </div>

    {/* Outcome Submission Modal */}
    {showReportModal && (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "grid", placeItems: "center", zIndex: 120, padding: 20 }}>
        <div style={{ background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 16, padding: "28px", width: "100%", maxWidth: 500 }}>
          <h3 style={{ margin: "0 0 6px" }}>Submit Community Outcome</h3>
          <p className="muted" style={{ fontSize: ".78rem", marginBottom: 20 }}>Report quantifiable impact metrics from your completed event.</p>
          <form onSubmit={handleReportSubmit} style={{ display: "grid", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: ".75rem", fontWeight: 700, marginBottom: 6 }}>Event</label>
              <select 
                value={selectedEventId} 
                onChange={e => setSelectedEventId(e.target.value)}
                style={{ width: "100%", height: 44, padding: "0 12px", border: "1px solid var(--line)", borderRadius: 8, background: "var(--bg)", color: "var(--text)", fontSize: ".82rem" }}
              >
                {events.map(ev => <option key={ev._id} value={ev._id}>{ev.title}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: ".75rem", fontWeight: 700, marginBottom: 6 }}>Outcome Metric</label>
              <select 
                value={outcomeData.metric} 
                onChange={e => setOutcomeData({ ...outcomeData, metric: e.target.value })}
                style={{ width: "100%", height: 44, padding: "0 12px", border: "1px solid var(--line)", borderRadius: 8, background: "var(--bg)", color: "var(--text)", fontSize: ".82rem" }}
              >
                <option value="Trees Planted">Trees Planted</option>
                <option value="Blankets & Clothes Distributed">Blankets & Clothes Distributed</option>
                <option value="Meals Served">Meals Served</option>
                <option value="Books Collected">Books Collected</option>
                <option value="Bags of Trash Collected">Bags of Trash Collected</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: ".75rem", fontWeight: 700, marginBottom: 6 }}>Total Quantity / Count</label>
              <div className="input-wrap">
                <input 
                  type="number" 
                  min="1" 
                  placeholder="e.g. 150" 
                  value={outcomeData.count} 
                  onChange={e => setOutcomeData({ ...outcomeData, count: e.target.value })} 
                  required 
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <button className="btn btn-primary" type="submit" style={{ flex: 1 }}>Submit Outcome</button>
              <button className="btn btn-ghost" type="button" onClick={() => setShowReportModal(false)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    )}
  </>;
}
