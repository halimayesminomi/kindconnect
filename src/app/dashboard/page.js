"use client";

import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock3, Heart, Users, Plus, MapPin, ChevronRight } from "lucide-react";
import { StatCard } from "@/components/cards";
import { useAuth } from "@/components/auth-provider";
import { useSite } from "@/components/site-provider";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const { lang, t } = useSite();
  const [myEvents, setMyEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);

  useEffect(() => {
    api.getMyEvents().then(res => setMyEvents(res.data || [])).catch(() => {});
    api.getMyRegistrations().then(res => setJoinedEvents(res.data || [])).catch(() => {});
  }, []);

  const upcomingJoined = joinedEvents.filter(r => r.eventId && new Date(r.eventId.date) > new Date()).slice(0, 3);
  const now = new Date();
  const greeting = lang === "bn"
    ? (now.getHours() < 12 ? "শুভ সকাল" : now.getHours() < 17 ? "শুভ দুপুর" : "শুভ সন্ধ্যা")
    : (now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening");
  const dateStr = now.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).toUpperCase();
  const isAdmin = user?.role === "admin";
  const isOrganizer = user?.role === "organizer" || isAdmin;
  const displayName = isOrganizer ? (user?.name || "Halima Yesmin Omi") : (user?.name?.split(" ")[0] || "there");

  return <>
    {isAdmin ? (
      <div style={{
        marginBottom: 20,
        background: "linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(183, 243, 107, 0.06) 100%)",
        border: "1px solid rgba(239, 68, 68, 0.5)",
        borderRadius: 14,
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ background: "#ff6b6b", color: "#fff", fontWeight: 800, fontSize: "0.72rem", padding: "4px 10px", borderRadius: 8, letterSpacing: "0.5px" }}>
            ADMIN PORTAL
          </span>
          <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>
            Logged in as <b>{user?.name || "Halima Yesmin Omi"}</b> — Platform Administrator & Lead Builder
          </span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/admin" className="btn btn-primary" style={{ padding: "6px 14px", fontSize: "0.78rem", background: "#ff6b6b", borderColor: "#ff6b6b", color: "#fff" }}>
            🛡️ Admin Control Panel
          </Link>
          <Link href="/dashboard/create-event" className="btn btn-outline" style={{ padding: "6px 14px", fontSize: "0.78rem" }}>
            <Plus size={15}/> Host Event
          </Link>
        </div>
      </div>
    ) : isOrganizer ? (
      <div style={{
        marginBottom: 20,
        background: "linear-gradient(135deg, rgba(21, 128, 61, 0.15) 0%, rgba(183, 243, 107, 0.08) 100%)",
        border: "1px solid var(--green)",
        borderRadius: 14,
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ background: "var(--green)", color: "#062817", fontWeight: 800, fontSize: "0.72rem", padding: "4px 10px", borderRadius: 8, letterSpacing: "0.5px" }}>
            ORGANIZER PORTAL
          </span>
          <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>
            Logged in as <b>{user?.name || "Halima Yesmin Omi"}</b> — Lead Organizer & Platform Builder
          </span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/dashboard/create-event" className="btn btn-primary" style={{ padding: "6px 14px", fontSize: "0.78rem" }}>
            <Plus size={15}/> Host New Event
          </Link>
          <Link href="/dashboard/attendance" className="btn btn-outline" style={{ padding: "6px 14px", fontSize: "0.78rem" }}>
            Organizer QR Code
          </Link>
        </div>
      </div>
    ) : null}

    <div className="dash-heading">
      <div>
        <span className="eyebrow">{dateStr}</span>
        <h1>{greeting}, {displayName} <span>✳</span></h1>
        <p className="muted">{isOrganizer ? (lang === "bn" ? "আবার স্বাগতম, লিড অর্গানাইজার। আপনার কমিউনিটি উদ্যোগ পরিচালনা করুন।" : "Welcome back, Lead Organizer. Manage community initiatives and platform events.") : (lang === "bn" ? "আজকের দিনটিকে অর্থপূর্ণ করতে প্রস্তুত?" : "Ready to make today meaningful?")}</p>
      </div>
      <Link href="/dashboard/create-event" className="btn btn-primary"><Plus size={17}/> {lang === "bn" ? "ইভেন্ট তৈরি করুন" : "Create event"}</Link>
    </div>
    <div className="stats-grid">
      <StatCard icon={Heart} label={lang === "bn" ? "তৈরি করা ইভেন্ট" : "Events created"} value={myEvents.length} change={`${myEvents.filter(e => new Date(e.date) > new Date()).length} ${lang === "bn" ? "আসন্ন" : "upcoming"}`}/>
      <StatCard icon={CalendarDays} label={lang === "bn" ? "যুক্ত হওয়া ইভেন্ট" : "Events joined"} value={joinedEvents.length} change={`${upcomingJoined.length} ${lang === "bn" ? "আসন্ন" : "upcoming"}`}/>
      <StatCard icon={Users} label={lang === "bn" ? "মোট ভলান্টিয়ার" : "Total volunteers"} value={myEvents.reduce((a, e) => a + (e.volunteersCount || 0), 0)} change={lang === "bn" ? "আপনার সকল ইভেন্টে" : "Across your events"}/>
      <StatCard 
        icon={Clock3} 
        label={isOrganizer ? (lang === "bn" ? "প্ল্যাটফর্ম ভূমিকা" : "Platform role") : (lang === "bn" ? "ভলান্টিয়ার ভূমিকা" : "Volunteer role")} 
        value={isOrganizer ? (lang === "bn" ? "অর্গানাইজার ও বিল্ডার" : "Organizer & Builder") : (user?.role || "Volunteer")} 
        change={isOrganizer ? (lang === "bn" ? "কোর সিস্টেম আর্কিটেক্ট" : "Core System Architect") : (lang === "bn" ? "সক্রিয় সদস্য" : "Active member")}
      />
    </div>
    <div className="dash-columns">
      <section className="panel">
        <div className="panel-heading">
          <div><h3>Upcoming joined events</h3><p className="muted">Your next opportunities to make an impact.</p></div>
          <Link href="/dashboard/joined" className="text-link">See all <ChevronRight size={15}/></Link>
        </div>
        {upcomingJoined.length > 0 ? upcomingJoined.map(r => {
          const e = r.eventId;
          if (!e) return null;
          const d = new Date(e.date);
          return <div className="upcoming-item" key={r._id}>
            <div className="upcoming-date"><b>{d.getDate()}</b><small>{d.toLocaleString("en", { month: "short" })}</small></div>
            <div className="upcoming-info"><b>{e.title}</b><small className="muted"><MapPin size={13}/>{e.location} · {e.time}</small></div>
            <Link href={`/events/${e._id}`} className="icon-btn"><ArrowUpRight size={17}/></Link>
          </div>;
        }) : <p className="muted" style={{padding:"20px 0",fontSize:".82rem"}}>No upcoming events. <Link href="/events" className="text-link">Find events →</Link></p>}
      </section>
      <section className="panel progress-panel">
        <div className="panel-heading"><div><h3>Your impact journey</h3><p className="muted">Keep showing up. It adds up.</p></div></div>
        <div className="journey-ring"><div><b>{isOrganizer ? myEvents.length : joinedEvents.length}</b><small>{isOrganizer ? "events hosted" : "events joined"}</small></div></div>
        <h4>{isOrganizer ? "Lead Organizer & Platform Builder" : "Active Volunteer"}</h4>
        <p className="muted">{isOrganizer ? "Platform architect, community lead, and creator of KindConnect." : "Keep joining events to grow your impact."}</p>
        <Link href={isOrganizer ? "/dashboard/events" : "/dashboard/certificates"} className="text-link">{isOrganizer ? "Manage events" : "View achievements"} <ArrowUpRight size={15}/></Link>
      </section>
    </div>
    <div className="tip-banner"><span>✦</span><div><b>Good things grow when shared.</b><p>Invite a friend to join your next volunteering event.</p></div><Link href="/events">Explore together <ArrowUpRight size={15}/></Link></div>
  </>;
}
