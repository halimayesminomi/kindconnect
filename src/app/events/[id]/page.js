"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarDays, Clock3, MapPin, Users, CheckCircle2, MessageSquare, Send, Lock, ExternalLink } from "lucide-react";
import { PublicLayout } from "@/components/site";
import { useAuth } from "@/components/auth-provider";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function EventDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatText, setChatText] = useState("");
  const [sendingChat, setSendingChat] = useState(false);

  const isCreatorOrAdmin = Boolean(
    user && event && (user.email === event.creatorEmail || user.role === "admin")
  );
  const canChat = hasJoined || isCreatorOrAdmin;

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
      .catch(() => router.push("/events"))
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
    <Link href="/events" className="back-link"><ArrowLeft size={16}/> Back to opportunities</Link>
    <div className="detail-layout">
      <div>
        <div className="detail-cover" style={{ backgroundImage: `url(${event.image})` }}/>
        <div className="detail-main">
          <span className="category-pill static-pill">{event.category}</span>
          <h1>{event.title}</h1>
          <p className="muted">{event.description}</p>
          <h3>About this opportunity</h3>
          <p className="muted">Be part of a friendly team, meet people who care about the same things, and contribute to a practical community initiative. No special experience is needed — just bring your energy and willingness to help.</p>
          <div className="detail-perks">
            <span><CheckCircle2 size={16}/>Open to all volunteers</span>
            <span><CheckCircle2 size={16}/>Community-led activity</span>
            <span><CheckCircle2 size={16}/>Participation recognition</span>
          </div>

          {/* Event Community Group Chat Section */}
          <div style={{ marginTop: 32, padding: "20px", background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
              <div>
                <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: 8, fontSize: "1.05rem" }}>
                  <MessageSquare size={18} color="var(--green)" /> Event Volunteer Group Chat
                </h3>
                <p className="muted" style={{ fontSize: "0.75rem", margin: "2px 0 0" }}>
                  Dedicated discussion room for volunteers and organizers of this event.
                </p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Link
                  href="/dashboard/chat"
                  className="btn btn-outline"
                  style={{ padding: "6px 12px", fontSize: "0.74rem", display: "inline-flex", alignItems: "center", gap: 5 }}
                >
                  🛡️ Chat with Admin
                </Link>
                {canChat && (
                  <Link
                    href={`/dashboard/chat?event=${event._id}`}
                    className="btn btn-primary"
                    style={{ padding: "6px 12px", fontSize: "0.74rem" }}
                  >
                    Open in Full Chat ↗
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
                      No messages in this group yet. Say hello to fellow volunteers! 👋
                    </p>
                  ) : (
                    chatMessages.map(msg => {
                      const isMe = user && ((msg.sender === user._id) || (msg.sender === user.id) || (msg.sender?._id === user._id));
                      const isAdminMsg = msg.senderRole === "admin" || msg.senderUsername === "omi";
                      return (
                        <div key={msg._id} style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.68rem", color: "var(--muted)", marginBottom: 2 }}>
                            <b style={{ color: isMe ? "var(--green)" : "inherit" }}>{isMe ? "You" : msg.senderName}</b>
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
                <form onSubmit={handleSendChat} style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    placeholder="Type a message to the event group..."
                    value={chatText}
                    onChange={e => setChatText(e.target.value)}
                    disabled={sendingChat}
                    style={{
                      flex: 1,
                      padding: "8px 14px",
                      borderRadius: 10,
                      border: "1px solid var(--line)",
                      background: "var(--bg)",
                      color: "var(--text)",
                      fontSize: "0.82rem",
                      outline: "none"
                    }}
                  />
                  <button
                    type="submit"
                    disabled={sendingChat || !chatText.trim()}
                    className="btn btn-primary"
                    style={{ padding: "8px 16px", fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: 6 }}
                  >
                    <span>Send</span> <Send size={14} />
                  </button>
                </form>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "24px 16px", background: "var(--bg)", borderRadius: 12, border: "1px dashed var(--line)" }}>
                <Lock size={22} color="var(--muted)" style={{ margin: "0 auto 8px" }} />
                <h4 style={{ margin: 0, fontSize: "0.95rem" }}>Event Group Chat is Reserved for Attendees</h4>
                <p className="muted" style={{ fontSize: "0.76rem", margin: "4px auto 14px", maxWidth: 360 }}>
                  Join this event to collaborate with fellow volunteers in the group chat and coordinate logistics!
                </p>
                {!user ? (
                  <Link href="/login" className="btn btn-primary" style={{ padding: "6px 16px", fontSize: "0.78rem" }}>
                    Sign In to Join Event
                  </Link>
                ) : (
                  <button onClick={handleJoin} disabled={joining} className="btn btn-primary" style={{ padding: "6px 16px", fontSize: "0.78rem" }}>
                    {joining ? "Joining..." : "Join Event to Unlock Group Chat"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <aside className="join-card">
        <span className="eyebrow">EVENT DETAILS</span>
        <h2>Be part of it.</h2>
        <div className="detail-fact"><CalendarDays/><span><small>Date</small><b>{dateStr}</b></span></div>
        <div className="detail-fact"><Clock3/><span><small>Time</small><b>{event.time}</b></span></div>
        <div className="detail-fact">
          <MapPin/>
          <span>
            <small>Location</small>
            <b>{event.location}</b>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location + ", Bangladesh")}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: ".68rem", color: "var(--green)", marginTop: 2 }}
            >
              View on Map <ExternalLink size={10} />
            </a>
          </span>
        </div>
        <div className="detail-fact"><Users/><span><small>Volunteers</small><b>{event.volunteersCount} of {event.capacity} spots filled</b></span></div>
        <div className="progress"><span style={{ width: `${percent}%` }}/></div>
        {isPast ? (
          <button className="btn btn-ghost btn-block" disabled>Event has ended</button>
        ) : hasJoined ? (
          <button className="btn btn-outline btn-block" onClick={handleCancel} disabled={joining}>{joining ? "Cancelling..." : "Cancel Registration"}</button>
        ) : isFull ? (
          <button className="btn btn-outline btn-block" style={{ borderColor: "#d97706", color: "#d97706" }} onClick={handleJoin} disabled={joining}>
            {joining ? "Joining..." : "Join Waiting List"} {!joining && <Clock3 size={16}/>}
          </button>
        ) : (
          <button className="btn btn-primary btn-block" onClick={handleJoin} disabled={joining}>{joining ? "Joining..." : "Join this event"} {!joining && <ArrowUpRight size={17}/>}</button>
        )}
        {!user && !isPast && <small className="muted center-note">Sign in to register your interest.</small>}
        {isFull && !hasJoined && !isPast && <small className="muted center-note" style={{color:"#d97706"}}>Event is at capacity. Joining places you on the automated waitlist.</small>}
        {hasJoined && <small className="muted center-note" style={{color:"var(--green)"}}>✓ You're registered for this event!</small>}
      </aside>
    </div>
  </main></PublicLayout>;
}
