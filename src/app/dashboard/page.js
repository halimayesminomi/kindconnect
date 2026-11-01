"use client";

import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock3, Heart, Users, Plus, MapPin, ChevronRight } from "lucide-react";
import { StatCard } from "@/components/cards";
import { useAuth } from "@/components/auth-provider";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);

  useEffect(() => {
    api.getMyEvents().then(res => setMyEvents(res.data || [])).catch(() => {});
    api.getMyRegistrations().then(res => setJoinedEvents(res.data || [])).catch(() => {});
  }, []);

  const upcomingJoined = joinedEvents.filter(r => r.eventId && new Date(r.eventId.date) > new Date()).slice(0, 3);
  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).toUpperCase();
  const firstName = user?.name?.split(" ")[0] || "there";

  return <>
    <div className="dash-heading">
      <div>
        <span className="eyebrow">{dateStr}</span>
        <h1>{greeting}, {firstName} <span>✳</span></h1>
        <p className="muted">Ready to make today meaningful?</p>
      </div>
      <Link href="/dashboard/create-event" className="btn btn-primary"><Plus size={17}/> Create event</Link>
    </div>
    <div className="stats-grid">
      <StatCard icon={Heart} label="Events created" value={myEvents.length} change={`${myEvents.filter(e => new Date(e.date) > new Date()).length} upcoming`}/>
      <StatCard icon={CalendarDays} label="Events joined" value={joinedEvents.length} change={`${upcomingJoined.length} upcoming`}/>
      <StatCard icon={Users} label="Total volunteers" value={myEvents.reduce((a, e) => a + (e.volunteersCount || 0), 0)} change="Across your events"/>
      <StatCard icon={Clock3} label="Volunteer role" value={user?.role || "user"} change="Active member"/>
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
        <div className="journey-ring"><div><b>{joinedEvents.length}</b><small>events joined</small></div></div>
        <h4>Active Volunteer</h4>
        <p className="muted">Keep joining events to grow your impact.</p>
        <Link href="/dashboard/certificates" className="text-link">View achievements <ArrowUpRight size={15}/></Link>
      </section>
    </div>
    <div className="tip-banner"><span>✦</span><div><b>Good things grow when shared.</b><p>Invite a friend to join your next volunteering event.</p></div><Link href="/events">Explore together <ArrowUpRight size={15}/></Link></div>
  </>;
}
