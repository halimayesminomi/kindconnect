import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Users } from "lucide-react";

export function EventCard({ event }) {
  const id = event.id || event._id;
  const volunteers = event.volunteersCount ?? event.volunteers ?? 0;
  const goal = event.capacity ?? event.goal ?? 1;
  const percent = Math.min(100, Math.round(volunteers / goal * 100));

  // Format date - handle both string and Date
  let dateStr = event.date;
  if (event.date && typeof event.date !== "string") {
    dateStr = new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } else if (event.date && event.date.includes("T")) {
    dateStr = new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  return <article className="event-card">
    <Link href={`/events/${id}`} className="event-image" style={{ backgroundImage: `url(${event.image})` }}>
      <span className="category-pill">{event.category}</span><span className="image-arrow"><ArrowUpRight size={18}/></span>
    </Link>
    <div className="event-content">
      <div className="event-meta"><span><CalendarDays size={14}/>{dateStr}</span><span><MapPin size={14}/>{event.location}</span></div>
      <h3><Link href={`/events/${id}`}>{event.title}</Link></h3>
      <div className="capacity-row"><span><Users size={14}/>{volunteers} joined</span><span>{goal} spots</span></div>
      <div className="progress"><span style={{ width: `${percent}%` }}/></div>
      <Link href={`/events/${id}`} className="card-link">View opportunity <ArrowUpRight size={15}/></Link>
    </div>
  </article>;
}

export function StatCard({ icon: Icon, label, value, change }) {
  return <div className="stat-card"><div className="stat-icon"><Icon size={19}/></div><span className="muted stat-label">{label}</span><strong>{value}</strong><span className="stat-change">{change}</span></div>;
}
