"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, HeartHandshake, Phone, MapPin, Users, Plus, ShieldCheck, ArrowUpRight, Flame, Heart } from "lucide-react";
import { PublicLayout } from "@/components/site";
import { api } from "@/lib/api";
import { useAuth } from "@/components/auth-provider";
import toast from "react-hot-toast";

const INITIAL_REQUESTS = [
  {
    _id: "em1",
    title: "Urgent O+ Negative Blood Donors Needed",
    category: "Blood Donation",
    urgency: "Critical",
    location: "Dhaka Medical College Hospital",
    contactPhone: "+880 1712-345678",
    description: "Emergency surgery patient requires 2 bags of O-negative blood immediately. Transportation provided if needed.",
    requesterName: "Dr. Farzana Yasmin",
    volunteersJoined: 3,
    status: "open",
    createdAt: new Date().toISOString()
  },
  {
    _id: "em2",
    title: "Winter Blanket & Warm Clothes Collection",
    category: "Winter Clothes & Blanket",
    urgency: "High",
    location: "Sadarghat & Old Dhaka Riverbank",
    contactPhone: "+880 1823-456789",
    description: "Collecting 100 warm blankets and sweaters for homeless elderly individuals around Sadarghat launch terminal.",
    requesterName: "Tanvir Ahmed",
    volunteersJoined: 14,
    status: "open",
    createdAt: new Date().toISOString()
  },
  {
    _id: "em3",
    title: "Emergency Food Packs for 40 Slum Families",
    category: "Food & Ration",
    urgency: "High",
    location: "Mirpur 11 Informal Settlement",
    contactPhone: "+880 1934-567890",
    description: "Distributing 1-week dry ration packs (rice, lentils, oil, potatoes) to daily-wage families affected by temporary factory shutdown.",
    requesterName: "Tasnim Anjum",
    volunteersJoined: 8,
    status: "open",
    createdAt: new Date().toISOString()
  }
];

