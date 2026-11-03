"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  AlertTriangle, 
  HeartHandshake, 
  Phone, 
  MapPin, 
  Users, 
  Plus, 
  ShieldCheck, 
  ArrowUpRight, 
  Flame, 
  Heart,
  UserCheck,
  Clock,
  X,
  MessageCircle,
  CheckCircle2
} from "lucide-react";
import { PublicLayout } from "@/components/site";
import { api } from "@/lib/api";
import { useAuth } from "@/components/auth-provider";
import { useSite } from "@/components/site-provider";
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
    volunteersJoined: 2,
    status: "open",
    responders: [
      {
        name: "Shanto Ahmed",
        email: "shanto@kindconnect.org",
        phone: "+880 1711-223344",
        message: "আমি ঢাকা মেডিক্যালের কাছেই আছি, ও-নেগেটিভ রক্ত দিতে প্রস্তুত।",
        respondedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        name: "Nusrat Jahan",
        email: "nusrat@kindconnect.org",
        phone: "+880 1819-556677",
        message: "আমার সাথে যোগাযোগ করতে পারেন, প্রয়োজনে অ্যাম্বুলেন্স সাপোর্ট দিতে পারব।",
        respondedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      }
    ],
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
    volunteersJoined: 1,
    status: "open",
    responders: [
      {
        name: "Halima Yesmin Omi",
        email: "halimaomi2002@gmail.com",
        phone: "+880 1700-112233",
        message: "মেট্রোপলিটন ইউনিভার্সিটি সিলেট থেকে আমরা ২৫টি কম্বল সংগ্রহ করেছি।",
        respondedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      }
    ],
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
    volunteersJoined: 0,
    status: "open",
    responders: [],
    createdAt: new Date().toISOString()
  }
];

