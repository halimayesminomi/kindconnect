"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpRight, HeartHandshake, Menu, Moon, Sun, X, LogOut, Globe } from "lucide-react";
import { useState } from "react";
import { useSite } from "./site-provider";
import { useAuth } from "./auth-provider";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { theme, setTheme, lang, setLang, t } = useSite();
  const { user, logout } = useAuth();

  const links = [
    [t("exploreEvents"), "/events"],
    [t("emergencyRelief"), "/emergency"],
    [t("about"), "/about"],
    [t("ourImpact"), "/impact"],
    [t("leaderboard"), "/leaderboard"]
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const initials = user?.name ? user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) : "";

  return (
    <header className="site-header">
      <div className="nav-wrap container">
        <Link href="/" className="brand">
          <span className="brand-mark"><HeartHandshake size={22}/></span>
          <span>kind<span className="brand-accent">connect</span><small>CONNECT PEOPLE. CREATE IMPACT.</small></span>
        </Link>
        <nav className={`main-nav ${open ? "nav-open" : ""}`}>
          {links.map(([label, href]) => (
            <Link key={href} className={pathname === href ? "active" : ""} href={href} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          <div className="mobile-actions">
            {user ? (
              <>
                <Link className="btn btn-ghost" href="/dashboard" onClick={() => setOpen(false)}>{t("dashboard")}</Link>
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

          {user ? (
            <>
              <Link className="btn btn-ghost desktop-only" href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }} title={user.name}>
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.name} title={user.name} style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover" }} />
                ) : (
                  <span className="avatar" title={user.name} style={{ width: 26, height: 26, fontSize: ".6rem" }}>{initials}</span>
                )}
                <span title={user.name}>{user.name?.split(" ")[0]}</span>
              </Link>
              <button className="btn btn-outline desktop-only" onClick={handleLogout} style={{ gap: "6px" }}>
                <LogOut size={15}/>{t("logout")}
              </button>
            </>
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
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link href="/" className="brand">
            <span className="brand-mark"><HeartHandshake size={22}/></span>
            <span>kind<span className="brand-accent">connect</span><small>CONNECT PEOPLE. CREATE IMPACT.</small></span>
          </Link>
          <p className="muted footer-copy">Small actions. Stronger communities. A better tomorrow.</p>
          <p className="muted" style={{ fontSize: ".72rem", marginTop: 8 }}>
            Course: <b>CSE 35+36 Web Programming Lab</b><br />
            Team: <b>Halima Yesmin Omi</b> (251-112-001) & <b>Shraboni Das</b> (251-112-006)<br />
            Instructor: <b>Mr. Abu Jafar Md. Jakaria</b>
          </p>
        </div>
        <div>
          <b>Explore</b>
          <Link href="/events">Events</Link>
          <Link href="/impact">Our impact</Link>
          <Link href="/leaderboard">Leaderboard</Link>
        </div>
        <div>
          <b>Community</b>
          <Link href="/about">About us</Link>
          <Link href="/register">Become a volunteer</Link>
          <Link href="/login">Sign in</Link>
        </div>
        <div>
          <b>Get involved</b>
          <p className="muted">Have an idea for your community?</p>
          <Link className="text-link" href="/register">Start making impact <ArrowUpRight size={15}/></Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 KindConnect. Built for social development in Bangladesh.</span>
        <span>Made with purpose <span className="brand-accent">♥</span></span>
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
