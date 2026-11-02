"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  CalendarDays, 
  ShieldCheck, 
  Trash2, 
  Check, 
  X, 
  Search, 
  AlertTriangle, 
  FileText, 
  ArrowUpRight, 
  CheckCircle2, 
  UserCheck, 
  Sparkles,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { StatCard } from "@/components/cards";
import { api } from "@/lib/api";
import { useAuth } from "@/components/auth-provider";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function AdminPage() {
  const { user: currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState("users"); // "users" | "events" | "emergency" | "registrations"
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Users state
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState(null);

  // Events state
  const [events, setEvents] = useState([]);
  const [eventSearch, setEventSearch] = useState("");

  // Emergency state
  const [emergencyList, setEmergencyList] = useState([]);

  // Registrations state
  const [registrations, setRegistrations] = useState([]);

  // Load all platform data
  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, eventsRes, emergencyRes, regRes] = await Promise.allSettled([
        api.getAdminStats(),
        api.getAdminUsers(),
        api.getAdminEvents(),
        api.getAdminEmergency(),
        api.getAdminRegistrations(),
      ]);

      if (statsRes.status === "fulfilled" && statsRes.value?.data) {
        setStats(statsRes.value.data);
      }
      if (usersRes.status === "fulfilled" && usersRes.value?.data) {
        setUsers(usersRes.value.data);
      }
      if (eventsRes.status === "fulfilled" && eventsRes.value?.data) {
        setEvents(eventsRes.value.data);
      }
      if (emergencyRes.status === "fulfilled" && emergencyRes.value?.data) {
        setEmergencyList(emergencyRes.value.data);
      }
      if (regRes.status === "fulfilled" && regRes.value?.data) {
        setRegistrations(regRes.value.data);
      }
    } catch (err) {
      console.error("Admin fetch error:", err);
      toast.error("Failed to load some admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesRole = !userRoleFilter || u.role === userRoleFilter;
    const q = userSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  });

  // Filtered events
  const filteredEvents = events.filter((e) => {
    const q = eventSearch.toLowerCase().trim();
    return !q || e.title?.toLowerCase().includes(q) || e.creatorName?.toLowerCase().includes(q) || e.category?.toLowerCase().includes(q);
  });

  // Role update handler
  const handleRoleChange = async (userId, newRole, userName) => {
    const swalBg = document.documentElement.classList.contains("light") ? "#ffffff" : "#111715";
    const swalColor = document.documentElement.classList.contains("light") ? "#0a0a0a" : "#f2f6f2";

    const result = await Swal.fire({
      title: "Update User Role",
      html: `Change role of <b>${userName}</b> to <span style="text-transform: uppercase; font-weight: bold; color: ${
        newRole === "admin" ? "#ff6b6b" : newRole === "organizer" ? "#b7f36b" : "#94a3b8"
      }">${newRole}</span>?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `Yes, make ${newRole}`,
      confirmButtonColor: newRole === "admin" ? "#ef4444" : "#15803d",
      cancelButtonText: "Cancel",
      background: swalBg,
      color: swalColor,
    });

    if (!result.isConfirmed) return;

    setUpdatingUserId(userId);
    try {
      let designation;
      if (newRole === "admin") designation = "Platform Administrator";
      else if (newRole === "organizer") designation = "Community Organizer";
      else designation = "Volunteer";

      await api.updateUserRole(userId, { role: newRole, designation });
      toast.success(`Role updated to ${newRole}! ✓`);
      
      // Update local state
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole, designation } : u))
      );
      // Reload stats
      api.getAdminStats().then((res) => res.data && setStats(res.data)).catch(() => {});
    } catch (err) {
      toast.error(err.message || "Failed to update role.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Delete user handler
  const handleDeleteUser = async (userId, userName) => {
    const swalBg = document.documentElement.classList.contains("light") ? "#ffffff" : "#111715";
    const swalColor = document.documentElement.classList.contains("light") ? "#0a0a0a" : "#f2f6f2";

    const result = await Swal.fire({
      title: "Delete User Account",
      text: `Are you sure you want to permanently remove "${userName}" from KindConnect? This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Delete Account",
      background: swalBg,
      color: swalColor,
    });

    if (!result.isConfirmed) return;

    try {
      await api.deleteUser(userId);
      toast.success("User account deleted.");
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      api.getAdminStats().then((res) => res.data && setStats(res.data)).catch(() => {});
    } catch (err) {
      toast.error(err.message || "Failed to delete user.");
    }
  };

  // Delete event handler
  const handleDeleteEvent = async (eventId, title) => {
    const swalBg = document.documentElement.classList.contains("light") ? "#ffffff" : "#111715";
    const swalColor = document.documentElement.classList.contains("light") ? "#0a0a0a" : "#f2f6f2";

    const result = await Swal.fire({
      title: "Moderate / Delete Event",
      text: `Permanently delete "${title}" and all related registrations?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Delete Event",
      background: swalBg,
      color: swalColor,
    });

    if (!result.isConfirmed) return;

    try {
      await api.deleteAdminEvent(eventId);
      toast.success("Event deleted from platform.");
      setEvents((prev) => prev.filter((e) => e._id !== eventId));
      api.getAdminStats().then((res) => res.data && setStats(res.data)).catch(() => {});
    } catch (err) {
      toast.error(err.message || "Failed to delete event.");
    }
  };

  // Emergency verification toggle
  const handleToggleEmergencyVerify = async (id, currentVerified) => {
    const nextStatus = !currentVerified;
    try {
      await api.verifyAdminEmergency(id, { verified: nextStatus });
      toast.success(nextStatus ? "Emergency request approved! ✓" : "Marked unverified.");
      setEmergencyList((prev) =>
        prev.map((item) => (item._id === id ? { ...item, verified: nextStatus } : item))
      );
      api.getAdminStats().then((res) => res.data && setStats(res.data)).catch(() => {});
    } catch (err) {
      toast.error(err.message || "Failed to update verification.");
    }
  };

  // Delete emergency request
  const handleDeleteEmergency = async (id, title) => {
    const swalBg = document.documentElement.classList.contains("light") ? "#ffffff" : "#111715";
    const swalColor = document.documentElement.classList.contains("light") ? "#0a0a0a" : "#f2f6f2";

    const result = await Swal.fire({
      title: "Remove Emergency Request",
      text: `Delete "${title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Delete Request",
      background: swalBg,
      color: swalColor,
    });

    if (!result.isConfirmed) return;

    try {
      await api.deleteAdminEmergency(id);
      toast.success("Emergency request deleted.");
      setEmergencyList((prev) => prev.filter((r) => r._id !== id));
      api.getAdminStats().then((res) => res.data && setStats(res.data)).catch(() => {});
    } catch (err) {
      toast.error(err.message || "Failed to delete request.");
    }
  };

  return (
    <>
      {/* Top Banner & Control Center Header */}
      <div className="dash-heading">
        <div>
          <span className="eyebrow" style={{ color: "#ff6b6b", fontWeight: 800 }}>
            PLATFORM CONTROL CENTER
          </span>
          <h1>Admin Governance & Operations</h1>
          <p className="muted">
            Logged in as <b>{currentUser?.name || "Halima Yesmin Omi"}</b> (
            <span style={{ color: "var(--green)" }}>@{currentUser?.username || "omi"}</span>) — Full Platform Privileges
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button 
            onClick={loadAdminData} 
            className="icon-btn" 
            title="Refresh Data"
            style={{ width: 38, height: 38 }}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <span className="status-pill status-green" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span className="live-dot" /> System Operational
          </span>
        </div>
      </div>

      {/* Platform Stats Grid */}
      <div className="stats-grid">
        <StatCard
          icon={Users}
          label="Total Registered Users"
          value={stats?.totalUsers ?? users.length}
          change={`${stats?.users?.volunteers ?? 0} volunteers • ${stats?.users?.organizers ?? 0} organizers • ${stats?.users?.admins ?? 1} admins`}
        />
        <StatCard
          icon={CalendarDays}
          label="Platform Events"
          value={stats?.totalEvents ?? events.length}
          change={`${stats?.events?.upcoming ?? 0} upcoming active`}
        />
        <StatCard
          icon={CheckCircle2}
          label="Total Registrations"
          value={stats?.totalRegistrations ?? registrations.length}
          change="Community participation"
        />
        <StatCard
          icon={AlertCircle}
          label="Emergency Requests"
          value={stats?.totalEmergency ?? emergencyList.length}
          change={`${stats?.emergency?.pending ?? 0} pending review`}
        />
      </div>

      {/* Tab Navigation */}
      <div style={{ display: "flex", gap: 8, margin: "24px 0 16px", flexWrap: "wrap" }}>
        <button
          onClick={() => setActiveTab("users")}
          className={`btn ${activeTab === "users" ? "btn-primary" : "btn-ghost"}`}
          style={{
            padding: "8px 18px",
            fontSize: ".82rem",
            background: activeTab === "users" ? "#ef4444" : undefined,
            borderColor: activeTab === "users" ? "#ef4444" : undefined,
            color: activeTab === "users" ? "#fff" : undefined,
          }}
        >
          <Users size={15} style={{ marginRight: 6 }} /> User Management ({users.length})
        </button>

        <button
          onClick={() => setActiveTab("events")}
          className={`btn ${activeTab === "events" ? "btn-primary" : "btn-ghost"}`}
          style={{
            padding: "8px 18px",
            fontSize: ".82rem",
            background: activeTab === "events" ? "#ef4444" : undefined,
            borderColor: activeTab === "events" ? "#ef4444" : undefined,
            color: activeTab === "events" ? "#fff" : undefined,
          }}
        >
          <CalendarDays size={15} style={{ marginRight: 6 }} /> Event Moderation ({events.length})
        </button>

        <button
          onClick={() => setActiveTab("emergency")}
          className={`btn ${activeTab === "emergency" ? "btn-primary" : "btn-ghost"}`}
          style={{
            padding: "8px 18px",
            fontSize: ".82rem",
            background: activeTab === "emergency" ? "#ef4444" : undefined,
            borderColor: activeTab === "emergency" ? "#ef4444" : undefined,
            color: activeTab === "emergency" ? "#fff" : undefined,
          }}
        >
          <AlertCircle size={15} style={{ marginRight: 6 }} /> Emergency Relief ({emergencyList.length})
        </button>

        <button
          onClick={() => setActiveTab("registrations")}
          className={`btn ${activeTab === "registrations" ? "btn-primary" : "btn-ghost"}`}
          style={{
            padding: "8px 18px",
            fontSize: ".82rem",
            background: activeTab === "registrations" ? "#ef4444" : undefined,
            borderColor: activeTab === "registrations" ? "#ef4444" : undefined,
            color: activeTab === "registrations" ? "#fff" : undefined,
          }}
        >
          <CheckCircle2 size={15} style={{ marginRight: 6 }} /> Registrations Log ({registrations.length})
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: USER MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === "users" && (
        <div className="panel table-panel">
          <div className="panel-heading" style={{ flexWrap: "wrap", gap: 14 }}>
            <div>
              <h3>Community Members & Governance</h3>
              <p className="muted" style={{ fontSize: "0.76rem", margin: "2px 0 0" }}>
                Manage volunteer, organizer, and administrator accounts across KindConnect.
              </p>
            </div>
            
            {/* Filter & Search Bar */}
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ position: "relative" }}>
                <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
                <input
                  type="text"
                  placeholder="Search name, email, @username..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  style={{
                    padding: "6px 12px 6px 30px",
                    borderRadius: 8,
                    fontSize: ".78rem",
                    border: "1px solid var(--line)",
                    background: "var(--bg)",
                    color: "var(--text)",
                    width: 220,
                  }}
                />
              </div>

              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  fontSize: ".78rem",
                  border: "1px solid var(--line)",
                  background: "var(--bg)",
                  color: "var(--text)",
                }}
              >
                <option value="">All Roles</option>
                <option value="user">Volunteers only</option>
                <option value="organizer">Organizers only</option>
                <option value="admin">Admins only</option>
              </select>

              <span className="status-pill">{filteredUsers.length} users</span>
            </div>
          </div>

          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Contact Email</th>
                  <th>Platform Role</th>
                  <th>Designation</th>
                  <th>Joined Date</th>
                  <th style={{ textAlign: "right" }}>Actions / Role Assignment</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "32px", color: "var(--muted)" }}>
                      No users match the search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isSelf = currentUser?._id === u._id || currentUser?.id === u._id;
                    const isOmi = u.username === "omi" || u.email === "omi@kindconnect.org";
                    const roleColor =
                      u.role === "admin"
                        ? "#ff6b6b"
                        : u.role === "organizer"
                        ? "var(--green)"
                        : "var(--muted)";

                    return (
                      <tr key={u._id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            {u.photoURL ? (
                              <img
                                src={u.photoURL}
                                alt={u.name}
                                style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover" }}
                              />
                            ) : (
                              <span className="avatar" style={{ width: 34, height: 34, fontSize: ".72rem" }}>
                                {u.name ? u.name.slice(0, 2).toUpperCase() : "U"}
                              </span>
                            )}
                            <div>
                              <b style={{ display: "flex", alignItems: "center", gap: 6, fontSize: ".82rem" }}>
                                {u.name}
                                {isOmi && (
                                  <span
                                    style={{
                                      background: "#ff6b6b",
                                      color: "#fff",
                                      fontSize: "0.55rem",
                                      fontWeight: 800,
                                      padding: "1px 6px",
                                      borderRadius: 4,
                                      letterSpacing: "0.4px",
                                    }}
                                  >
                                    CREATOR
                                  </span>
                                )}
                                {isSelf && !isOmi && (
                                  <span className="status-pill status-green" style={{ fontSize: ".55rem", padding: "1px 6px" }}>
                                    YOU
                                  </span>
                                )}
                              </b>
                              <small className="muted" style={{ fontSize: ".7rem" }}>
                                @{u.username || "no-username"}
                              </small>
                            </div>
                          </div>
                        </td>

                        <td style={{ fontSize: ".78rem" }}>{u.email}</td>

                        <td>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              padding: "3px 9px",
                              borderRadius: 12,
                              fontSize: ".68rem",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              background:
                                u.role === "admin"
                                  ? "rgba(239, 68, 68, 0.15)"
                                  : u.role === "organizer"
                                  ? "rgba(183, 243, 107, 0.15)"
                                  : "rgba(148, 163, 184, 0.15)",
                              color: roleColor,
                              border: `1px solid ${roleColor}40`,
                            }}
                          >
                            <span
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: roleColor,
                              }}
                            />
                            {u.role}
                          </span>
                        </td>

                        <td style={{ fontSize: ".78rem", color: "var(--text)" }}>
                          {u.designation || (u.role === "admin" ? "Platform Administrator" : u.role === "organizer" ? "Community Organizer" : "Volunteer")}
                        </td>

                        <td style={{ fontSize: ".75rem", color: "var(--muted)" }}>
                          {u.createdAt
                            ? new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                            : "—"}
                        </td>

                        <td style={{ textAlign: "right" }}>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                            {/* Role change dropdown or buttons */}
                            {u.role !== "admin" && (
                              <button
                                onClick={() => handleRoleChange(u._id, "admin", u.name)}
                                className="btn btn-ghost"
                                style={{ padding: "4px 8px", fontSize: ".68rem", color: "#ff6b6b" }}
                                title="Promote to Administrator"
                                disabled={updatingUserId === u._id}
                              >
                                + Admin
                              </button>
                            )}

                            {u.role !== "organizer" && (
                              <button
                                onClick={() => handleRoleChange(u._id, "organizer", u.name)}
                                className="btn btn-ghost"
                                style={{ padding: "4px 8px", fontSize: ".68rem", color: "var(--green)" }}
                                title="Promote to Organizer"
                                disabled={updatingUserId === u._id}
                              >
                                + Organizer
                              </button>
                            )}

                            {u.role !== "user" && !isOmi && (
                              <button
                                onClick={() => handleRoleChange(u._id, "user", u.name)}
                                className="btn btn-ghost"
                                style={{ padding: "4px 8px", fontSize: ".68rem", color: "var(--muted)" }}
                                title="Demote to Volunteer"
                                disabled={updatingUserId === u._id}
                              >
                                Set Volunteer
                              </button>
                            )}

                            {/* Delete User */}
                            {!isOmi && !isSelf && (
                              <button
                                onClick={() => handleDeleteUser(u._id, u.name)}
                                className="icon-btn"
                                title="Delete user"
                                style={{ width: 28, height: 28 }}
                              >
                                <Trash2 size={13} color="#ef4444" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: EVENT MODERATION */}
      {/* ========================================================================= */}
      {activeTab === "events" && (
        <div className="panel table-panel">
          <div className="panel-heading" style={{ flexWrap: "wrap", gap: 14 }}>
            <div>
              <h3>All Platform Events Moderation</h3>
              <p className="muted" style={{ fontSize: "0.76rem", margin: "2px 0 0" }}>
                Review, moderate, or remove inappropriate events across the platform.
              </p>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ position: "relative" }}>
                <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }} />
                <input
                  type="text"
                  placeholder="Filter events or creator..."
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                  style={{
                    padding: "6px 12px 6px 30px",
                    borderRadius: 8,
                    fontSize: ".78rem",
                    border: "1px solid var(--line)",
                    background: "var(--bg)",
                    color: "var(--text)",
                    width: 220,
                  }}
                />
              </div>
              <span className="status-pill">{filteredEvents.length} listed</span>
            </div>
          </div>

          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Event Title</th>
                  <th>Category</th>
                  <th>Date & Location</th>
                  <th>Organizer / Creator</th>
                  <th>Attendance Capacity</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "32px", color: "var(--muted)" }}>
                      No events found.
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((e) => (
                    <tr key={e._id}>
                      <td>
                        <b>{e.title}</b>
                      </td>
                      <td>
                        <span className="category-pill" style={{ position: "static", fontSize: ".62rem" }}>
                          {e.category}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: ".76rem" }}>
                          <div>{new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                          <small className="muted">{e.location}</small>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: ".76rem" }}>
                          <b>{e.creatorName}</b>
                          <br />
                          <small className="muted">{e.creatorEmail}</small>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: ".78rem", fontWeight: 700 }}>
                          {e.volunteersCount || 0} / {e.capacity}
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill ${e.status === "published" ? "status-green" : ""}`} style={{ fontSize: ".65rem" }}>
                          {e.status}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: 6 }}>
                          <a
                            href={`/events/${e._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="icon-btn"
                            title="View Public Page"
                            style={{ width: 28, height: 28 }}
                          >
                            <ArrowUpRight size={14} />
                          </a>
                          <button
                            onClick={() => handleDeleteEvent(e._id, e.title)}
                            className="icon-btn"
                            title="Delete / Moderate Event"
                            style={{ width: 28, height: 28 }}
                          >
                            <Trash2 size={14} color="#ef4444" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: EMERGENCY RELIEF MODERATION */}
      {/* ========================================================================= */}
      {activeTab === "emergency" && (
        <div className="panel table-panel">
          <div className="panel-heading">
            <div>
              <h3>Emergency Relief & Verification</h3>
              <p className="muted" style={{ fontSize: "0.76rem", margin: "2px 0 0" }}>
                Verify grassroots emergency aid requests so volunteers can safely donate and assist.
              </p>
            </div>
            <span className="status-pill">{emergencyList.length} requests</span>
          </div>

          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Request Title</th>
                  <th>Category</th>
                  <th>Urgency</th>
                  <th>Location</th>
                  <th>Requester & Phone</th>
                  <th>Verified Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {emergencyList.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "32px", color: "var(--muted)" }}>
                      No emergency requests logged yet.
                    </td>
                  </tr>
                ) : (
                  emergencyList.map((req) => (
                    <tr key={req._id}>
                      <td>
                        <b>{req.title}</b>
                        <p className="muted" style={{ fontSize: ".7rem", margin: "3px 0 0", maxWidth: 260 }}>
                          {req.description?.slice(0, 90)}...
                        </p>
                      </td>
                      <td>
                        <span className="category-pill" style={{ position: "static", fontSize: ".62rem" }}>
                          {req.category}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: ".68rem",
                            fontWeight: 800,
                            padding: "2px 8px",
                            borderRadius: 6,
                            background:
                              req.urgency === "Critical"
                                ? "rgba(239, 68, 68, 0.2)"
                                : req.urgency === "High"
                                ? "rgba(245, 158, 11, 0.2)"
                                : "rgba(59, 130, 246, 0.2)",
                            color:
                              req.urgency === "Critical"
                                ? "#ef4444"
                                : req.urgency === "High"
                                ? "#f59e0b"
                                : "#3b82f6",
                          }}
                        >
                          {req.urgency}
                        </span>
                      </td>
                      <td style={{ fontSize: ".76rem" }}>{req.location}</td>
                      <td>
                        <div style={{ fontSize: ".76rem" }}>
                          <b>{req.requesterName}</b>
                          <br />
                          <small className="muted">{req.contactPhone}</small>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`status-pill ${req.verified ? "status-green" : ""}`}
                          style={{ fontSize: ".68rem" }}
                        >
                          {req.verified ? "✓ Verified" : "Pending Review"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: 6 }}>
                          <button
                            onClick={() => handleToggleEmergencyVerify(req._id, req.verified)}
                            className="btn btn-outline"
                            style={{
                              padding: "4px 10px",
                              fontSize: ".7rem",
                              color: req.verified ? "#94a3b8" : "var(--green)",
                              borderColor: req.verified ? "var(--line)" : "var(--green)",
                            }}
                          >
                            {req.verified ? "Unverify" : "✓ Approve"}
                          </button>
                          <button
                            onClick={() => handleDeleteEmergency(req._id, req.title)}
                            className="icon-btn"
                            title="Delete Request"
                            style={{ width: 28, height: 28 }}
                          >
                            <Trash2 size={13} color="#ef4444" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: REGISTRATIONS LOG */}
      {/* ========================================================================= */}
      {activeTab === "registrations" && (
        <div className="panel table-panel">
          <div className="panel-heading">
            <div>
              <h3>Platform-wide Registrations Feed</h3>
              <p className="muted" style={{ fontSize: "0.76rem", margin: "2px 0 0" }}>
                Recent signups and participation records across all events.
              </p>
            </div>
            <span className="status-pill">{registrations.length} registrations</span>
          </div>

          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Volunteer Name</th>
                  <th>Volunteer Email</th>
                  <th>Registration Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {registrations.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "32px", color: "var(--muted)" }}>
                      No event registrations recorded yet.
                    </td>
                  </tr>
                ) : (
                  registrations.map((reg) => (
                    <tr key={reg._id}>
                      <td>
                        <b>{reg.eventId?.title || "Event deleted or archived"}</b>
                        {reg.eventId?.location && (
                          <div className="muted" style={{ fontSize: ".7rem" }}>
                            {reg.eventId.location}
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ fontSize: ".78rem", fontWeight: 600 }}>
                          {reg.userName || reg.userId?.name || "Participant"}
                        </div>
                      </td>
                      <td style={{ fontSize: ".78rem", color: "var(--muted)" }}>
                        {reg.userEmail || reg.userId?.email || "—"}
                      </td>
                      <td style={{ fontSize: ".75rem" }}>
                        {reg.registeredAt
                          ? new Date(reg.registeredAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </td>
                      <td>
                        <span className="status-pill status-green" style={{ fontSize: ".65rem" }}>
                          {reg.status || "confirmed"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
