"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, CalendarDays, ChevronDown, CircleHelp, ClipboardList, FileBadge, LayoutDashboard, LogOut, Menu, X, HeartHandshake, Plus, QrCode, Check, CheckCheck } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "./auth-provider";
import { api } from "@/lib/api";

const userLinks = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My events", href: "/dashboard/events", icon: ClipboardList },
  { label: "Joined events", href: "/dashboard/joined", icon: CalendarDays },
  { label: "QR Attendance", href: "/dashboard/attendance", icon: QrCode },
  { label: "Certificates", href: "/dashboard/certificates", icon: FileBadge }
];

export function DashboardShell({ children, user }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);
  const { logout } = useAuth();

  const displayName = user?.name || "User";
  const initials = displayName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  const role = user?.role === "admin" ? "Admin" : user?.role === "organizer" ? "Organizer" : "Volunteer";

  const fetchNotifs = () => {
    api.getNotifications()
      .then(res => {
        setNotifications(res.data?.notifications || []);
        setUnreadCount(res.data?.unreadCount || 0);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 15000);
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
        <Link href="/" className="brand"><span className="brand-mark"><HeartHandshake size={21}/></span><span>kind<span className="brand-accent">connect</span><small>YOUR IMPACT SPACE</small></span></Link>
        <button className="icon-btn sidebar-close" onClick={() => setOpen(false)}><X/></button>
      </div>
      <div className="workspace-label">WORKSPACE</div>
      <div className="side-links">
        {userLinks.map(({ label, href, icon: Icon }) => (
          <Link key={href} href={href} onClick={() => setOpen(false)} className={`side-link ${pathname === href ? "selected" : ""}`}><Icon size={18}/>{label}</Link>
        ))}
      </div>
      <div className="sidebar-bottom">
        <div className="help-card"><CircleHelp size={19}/><b>Need a hand?</b><p>We're here to help you make an impact.</p><a href="mailto:hello@kindconnect.org">Get support ↗</a></div>
        <button className="side-link" onClick={handleLogout} style={{width:"100%",border:"none",background:"transparent",textAlign:"left",cursor:"pointer"}}><LogOut size={18}/>Logout</button>
        <Link href="/" className="side-link">Back to website</Link>
      </div>
    </aside>
    <main className="dashboard-main">
      <header className="dash-topbar">
        <button className="icon-btn dash-menu" onClick={() => setOpen(!open)}><Menu/></button>
        <div className="breadcrumb">Workspace <span>/</span> <b>{role} dashboard</b></div>
        <div className="dash-top-actions">
          <Link href="/dashboard/create-event" className="btn btn-primary" style={{padding:"8px 14px",fontSize:".78rem"}}><Plus size={15}/>New Event</Link>
          
          {/* Notification Menu */}
          <div style={{ position: "relative" }} ref={notifRef}>
            <button 
              className="icon-btn notification-btn" 
              onClick={() => setNotifOpen(!notifOpen)}
              title="Notifications"
            >
              <Bell size={18}/>
              {unreadCount > 0 && <i style={{ background: "var(--green)", width: 8, height: 8, position: "absolute", top: 6, right: 6, borderRadius: "50%" }} />}
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
                  <b style={{ fontSize: "0.85rem" }}>Notifications {unreadCount > 0 && `(${unreadCount})`}</b>
                  {unreadCount > 0 && (
                    <button onClick={handleMarkAllRead} style={{ background: "transparent", border: "none", color: "var(--green)", fontSize: "0.72rem", cursor: "pointer", fontWeight: 700 }}>
                      Mark all read
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <p className="muted" style={{ fontSize: "0.78rem", textAlign: "center", padding: "20px 0" }}>No notifications yet</p>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n._id} 
                      onClick={() => !n.read && handleMarkOne(n._id)}
                      style={{
                        padding: "10px",
                        borderRadius: 8,
                        marginBottom: 6,
                        background: n.read ? "transparent" : "rgba(183, 243, 107, 0.08)",
                        border: `1px solid ${n.read ? "transparent" : "rgba(183, 243, 107, 0.2)"}`,
                        cursor: "pointer",
                        transition: "0.2s"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <b style={{ fontSize: "0.78rem", color: n.read ? "inherit" : "var(--green)" }}>{n.title}</b>
                        <small className="muted" style={{ fontSize: "0.62rem" }}>
                          {new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </small>
                      </div>
                      <p className="muted" style={{ fontSize: "0.72rem", margin: "4px 0 0" }}>{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="profile-mini">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" style={{width:34,height:34,borderRadius:"50%",objectFit:"cover"}} />
            ) : (
              <span className="avatar">{initials}</span>
            )}
            <span><b>{displayName}</b><small>{role}</small></span>
            <ChevronDown size={15}/>
          </div>
        </div>
      </header>
      <div className="dashboard-content">{children}</div>
    </main>
  </div>;
}