export default function EmergencyPage() {
  const { user } = useAuth();
  const { lang, t } = useSite();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState("All");

  // Post Request Modal
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

  // View Responders Modal
  const [viewingRespondersRequest, setViewingRespondersRequest] = useState(null);

  // Respond / Help Modal
  const [respondingRequest, setRespondingRequest] = useState(null);
  const [submittingResponse, setSubmittingResponse] = useState(false);
  const [responseForm, setResponseForm] = useState({
    name: "",
    phone: "",
    message: ""
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

  // Open Help Response Modal
  const handleOpenHelpModal = (req) => {
    setRespondingRequest(req);
    setResponseForm({
      name: user?.name || "",
      phone: user?.phone || "+880 17",
      message: lang === "bn" ? "আমি এই জরুরি সহায়তায় পাশে থাকতে প্রস্তুত।" : "I am ready to help in this emergency initiative."
    });
  };

  // Submit Help Response
  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (!respondingRequest) return;

    setSubmittingResponse(true);
    try {
      const payload = {
        name: responseForm.name.trim() || user?.name || "Kind Helper",
        phone: responseForm.phone.trim(),
        message: responseForm.message.trim(),
        email: user?.email || "volunteer@kindconnect.org"
      };

      const res = await api.respondEmergencyRequest(respondingRequest._id, payload);
      toast.success(lang === "bn" ? `ধন্যবাদ! আপনি "${respondingRequest.title}"-এর সহায়তা টিমে যুক্ত হয়েছেন ❤️` : `You joined the response team for "${respondingRequest.title}"! ❤️`);
      
      setRespondingRequest(null);
      loadRequests();
    } catch (err) {
      toast.error(err.message || "Failed to submit response.");
    } finally {
      setSubmittingResponse(false);
    }
  };

  // Submit New Emergency Request
  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error(lang === "bn" ? "জরুরি সহায়তার অনুরোধ পাঠাতে লগইন করুন।" : "Please sign in to submit an emergency request.");
      return;
    }
    if (!form.title || !form.location || !form.contactPhone || !form.description) {
      toast.error(lang === "bn" ? "অনুগ্রহ করে সব ঘর পূরণ করুন।" : "Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    try {
      await api.createEmergencyRequest({
        ...form,
        requesterName: user.name || "Community Member",
        requesterEmail: user.email,
      });
      toast.success(lang === "bn" ? "জরুরি সহায়তার আবেদন সফলভাবে প্রকাশিত হয়েছে! 🚨" : "Emergency relief request submitted and verified! 🚨");
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

  return (
    <PublicLayout>
      <main className="container page-main">
        <div className="page-hero compact">
          <span className="eyebrow" style={{ color: "#ff6b6b" }}>
            <Flame size={14} color="#ff6b6b" /> {t("emergencyEyebrow")}
          </span>
          <h1>
            {lang === "bn" ? (
              <>কমিউনিটি ইমার্জেন্সি <br/><span className="gradient-text">রিলিফ ও সাহায্য হাব।</span></>
            ) : (
              <>Emergency Help &<br/><span className="gradient-text">Community Relief.</span></>
            )}
          </h1>
          <p className="muted">{t("emergencyDesc")}</p>
        </div>

        {/* Toolbar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, margin: "20px 0 24px" }}>
          <div className="category-tabs" style={{ margin: 0 }}>
            {categories.map(c => (
              <button key={c} onClick={() => setFilterCat(c)} className={filterCat === c ? "tab-active" : ""}>
                {c === "All" ? t("catAll") : c}
              </button>
            ))}
          </div>

          <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ padding: "10px 18px", fontSize: ".82rem" }}>
            <Plus size={16} /> {lang === "bn" ? "+ সাহায্যের আবেদন জানান" : t("postAppeal")}
          </button>
        </div>

        {/* Emergency Cards Grid */}
        {loading ? (
          <p style={{ textAlign: "center", padding: "60px 0" }}>{lang === "bn" ? "লোড হচ্ছে..." : "Loading requests..."}</p>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <HeartHandshake size={32} />
            <h3>{lang === "bn" ? "এই ক্যাটাগরিতে বর্তমানে কোনো জরুরি অনুরোধ নেই" : "No active emergency requests in this category"}</h3>
            <p>{lang === "bn" ? "কমিউনিটি এই মুহূর্তে সুরক্ষিত ও সহযোগিতাপ্রাপ্ত।" : "Communities are currently supported."}</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20 }}>
            {filtered.map(req => {
              const isCritical = req.urgency === "Critical";
              const respondersList = req.responders || [];
              const respondersCount = Math.max(respondersList.length, req.volunteersJoined || 0);

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
                      {req.urgency} {lang === "bn" ? "জরুরি মাত্রা" : "Urgency"}
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

                  {/* Responders Action Section */}
                  <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                    <button
                      type="button"
                      onClick={() => setViewingRespondersRequest(req)}
                      className="btn btn-ghost"
                      style={{
                        padding: "6px 10px",
                        fontSize: "0.75rem",
                        color: "var(--green)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        border: "1px solid var(--line)",
                        borderRadius: 8,
                        background: "rgba(34, 197, 94, 0.06)"
                      }}
                    >
                      <Users size={14} /> 
                      <b>{respondersCount}</b> {lang === "bn" ? "জন রেসপন্স করেছেন (দেখুন)" : "Responded (View)"}
                    </button>

                    <button 
                      onClick={() => handleOpenHelpModal(req)} 
                      className="btn btn-primary" 
                      style={{ padding: "8px 14px", fontSize: ".78rem", display: "inline-flex", alignItems: "center", gap: 6 }}
                    >
                      <Heart size={14} /> {lang === "bn" ? "সাহায্য করুন" : t("joinRelief")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* MODAL 1: VIEW RESPONDERS LIST */}
        {viewingRespondersRequest && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.78)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center", zIndex: 150, padding: "12px" }}>
            <div className="kc-modal-box" style={{ background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 18, padding: "24px", maxWidth: 520, maxHeight: "88vh", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, borderBottom: "1px solid var(--line)", paddingBottom: 12 }}>
                <div>
                  <span className="category-pill static-pill" style={{ fontSize: "0.65rem", marginBottom: 6 }}>
                    {viewingRespondersRequest.category}
                  </span>
                  <h3 style={{ margin: "4px 0", fontSize: "1.15rem" }}>
                    {viewingRespondersRequest.title}
                  </h3>
                  <p className="muted" style={{ fontSize: "0.76rem", margin: 0 }}>
                    {lang === "bn" ? "এই জরুরি সহায়তায় যারা সাড়া দিয়ে এগিয়ে এসেছেন:" : "Volunteers who responded to offer assistance:"}
                  </p>
                </div>
                <button
                  onClick={() => setViewingRespondersRequest(null)}
                  className="btn btn-ghost"
                  style={{ padding: 6, borderRadius: "50%", minWidth: "auto", border: "1px solid var(--line)" }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Responders List Body */}
              <div style={{ overflowY: "auto", flex: 1, paddingRight: 4, display: "flex", flexDirection: "column", gap: 10 }}>
                {(!viewingRespondersRequest.responders || viewingRespondersRequest.responders.length === 0) ? (
                  <div style={{ textAlign: "center", padding: "40px 10px" }}>
                    <Users size={32} color="var(--muted)" style={{ margin: "0 auto 10px" }} />
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text)" }}>
                      {lang === "bn" ? "এখনও কেউ আনুষ্ঠানিক বার্তা পাঠায়নি।" : "No written responses logged yet."}
                    </p>
                    <p className="muted" style={{ fontSize: "0.75rem", margin: "4px 0 16px" }}>
                      {lang === "bn" ? "আপনি প্রথম ব্যক্তি হিসেবে সহযোগিতার হাত বাড়িয়ে দিতে পারেন!" : "Be the first volunteer to step forward!"}
                    </p>
                    <button
                      onClick={() => {
                        const target = viewingRespondersRequest;
                        setViewingRespondersRequest(null);
                        handleOpenHelpModal(target);
                      }}
                      className="btn btn-primary"
                      style={{ padding: "8px 16px", fontSize: "0.8rem" }}
                    >
                      <Heart size={14} /> {lang === "bn" ? "এখনই সাহায্য করুন" : "Offer Help Now"}
                    </button>
                  </div>
                ) : (
                  viewingRespondersRequest.responders.map((resp, idx) => (
                    <div
                      key={resp._id || idx}
                      style={{
                        padding: "12px 14px",
                        background: "var(--bg)",
                        border: "1px solid var(--line)",
                        borderRadius: 12,
                        display: "flex",
                        flexDirection: "column",
                        gap: 6
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--green)", color: "#062817", display: "grid", placeItems: "center", fontWeight: 700, fontSize: "0.82rem" }}>
                            {resp.name?.charAt(0).toUpperCase() || "V"}
                          </div>
                          <div>
                            <b style={{ fontSize: "0.85rem", color: "var(--text)" }}>{resp.name}</b>
                            {resp.email && <div className="muted" style={{ fontSize: "0.7rem" }}>{resp.email}</div>}
                          </div>
                        </div>
                        <span style={{ fontSize: "0.68rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: 4 }}>
                          <Clock size={12} /> {resp.respondedAt ? new Date(resp.respondedAt).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recently"}
                        </span>
                      </div>

                      {resp.message && (
                        <div style={{ background: "var(--panel)", padding: "8px 10px", borderRadius: 8, fontSize: "0.78rem", color: "var(--text)", border: "1px solid var(--line)" }}>
                          💬 "{resp.message}"
                        </div>
                      )}

                      {resp.phone && (
                        <div style={{ fontSize: "0.72rem", color: "var(--green)", display: "flex", alignItems: "center", gap: 5 }}>
                          <Phone size={12} /> <span>{resp.phone}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--line)", display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setViewingRespondersRequest(null)}
                  className="btn btn-ghost"
                  style={{ padding: "8px 18px", fontSize: "0.8rem", border: "1px solid var(--line)" }}
                >
                  {lang === "bn" ? "বন্ধ করুন" : "Close"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: SUBMIT HELP / RESPONSE FORM */}
        {respondingRequest && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.78)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center", zIndex: 150, padding: "12px" }}>
            <div className="kc-modal-box" style={{ background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 18, padding: "24px", maxWidth: 480 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <span className="category-pill static-pill" style={{ fontSize: "0.65rem", marginBottom: 6 }}>
                    {respondingRequest.category}
                  </span>
                  <h3 style={{ margin: "4px 0", fontSize: "1.2rem" }}>
                    {lang === "bn" ? "সাহায্যে এগিয়ে আসুন" : "Join Response Team"}
                  </h3>
                  <p className="muted" style={{ fontSize: "0.76rem", margin: 0 }}>
                    {respondingRequest.title}
                  </p>
                </div>
                <button
                  onClick={() => setRespondingRequest(null)}
                  className="btn btn-ghost"
                  style={{ padding: 6, borderRadius: "50%", minWidth: "auto", border: "1px solid var(--line)" }}
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmitResponse} style={{ display: "grid", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: ".74rem", fontWeight: 700, marginBottom: 5 }}>
                    {lang === "bn" ? "আপনার নাম" : "Your Name"}
                  </label>
                  <div className="input-wrap">
                    <input 
                      placeholder="e.g. Halima Yesmin Omi" 
                      value={responseForm.name} 
                      onChange={e => setResponseForm({ ...responseForm, name: e.target.value })} 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: ".74rem", fontWeight: 700, marginBottom: 5 }}>
                    {lang === "bn" ? "জরুরি যোগাযোগের মোবাইল নম্বর" : "Contact Phone Number"}
                  </label>
                  <div className="input-wrap">
                    <input 
                      placeholder="e.g. +880 1712-345678" 
                      value={responseForm.phone} 
                      onChange={e => setResponseForm({ ...responseForm, phone: e.target.value })} 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: ".74rem", fontWeight: 700, marginBottom: 5 }}>
                    {lang === "bn" ? "কীভাবে সহায়তা করতে চান? (বার্তা)" : "How can you help? (Message)"}
                  </label>
                  <textarea 
                    placeholder={lang === "bn" ? "যেমন: আমি ২ ব্যাগ রক্তের ব্যবস্থা করতে পারব / প্রয়োজনীয় শীতবস্ত্র নিয়ে আসব..." : "Explain how you can assist (e.g. blood donation, transport, relief items)..."} 
                    value={responseForm.message} 
                    onChange={e => setResponseForm({ ...responseForm, message: e.target.value })} 
                    required 
                    style={{ width: "100%", minHeight: 80, padding: "10px", border: "1px solid var(--line)", borderRadius: 9, background: "var(--bg)", color: "var(--text)", fontSize: ".82rem", resize: "vertical" }}
                  />
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                  <button className="btn btn-primary" type="submit" disabled={submittingResponse} style={{ flex: 1 }}>
                    {submittingResponse ? (lang === "bn" ? "জমা হচ্ছে..." : "Submitting...") : (lang === "bn" ? "সাহায্য নিশ্চিত করুন" : "Confirm Response")}
                  </button>
                  <button className="btn btn-ghost" type="button" onClick={() => setRespondingRequest(null)} style={{ border: "1px solid var(--line)" }}>
                    {lang === "bn" ? "বাতিল" : "Cancel"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 3: CREATE NEW EMERGENCY REQUEST */}
        {showModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.78)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center", zIndex: 150, padding: "12px" }}>
            <div className="kc-modal-box" style={{ background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 18, padding: "24px", maxWidth: 540 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <h2 style={{ margin: "0 0 4px", fontSize: "1.45rem" }}>
                    {lang === "bn" ? "জরুরি সহায়তার আবেদন জানান" : "Submit Community Relief Request"}
                  </h2>
                  <p className="muted" style={{ fontSize: ".8rem", margin: 0 }}>
                    {lang === "bn" ? "বিপদগ্রস্ত এলাকা বা মানুষের সাহায্যে সরাসরি ভলান্টিয়ার টিমের সাথে যুক্ত হোন।" : "Report an urgent situation to connect with neighborhood volunteers."}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="btn btn-ghost"
                  style={{ padding: 6, borderRadius: "50%", minWidth: "auto", border: "1px solid var(--line)" }}
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmitRequest} style={{ display: "grid", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: ".75rem", fontWeight: 700, marginBottom: 6 }}>
                    {lang === "bn" ? "আবেদনের শিরোনাম" : "Request Title"}
                  </label>
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
                    <label style={{ display: "block", fontSize: ".75rem", fontWeight: 700, marginBottom: 6 }}>
                      {lang === "bn" ? "ক্যাটাগরি" : "Category"}
                    </label>
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
                    <label style={{ display: "block", fontSize: ".75rem", fontWeight: 700, marginBottom: 6 }}>
                      {lang === "bn" ? "জরুরি মাত্রা" : "Urgency Level"}
                    </label>
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
                    <label style={{ display: "block", fontSize: ".75rem", fontWeight: 700, marginBottom: 6 }}>
                      {lang === "bn" ? "স্থান / হাসপাতাল" : "Location / Hospital"}
                    </label>
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
                    <label style={{ display: "block", fontSize: ".75rem", fontWeight: 700, marginBottom: 6 }}>
                      {lang === "bn" ? "জরুরি ফোন নম্বর" : "Emergency Contact Phone"}
                    </label>
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
                  <label style={{ display: "block", fontSize: ".75rem", fontWeight: 700, marginBottom: 6 }}>
                    {lang === "bn" ? "পরিস্থিতির বিস্তারিত বিবরণ" : "Description & Situation"}
                  </label>
                  <textarea 
                    placeholder={lang === "bn" ? "জরুরি পরিস্থিতি ও সহায়তার চাহিদা বিস্তারিতভাবে লিখুন..." : "Explain the urgency, items or assistance needed, and coordination details..."} 
                    value={form.description} 
                    onChange={e => setForm({ ...form, description: e.target.value })} 
                    required 
                    style={{ width: "100%", minHeight: 90, padding: "12px", border: "1px solid var(--line)", borderRadius: 9, background: "var(--bg)", color: "var(--text)", fontSize: ".82rem", resize: "vertical" }}
                  />
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                  <button className="btn btn-primary" type="submit" disabled={submitting} style={{ flex: 1 }}>
                    {submitting ? (lang === "bn" ? "জমা হচ্ছে..." : "Submitting...") : (lang === "bn" ? "আবেদন প্রকাশ করুন" : "Submit for Verification")}
                  </button>
                  <button className="btn btn-ghost" type="button" onClick={() => setShowModal(false)} style={{ border: "1px solid var(--line)" }}>
                    {lang === "bn" ? "বাতিল" : "Cancel"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </PublicLayout>
  );
}
