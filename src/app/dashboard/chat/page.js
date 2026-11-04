"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  MessageSquare, 
  Send, 
  Users, 
  ShieldCheck, 
  CalendarDays, 
  Sparkles, 
  ArrowUpRight, 
  UserCheck, 
  Clock, 
  CheckCheck,
  Search,
  MessageCircle,
  Hash,
  ArrowLeft
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/components/auth-provider";
import toast from "react-hot-toast";

function ChatContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const initialEventId = searchParams.get("event");
  const initialUserId = searchParams.get("user");

  // Selected chat target:
  // - { type: "event", id: eventId, data: eventObj }
  // - { type: "admin" } (for volunteers chatting with admin)
  // - { type: "user", id: volunteerUserId, data: userObj } (for admin chatting with volunteer)
  const [activeChat, setActiveChat] = useState(null);

  // Mobile navigation view: "channels" (sidebar list) | "room" (active chat messages)
  const [mobileView, setMobileView] = useState("channels");

  const [events, setEvents] = useState([]);
  const [adminConversations, setAdminConversations] = useState([]);
  const [adminInfo, setAdminInfo] = useState(null);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const messagesEndRef = useRef(null);
  const pollingRef = useRef(null);
  const lastOtherMsgIdRef = useRef(null);

  const isAdmin = user?.role === "admin";

  // Audio chime for new incoming messages
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(659.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (_) {}
  };

  // Auto-scroll to bottom of messages container
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Select a chat room and switch to room view on mobile
  const selectChat = (target) => {
    setActiveChat(target);
    setMobileView("room");
  };

  // Load chat channel lists
  const loadChannels = async () => {
    try {
      // 1. Load Event Group Channels
      const evRes = await api.getChatEvents();
      const evList = evRes.data || [];
      setEvents(evList);

      // 2. Load Direct Chats
      let firstUserConv = null;
      let convList = [];
      if (isAdmin) {
        // Admin loads all direct volunteer conversations
        const convRes = await api.getAdminConversations();
        convList = convRes.data || [];
        setAdminConversations(convList);
        if (convList.length > 0) {
          firstUserConv = convList[0];
        }
      } else {
        // Volunteer loads admin info
        const directRes = await api.getDirectAdminChat();
        if (directRes.data?.admin) {
          setAdminInfo(directRes.data.admin);
        }
      }

      // Default selection if not already selected
      if (!activeChat) {
        if (initialUserId && isAdmin) {
          const matchUserConv = convList.find(c => c.user._id === initialUserId || c.user.id === initialUserId);
          if (matchUserConv) {
            selectChat({ type: "user", id: matchUserConv.user._id, data: matchUserConv.user });
            return;
          } else {
            selectChat({ type: "user", id: initialUserId, data: { _id: initialUserId, name: "Volunteer" } });
            return;
          }
        }

        if (initialEventId) {
          const match = evList.find(e => e._id === initialEventId || e.id === initialEventId);
          if (match) {
            selectChat({ type: "event", id: match._id, data: match });
            return;
          }
        }

        if (!isAdmin) {
          // Default to Direct Admin Chat for volunteers
          setActiveChat({ type: "admin" });
        } else if (firstUserConv) {
          // Admin defaults to the most recent volunteer inquiry
          setActiveChat({ type: "user", id: firstUserConv.user._id, data: firstUserConv.user });
        } else if (evList.length > 0) {
          // Fallback to first event room for admin
          setActiveChat({ type: "event", id: evList[0]._id, data: evList[0] });
        }
      }
    } catch (err) {
      console.error("Load channels error:", err);
    }
  };

  useEffect(() => {
    loadChannels();
  }, [isAdmin]);

  // Listen for initialEventId query param
  useEffect(() => {
    if (initialEventId && events.length > 0) {
      const match = events.find(e => e._id === initialEventId || e.id === initialEventId);
      if (match) {
        selectChat({ type: "event", id: match._id, data: match });
      }
    }
  }, [initialEventId, events]);

  // Listen for initialUserId query param
  useEffect(() => {
    if (initialUserId && isAdmin && adminConversations.length > 0) {
      const match = adminConversations.find(c => c.user._id === initialUserId || c.user.id === initialUserId);
      if (match) {
        selectChat({ type: "user", id: match.user._id, data: match.user });
      }
    }
  }, [initialUserId, isAdmin, adminConversations]);

  // Safe message updater that merges server messages without wiping optimistic ones,
  // and detects incoming messages to play chime & toast.
  const updateMessagesSafely = (serverMessages) => {
    if (!Array.isArray(serverMessages)) return;

    setMessages(prev => {
      const prevIds = new Set(prev.map(m => m._id?.toString()));
      const currentUserId = user?._id || user?.id;

      let newOtherMsg = null;
      serverMessages.forEach(m => {
        const mid = m._id?.toString();
        const isFromOther = m.sender?.toString() !== currentUserId?.toString();
        if (mid && !prevIds.has(mid) && isFromOther && !mid.startsWith("temp_")) {
          newOtherMsg = m;
        }
      });

      if (newOtherMsg && newOtherMsg._id?.toString() !== lastOtherMsgIdRef.current) {
        lastOtherMsgIdRef.current = newOtherMsg._id?.toString();
        playChime();
        toast(`${newOtherMsg.senderName}: ${newOtherMsg.text}`, {
          icon: "💬",
          duration: 4000,
        });
      }

      // Keep pending optimistic messages that haven't been resolved yet
      const optimisticPending = prev.filter(m => m._id && m._id.toString().startsWith("temp_"));
      return [...serverMessages, ...optimisticPending];
    });
  };

  // Fetch messages for currently active chat
  const fetchMessages = async (silent = false) => {
    if (!activeChat) return;
    if (!silent) setLoadingMessages(true);

    try {
      if (activeChat.type === "event") {
        const res = await api.getEventMessages(activeChat.id);
        if (res.data?.messages) {
          updateMessagesSafely(res.data.messages);
        }
      } else if (activeChat.type === "admin") {
        const res = await api.getDirectAdminChat();
        if (res.data?.messages) {
          updateMessagesSafely(res.data.messages);
        }
        if (res.data?.admin) {
          setAdminInfo(res.data.admin);
        }
      } else if (activeChat.type === "user") {
        const res = await api.getAdminUserChat(activeChat.id);
        if (res.data?.messages) {
          updateMessagesSafely(res.data.messages);
        }
      }
    } catch (err) {
      if (!silent) console.error("Fetch messages error:", err);
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  };

  // Re-fetch messages when active chat changes
  useEffect(() => {
    fetchMessages();

    // Start live polling every 3.5 seconds
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(() => {
      fetchMessages(true);
    }, 3500);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [activeChat]);

  // Send message handler
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || sending || !activeChat) return;

    if (!user) {
      toast.error("চ্যাটে বার্তা পাঠাতে অনুগ্রহ করে লগইন করুন।");
      return;
    }

    setSending(true);
    setInputText("");

    // Optimistic message for instant responsive UI
    const tempId = "temp_" + Date.now();
    const optimisticMsg = {
      _id: tempId,
      sender: user?._id || user?.id,
      senderName: user?.name || "You",
      senderRole: user?.role || "user",
      senderDesignation: user?.designation || (user?.role === "admin" ? "Platform Admin & Lead Builder" : "Volunteer"),
      senderPhoto: user?.photoURL || "",
      text,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimisticMsg]);

    try {
      if (activeChat.type === "event") {
        const res = await api.sendEventMessage(activeChat.id, text);
        if (res.data) {
          setMessages(prev => prev.map(m => m._id === tempId ? res.data : m));
        }
      } else if (activeChat.type === "admin") {
        const res = await api.sendDirectAdminMessage(text);
        if (res.data) {
          setMessages(prev => prev.map(m => m._id === tempId ? res.data : m));
        }
      } else if (activeChat.type === "user") {
        const res = await api.sendAdminUserMessage(activeChat.id, text);
        if (res.data) {
          setMessages(prev => prev.map(m => m._id === tempId ? res.data : m));
        }
      }
    } catch (err) {
      toast.error(err.message || "বার্তা পাঠাতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।");
      // Rollback optimistic message
      setMessages(prev => prev.filter(m => m._id !== tempId));
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="dash-heading" style={{ marginBottom: 16 }}>
        <div>
          <span className="eyebrow" style={{ color: "var(--green)", fontWeight: 800 }}>
            REAL-TIME COLLABORATION
          </span>
          <h1 style={{ fontSize: "1.65rem", margin: "4px 0" }}>Event Groups & Admin Messaging</h1>
          <p className="muted" style={{ fontSize: "0.82rem" }}>
            ইভেন্ট ভলান্টিয়ার গ্রুপে চ্যাট করুন অথবা প্ল্যাটফর্ম অ্যাডমিনের সাথে সরাসরি যোগাযোগ করুন।
          </p>
        </div>
      </div>

      {/* Main Responsive Chat Container */}
      <div className={`chat-container-layout ${mobileView === "room" ? "show-room" : "show-channels"}`}>
        
        {/* =================================================================== */}
        {/* LEFT SIDEBAR: CHANNELS & THREADS LIST */}
        {/* =================================================================== */}
        <div className="chat-sidebar-pane">
          {/* Section 1: DIRECT ADMIN SUPPORT */}
          <div style={{ padding: "16px 14px 10px" }}>
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 800,
                color: "var(--muted)",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Direct Support
            </span>

            {/* If regular volunteer: Chat with Admin button */}
            {!isAdmin ? (
              <div
                onClick={() => selectChat({ type: "admin" })}
                style={{
                  marginTop: 8,
                  padding: "10px 12px",
                  borderRadius: 10,
                  cursor: "pointer",
                  background: activeChat?.type === "admin" ? "rgba(239, 68, 68, 0.15)" : "transparent",
                  border: `1px solid ${activeChat?.type === "admin" ? "rgba(239, 68, 68, 0.4)" : "transparent"}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  transition: "0.2s",
                }}
              >
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "#ef4444",
                      color: "#fff",
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 800,
                      fontSize: "0.85rem",
                    }}
                  >
                    👑
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "var(--green)",
                      border: "2px solid var(--panel)",
                    }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <b style={{ fontSize: "0.82rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      Halima Yesmin Omi
                    </b>
                  </div>
                  <small style={{ color: "#ff6b6b", fontSize: "0.68rem", fontWeight: 700 }}>
                    Platform Admin & Builder
                  </small>
                </div>
              </div>
            ) : (
              // If Admin: list of volunteer conversations
              <div style={{ marginTop: 8 }}>
                {adminConversations.length === 0 ? (
                  <p className="muted" style={{ fontSize: "0.74rem", padding: "8px 4px" }}>
                    No volunteer inquiries yet.
                  </p>
                ) : (
                  adminConversations.map(conv => {
                    const isSelected = activeChat?.type === "user" && activeChat.id === conv.user._id;
                    return (
                      <div
                        key={conv.user._id}
                        onClick={() => selectChat({ type: "user", id: conv.user._id, data: conv.user })}
                        style={{
                          padding: "8px 10px",
                          borderRadius: 10,
                          cursor: "pointer",
                          marginBottom: 4,
                          background: isSelected ? "rgba(183, 243, 107, 0.15)" : "transparent",
                          border: `1px solid ${isSelected ? "var(--green)" : "transparent"}`,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span className="avatar" style={{ width: 30, height: 30, fontSize: "0.7rem" }}>
                          {conv.user.name ? conv.user.name.slice(0, 2).toUpperCase() : "U"}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <b style={{ fontSize: "0.78rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {conv.user.name}
                            </b>
                            {conv.unreadCount > 0 && (
                              <span style={{ background: "#ef4444", color: "#fff", fontSize: "0.6rem", fontWeight: 800, padding: "1px 6px", borderRadius: 10 }}>
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                          <small className="muted" style={{ fontSize: "0.68rem", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {conv.lastMessage?.text || "Started a chat"}
                          </small>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          <div style={{ height: 1, background: "var(--line)", margin: "4px 14px 10px" }} />

          {/* Section 2: EVENT GROUP CHATS */}
          <div style={{ padding: "0 14px 16px", flex: 1, overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  color: "var(--muted)",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                Event Group Rooms ({events.length})
              </span>
            </div>

            {events.length === 0 ? (
              <p className="muted" style={{ fontSize: "0.74rem", padding: "12px 4px" }}>
                No active events available at this moment.
              </p>
            ) : (
              events.map(ev => {
                const isSelected = activeChat?.type === "event" && activeChat.id === ev._id;
                return (
                  <div
                    key={ev._id}
                    onClick={() => selectChat({ type: "event", id: ev._id, data: ev })}
                    style={{
                      padding: "10px",
                      borderRadius: 10,
                      cursor: "pointer",
                      marginBottom: 6,
                      background: isSelected ? "rgba(183, 243, 107, 0.12)" : "transparent",
                      border: `1px solid ${isSelected ? "rgba(183, 243, 107, 0.35)" : "transparent"}`,
                      transition: "0.2s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <span className="category-pill" style={{ position: "static", fontSize: "0.55rem", padding: "1px 6px" }}>
                        {ev.category}
                      </span>
                      {ev.unreadCount > 0 && (
                        <span style={{ background: "var(--green)", color: "#062817", fontSize: "0.6rem", fontWeight: 800, padding: "1px 6px", borderRadius: 10 }}>
                          {ev.unreadCount} new
                        </span>
                      )}
                      <small className="muted" style={{ fontSize: "0.65rem", marginLeft: "auto" }}>
                        {ev.volunteersCount}/{ev.capacity}
                      </small>
                    </div>
                    <b
                      style={{
                        fontSize: "0.8rem",
                        display: "block",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: isSelected ? "var(--green)" : "inherit",
                      }}
                    >
                      {ev.title}
                    </b>
                    {ev.lastMessage && (
                      <small className="muted" style={{ fontSize: "0.68rem", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: 2 }}>
                        {((ev.lastMessage.senderName || "").trim().split(/\s+/)[0] || "User")}: {ev.lastMessage.text}
                      </small>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* =================================================================== */}
        {/* RIGHT SIDE: ACTIVE CHAT ROOM */}
        {/* =================================================================== */}
        <div className="chat-room-pane">
          {/* Room Header */}
          <div
            style={{
              padding: "12px 18px",
              borderBottom: "1px solid var(--line)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "rgba(0,0,0,0.03)",
              gap: 10
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
              {/* Mobile Back Button to Channels List */}
              <button
                type="button"
                onClick={() => setMobileView("channels")}
                className="chat-mobile-back-btn"
                title="চ্যানেল তালিকায় ফিরে যান"
              >
                <ArrowLeft size={16} /> <span>চ্যানেল তালিকা</span>
              </button>

              {activeChat?.type === "event" ? (
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <Hash size={18} color="var(--green)" />
                    <h3 style={{ margin: 0, fontSize: "1.05rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {activeChat.data?.title || "Event Group Room"}
                    </h3>
                    <span className="category-pill" style={{ position: "static", fontSize: "0.62rem" }}>
                      {activeChat.data?.category}
                    </span>
                  </div>
                  <p className="muted" style={{ fontSize: "0.74rem", margin: "3px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    Official group room for registered volunteers and organizers • {activeChat.data?.location || "Sylhet"}
                  </p>
                </div>
              ) : activeChat?.type === "admin" ? (
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: "1.2rem" }}>🛡️</span>
                    <h3 style={{ margin: 0, fontSize: "1.05rem" }}>
                      {adminInfo?.name || "Halima Yesmin Omi"}
                    </h3>
                    <span
                      style={{
                        background: "#ef4444",
                        color: "#fff",
                        fontSize: "0.6rem",
                        fontWeight: 800,
                        padding: "2px 8px",
                        borderRadius: 10,
                        letterSpacing: "0.4px",
                      }}
                    >
                      PLATFORM ADMIN & BUILDER
                    </span>
                  </div>
                  <p className="muted" style={{ fontSize: "0.74rem", margin: "3px 0 0" }}>
                    Direct line for urgent inquiries, volunteer coordination, and platform support.
                  </p>
                </div>
              ) : (
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span className="avatar" style={{ width: 28, height: 28, fontSize: "0.65rem" }}>
                      {activeChat?.data?.name ? activeChat.data.name.slice(0, 2).toUpperCase() : "U"}
                    </span>
                    <h3 style={{ margin: 0, fontSize: "1.05rem" }}>{activeChat?.data?.name || "Volunteer Inquiry"}</h3>
                    <span className="status-pill" style={{ fontSize: "0.62rem" }}>
                      {activeChat?.data?.role || "Volunteer"}
                    </span>
                  </div>
                  <p className="muted" style={{ fontSize: "0.74rem", margin: "3px 0 0" }}>
                    Direct volunteer support thread with {activeChat?.data?.email}
                  </p>
                </div>
              )}
            </div>

            {activeChat?.type === "event" && (
              <a
                href={`/events/${activeChat.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ padding: "6px 12px", fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: 5, flexShrink: 0 }}
              >
                View Opportunity <ArrowUpRight size={14} />
              </a>
            )}
          </div>

          {/* Messages Stream */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {loadingMessages ? (
              <p className="muted" style={{ textAlign: "center", margin: "auto" }}>
                Loading conversation messages...
              </p>
            ) : messages.length === 0 ? (
              <div style={{ textAlign: "center", margin: "auto", maxWidth: 360, padding: 20 }}>
                <span style={{ fontSize: "2.4rem", display: "block", marginBottom: 8 }}>💬</span>
                <h4>No messages in this room yet</h4>
                <p className="muted" style={{ fontSize: "0.78rem" }}>
                  {activeChat?.type === "event"
                    ? "সহ-ভলান্টিয়ারদের সাথে শুভেচ্ছা জানান এবং কার্যক্রমে একযোগে অংশগ্রহণ করুন!"
                    : "প্ল্যাটফর্ম অ্যাডমিন Halima Yesmin Omi-কে সরাসরি আপনার প্রশ্ন বা বার্তা পাঠান।"}
                </p>
              </div>
            ) : (
              messages.map(msg => {
                const currentUserId = user?._id || user?.id;
                const isMe = (msg.sender === currentUserId) || (msg.sender?._id === currentUserId) || (msg.sender?.toString() === currentUserId?.toString());
                const isAdminSender = msg.senderRole === "admin" || msg.senderUsername === "omi";
                const isOrganizerSender = msg.senderRole === "organizer";

                return (
                  <div
                    key={msg._id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isMe ? "flex-end" : "flex-start",
                      maxWidth: "85%",
                      alignSelf: isMe ? "flex-end" : "flex-start",
                    }}
                  >
                    {/* Sender Identity Header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: 3,
                        fontSize: "0.7rem",
                        color: "var(--muted)",
                      }}
                    >
                      <b style={{ color: isMe ? "var(--green)" : "var(--text)" }}>
                        {isMe ? "You" : msg.senderName}
                      </b>

                      {isAdminSender ? (
                        <span
                          style={{
                            background: "#ef4444",
                            color: "#fff",
                            fontSize: "0.55rem",
                            fontWeight: 800,
                            padding: "1px 5px",
                            borderRadius: 4,
                            letterSpacing: "0.3px",
                          }}
                        >
                          ADMIN & BUILDER
                        </span>
                      ) : isOrganizerSender ? (
                        <span
                          style={{
                            background: "var(--green)",
                            color: "#062817",
                            fontSize: "0.55rem",
                            fontWeight: 800,
                            padding: "1px 5px",
                            borderRadius: 4,
                          }}
                        >
                          ORGANIZER
                        </span>
                      ) : null}

                      <small style={{ fontSize: "0.62rem" }}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </small>
                    </div>

                    {/* Message Bubble */}
                    <div
                      style={{
                        padding: "10px 14px",
                        borderRadius: 14,
                        fontSize: "0.86rem",
                        lineHeight: 1.45,
                        wordBreak: "break-word",
                        background: isMe
                          ? "linear-gradient(135deg, rgba(21, 128, 61, 0.95) 0%, rgba(183, 243, 107, 0.9) 100%)"
                          : isAdminSender
                          ? "rgba(239, 68, 68, 0.12)"
                          : "var(--bg)",
                        color: isMe ? "#062817" : "var(--text)",
                        border: `1px solid ${
                          isMe
                            ? "transparent"
                            : isAdminSender
                            ? "rgba(239, 68, 68, 0.35)"
                            : "var(--line)"
                        }`,
                        boxShadow: isMe ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
                        fontWeight: isMe ? 500 : 400,
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={handleSendMessage}
            style={{
              padding: "12px 16px",
              borderTop: "1px solid var(--line)",
              display: "flex",
              gap: 8,
              background: "rgba(0,0,0,0.02)",
              alignItems: "center"
            }}
          >
            <input
              type="text"
              className="chat-input-box"
              placeholder={
                activeChat?.type === "event"
                  ? `Message #${activeChat.data?.title || "event group"}...`
                  : activeChat?.type === "admin"
                  ? "Message Halima Yesmin Omi (Admin)..."
                  : `Reply to ${activeChat?.data?.name || "volunteer"}...`
              }
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              disabled={sending || !activeChat}
              style={{
                flex: 1,
                padding: "10px 16px",
                borderRadius: 12,
                fontSize: "16px",
                border: "1px solid var(--line)",
                background: "var(--bg)",
                color: "var(--text)",
                outline: "none",
                minHeight: 44
              }}
            />
            <button
              type="submit"
              disabled={sending || !inputText.trim() || !activeChat}
              className="btn btn-primary"
              style={{
                padding: "10px 18px",
                fontSize: "0.88rem",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                borderRadius: 12,
                minHeight: 44,
                minWidth: 72,
                justifyContent: "center"
              }}
            >
              <span>{sending ? "..." : "Send"}</span>
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "60vh", display: "grid", placeItems: "center", color: "var(--muted)" }}>
        <p>Loading KindConnect Live Chat...</p>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
