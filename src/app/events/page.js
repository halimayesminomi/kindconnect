"use client";
import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, MapPin, LayoutGrid, Map as MapIcon, ArrowUpRight, CalendarDays, Users } from "lucide-react";
import Link from "next/link";
import { PublicLayout } from "@/components/site";
import { EventCard } from "@/components/cards";
import { api } from "@/lib/api";

const DHAKA_LOCATIONS = [
  { name: "Uttara", lat: 23.8759, lon: 90.3795, desc: "North Dhaka Hub" },
  { name: "Mirpur", lat: 23.8223, lon: 90.3654, desc: "West Community Sector" },
  { name: "Banani", lat: 23.7937, lon: 90.4066, desc: "Central Health & Youth Drives" },
  { name: "Dhanmondi", lat: 23.7461, lon: 90.3742, desc: "Community & Education Center" },
  { name: "Bashundhara", lat: 23.8191, lon: 90.4358, desc: "Animal & Nature Initiatives" },
  { name: "Hatirjheel", lat: 23.7693, lon: 90.4074, desc: "Green Waterfront Planting" },
];

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "map"
  const [selectedLocation, setSelectedLocation] = useState(null);

  const categories = ["All", "Environment", "Education", "Community", "Health", "Animals", "Emergency", "Other"];

  useEffect(() => {
    api.getEvents()
      .then(res => setEvents(res.data || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() =>
    events.filter(e => {
      const matchCat = category === "All" || e.category === category;
      const matchQuery = `${e.title} ${e.location} ${e.category} ${e.description}`.toLowerCase().includes(query.toLowerCase());
      const matchLoc = !selectedLocation || e.location.toLowerCase().includes(selectedLocation.toLowerCase());
      return matchCat && matchQuery && matchLoc;
    }), [query, category, events, selectedLocation]);

  return <PublicLayout><main className="page-main container">
    <div className="page-hero compact">
      <span className="eyebrow">MAKE YOUR NEXT MOVE</span>
      <h1>Find an opportunity<br/><span className="gradient-text">to do good.</span></h1>
      <p className="muted">A little of your time can mean a lot to someone else.</p>
    </div>

    <div className="event-toolbar">
      <div className="search-box">
        <Search size={18}/>
        <input 
          value={query} 
          onChange={e => setQuery(e.target.value)} 
          placeholder="Search events, causes or locations..."
        />
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {/* View Toggle */}
        <div style={{ display: "flex", border: "1px solid var(--line)", borderRadius: 10, overflow: "hidden", background: "var(--panel)" }}>
          <button 
            onClick={() => setViewMode("grid")}
            style={{ 
              display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", fontSize: ".78rem", fontWeight: 700,
              background: viewMode === "grid" ? "var(--green)" : "transparent",
              color: viewMode === "grid" ? "#14200f" : "var(--muted)",
              cursor: "pointer"
            }}
          >
            <LayoutGrid size={15}/> Grid
          </button>
          <button 
            onClick={() => setViewMode("map")}
            style={{ 
              display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", fontSize: ".78rem", fontWeight: 700,
              background: viewMode === "map" ? "var(--green)" : "transparent",
              color: viewMode === "map" ? "#14200f" : "var(--muted)",
              cursor: "pointer"
            }}
          >
            <MapIcon size={15}/> Map Explorer
          </button>
        </div>
      </div>
    </div>

    {/* Category Tabs */}
    <div className="category-tabs">
      {categories.map(c => (
        <button key={c} onClick={() => setCategory(c)} className={category === c ? "tab-active" : ""}>
          {c}
        </button>
      ))}
    </div>

    <div className="results-line">
      <span>{loading ? "Loading..." : `${filtered.length} opportunities found`}</span>
      <span>
        <MapPin size={14}/> {selectedLocation ? `Filtered by ${selectedLocation}` : "Across Dhaka"}
        {selectedLocation && (
          <button 
            onClick={() => setSelectedLocation(null)} 
            style={{ marginLeft: 8, background: "transparent", border: "none", color: "var(--green)", cursor: "pointer", fontSize: ".72rem", textDecoration: "underline" }}
          >
            Clear area
          </button>
        )}
      </span>
    </div>

    {/* Map Explorer View */}
    {viewMode === "map" ? (
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24, marginBottom: 50 }}>
        {/* OpenStreetMap Interactive Embed */}
        <div style={{ border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden", height: 500, position: "relative" }}>
          <iframe
            title="Dhaka Events Map"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            src="https://www.openstreetmap.org/export/embed.html?bbox=90.3100%2C23.7000%2C90.4900%2C23.9000&amp;layer=mapnik&amp;marker=23.7808%2C90.4152"
          />
          <div style={{ position: "absolute", bottom: 12, left: 12, right: 12, background: "rgba(17, 23, 21, 0.9)", backdropFilter: "blur(10px)", border: "1px solid var(--line)", borderRadius: 10, padding: "8px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: ".72rem" }}>
            <span><b>OpenStreetMap:</b> Dhaka Social Service Hubs</span>
            <span style={{ color: "var(--green)" }}>● 6 Active Volunteer Zones</span>
          </div>
        </div>

        {/* Location Selector & Events in Area */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <b style={{ fontSize: ".88rem", display: "block", marginBottom: 8 }}>Explore Events by Area in Dhaka:</b>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {DHAKA_LOCATIONS.map(loc => {
                const count = events.filter(e => e.location.toLowerCase().includes(loc.name.toLowerCase())).length;
                const isSelected = selectedLocation === loc.name;
                return (
                  <button
                    key={loc.name}
                    onClick={() => setSelectedLocation(isSelected ? null : loc.name)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: `1px solid ${isSelected ? "var(--green)" : "var(--line)"}`,
                      background: isSelected ? "rgba(183, 243, 107, 0.15)" : "var(--panel)",
                      color: isSelected ? "var(--green)" : "var(--text)",
                      fontSize: ".75rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6
                    }}
                  >
                    <MapPin size={13} color={isSelected ? "var(--green)" : "var(--muted)"} />
                    <b>{loc.name}</b>
                    <span style={{ opacity: 0.7 }}>({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", maxHeight: 400, display: "grid", gap: 12, paddingRight: 4 }}>
            {filtered.length === 0 ? (
              <div className="empty-state" style={{ padding: "40px 10px" }}>
                <p className="muted">No events currently scheduled in this zone.</p>
              </div>
            ) : (
              filtered.map(e => (
                <div key={e._id} style={{ background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 12, padding: "14px", display: "flex", gap: 14 }}>
                  <div style={{ width: 80, height: 80, borderRadius: 10, backgroundImage: `url(${e.image})`, backgroundSize: "cover", backgroundPosition: "center", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span className="category-pill" style={{ position: "static", fontSize: ".6rem", padding: "2px 8px" }}>{e.category}</span>
                    <h4 style={{ margin: "6px 0 4px", fontSize: ".88rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      <Link href={`/events/${e._id}`}>{e.title}</Link>
                    </h4>
                    <p className="muted" style={{ fontSize: ".7rem", margin: "2px 0", display: "flex", alignItems: "center", gap: 5 }}>
                      <MapPin size={12}/> {e.location} · {new Date(e.date).toLocaleDateString()}
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                      <small className="muted" style={{ fontSize: ".68rem" }}>{e.volunteersCount}/{e.capacity} joined</small>
                      <Link href={`/events/${e._id}`} className="text-link" style={{ fontSize: ".72rem" }}>
                        Details <ArrowUpRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    ) : (
      /* Grid View */
      loading ? (
        <div className="event-grid">
          {[1,2,3].map(i => (
            <div key={i} className="event-card" style={{minHeight:320,display:"grid",placeItems:"center",opacity:.4}}>
              <p>Loading opportunities...</p>
            </div>
          ))}
        </div>
      ) : filtered.length ? (
        <div className="event-grid">
          {filtered.map(e => <EventCard key={e._id} event={{ ...e, id: e._id }} />)}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={28}/>
          <h3>No events found</h3>
          <p>Try a different keyword, category, or location filter.</p>
        </div>
      )
    )}
  </main></PublicLayout>;
}
