"use client";

import { useEffect, useState, useRef } from "react";
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
  Hash
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/components/auth-provider";
import toast from "react-hot-toast";

export default function ChatPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const initialEventId = searchParams.get("event");

  // Selected chat target:
  // - { type: "event", id: eventId, data: eventObj }
  // - { type: "admin" } (for volunteers chatting with admin)
  // - { type: "user", id: volunteerUserId, data: userObj } (for admin chatting with volunteer)
  const [activeChat, setActiveChat] = useState(null);

  const [events, setEvents] = useState([]);
  const [adminConversations, setAdminConversations] = useState([]);
  const [adminInfo, setAdminInfo] = useState(null);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const messagesEndRef = useRef(null);
  const pollingRef = useRef(null);

  const isAdmin = user?.role === "admin";

  // Auto-scroll to bottom of messages container
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat channel lists
  const loadChannels = async () => {
    try {
      // 1. Load Event Group Channels
      const evRes = await api.getChatEvents();
      const evList = evRes.data || [];
      setEvents(evList);

      // 2. Load Direct Chats
      if (isAdmin) {
        // Admin loads all direct volunteer conversations
        const convRes = await api.getAdminConversations();
        setAdminConversations(convRes.data || []);
      } else {
        // Volunteer loads admin info
        const directRes = await api.getDirectAdminChat();
        if (directRes.data?.admin) {
          setAdminInfo(directRes.data.admin);
        }
      }

      // Default selection if not already selected
      if (!activeChat) {
        if (initialEventId) {
          const match = evList.find(e => e._id === initialEventId);
          if (match) {
            setActiveChat({ type: "event", id: match._id, data: match });
            return;
          }
        }
        if (!isAdmin) {
          // Default to Direct Admin Chat for volunteers
          setActiveChat({ type: "admin" });
        } else if (evList.length > 0) {
          // Default to first event group for admin
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

  // Fetch messages for currently active chat
  const fetchMessages = async (silent = false) => {
    if (!activeChat) return;
    if (!silent) setLoadingMessages(true);

    try {
      if (activeChat.type === "event") {
        const res = await api.getEventMessages(activeChat.id);
        if (res.data?.messages) {
          setMessages(res.data.messages);
        }
      } else if (activeChat.type === "admin") {
        const res = await api.getDirectAdminChat();
        if (res.data?.messages) {
          setMessages(res.data.messages);
        }
        if (res.data?.admin) {
          setAdminInfo(res.data.admin);
        }
      } else if (activeChat.type === "user") {
        const res = await api.getAdminUserChat(activeChat.id);
        if (res.data?.messages) {
          setMessages(res.data.messages);
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

    setSending(true);
    setInputText("");

    // Optimistic message
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
      toast.error(err.message || "Failed to deliver message.");
      // Rollback optimistic message
      setMessages(prev => prev.filter(m => m._id !== tempId));
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="dash-heading" style={{ marginBottom: 18 }}>
        <div>
          <span className="eyebrow" style={{ color: "var(--green)", fontWeight: 800 }}>
            REAL-TIME COLLABORATION
          </span>
          <h1>Event Groups & Admin Messaging</h1>
          <p className="muted">
            Collaborate in dedicated event rooms or message the platform administrator directly.
          </p>
        </div>
      </div>

      {/* Main Chat Container */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "310px 1fr",
          gap: 16,
          height: "calc(100vh - 220px)",
          minHeight: 560,
          background: "var(--panel)",
          border: "1px solid var(--line)",
          borderRadius: 16,
          overflow: "hidden",
        }}
        className="chat-container-layout"
      >
        {/* =================================================================== */}
        {/* LEFT SIDEBAR: CHANNEL & THREAD LIST */}
        {/* =================================================================== */}
        <div
          style={{
            borderRight: "1px solid var(--line)",
            display: "flex",
            flexDirection: "column",
            background: "rgba(0,0,0,0.06)",
            overflowY: "auto",
          }}
        >
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
                onClick={() => setActiveChat({ type: "admin" })}
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
                        onClick={() => setActiveChat({ type: "user", id: conv.user._id, data: conv.user })}
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
                You have not joined any events yet. Join an event to access its group chat!
              </p>
            ) : (
              events.map(ev => {
                const isSelected = activeChat?.type === "event" && activeChat.id === ev._id;
                return (
                  <div
                    key={ev._id}
                    onClick={() => setActiveChat({ type: "event", id: ev._id, data: ev })}
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
                        {ev.lastMessage.senderName?.split(" ")[0]}: {ev.lastMessage.text}
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
        <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
          {/* Room Header */}
          <div
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid var(--line)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "rgba(0,0,0,0.03)",
            }}
          >
            {activeChat?.type === "event" ? (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Hash size={18} color="var(--green)" />
                  <h3 style={{ margin: 0, fontSize: "1.05rem" }}>{activeChat.data?.title || "Event Group Room"}</h3>
                  <span className="category-pill" style={{ position: "static", fontSize: "0.62rem" }}>
                    {activeChat.data?.category}
                  </span>
                </div>
                <p className="muted" style={{ fontSize: "0.74rem", margin: "3px 0 0" }}>
                  Official group room for registered volunteers and organizers • {activeChat.data?.location || "Community"}
                </p>
              </div>
            ) : activeChat?.type === "admin" ? (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
                  Direct line for urgent inquiries, organizer permissions, and platform support.
                </p>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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

            {activeChat?.type === "event" && (
              <a
                href={`/events/${activeChat.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ padding: "6px 12px", fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: 5 }}
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
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {loadingMessages ? (
              <p className="muted" style={{ textAlign: "center", margin: "auto" }}>
                Loading conversation messages...
              </p>
            ) : messages.length === 0 ? (
              <div style={{ textAlign: "center", margin: "auto", maxWidth: 360 }}>
                <span style={{ fontSize: "2.4rem", display: "block", marginBottom: 8 }}>💬</span>
                <h4>No messages in this room yet</h4>
                <p className="muted" style={{ fontSize: "0.78rem" }}>
                  {activeChat?.type === "event"
                    ? "Be the first to say hello to fellow volunteers joining this community event!"
                    : "Send a direct message to the admin. You'll receive real-time support here."}
                </p>
              </div>
            ) : (
              messages.map(msg => {
                const isMe = (msg.sender === (user?._id || user?.id)) || (msg.sender?._id === (user?._id || user?.id));
                const isAdminSender = msg.senderRole === "admin" || msg.senderUsername === "omi";
                const isOrganizerSender = msg.senderRole === "organizer";

                return (
                  <div
                    key={msg._id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isMe ? "flex-end" : "flex-start",
                      maxWidth: "75%",
                      alignSelf: isMe ? "flex-end" : "flex-start",
                    }}
                  >
                    {/* Sender Identity Header (shown if not me or in group chat) */}
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
                        fontSize: "0.84rem",
                        lineHeight: 1.45,
                        wordBreak: "break-word",
                        background: isMe
                          ? "linear-gradient(135deg, rgba(21, 128, 61, 0.9) 0%, rgba(183, 243, 107, 0.85) 100%)"
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
              padding: "14px 20px",
              borderTop: "1px solid var(--line)",
              display: "flex",
              gap: 10,
              background: "rgba(0,0,0,0.02)",
            }}
          >
            <input
              type="text"
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
                fontSize: "0.85rem",
                border: "1px solid var(--line)",
                background: "var(--bg)",
                color: "var(--text)",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={sending || !inputText.trim() || !activeChat}
              className="btn btn-primary"
              style={{
                padding: "10px 18px",
                fontSize: "0.85rem",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                borderRadius: 12,
              }}
            >
              <span>Send</span>
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
