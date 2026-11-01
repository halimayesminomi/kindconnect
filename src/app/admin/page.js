"use client";

import { ArrowUpRight, Users, CalendarDays, ShieldCheck, Flag, Check, Trash2, CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/cards";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function Admin() {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("events"); // "events" | "organizers" | "reports"
  
  const [organizerApps, setOrganizerApps] = useState([
    { id: "org1", name: "Green Future BD", lead: "Rafiqul Islam", email: "green@future.org", date: "2 days ago", verified: false },
    { id: "org2", name: "Dhaka Youth Relief", lead: "Tasnim Anjum", email: "tasnim@youthrelief.org", date: "5 hours ago", verified: false },
    { id: "org3", name: "Paws & Care Foundation", lead: "Farhan Kabir", email: "paws@care.org", date: "1 week ago", verified: true },
  ]);

  const [reports, setReports] = useState([
    { id: "rep1", event: "Green City Clean Up", result: "62 Bags collected, 120 saplings planted", verified: false },
    { id: "rep2", event: "Books for Brighter Futures", result: "240 Books sorted and given to Mirpur school", verified: true },
  ]);
  const [emergencyList, setEmergencyList] = useState([]);

  const loadEvents = () => {
    api.getEvents("all=true").then(res => setEvents(res.data || [])).catch(() => {});
    api.getEmergencyRequests("all=true").then(res => setEmergencyList(res.data || [])).catch(() => {});
  };

  useEffect(loadEvents, []);

  const handleVerifyOrganizer = (id) => {
    setOrganizerApps(prev => prev.map(o => o.id === id ? { ...o, verified: true } : o));
    toast.success("Organizer verified successfully! ✓");
  };

  const handleVerifyReport = (id) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, verified: true } : r));
    toast.success("Impact report approved and added to community dashboard! ✓");
  };

  const handleDeleteEvent = async (id, title) => {
    const result = await Swal.fire({
      title: "Moderate Event",
      text: `Remove "${title}" from platform?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff6b6b",
      confirmButtonText: "Remove Event",
      background: "#111715",
      color: "#f2f6f2",
    });

    if (result.isConfirmed) {
      try {
        await api.deleteEvent(id);
        toast.success("Event removed.");
        loadEvents();
      } catch (err) {
        toast.error(err.message || "Failed to remove event.");
      }
    }
  };

  return <>
    <div className="dash-heading">
      <div>
        <span className="eyebrow">PLATFORM CONTROL CENTER</span>
        <h1>Admin Moderation & Governance</h1>
        <p className="muted">Review activities, verify community organizers, and approve impact reports.</p>
      </div>
      <span className="status-pill status-green"><span className="live-dot"/> System Healthy</span>
    </div>

    {/* Platform Stats */}
    <div className="stats-grid">
      <StatCard icon={Users} label="Total events" value={events.length} change="Platform-wide"/>
      <StatCard icon={CalendarDays} label="Active upcoming" value={events.filter(e => new Date(e.date) > new Date()).length} change="Scheduled"/>
      <StatCard icon={ShieldCheck} label="Pending verifications" value={organizerApps.filter(o => !o.verified).length} change="Needs review"/>
      <StatCard icon={Flag} label="Submitted reports" value={reports.length} change="Verified"/>
    </div>

    {/* Tab Navigation */}
    <div style={{ display: "flex", gap: 10, margin: "24px 0 16px" }}>
      <button 
        onClick={() => setActiveTab("events")}
        className={`btn ${activeTab === "events" ? "btn-primary" : "btn-ghost"}`}
        style={{ padding: "8px 16px", fontSize: ".78rem" }}
      >
        Event Moderation ({events.length})
      </button>
      <button 
        onClick={() => setActiveTab("organizers")}
        className={`btn ${activeTab === "organizers" ? "btn-primary" : "btn-ghost"}`}
        style={{ padding: "8px 16px", fontSize: ".78rem" }}
      >
        Organizer Verification ({organizerApps.filter(o => !o.verified).length} pending)
      </button>
      <button 
        onClick={() => setActiveTab("reports")}
        className={`btn ${activeTab === "reports" ? "btn-primary" : "btn-ghost"}`}
        style={{ padding: "8px 16px", fontSize: ".78rem" }}
      >
        Impact Reports ({reports.length})
      </button>
      <button 
        onClick={() => setActiveTab("emergency")}
        className={`btn ${activeTab === "emergency" ? "btn-primary" : "btn-ghost"}`}
        style={{ padding: "8px 16px", fontSize: ".78rem" }}
      >
        Emergency Relief ({emergencyList.length})
      </button>
    </div>

    {/* Tab 1: Event Moderation */}
    {activeTab === "events" && (
      <div className="panel table-panel">
        <div className="panel-heading">
          <h3>All Platform Events</h3>
          <span className="status-pill">{events.length} listed</span>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Event Title</th>
                <th>Category</th>
                <th>Location</th>
                <th>Creator</th>
                <th>Volunteers</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(e => (
                <tr key={e._id}>
                  <td><b>{e.title}</b></td>
                  <td><span className="category-pill" style={{ position: "static", fontSize: ".62rem" }}>{e.category}</span></td>
                  <td>{e.location}</td>
                  <td>{e.creatorName} <small className="muted">{e.creatorEmail}</small></td>
                  <td>{e.volunteersCount}/{e.capacity}</td>
                  <td>
                    <button onClick={() => handleDeleteEvent(e._id, e.title)} className="icon-btn" title="Moderate/Delete">
                      <Trash2 size={14} color="#ff6b6b" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}

    {/* Tab 2: Organizer Verification */}
    {activeTab === "organizers" && (
      <div className="panel table-panel">
        <div className="panel-heading">
          <h3>Organizer Verification Applications</h3>
          <span className="status-pill">{organizerApps.length} total</span>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Organization</th>
                <th>Representative</th>
                <th>Contact</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {organizerApps.map(org => (
                <tr key={org.id}>
                  <td><b>{org.name}</b></td>
                  <td>{org.lead}</td>
                  <td>{org.email}</td>
                  <td>{org.date}</td>
                  <td>
                    <span className={`status-pill ${org.verified ? "status-green" : ""}`}>
                      {org.verified ? "✓ Verified" : "Pending Review"}
                    </span>
                  </td>
                  <td>
                    {!org.verified ? (
                      <button onClick={() => handleVerifyOrganizer(org.id)} className="btn btn-primary" style={{ padding: "6px 12px", fontSize: ".72rem" }}>
                        <Check size={14} /> Approve & Verify
                      </button>
                    ) : (
                      <span className="muted" style={{ fontSize: ".72rem" }}>Approved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}

    {/* Tab 3: Impact Reports Review */}
    {activeTab === "reports" && (
      <div className="panel table-panel">
        <div className="panel-heading">
          <h3>Event Outcome Reports</h3>
          <span className="status-pill">{reports.length} submitted</span>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Reported Community Outcome</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(rep => (
                <tr key={rep.id}>
                  <td><b>{rep.event}</b></td>
                  <td>{rep.result}</td>
                  <td>
                    <span className={`status-pill ${rep.verified ? "status-green" : ""}`}>
                      {rep.verified ? "✓ Verified" : "Pending Approval"}
                    </span>
                  </td>
                  <td>
                    {!rep.verified ? (
                      <button onClick={() => handleVerifyReport(rep.id)} className="btn btn-primary" style={{ padding: "6px 12px", fontSize: ".72rem" }}>
                        <CheckCircle2 size={14} /> Verify & Publish
                      </button>
                    ) : (
                      <span className="muted" style={{ fontSize: ".72rem" }}>Published to Impact Dashboard</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}

    {/* Tab 4: Emergency Relief Moderation */}
    {activeTab === "emergency" && (
      <div className="panel table-panel">
        <div className="panel-heading">
          <h3>Community Emergency Requests</h3>
          <span className="status-pill">{emergencyList.length} active</span>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Urgency</th>
                <th>Location</th>
                <th>Contact</th>
                <th>Volunteers</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {emergencyList.map(em => (
                <tr key={em._id}>
                  <td><b>{em.title}</b></td>
                  <td><span className="category-pill" style={{ position: "static", fontSize: ".62rem" }}>{em.category}</span></td>
                  <td>
                    <span style={{ color: em.urgency === "Critical" ? "#ff6b6b" : "#ffd166", fontWeight: 700 }}>
                      {em.urgency}
                    </span>
                  </td>
                  <td>{em.location}</td>
                  <td>{em.contactPhone}</td>
                  <td>{em.volunteersJoined || 0}</td>
                  <td>
                    <span className="status-pill status-green">
                      {em.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </>;
}
