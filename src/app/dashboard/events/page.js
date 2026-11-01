"use client";

import Link from "next/link";
import { Plus, MoreHorizontal, MapPin, CalendarDays, Trash2, Edit, ArrowUpRight, QrCode } from "lucide-react";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = () => {
    api.getMyEvents()
      .then(res => setEvents(res.data || []))
      .catch(() => toast.error("Failed to load your events."))
      .finally(() => setLoading(false));
  };

  useEffect(loadEvents, []);

  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: "Delete event?",
      text: `Are you sure you want to delete "${title}"? This will also remove all volunteer registrations.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#b7f36b",
      cancelButtonColor: "#666",
      confirmButtonText: "Yes, delete it",
      background: "#111715",
      color: "#f2f6f2",
    });
    if (result.isConfirmed) {
      try {
        await api.deleteEvent(id);
        toast.success("Event deleted successfully.");
        setEvents(prev => prev.filter(e => e._id !== id));
      } catch (err) {
        toast.error(err.message || "Failed to delete event.");
      }
    }
  };

  const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return <>
    <div className="dash-heading">
      <div>
        <span className="eyebrow">YOUR CONTRIBUTION</span>
        <h1>My events</h1>
        <p className="muted">Manage the opportunities you've created.</p>
      </div>
      <Link href="/dashboard/create-event" className="btn btn-primary"><Plus size={17}/> Create an event</Link>
    </div>
    <div className="panel table-panel">
      <div className="panel-heading">
        <h3>Created by you</h3>
        <span className="status-pill">{events.length} total</span>
      </div>
      {loading ? <p style={{padding:"30px 20px"}} className="muted">Loading your events...</p> : events.length === 0 ? (
        <div style={{padding:"40px 20px",textAlign:"center"}}>
          <p className="muted">You haven't created any events yet.</p>
          <Link href="/dashboard/create-event" className="btn btn-primary" style={{marginTop:"15px"}}><Plus size={16}/> Create your first event</Link>
        </div>
      ) : (
        <div className="table-scroll">
          <table>
            <thead><tr><th>Event</th><th>Date</th><th>Volunteers</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {events.map(e => (
                <tr key={e._id}>
                  <td><b>{e.title}</b><small><MapPin size={12}/>{e.location}</small></td>
                  <td>{fmtDate(e.date)}</td>
                  <td>{e.volunteersCount}/{e.capacity}</td>
                  <td><span className={`status-pill ${new Date(e.date) > new Date() ? "status-green" : ""}`}>{new Date(e.date) > new Date() ? "Upcoming" : "Past"}</span></td>
                  <td style={{display:"flex",gap:"6px"}}>
                    <Link href="/dashboard/attendance" className="icon-btn" title="View Check-In QR"><QrCode size={15}/></Link>
                    <Link href={`/dashboard/update-event/${e._id}`} className="icon-btn" title="Edit"><Edit size={15}/></Link>
                    <button className="icon-btn" title="Delete" onClick={() => handleDelete(e._id, e.title)}><Trash2 size={15}/></button>
                    <Link href={`/events/${e._id}`} className="icon-btn" title="View"><ArrowUpRight size={15}/></Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </>;
}
