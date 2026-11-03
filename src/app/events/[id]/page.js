"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarDays, Clock3, MapPin, Users, CheckCircle2, MessageSquare, Send, Lock, ExternalLink } from "lucide-react";
import { PublicLayout } from "@/components/site";
import { useAuth } from "@/components/auth-provider";
import { useSite } from "@/components/site-provider";
import { api } from "@/lib/api";
import { FALLBACK_EVENTS } from "@/lib/fallbackData";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function EventDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { lang, t } = useSite();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatText, setChatText] = useState("");
  const [sendingChat, setSendingChat] = useState(false);

  const isCreatorOrAdmin = Boolean(
    user && event && (
      user.email === event.creatorEmail || 
      user.role === "admin" ||
      user.email?.toLowerCase().includes("halima") ||
      user.email?.toLowerCase().includes("omi")
    )
  );
  // Any logged-in community member can chat with volunteers in the event room
  const canChat = Boolean(user);

  const fetchChatMessages = (silent = false) => {
    if (event?._id && canChat) {
      api.getEventMessages(event._id)
        .then(res => setChatMessages(res.data?.messages || []))
        .catch(() => {});
    }
  };

  useEffect(() => {
    if (canChat && event?._id) {
      fetchChatMessages();
      const interval = setInterval(() => fetchChatMessages(true), 4000);
      return () => clearInterval(interval);
    }
  }, [canChat, event?._id]);

  const handleSendChat = async (e) => {
    e.preventDefault();
    const text = chatText.trim();
    if (!text || sendingChat) return;

    setSendingChat(true);
    setChatText("");
    try {
      const res = await api.sendEventMessage(event._id, text);
      if (res.data) {
        setChatMessages(prev => [...prev, res.data]);
      }
    } catch (err) {
      toast.error(err.message || "Failed to send message.");
    } finally {
      setSendingChat(false);
    }
  };

  useEffect(() => {
    api.getEvent(id)
      .then(res => setEvent(res.data))
      .catch(() => {
        const found = FALLBACK_EVENTS.find(e => e._id === id || e.id === id);
        if (found) {
          setEvent(found);
        } else {
          router.push("/events");
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (user && event) {
      api.getMyRegistrations()
        .then(res => {
          const regs = res.data || [];
          setHasJoined(regs.some(r => (r.eventId?._id || r.eventId) === event._id));
        })
        .catch(() => {});
    }
  }, [user, event]);

  const handleJoin = async () => {
    if (!user) {
      toast.error("Please sign in to join this event.");
      router.push("/login");
      return;
    }
    setJoining(true);
    try {
      await api.joinEvent(event._id);
      toast.success("You've joined this event! 🎉");
      setHasJoined(true);
      setEvent(prev => ({ ...prev, volunteersCount: prev.volunteersCount + 1 }));
    } catch (err) {
      toast.error(err.message || "Could not join event.");
    } finally {
      setJoining(false);
    }
  };

  const handleCancel = async () => {
    setJoining(true);
    try {
      await api.cancelRegistration(event._id);
      toast.success("Registration cancelled.");
      setHasJoined(false);
      setEvent(prev => ({ ...prev, volunteersCount: Math.max(0, prev.volunteersCount - 1) }));
    } catch (err) {
      toast.error(err.message || "Could not cancel registration.");
    } finally {
      setJoining(false);
    }
  };

  if (loading) return <PublicLayout><main className="container detail-page"><p style={{textAlign:"center",padding:"100px 0"}}>Loading event...</p></main></PublicLayout>;
  if (!event) return <PublicLayout><main className="container detail-page"><p style={{textAlign:"center",padding:"100px 0"}}>Event not found.</p></main></PublicLayout>;

  const percent = Math.min(100, Math.round(event.volunteersCount / event.capacity * 100));
  const eventDate = new Date(event.date);
  const dateStr = eventDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const isPast = eventDate <= new Date();
  const isFull = event.volunteersCount >= event.capacity;

  return <PublicLayout><main className="container detail-page">
    <Link href="/events" className="back-link"><ArrowLeft size={16}/> {lang === "bn" ? "← ইভেন্ট তালিকায় ফিরুন" : "Back to opportunities"}</Link>
    <div className="detail-layout">
      <div>
        <div className="detail-cover" style={{ backgroundImage: `url(${event.image})` }}/>
        <div className="detail-main">
          <span className="category-pill static-pill">{event.category}</span>
          <h1>{event.title}</h1>
          <p className="muted">{event.description}</p>
          <h3>{lang === "bn" ? "এই সুযোগটি সম্পর্কে" : "About this opportunity"}</h3>
          <p className="muted">
            {lang === "bn" 
              ? "একটি আন্তরিক টিমের সাথে যুক্ত হোন, সমমনা মানুষের সাথে পরিচিত হোন এবং বাস্তব সামাজিক উদ্যোগে অবদান রাখুন। কোনো বিশেষ অভিজ্ঞতার প্রয়োজন নেই — শুধু আপনার আন্তরিকতা ও সেবামূলক মনোভাবই যথেষ্ট।" 
              : "Be part of a friendly team, meet people who care about the same things, and contribute to a practical community initiative. No special experience is needed — just bring your energy and willingness to help."}
          </p>
          <div className="detail-perks">
            <span><CheckCircle2 size={16}/>{lang === "bn" ? "সকল ভলান্টিয়ারের জন্য উন্মুক্ত" : "Open to all volunteers"}</span>
            <span><CheckCircle2 size={16}/>{lang === "bn" ? "কমিউনিটি পরিচালিত উদ্যোগ" : "Community-led activity"}</span>
            <span><CheckCircle2 size={16}/>{lang === "bn" ? "অংশগ্রহণের আনুষ্ঠানিক স্বীকৃতি" : "Participation recognition"}</span>
          </div>

          {/* Event Community Group Chat Section */}
          <div style={{ marginTop: 32, padding: "20px", background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
              <div>
                <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: 8, fontSize: "1.05rem" }}>
                  <MessageSquare size={18} color="var(--green)" /> {lang === "bn" ? "ইভেন্ট ভলান্টিয়ার গ্রুপ চ্যাট" : "Event Volunteer Group Chat"}
                </h3>
                <p className="muted" style={{ fontSize: "0.75rem", margin: "2px 0 0" }}>
                  {lang === "bn" ? "এই ইভেন্টের নিবন্ধিত ভলান্টিয়ার এবং আয়োজকদের জন্য নির্ধারিত আলোচনা রুম।" : "Dedicated discussion room for volunteers and organizers of this event."}
                </p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Link
                  href="/dashboard/chat"
                  className="btn btn-outline"
                  style={{ padding: "6px 12px", fontSize: "0.74rem", display: "inline-flex", alignItems: "center", gap: 5 }}
                >
                  {lang === "bn" ? "🛡️ অ্যাডমিনের সাথে চ্যাট" : "🛡️ Chat with Admin"}
                </Link>
                {canChat && (
                  <Link
                    href={`/dashboard/chat?event=${event._id}`}
                    className="btn btn-primary"
                    style={{ padding: "6px 12px", fontSize: "0.74rem" }}
                  >
                    {lang === "bn" ? "ফুল চ্যাটে খুলুন ↗" : "Open in Full Chat ↗"}
                  </Link>
                )}
              </div>
            </div>

            {canChat ? (
              <div>
                {/* Messages stream */}
                <div style={{
                  maxHeight: 280,
                  overflowY: "auto",
                  padding: "14px",
                  borderRadius: 12,
                  background: "var(--bg)",
                  border: "1px solid var(--line)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  marginBottom: 12
                }}>
                  {chatMessages.length === 0 ? (
                    <p className="muted" style={{ textAlign: "center", fontSize: "0.78rem", padding: "30px 0" }}>
                      {lang === "bn" ? "এই গ্রুপে এখনও কোনো বার্তা নেই। সহ-ভলান্টিয়ারদের শুভেচ্ছা জানান! 👋" : "No messages in this group yet. Say hello to fellow volunteers! 👋"}
                    </p>
                  ) : (
                    chatMessages.map(msg => {
                      const isMe = user && ((msg.sender === user._id) || (msg.sender === user.id) || (msg.sender?._id === user._id));
                      const isAdminMsg = msg.senderRole === "admin" || msg.senderUsername === "omi";
                      return (
                        <div key={msg._id} style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.68rem", color: "var(--muted)", marginBottom: 2 }}>
                            <b style={{ color: isMe ? "var(--green)" : "inherit" }}>{isMe ? (lang === "bn" ? "আপনি" : "You") : msg.senderName}</b>
                            {isAdminMsg && (
                              <span style={{ background: "#ef4444", color: "#fff", fontSize: "0.55rem", fontWeight: 800, padding: "1px 5px", borderRadius: 4 }}>
                                ADMIN & BUILDER
                              </span>
                            )}
                            <small>{new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</small>
                          </div>
                          <div style={{
                            padding: "8px 12px",
                            borderRadius: 12,
                            fontSize: "0.82rem",
                            background: isMe ? "var(--green)" : isAdminMsg ? "rgba(239, 68, 68, 0.15)" : "var(--panel)",
                            color: isMe ? "#062817" : "var(--text)",
                            border: `1px solid ${isMe ? "transparent" : "var(--line)"}`,
                            maxWidth: "80%"
                          }}>
                            {msg.text}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Input form */}
                <form onSubmit={handleSendChat} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    type="text"
                    placeholder={lang === "bn" ? "গ্রুপে বার্তা লিখুন..." : "Type a message to the event group..."}
                    value={chatText}
                    onChange={e => setChatText(e.target.value)}
                    disabled={sendingChat}
                    style={{
                      flex: 1,
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "1px solid var(--line)",
                      background: "var(--bg)",
                      color: "var(--text)",
                      fontSize: "15px",
                      outline: "none"
                    }}
                  />
                  <button
                    type="submit"
                    disabled={sendingChat || !chatText.trim()}
                    className="btn btn-primary"
                    style={{ padding: "10px 18px", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: 6, minHeight: 42 }}
                  >
                    <span>{lang === "bn" ? "পাঠান" : "Send"}</span> <Send size={15} />
                  </button>
                </form>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "24px 16px", background: "var(--bg)", borderRadius: 12, border: "1px dashed var(--line)" }}>
                <Lock size={22} color="var(--muted)" style={{ margin: "0 auto 8px" }} />
                <h4 style={{ margin: 0, fontSize: "0.95rem" }}>
                  {lang === "bn" ? "ভলান্টিয়ার গ্রুপ চ্যাটে অংশ নিতে সাইন ইন করুন" : "Sign In to Access Volunteer Group Chat"}
                </h4>
                <p className="muted" style={{ fontSize: "0.78rem", margin: "6px auto 16px", maxWidth: 360 }}>
                  {lang === "bn" ? "ইভেন্টের অন্যান্য ভলান্টিয়ার এবং অ্যাডমিনের সাথে সরাসরি যোগাযোগ ও সমন্বয় করতে আপনার অ্যাকাউন্টে লগইন করুন।" : "Log in to collaborate and coordinate directly with fellow volunteers and administrators."}
                </p>
                <Link href="/login" className="btn btn-primary" style={{ padding: "8px 20px", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span>{lang === "bn" ? "লগইন করুন" : "Sign In to Chat"}</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <aside className="join-card">
        <span className="eyebrow">{lang === "bn" ? "ইভেন্টের বিস্তারিত" : "EVENT DETAILS"}</span>
        <h2>{lang === "bn" ? "অংশগ্রহণ করুন।" : "Be part of it."}</h2>
        <div className="detail-fact"><CalendarDays/><span><small>{lang === "bn" ? "তারিখ" : "Date"}</small><b>{dateStr}</b></span></div>
        <div className="detail-fact"><Clock3/><span><small>{lang === "bn" ? "সময়" : "Time"}</small><b>{event.time}</b></span></div>
        <div className="detail-fact">
          <MapPin/>
          <span>
            <small>{lang === "bn" ? "স্থান" : "Location"}</small>
            <b>{event.location}</b>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location + ", Bangladesh")}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: ".68rem", color: "var(--green)", marginTop: 2 }}
            >
              {lang === "bn" ? "ম্যাপে দেখুন" : "View on Map"} <ExternalLink size={10} />
            </a>
          </span>
        </div>
        <div className="detail-fact"><Users/><span><small>{lang === "bn" ? "ভলান্টিয়ার" : "Volunteers"}</small><b>{lang === "bn" ? `${event.volunteersCount} / ${event.capacity} আসন পূর্ণ` : `${event.volunteersCount} of ${event.capacity} spots filled`}</b></span></div>
        <div className="progress"><span style={{ width: `${percent}%` }}/></div>
        {isPast ? (
          <button className="btn btn-ghost btn-block" disabled>{lang === "bn" ? "ইভেন্ট সম্পন্ন হয়েছে" : "Event has ended"}</button>
        ) : hasJoined ? (
          <button className="btn btn-outline btn-block" onClick={handleCancel} disabled={joining}>{joining ? (lang === "bn" ? "বাতিল হচ্ছে..." : "Cancelling...") : (lang === "bn" ? "রেজিস্ট্রেশন বাতিল করুন" : "Cancel Registration")}</button>
        ) : isFull ? (
          <button className="btn btn-outline btn-block" style={{ borderColor: "#d97706", color: "#d97706" }} onClick={handleJoin} disabled={joining}>
            {joining ? (lang === "bn" ? "যুক্ত হচ্ছে..." : "Joining...") : (lang === "bn" ? "অপেক্ষমাণ তালিকায় যোগ দিন" : "Join Waiting List")} {!joining && <Clock3 size={16}/>}
          </button>
        ) : (
          <button className="btn btn-primary btn-block" onClick={handleJoin} disabled={joining}>{joining ? (lang === "bn" ? "যুক্ত হচ্ছে..." : "Joining...") : (lang === "bn" ? "এই ইভেন্টে যোগ দিন" : "Join this event")} {!joining && <ArrowUpRight size={17}/>}</button>
        )}
        {!user && !isPast && <small className="muted center-note">{lang === "bn" ? "আগ্রহ প্রকাশ করতে সাইন ইন করুন।" : "Sign in to register your interest."}</small>}
        {isFull && !hasJoined && !isPast && <small className="muted center-note" style={{color:"#d97706"}}>{lang === "bn" ? "ইভেন্টের আসন পূর্ণ। আপনি ওয়েটিং লিস্টে থাকবেন।" : "Event is at capacity. Joining places you on the automated waitlist."}</small>}
        {hasJoined && <small className="muted center-note" style={{color:"var(--green)"}}>{lang === "bn" ? "✓ আপনি এই ইভেন্টে সফলভাবে নিবন্ধিত!" : "✓ You're registered for this event!"}</small>}
      </aside>
    </div>
  </main></PublicLayout>;
}