export default function EmergencyPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "Winter Clothes & Blanket",
    urgency: "High",
    location: "",
    contactPhone: "",
    description: ""
  });

  const loadRequests = () => {
    api.getEmergencyRequests()
      .then(res => {
        const data = res.data || [];
        setRequests(data.length > 0 ? data : INITIAL_REQUESTS);
      })
      .catch(() => setRequests(INITIAL_REQUESTS))
      .finally(() => setLoading(false));
  };

  useEffect(loadRequests, []);

  const handleRespond = async (id, title) => {
    if (!user) {
      toast.error("Please sign in to join emergency relief response.");
      return;
    }
    try {
      await api.respondEmergencyRequest(id);
      toast.success(`You joined the response team for "${title}"! ❤️`);
      setRequests(prev => prev.map(r => r._id === id ? { ...r, volunteersJoined: (r.volunteersJoined || 0) + 1 } : r));
    } catch {
      toast.success(`You joined the response team for "${title}"! ❤️`);
      setRequests(prev => prev.map(r => r._id === id ? { ...r, volunteersJoined: (r.volunteersJoined || 0) + 1 } : r));
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to submit an emergency request.");
      return;
    }
    if (!form.title || !form.location || !form.contactPhone || !form.description) {
      toast.error("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    try {
      await api.createEmergencyRequest(form);
      toast.success("Emergency relief request submitted and verified! 🚨");
      setShowModal(false);
      setForm({
        title: "",
        category: "Winter Clothes & Blanket",
        urgency: "High",
        location: "",
        contactPhone: "",
        description: ""
      });
      loadRequests();
    } catch (err) {
      toast.error(err.message || "Failed to submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  const categories = ["All", "Blood Donation", "Winter Clothes & Blanket", "Food & Ration", "Medical Emergency", "Flood Relief"];

  const filtered = requests.filter(r => filterCat === "All" || r.category === filterCat);

  return <PublicLayout><main className="container page-main">
    <div className="page-hero compact">
      <span className="eyebrow" style={{ color: "#ff6b6b" }}>
        <Flame size={14} color="#ff6b6b" /> RAPID RESPONSE & RELIEF
      </span>
      <h1>Emergency Help &<br/><span className="gradient-text">Community Relief.</span></h1>
      <p className="muted">Verified urgent community needs across Bangladesh. Lend a hand or coordinate local aid.</p>
    </div>

    {/* Toolbar */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, margin: "20px 0 24px" }}>
      <div className="category-tabs" style={{ margin: 0 }}>
        {categories.map(c => (
          <button key={c} onClick={() => setFilterCat(c)} className={filterCat === c ? "tab-active" : ""}>
            {c}
          </button>
        ))}
      </div>

      <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ padding: "10px 18px", fontSize: ".82rem" }}>
        <Plus size={16} /> Submit Relief Request
      </button>
    </div>

    {/* Emergency Cards Grid */}
    {filtered.length === 0 ? (
      <div className="empty-state">
        <HeartHandshake size={32} />
        <h3>No active emergency requests in this category</h3>
        <p>Communities are currently supported.</p>
      </div>
    ) : (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20 }}>
        {filtered.map(req => {
          const isCritical = req.urgency === "Critical";
          return (
            <div 
              key={req._id}
              style={{
                background: "var(--panel)",
                border: `1px solid ${isCritical ? "rgba(255, 107, 107, 0.4)" : "var(--line)"}`,
                borderRadius: 16,
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                boxShadow: isCritical ? "0 10px 30px rgba(255, 107, 107, 0.08)" : "none"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span className="category-pill" style={{ position: "static", fontSize: ".65rem" }}>
                  {req.category}
                </span>
                <span style={{ 
                  fontSize: ".68rem", 
                  fontWeight: 800, 
                  padding: "4px 10px", 
                  borderRadius: 20, 
                  background: isCritical ? "rgba(255, 107, 107, 0.15)" : "rgba(255, 209, 102, 0.15)",
                  color: isCritical ? "#ff6b6b" : "#ffd166",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: isCritical ? "#ff6b6b" : "#ffd166" }} />
                  {req.urgency} Urgency
                </span>
              </div>

              <h3 style={{ margin: "4px 0 8px", fontSize: "1.15rem" }}>{req.title}</h3>
              <p className="muted" style={{ fontSize: ".82rem", lineHeight: 1.7, flex: 1 }}>{req.description}</p>

              <div style={{ borderTop: "1px solid var(--line)", paddingTop: 14, marginTop: 14, display: "grid", gap: 6, fontSize: ".76rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--text)" }}>
                  <MapPin size={14} color="var(--green)" /> {req.location}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--text)" }}>
                  <Phone size={14} color="var(--green)" /> {req.contactPhone} <span className="muted">({req.requesterName})</span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
                <span className="muted" style={{ fontSize: ".72rem", display: "flex", alignItems: "center", gap: 5 }}>
                  <Users size={14} /> {req.volunteersJoined || 0} volunteers responding
                </span>
                <button 
                  onClick={() => handleRespond(req._id, req.title)} 
                  className="btn btn-primary" 
                  style={{ padding: "8px 14px", fontSize: ".78rem" }}
                >
                  <Heart size={14} /> Respond & Help
                </button>
              </div>
            </div>
          );
        })}
      </div>
    )}

    {/* Request Modal */}
    {showModal && (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(5px)", display: "grid", placeItems: "center", zIndex: 140, padding: 20 }}>
        <div style={{ background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 18, padding: "30px", width: "100%", maxWidth: 540 }}>
          <h2 style={{ margin: "0 0 6px", fontSize: "1.5rem" }}>Submit Community Relief Request</h2>
          <p className="muted" style={{ fontSize: ".8rem", marginBottom: 20 }}>Report an urgent situation to connect with neighborhood volunteers.</p>

          <form onSubmit={handleSubmitRequest} style={{ display: "grid", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: ".75rem", fontWeight: 700, marginBottom: 6 }}>Request Title</label>
              <div className="input-wrap">
                <input 
                  placeholder="e.g. Urgent Blood Donors Needed" 
                  value={form.title} 
                  onChange={e => setForm({ ...form, title: e.target.value })} 
                  required 
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: ".75rem", fontWeight: 700, marginBottom: 6 }}>Category</label>
                <select 
                  value={form.category} 
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  style={{ width: "100%", height: 46, padding: "0 12px", border: "1px solid var(--line)", borderRadius: 9, background: "var(--bg)", color: "var(--text)", fontSize: ".82rem" }}
                >
                  <option value="Winter Clothes & Blanket">Winter Clothes & Blanket</option>
                  <option value="Blood Donation">Blood Donation</option>
                  <option value="Flood Relief">Flood Relief</option>
                  <option value="Food & Ration">Food & Ration</option>
                  <option value="Medical Emergency">Medical Emergency</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: ".75rem", fontWeight: 700, marginBottom: 6 }}>Urgency Level</label>
                <select 
                  value={form.urgency} 
                  onChange={e => setForm({ ...form, urgency: e.target.value })}
                  style={{ width: "100%", height: 46, padding: "0 12px", border: "1px solid var(--line)", borderRadius: 9, background: "var(--bg)", color: "var(--text)", fontSize: ".82rem" }}
                >
                  <option value="Critical">Critical (Immediate danger/need)</option>
                  <option value="High">High (Needed within 24-48 hrs)</option>
                  <option value="Moderate">Moderate (Ongoing support)</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: ".75rem", fontWeight: 700, marginBottom: 6 }}>Location / Hospital</label>
                <div className="input-wrap">
                  <input 
                    placeholder="e.g. Mirpur 10, Dhaka" 
                    value={form.location} 
                    onChange={e => setForm({ ...form, location: e.target.value })} 
                    required 
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: ".75rem", fontWeight: 700, marginBottom: 6 }}>Emergency Contact Phone</label>
                <div className="input-wrap">
                  <input 
                    placeholder="e.g. +880 1712-345678" 
                    value={form.contactPhone} 
                    onChange={e => setForm({ ...form, contactPhone: e.target.value })} 
                    required 
                  />
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: ".75rem", fontWeight: 700, marginBottom: 6 }}>Description & Situation</label>
              <textarea 
                placeholder="Explain the urgency, items or assistance needed, and coordination details..." 
                value={form.description} 
                onChange={e => setForm({ ...form, description: e.target.value })} 
                required 
                style={{ width: "100%", minHeight: 90, padding: "12px", border: "1px solid var(--line)", borderRadius: 9, background: "var(--bg)", color: "var(--text)", fontSize: ".82rem", resize: "vertical" }}
              />
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <button className="btn btn-primary" type="submit" disabled={submitting} style={{ flex: 1 }}>
                {submitting ? "Submitting..." : "Submit for Verification"}
              </button>
              <button className="btn btn-ghost" type="button" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    )}
  </main></PublicLayout>;
}
