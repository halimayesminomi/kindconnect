"use client";

import Link from "next/link";
import { CalendarDays, MapPin, ArrowUpRight } from "lucide-react";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Joined() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMyRegistrations()
      .then(res => setRegistrations(res.data || []))
      .catch(() => toast.error("Failed to load joined events."))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (eventId) => {
    try {
      await api.cancelRegistration(eventId);
      toast.success("Registration cancelled.");
      setRegistrations(prev => prev.filter(r => (r.eventId?._id || r.eventId) !== eventId));
    } catch (err) {
      toast.error(err.message || "Failed to cancel registration.");
    }
  };

  const sorted = [...registrations]
    .filter(r => r.eventId)
    .sort((a, b) => new Date(b.eventId.date) - new Date(a.eventId.date));

  return <>
    <div className="dash-heading">
      <div>
        <span className="eyebrow">SHOWING UP MATTERS</span>
        <h1>Joined events</h1>
        <p className="muted">Your upcoming and past community moments.</p>
      </div>
      <Link href="/events" className="btn btn-primary">Find more events <ArrowUpRight size={16}/></Link>
    </div>
    {loading ? <p className="muted" style={{padding:"30px 0"}}>Loading your events...</p> : sorted.length === 0 ? (
      <div className="empty-state">
        <CalendarDays size={28}/>
        <h3>No events joined yet</h3>
        <p>Browse events and join one that interests you!</p>
        <Link href="/events" className="btn btn-primary" style={{marginTop:"15px"}}>Explore events <ArrowUpRight size={16}/></Link>
      </div>
    ) : (
      <div className="joined-list">
        {sorted.map(r => {
          const e = r.eventId;
          const isUpcoming = new Date(e.date) > new Date();
          const dateStr = new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
          return <article className="joined-card" key={r._id}>
            <div className="joined-thumb" style={{ backgroundImage: `url(${e.image})` }}/>
            <div className="joined-info">
              <span className="eyebrow">{isUpcoming ? "UPCOMING" : "COMPLETED"}</span>
              <h3>{e.title}</h3>
              <p className="muted"><CalendarDays size={14}/>{dateStr} · {e.time}</p>
              <p className="muted"><MapPin size={14}/>{e.location}</p>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
              <Link href={`/events/${e._id}`} className="btn btn-outline">Details <ArrowUpRight size={15}/></Link>
              {isUpcoming && <button className="btn btn-ghost" style={{fontSize:".72rem",padding:"8px 12px"}} onClick={() => handleCancel(e._id)}>Cancel</button>}
            </div>
          </article>;
        })}
      </div>
    )}
  </>;
}
