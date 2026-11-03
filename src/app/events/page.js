"use client";

import { useEffect, useMemo, useState } from "react";
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  LayoutGrid, 
  Map as MapIcon, 
  ArrowUpRight, 
  CalendarDays, 
  Users, 
  Sparkles,
  ExternalLink,
  Compass,
  Building2,
  Navigation,
  Globe2
} from "lucide-react";
import Link from "next/link";
import { PublicLayout } from "@/components/site";
import { EventCard } from "@/components/cards";
import { api } from "@/lib/api";
import { FALLBACK_EVENTS } from "@/lib/fallbackData";

export const BANGLADESH_DIVISIONS = [
  {
    id: "all",
    name: "All Bangladesh",
    nameBn: "সমগ্র বাংলাদেশ",
    flag: "🇧🇩",
    bbox: "88.0100%2C20.7400%2C92.6700%2C26.6300",
    center: { lat: 23.6850, lon: 90.3563 },
    zoomDesc: "National Volunteer Network Across All 8 Divisions",
    keyAreas: [
      { name: "Sylhet", desc: "Northeast Community Hub" },
      { name: "Dhaka", desc: "Capital & Central Zone" },
      { name: "Chattogram", desc: "Southeast Coast Hub" },
      { name: "Rajshahi", desc: "Northern Division" },
      { name: "Khulna", desc: "Southwest Riverine Hub" },
      { name: "Barishal", desc: "Southern Coastal Belt" },
      { name: "Rangpur", desc: "Northwest Agricultural Zone" },
      { name: "Mymensingh", desc: "Central North Region" },
    ]
  },
  {
    id: "sylhet",
    name: "Sylhet",
    nameBn: "সিলেট বিভাগ",
    flag: "🟢",
    bbox: "91.3500%2C24.3000%2C92.5000%2C25.2000",
    center: { lat: 24.8949, lon: 91.8687 },
    zoomDesc: "Sylhet Division • Metropolitan University Zone",
    keyAreas: [
      { name: "Sylhet", desc: "Central City Zone" },
      { name: "Metropolitan University", desc: "Bateshwar Campus & Tech Hub" },
      { name: "Zindabazar", desc: "Commercial & Youth Center" },
      { name: "Amberkhana", desc: "North Sylhet Transit Hub" },
      { name: "Tilagarh", desc: "Eastern Education Hub" },
      { name: "Shahjalal Uposhohor", desc: "Residential Community" },
      { name: "Moulvibazar", desc: "Tea Capital & Community Care" },
      { name: "Sreemangal", desc: "Eco-Volunteer Drives" },
      { name: "Sunamganj", desc: "Haor Relief & Welfare" },
      { name: "Habiganj", desc: "Southern Sylhet Drives" },
    ]
  },
  {
    id: "dhaka",
    name: "Dhaka",
    nameBn: "ঢাকা বিভাগ",
    flag: "🏢",
    bbox: "90.1500%2C23.6000%2C90.6500%2C24.0500",
    center: { lat: 23.8103, lon: 90.4125 },
    zoomDesc: "Dhaka Metropolitan Area & Suburbs",
    keyAreas: [
      { name: "Uttara", desc: "North Dhaka Hub" },
      { name: "Mirpur", desc: "West Community Sector" },
      { name: "Banani", desc: "Central Health & Youth Drives" },
      { name: "Dhanmondi", desc: "Community & Education Center" },
      { name: "Gulshan", desc: "Civic Action Hub" },
      { name: "Old Dhaka", desc: "Heritage & Community Relief" },
      { name: "Bashundhara", desc: "Animal & Nature Initiatives" },
      { name: "Gazipur", desc: "Industrial Community Drives" },
      { name: "Narayanganj", desc: "River Basin Drives" },
    ]
  },
  {
    id: "chattogram",
    name: "Chattogram",
    nameBn: "চট্টগ্রাম বিভাগ",
    flag: "⚓",
    bbox: "91.6500%2C22.1500%2C92.0500%2C22.5500",
    center: { lat: 22.3569, lon: 91.7832 },
    zoomDesc: "Port City & Coastal Region",
    keyAreas: [
      { name: "Chattogram", desc: "Central Port Zone" },
      { name: "Agrabad", desc: "Commercial & Aid Center" },
      { name: "GEC Circle", desc: "Central Youth Drives" },
      { name: "Patenga", desc: "Coastal Clean-up" },
      { name: "Cox's Bazar", desc: "Humanitarian & Marine Care" },
      { name: "Cumilla", desc: "Eastern Highway Hub" },
    ]
  },
  {
    id: "rajshahi",
    name: "Rajshahi",
    nameBn: "রাজশাহী বিভাগ",
    flag: "🌾",
    bbox: "88.4000%2C24.2000%2C88.8000%2C24.5500",
    center: { lat: 24.3745, lon: 88.6042 },
    zoomDesc: "Silk City & Northern Heartland",
    keyAreas: [
      { name: "Rajshahi", desc: "Padma Riverside Hub" },
      { name: "Shaheb Bazar", desc: "City Center" },
      { name: "Bogura", desc: "Northern Gateway" },
      { name: "Pabna", desc: "Southern Rajshahi Zone" },
    ]
  },
  {
    id: "khulna",
    name: "Khulna",
    nameBn: "খুলনা বিভাগ",
    flag: "🌊",
    bbox: "89.3500%2C22.6500%2C89.7000%2C23.0500",
    center: { lat: 22.8456, lon: 89.5403 },
    zoomDesc: "Sundarbans Gateway & Industrial Port",
    keyAreas: [
      { name: "Khulna", desc: "Bhairab River Hub" },
      { name: "Boyra", desc: "Community Health Zone" },
      { name: "Jashore", desc: "Agricultural Hub" },
      { name: "Kushtia", desc: "Cultural Heritage Center" },
    ]
  },
  {
    id: "barishal",
    name: "Barishal",
    nameBn: "বরিশাল বিভাগ",
    flag: "⛵",
    bbox: "90.1500%2C22.5000%2C90.5500%2C22.9000",
    center: { lat: 22.7010, lon: 90.3535 },
    zoomDesc: "Southern Rivers & Coastal Protection",
    keyAreas: [
      { name: "Barishal", desc: "Venice of Bengal Central" },
      { name: "Band Road", desc: "Kirtankhola Riverfront" },
      { name: "Patuakhali", desc: "Coastal Relief Center" },
      { name: "Kuakata", desc: "Marine Eco-Drives" },
    ]
  },
  {
    id: "rangpur",
    name: "Rangpur",
    nameBn: "রংপুর বিভাগ",
    flag: "🌿",
    bbox: "89.0500%2C25.5500%2C89.4500%2C25.9500",
    center: { lat: 25.7439, lon: 89.2752 },
    zoomDesc: "North Bengal Agriculture & Winter Relief",
    keyAreas: [
      { name: "Rangpur", desc: "Teesta Basin Center" },
      { name: "Modern Mor", desc: "University Community Hub" },
      { name: "Dinajpur", desc: "Northern Heritage & Relief" },
      { name: "Saidpur", desc: "Railway Town Outreach" },
    ]
  },
  {
    id: "mymensingh",
    name: "Mymensingh",
    nameBn: "ময়মনসিংহ বিভাগ",
    flag: "🏞️",
    bbox: "90.2000%2C24.5500%2C90.6500%2C24.9500",
    center: { lat: 24.7471, lon: 90.4203 },
    zoomDesc: "Brahmaputra Basin & Education Hub",
    keyAreas: [
      { name: "Mymensingh", desc: "Brahmaputra Riverside" },
      { name: "Ganginar Par", desc: "Town Center" },
      { name: "Jamalpur", desc: "Rural Development Zone" },
      { name: "Netrokona", desc: "Haor Border Initiatives" },
    ]
  }
];

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "map"
  const [selectedDivision, setSelectedDivision] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState(null);

  const categories = ["All", "Environment", "Education", "Community", "Health", "Animals", "Emergency", "Other"];

  useEffect(() => {
    api.getEvents()
      .then(res => {
        if (res?.data && res.data.length > 0) {
          setEvents(res.data);
        } else {
          setEvents(FALLBACK_EVENTS);
        }
      })
      .catch(() => setEvents(FALLBACK_EVENTS))
      .finally(() => setLoading(false));

    api.getRecommendations()
      .then(res => {
        if (res?.data && res.data.length > 0) {
          setRecommendations(res.data);
        } else {
          setRecommendations(FALLBACK_EVENTS.slice(0, 3));
        }
      })
      .catch(() => setRecommendations(FALLBACK_EVENTS.slice(0, 3)));
  }, []);

  const activeDivision = useMemo(() => {
    return BANGLADESH_DIVISIONS.find(d => d.id === selectedDivision) || BANGLADESH_DIVISIONS[0];
  }, [selectedDivision]);

  const filtered = useMemo(() =>
    events.filter(e => {
      const matchCat = category === "All" || e.category === category;
      const matchQuery = `${e.title} ${e.location} ${e.category} ${e.description}`.toLowerCase().includes(query.toLowerCase());
      
      // Location matching logic for full Bangladesh
      let matchLoc = true;
      if (selectedLocation) {
        matchLoc = e.location.toLowerCase().includes(selectedLocation.toLowerCase());
      } else if (selectedDivision && selectedDivision !== "all") {
        const divObj = BANGLADESH_DIVISIONS.find(d => d.id === selectedDivision);
        if (divObj) {
          const divKeywords = [
            divObj.name.toLowerCase(), 
            ...(divObj.keyAreas || []).map(a => a.name.toLowerCase())
          ];
          matchLoc = divKeywords.some(kw => e.location.toLowerCase().includes(kw));
        }
      }

      return matchCat && matchQuery && matchLoc;
    }), [query, category, events, selectedLocation, selectedDivision]);

  const mapSrc = useMemo(() => {
    return `https://www.openstreetmap.org/export/embed.html?bbox=${activeDivision.bbox}&layer=mapnik&marker=${activeDivision.center.lat}%2C${activeDivision.center.lon}`;
  }, [activeDivision]);

  return <PublicLayout><main className="page-main container">
    <div className="page-hero compact">
      <span className="eyebrow">MAKE YOUR NEXT MOVE</span>
      <h1>Find an opportunity<br/><span className="gradient-text">across Bangladesh.</span></h1>
      <p className="muted">
        সিলেট, ঢাকাসহ বাংলাদেশের প্রতিটি বিভাগের সামাজিক ও মানবিক উদ্যোগ এক প্ল্যাটফর্মে।
      </p>
    </div>

    <div className="event-toolbar">
      <div className="search-box">
        <Search size={18}/>
        <input 
          value={query} 
          onChange={e => setQuery(e.target.value)} 
          placeholder="Search events by title, division or location (e.g. Sylhet, Dhaka, Zindabazar)..."
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
            <MapIcon size={15}/> 🇧🇩 Bangladesh Map Explorer
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

    {/* AI Smart Recommendations */}
    {!query && category === "All" && recommendations.length > 0 && viewMode === "grid" && (
      <div style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.08), rgba(16,185,129,0.02))", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 16, padding: "20px 24px", marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "50%", background: "var(--green)", color: "#14200f" }}>
              <Sparkles size={18} />
            </span>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700 }}>AI Recommended For You</h3>
              <p className="muted" style={{ margin: 0, fontSize: "0.78rem" }}>Personalized recommendations based on community service history, location, and cause affinity.</p>
            </div>
          </div>
          <span style={{ fontSize: "0.72rem", background: "var(--surface)", border: "1px solid var(--line)", padding: "4px 10px", borderRadius: 999, fontWeight: 600 }}>
            ⚡ Real-time Smart Match
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {recommendations.map(e => (
            <div key={e._id} style={{ background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ height: 120, backgroundImage: `url(${e.image})`, backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
                <span style={{ position: "absolute", top: 8, right: 8, background: "#15803d", color: "#fff", padding: "2px 8px", borderRadius: 999, fontSize: "0.7rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                  <Sparkles size={11} /> {e.aiMatchScore}% Match
                </span>
                <span style={{ position: "absolute", bottom: 8, left: 8, background: "rgba(0,0,0,0.65)", color: "#fff", padding: "2px 8px", borderRadius: 6, fontSize: "0.68rem" }}>
                  {e.category}
                </span>
              </div>
              <div style={{ padding: 14, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h4 style={{ margin: "0 0 6px 0", fontSize: "0.92rem", fontWeight: 700, lineHeight: 1.3 }}>{e.title}</h4>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.72rem", color: "var(--green)", fontWeight: 600 }}>
                    💡 {e.aiReason}
                  </p>
                  <p className="muted" style={{ margin: 0, fontSize: "0.72rem", display: "flex", alignItems: "center", gap: 4 }}>
                    <MapPin size={12} /> {e.location}
                  </p>
                </div>
                <Link href={`/events/${e._id}`} className="btn btn-outline" style={{ marginTop: 12, fontSize: "0.74rem", padding: "6px 10px", justifyContent: "center" }}>
                  View Opportunity <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    <div className="results-line">
      <span>{loading ? "Loading..." : `${filtered.length} opportunities found`}</span>
      <span>
        <MapPin size={14}/> {selectedLocation ? `Filtered by ${selectedLocation}` : selectedDivision === "all" ? "Across All Bangladesh" : `In ${activeDivision.name} (${activeDivision.nameBn})`}
        {(selectedLocation || selectedDivision !== "all") && (
          <button 
            onClick={() => { setSelectedLocation(null); setSelectedDivision("all"); }} 
            style={{ marginLeft: 8, background: "transparent", border: "none", color: "var(--green)", cursor: "pointer", fontSize: ".72rem", textDecoration: "underline" }}
          >
            Reset to All Bangladesh
          </button>
        )}
      </span>
    </div>

    {/* Map Explorer View for Whole Bangladesh */}
    {viewMode === "map" ? (
      <div style={{ marginBottom: 50 }}>
        {/* Division Selection Pills Bar */}
        <div style={{
          background: "var(--panel)",
          border: "1px solid var(--line)",
          borderRadius: 14,
          padding: "12px 16px",
          marginBottom: 18,
          display: "flex",
          alignItems: "center",
          gap: 10,
          overflowX: "auto",
          boxShadow: "0 4px 15px rgba(0,0,0,0.15)"
        }}>
          <span style={{ fontSize: ".75rem", fontWeight: 800, color: "var(--green)", display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap", paddingRight: 8, borderRight: "1px solid var(--line)" }}>
            <Compass size={14} /> SELECT DIVISION:
          </span>

          <div style={{ display: "flex", gap: 8, flexWrap: "nowrap" }}>
            {BANGLADESH_DIVISIONS.map(div => {
              const isSelected = selectedDivision === div.id;
              // Count events matching this division
              const divEventsCount = div.id === "all" 
                ? events.length 
                : events.filter(e => {
                    const keywords = [div.name.toLowerCase(), ...(div.keyAreas || []).map(a => a.name.toLowerCase())];
                    return keywords.some(k => (e.location || "").toLowerCase().includes(k));
                  }).length;

              return (
                <button
                  key={div.id}
                  onClick={() => {
                    setSelectedDivision(div.id);
                    setSelectedLocation(null);
                  }}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 20,
                    border: isSelected ? "1px solid var(--green)" : "1px solid rgba(255,255,255,0.1)",
                    background: isSelected ? "rgba(183, 243, 107, 0.2)" : "rgba(255,255,255,0.03)",
                    color: isSelected ? "var(--green)" : "#cbd5e1",
                    fontSize: ".76rem",
                    fontWeight: isSelected ? 800 : 600,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    whiteSpace: "nowrap",
                    transition: "0.2s"
                  }}
                >
                  <span>{div.flag}</span>
                  <span>{div.name}</span>
                  <span style={{ 
                    fontSize: ".65rem", 
                    opacity: 0.8,
                    background: isSelected ? "var(--green)" : "rgba(255,255,255,0.1)",
                    color: isSelected ? "#14200f" : "#ffffff",
                    padding: "1px 6px",
                    borderRadius: 10,
                    fontWeight: 700
                  }}>
                    {divEventsCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Map & List Split Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 24 }}>
          {/* Interactive OpenStreetMap Container */}
          <div style={{ border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden", height: 530, position: "relative" }}>
            <iframe
              title={`Bangladesh Map - ${activeDivision.name}`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              src={mapSrc}
            />
            {/* Status & Info Overlay */}
            <div style={{
              position: "absolute",
              bottom: 12,
              left: 12,
              right: 12,
              background: "rgba(17, 23, 21, 0.92)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(183, 243, 107, 0.3)",
              borderRadius: 12,
              padding: "10px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: ".75rem",
              flexWrap: "wrap",
              gap: 8
            }}>
              <div>
                <b style={{ color: "#ffffff", display: "flex", alignItems: "center", gap: 6 }}>
                  <span>{activeDivision.flag}</span> {activeDivision.name} ({activeDivision.nameBn})
                </b>
                <span className="muted" style={{ fontSize: ".68rem" }}>
                  {activeDivision.zoomDesc}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ color: "var(--green)", fontWeight: 700 }}>
                  ● {filtered.length} Initiatives Found
                </span>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((selectedLocation || activeDivision.name) + ", Bangladesh")}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ padding: "4px 8px", fontSize: ".68rem", gap: 4 }}
                >
                  Google Maps <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>

          {/* Location Area Selector & Filtered Events Stream */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Areas / Hubs inside active division */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <b style={{ fontSize: ".88rem", display: "flex", alignItems: "center", gap: 6 }}>
                  <Navigation size={14} color="var(--green)" /> 
                  {activeDivision.id === "all" ? "Explore Key Hubs in Bangladesh:" : `Key Areas in ${activeDivision.name}:`}
                </b>
                {selectedLocation && (
                  <button
                    onClick={() => setSelectedLocation(null)}
                    style={{ background: "transparent", border: "none", color: "var(--green)", fontSize: ".72rem", cursor: "pointer", textDecoration: "underline" }}
                  >
                    View All in {activeDivision.name}
                  </button>
                )}
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, maxHeight: 130, overflowY: "auto", paddingRight: 4 }}>
                {activeDivision.keyAreas.map(loc => {
                  const count = events.filter(e => (e.location || "").toLowerCase().includes(loc.name.toLowerCase())).length;
                  const isSelected = selectedLocation === loc.name;
                  return (
                    <button
                      key={loc.name}
                      onClick={() => setSelectedLocation(isSelected ? null : loc.name)}
                      title={loc.desc}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 8,
                        border: `1px solid ${isSelected ? "var(--green)" : "var(--line)"}`,
                        background: isSelected ? "rgba(183, 243, 107, 0.18)" : "var(--panel)",
                        color: isSelected ? "var(--green)" : "var(--text)",
                        fontSize: ".74rem",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        transition: "0.15s"
                      }}
                    >
                      <MapPin size={12} color={isSelected ? "var(--green)" : "var(--muted)"} />
                      <b>{loc.name}</b>
                      <span style={{ 
                        fontSize: ".65rem", 
                        opacity: 0.8,
                        background: isSelected ? "var(--green)" : "rgba(255,255,255,0.08)",
                        color: isSelected ? "#14200f" : "var(--muted)",
                        padding: "1px 5px",
                        borderRadius: 6
                      }}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Event List in Chosen Geographic Zone */}
            <div style={{ flex: 1, overflowY: "auto", maxHeight: 380, display: "grid", gap: 12, paddingRight: 4 }}>
              {filtered.length === 0 ? (
                <div className="empty-state" style={{ padding: "40px 16px", textAlign: "center", border: "1px dashed var(--line)", borderRadius: 12 }}>
                  <MapPin size={32} color="var(--muted)" style={{ margin: "0 auto 10px" }} />
                  <h4 style={{ margin: "0 0 6px" }}>No events found in {selectedLocation || activeDivision.name}</h4>
                  <p className="muted" style={{ fontSize: ".78rem", maxWidth: 300, margin: "0 auto 14px" }}>
                    There are currently no scheduled volunteer initiatives in this area. Would you like to organize one?
                  </p>
                  <Link href="/dashboard/create-event" className="btn btn-outline" style={{ fontSize: ".76rem", padding: "6px 14px" }}>
                    + Create an Event in {selectedLocation || activeDivision.name}
                  </Link>
                </div>
              ) : (
                filtered.map(e => (
                  <div key={e._id} style={{ background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 12, padding: "14px", display: "flex", gap: 14 }}>
                    <div style={{ width: 85, height: 85, borderRadius: 10, backgroundImage: `url(${e.image})`, backgroundSize: "cover", backgroundPosition: "center", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span className="category-pill" style={{ position: "static", fontSize: ".6rem", padding: "2px 8px" }}>{e.category}</span>
                      <h4 style={{ margin: "6px 0 4px", fontSize: ".88rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        <Link href={`/events/${e._id}`}>{e.title}</Link>
                      </h4>
                      <p className="muted" style={{ fontSize: ".7rem", margin: "2px 0", display: "flex", alignItems: "center", gap: 5 }}>
                        <MapPin size={12} color="var(--green)"/> {e.location} · {new Date(e.date).toLocaleDateString()}
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
