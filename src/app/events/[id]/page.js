"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarDays, Clock3, MapPin, Users, CheckCircle2 } from "lucide-react";
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
        </div>
      </div>
      <aside className="join-card">
        <span className="eyebrow">EVENT DETAILS</span>
        <h2>Be part of it.</h2>
        <div className="detail-fact"><CalendarDays/><span><small>Date</small><b>{dateStr}</b></span></div>
        <div className="detail-fact"><Clock3/><span><small>Time</small><b>{event.time}</b></span></div>
        <div className="detail-fact"><MapPin/><span><small>Location</small><b>{event.location}</b></span></div>
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
