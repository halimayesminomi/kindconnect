"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, CalendarDays, ChevronDown, CircleHelp, ClipboardList, FileBadge, LayoutDashboard, LogOut, Menu, X, HeartHandshake, Plus, QrCode, ShieldCheck, MessageSquare, Sun, Moon, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "./auth-provider";
import { useSite } from "./site-provider";
import { api } from "@/lib/api";

export function DashboardShell({ children, user }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const notifRef = useRef(null);
  const lastUnreadCountRef = useRef(null);
  const { logout } = useAuth();
  const { lang, setLang, theme, setTheme, t } = useSite();

  const playNotificationChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (_) {}
  };

  const displayName = user?.name || "User";
  const initials = displayName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  const isAdmin = user?.role === "admin";
  const isOrganizer = user?.role === "organizer" || isAdmin;
  const role = isAdmin 
    ? (user?.designation || (lang === "bn" ? "প্ল্যাটফর্ম অ্যাডমিন ও লিড বিল্ডার" : "Platform Admin & Lead Builder"))
    : isOrganizer 
      ? (user?.designation || (lang === "bn" ? "অর্গানাইজার" : "Organizer")) 
      : (lang === "bn" ? "ভলান্টিয়ার" : "Volunteer");

  const navigationLinks = [
    ...(isAdmin ? [{ label: t("adminPanel"), href: "/admin", icon: ShieldCheck }] : []),
    { label: t("dashboard") || "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: lang === "bn" ? "প্রোফাইল ও অ্যাকাউন্ট" : "My Profile", href: "/dashboard/profile", icon: User },
    { label: t("liveChat") || "Live Chat", href: "/dashboard/chat", icon: MessageSquare, badge: unreadChatCount > 0 ? unreadChatCount : null },
    { label: t("myEvents") || "My events", href: "/dashboard/events", icon: ClipboardList },
    { label: t("myJoined") || "Joined events", href: "/dashboard/joined", icon: CalendarDays },
    { label: t("qrAttendance") || "QR Attendance", href: "/dashboard/attendance", icon: QrCode },
    { label: t("certificates") || "Certificates", href: "/dashboard/certificates", icon: FileBadge }
  ];

  const fetchNotifs = () => {
    api.getNotifications()
      .then(res => {
        const notifs = res.data?.notifications || res.notifications || [];
        const count = typeof res.data?.unreadCount === "number" ? res.data.unreadCount : (res.unreadCount || 0);
        const chatCount = typeof res.data?.unreadChatCount === "number" ? res.data.unreadChatCount : (res.unreadChatCount || 0);

        if (lastUnreadCountRef.current !== null && count > lastUnreadCountRef.current && count > 0) {
          playNotificationChime();
          const latestUnread = notifs.find(n => !n.read);
          if (latestUnread) {
            import("react-hot-toast").then(({ default: toast }) => {
              toast(latestUnread.title + ": " + latestUnread.message, {
                icon: "💬",
                duration: 5000,
              });
            });
          }
        }
        lastUnreadCountRef.current = count;

        setNotifications(notifs);
        setUnreadCount(count);
        setUnreadChatCount(chatCount);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch {}
  };

  const handleMarkOne = async (id) => {
    try {
      await api.markNotificationRead(id);
      setUnreadCount(prev => Math.max(0, prev - 1));
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch {}
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return <div className="dashboard-layout">
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="sidebar-top">
        <Link href="/" className="brand"><span className="brand-mark"><HeartHandshake size={21}/></span><span>kind<span className="brand-accent">connect</span><small>{lang === "bn" ? "আপনার প্রভাবের ক্ষেত্র" : "YOUR IMPACT SPACE"}</small></span></Link>
        <button className="icon-btn sidebar-close" onClick={() => setOpen(false)}><X/></button>
      </div>
      <div className="workspace-label">{t("workspace")}</div>
      <div className="side-links">
        {navigationLinks.map(({ label, href, icon: Icon, badge }) => (
          <Link key={href} href={href} onClick={() => setOpen(false)} className={`side-link ${pathname === href ? "selected" : ""}`}>
            <Icon size={18}/>
            <span style={{ flex: 1 }}>{label}</span>
            {badge && (
              <span style={{
                background: "var(--green)",
                color: "#062817",
                fontSize: "0.68rem",
                fontWeight: 900,
                padding: "2px 7px",
                borderRadius: "10px",
                lineHeight: 1,
              }}>
                {badge}
              </span>
            )}
          </Link>
        ))}
      </div>
      <div className="sidebar-bottom">
        <div className="help-card"><CircleHelp size={19}/><b>{t("needHand")}</b><p>{t("needHandDesc")}</p><a href="mailto:hello@kindconnect.org">{t("getSupport")}</a></div>
        <button className="side-link" onClick={handleLogout} style={{width:"100%",border:"none",background:"transparent",textAlign:"left",cursor:"pointer"}}><LogOut size={18}/>{t("logout")}</button>
        <Link href="/" className="side-link">{t("backToWebsite")}</Link>
      </div>
    </aside>
    <main className="dashboard-main">
      <header className="dash-topbar">
        <button className="icon-btn dash-menu" onClick={() => setOpen(!open)}><Menu/></button>
        <div className="breadcrumb">{t("workspace")} <span>/</span> <b>{role}</b></div>
        <div className="dash-top-actions">
          {/* Language Toggle in Dashboard */}
          <button 
            className="icon-btn" 
            title={lang === "en" ? "বাংলা ভাষায় দেখুন" : "Switch to English"} 
            onClick={() => setLang(lang === "en" ? "bn" : "en")}
            style={{ fontWeight: 800, fontSize: ".76rem", width: 44 }}
          >
            {lang === "en" ? "বাং" : "EN"}
          </button>

          {/* Theme Toggle in Dashboard */}
          <button className="icon-btn" aria-label="Toggle theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun size={17}/> : <Moon size={17}/>}
          </button>

          <Link href="/dashboard/create-event" className="btn btn-primary" style={{padding:"8px 14px",fontSize:".78rem"}}><Plus size={15}/>{t("newEvent")}</Link>
          
          {/* Notification Menu */}
          <div style={{ position: "relative" }} ref={notifRef}>
            <button 
              className="icon-btn notification-btn" 
              onClick={() => setNotifOpen(!notifOpen)}
              title={t("notifications")}
            >
              <Bell size={18}/>
              {unreadCount > 0 && (
                <span style={{
                  background: "#ff4d4f",
                  color: "#fff",
                  fontSize: "0.62rem",
                  fontWeight: 900,
                  position: "absolute",
                  top: -2,
                  right: -2,
                  minWidth: 16,
                  height: 16,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 3px",
                  lineHeight: 1
                }}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div style={{
                position: "absolute",
                right: 0,
                top: 48,
                width: 320,
                maxHeight: 420,
                overflowY: "auto",
                background: "var(--panel)",
                border: "1px solid var(--line)",
                borderRadius: 14,
                boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
                padding: "16px",
                zIndex: 100
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid var(--line)" }}>
                  <b style={{ fontSize: "0.85rem" }}>{t("notifications")} {unreadCount > 0 && `(${unreadCount})`}</b>
                  {unreadCount > 0 && (
                    <button onClick={handleMarkAllRead} style={{ background: "transparent", border: "none", color: "var(--green)", fontSize: "0.72rem", cursor: "pointer", fontWeight: 700 }}>
                      {t("markAllRead")}
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <p className="muted" style={{ fontSize: "0.78rem", textAlign: "center", padding: "20px 0" }}>{t("noNotifs")}</p>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n._id} 
                      onClick={() => {
                        if (!n.read) handleMarkOne(n._id);
                        if (n.link) {
                          setNotifOpen(false);
                          router.push(n.link);
                        }
                      }}
                      style={{
                        padding: "10px",
                        borderRadius: 8,
                        marginBottom: 6,
                        background: n.read ? "transparent" : "rgba(183, 243, 107, 0.08)",
                        border: `1px solid ${n.read ? "transparent" : "rgba(183, 243, 107, 0.25)"}`,
                        cursor: "pointer",
                        transition: "0.2s"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
                          {n.type?.startsWith("chat") ? (
                            <MessageSquare size={14} style={{ color: "var(--green)", flexShrink: 0 }} />
                          ) : (
                            <Bell size={14} style={{ color: "var(--green)", flexShrink: 0 }} />
                          )}
                          <b style={{ fontSize: "0.78rem", color: n.read ? "inherit" : "var(--green)", lineHeight: 1.2 }}>
                            {n.title}
                          </b>
                        </div>
                        <small className="muted" style={{ fontSize: "0.62rem", whiteSpace: "nowrap" }}>
                          {new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </small>
                      </div>
                      <p className="muted" style={{ fontSize: "0.73rem", margin: "4px 0 0", paddingLeft: 20 }}>
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <Link href="/dashboard/profile" className="profile-mini" title={`${displayName} - View & Edit Profile`} style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}>
            {user?.photoURL ? (
              <img src={user.photoURL} alt={displayName} title={displayName} style={{width:34,height:34,borderRadius:"50%",objectFit:"cover"}} />
            ) : (
              <span className="avatar" title={displayName}>{initials}</span>
            )}
            <span>
              <b style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {displayName}
                {isAdmin ? (
                  <span style={{ background: "#ff6b6b", color: "#fff", fontSize: "0.58rem", fontWeight: 800, padding: "1px 6px", borderRadius: 6, letterSpacing: "0.5px" }}>
                    ADMIN
                  </span>
                ) : isOrganizer ? (
                  <span style={{ background: "var(--green)", color: "#062817", fontSize: "0.58rem", fontWeight: 800, padding: "1px 6px", borderRadius: 6, letterSpacing: "0.5px" }}>
                    BUILDER
                  </span>
                ) : null}
              </b>
              <small style={{ color: isAdmin ? "#ff6b6b" : isOrganizer ? "var(--green)" : "inherit", fontWeight: isOrganizer ? 700 : 400 }}>{role}</small>
            </span>
            <ChevronDown size={15}/>
          </Link>
        </div>
      </header>
      <div className="dashboard-content">{children}</div>
    </main>
  </div>;
}
