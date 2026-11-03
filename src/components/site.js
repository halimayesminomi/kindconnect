"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpRight, HeartHandshake, Menu, Moon, Sun, X, LogOut, Globe, ChevronDown, ShieldCheck, LayoutDashboard, MessageSquare, CalendarDays } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useSite } from "./site-provider";
import { useAuth } from "./auth-provider";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { theme, setTheme, lang, setLang, t } = useSite();
  const { user, logout } = useAuth();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // When logged out: show public marketing links
  const publicLinks = [
    [t("exploreEvents"), "/events"],
    [t("emergencyRelief"), "/emergency"],
    [t("about"), "/about"],
    [t("ourImpact"), "/impact"],
    [t("leaderboard"), "/leaderboard"]
  ];

  // When logged in: show clean, focused, uncluttered navigation links
  const authLinks = [
    [t("exploreEvents") || "Events", "/events"],
    [t("emergencyRelief") || "Emergency Help", "/emergency"],
    ["Dashboard", "/dashboard"],
    ["Live Chat", "/dashboard/chat"],
  ];

  const links = user ? authLinks : publicLinks;

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
    router.push("/");
  };

  const initials = user?.name ? user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "";
  const firstName = user?.name ? user.name.split(" ")[0] : "Account";

  return (
    <header className="site-header">
      <div className="nav-wrap container">
        <Link href="/" className="brand">
          <span className="brand-mark"><HeartHandshake size={22}/></span>
          <span>kind<span className="brand-accent">connect</span><small>CONNECT PEOPLE. CREATE IMPACT.</small></span>
        </Link>

        {/* Center Main Nav */}
        <nav className={`main-nav ${open ? "nav-open" : ""}`}>
          {links.map(([label, href]) => (
            <Link key={href} className={pathname === href ? "active" : ""} href={href} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}

          {/* Mobile Only Menu Options */}
          <div className="mobile-actions">
            {user ? (
              <>
                <div style={{ padding: "10px 0", borderBottom: "1px solid var(--line)", marginBottom: 8 }}>
                  <b style={{ fontSize: ".9rem" }}>{user.name}</b>
                  <small style={{ display: "block", color: user.role === "admin" ? "#ef4444" : "var(--green)", fontSize: ".74rem", fontWeight: 700 }}>
                    {user.designation || (user.role === "admin" ? "Platform Admin & Lead Builder" : "Volunteer")}
                  </small>
                </div>
                {user.role === "admin" && (
                  <Link className="btn btn-outline" href="/admin" onClick={() => setOpen(false)} style={{ borderColor: "#ef4444", color: "#ef4444" }}>
                    🛡️ Admin Panel
                  </Link>
                )}
                <Link className="btn btn-outline" href="/dashboard/profile" onClick={() => setOpen(false)} style={{ borderColor: "var(--green)", color: "var(--green)" }}>
                  👤 {lang === "bn" ? "আমার প্রোফাইল ও অ্যাকাউন্ট" : "My Profile & Account"}
                </Link>
                <Link className="btn btn-ghost" href="/dashboard" onClick={() => setOpen(false)}>{t("dashboard")}</Link>
                <Link className="btn btn-ghost" href="/dashboard/chat" onClick={() => setOpen(false)}>Live Chat</Link>
                <button className="btn btn-primary" onClick={() => { setOpen(false); handleLogout(); }}>{t("logout")}</button>
              </>
            ) : (
              <>
                <Link className="btn btn-ghost" href="/login" onClick={() => setOpen(false)}>{t("login")}</Link>
                <Link className="btn btn-primary" href="/register" onClick={() => setOpen(false)}>{t("joinCommunity")} <ArrowUpRight size={16}/></Link>
              </>
            )}
          </div>
        </nav>

        {/* Right Nav Actions */}
        <div className="nav-actions">
          {/* Language Toggle */}
          <button 
            className="icon-btn" 
            title={lang === "en" ? "বাংলা ভাষায় দেখুন" : "Switch to English"} 
            onClick={() => setLang(lang === "en" ? "bn" : "en")}
            style={{ fontWeight: 800, fontSize: ".76rem", width: 44 }}
          >
            {lang === "en" ? "বাং" : "EN"}
          </button>

          {/* Theme Toggle */}
          <button className="icon-btn theme-toggle" aria-label="Toggle theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun size={18}/> : <Moon size={18}/>}
          </button>

          {/* User Profile Dropdown (Clean, modern, zero clutter) */}
          {user ? (
            <div style={{ position: "relative" }} ref={userMenuRef} className="desktop-only">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="btn btn-ghost"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "4px 10px 4px 6px",
                  borderRadius: "20px",
                  border: "1px solid var(--line)",
                  background: userMenuOpen ? "rgba(255,255,255,0.08)" : "transparent",
                  cursor: "pointer",
                }}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.name}
                    style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }}
                  />
                ) : (
                  <span className="avatar" style={{ width: 28, height: 28, fontSize: ".65rem" }}>
                    {initials}
                  </span>
                )}
                <span style={{ fontWeight: 600, fontSize: ".82rem" }}>
                  {firstName}
                </span>
                {user.role === "admin" ? (
                  <span
                    style={{
                      background: "#ef4444",
                      color: "#fff",
                      fontSize: "0.55rem",
                      fontWeight: 800,
                      padding: "1px 6px",
                      borderRadius: "6px",
                      letterSpacing: "0.4px",
                    }}
                  >
                    ADMIN
                  </span>
                ) : user.role === "organizer" ? (
                  <span
                    style={{
                      background: "var(--green)",
                      color: "#062817",
                      fontSize: "0.55rem",
                      fontWeight: 800,
                      padding: "1px 6px",
                      borderRadius: "6px",
                    }}
                  >
                    BUILDER
                  </span>
                ) : null}
                <ChevronDown
                  size={14}
                  style={{
                    color: "var(--muted)",
                    transition: "transform 0.2s",
                    transform: userMenuOpen ? "rotate(180deg)" : "none",
                  }}
                />
              </button>

              {/* Polished Floating Dropdown Menu */}
              {userMenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "calc(100% + 8px)",
                    width: 250,
                    background: "var(--panel)",
                    border: "1px solid var(--line)",
                    borderRadius: 14,
                    boxShadow: "0 14px 40px rgba(0,0,0,0.45)",
                    padding: "8px",
                    zIndex: 100,
                    animation: "fadeIn 0.15s ease-out",
                  }}
                >
                  {/* User Profile Header Card */}
                  <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--line)", marginBottom: 6 }}>
                    <b style={{ fontSize: "0.85rem", display: "block" }}>{user.name}</b>
                    <small style={{ color: user.role === "admin" ? "#ef4444" : "var(--green)", fontSize: "0.72rem", fontWeight: 700 }}>
                      {user.designation || (user.role === "admin" ? "Platform Admin & Lead Builder" : "Volunteer")}
                    </small>
                  </div>

                  {/* Quick Action Links */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "8px 12px",
                          borderRadius: 8,
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          color: "#ef4444",
                          background: "rgba(239, 68, 68, 0.08)",
                          transition: "0.15s",
                        }}
                      >
                        <ShieldCheck size={16} /> Admin Control Panel
                      </Link>
                    )}

                    <Link
                      href="/dashboard/profile"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "8px 12px",
                        borderRadius: 8,
                        fontSize: "0.8rem",
                        color: "var(--green)",
                        fontWeight: 600,
                        transition: "0.15s",
                      }}
                    >
                      <User size={16} /> {lang === "bn" ? "আমার প্রোফাইল ও অ্যাকাউন্ট" : "My Profile & Account"}
                    </Link>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "8px 12px",
                        borderRadius: 8,
                        fontSize: "0.8rem",
                        color: "var(--text)",
                        transition: "0.15s",
                      }}
                    >
                      <LayoutDashboard size={16} /> Dashboard Overview
                    </Link>

                    <Link
                      href="/dashboard/chat"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "8px 12px",
                        borderRadius: 8,
                        fontSize: "0.8rem",
                        color: "var(--text)",
                        transition: "0.15s",
                      }}
                    >
                      <MessageSquare size={16} /> Live Chat Rooms
                    </Link>

                    <Link
                      href="/dashboard/events"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "8px 12px",
                        borderRadius: 8,
                        fontSize: "0.8rem",
                        color: "var(--text)",
                        transition: "0.15s",
                      }}
                    >
                      <CalendarDays size={16} /> My Events
                    </Link>
                  </div>

                  {/* Divider */}
                  <div style={{ height: 1, background: "var(--line)", margin: "6px 0" }} />

                  {/* Sign Out Button */}
                  <button
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 12px",
                      borderRadius: 8,
                      fontSize: "0.8rem",
                      color: "#ef4444",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link className="btn btn-ghost desktop-only" href="/login">{t("login")}</Link>
              <Link className="btn btn-primary desktop-only" href="/register">{t("getStarted")} <ArrowUpRight size={16}/></Link>
            </>
          )}
          <button className="icon-btn menu-toggle" aria-label="Open menu" onClick={() => setOpen(!open)}>
            {open ? <X/> : <Menu/>}
          </button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const { t, lang } = useSite();
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link href="/" className="brand">
            <span className="brand-mark"><HeartHandshake size={22}/></span>
            <span>kind<span className="brand-accent">connect</span><small>CONNECT PEOPLE. CREATE IMPACT.</small></span>
          </Link>
          <p className="muted footer-copy">{t("footerSlogan")}</p>
          <p className="muted" style={{ fontSize: ".72rem", marginTop: 8, lineHeight: 1.6 }}>
            <b>CSE 36 (EVE) Metropolitan University</b><br />
            Team: <b>Halima Yesmin Omi</b> (251-112-001) & <b>Shraboni Das</b> (251-112-006)<br />
            Instructor: <b>Mr. Abu Jafar Md. Jakaria</b>
          </p>
        </div>
        <div>
          <b>{t("footerExplore")}</b>
          <Link href="/events">{t("exploreEvents")}</Link>
          <Link href="/impact">{t("ourImpact")}</Link>
          <Link href="/leaderboard">{t("leaderboard")}</Link>
        </div>
        <div>
          <b>{t("footerCommunity")}</b>
          <Link href="/about">{t("about")}</Link>
          <Link href="/register">{t("joinCommunity")}</Link>
          <Link href="/login">{t("login")}</Link>
        </div>
        <div>
          <b>{t("footerGetInvolved")}</b>
          <p className="muted">{t("footerIdea")}</p>
          <Link className="text-link" href="/register">{t("footerStart")} <ArrowUpRight size={15}/></Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>{t("footerCopy")}</span>
        <span>{t("footerPurpose")} <span className="brand-accent">♥</span></span>
      </div>
    </footer>
  );
}

export function PublicLayout({ children }) {
  return <><Navbar/>{children}<Footer/></>;
}

export function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {description && <p className="muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
