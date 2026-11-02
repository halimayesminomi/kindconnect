"use client";

import { useRouter } from "next/navigation";
import { ArrowUpRight, MapPin, Sparkles } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

const categories = ["Environment", "Education", "Community", "Health", "Animals", "Emergency", "Other"];

const BANGLADESH_LOCATION_PRESETS = [
  { label: "Metropolitan University, Sylhet", value: "Metropolitan University (Bateshwar), Sylhet" },
  { label: "Zindabazar, Sylhet", value: "Zindabazar, Sylhet" },
  { label: "Amberkhana, Sylhet", value: "Amberkhana, Sylhet" },
  { label: "Tilagarh, Sylhet", value: "Tilagarh, Sylhet" },
  { label: "Shahjalal Uposhohor, Sylhet", value: "Shahjalal Uposhohor, Sylhet" },
  { label: "Sreemangal, Sylhet", value: "Sreemangal, Moulvibazar, Sylhet" },
  { label: "Uttara, Dhaka", value: "Uttara, Dhaka" },
  { label: "Dhanmondi, Dhaka", value: "Dhanmondi, Dhaka" },
  { label: "Mirpur, Dhaka", value: "Mirpur, Dhaka" },
  { label: "GEC Circle, Chattogram", value: "GEC Circle, Chattogram" },
  { label: "Shaheb Bazar, Rajshahi", value: "Shaheb Bazar, Rajshahi" },
  { label: "Khulna City", value: "Khulna City" },
];

export default function CreateEvent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [locationValue, setLocationValue] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      title: form.title.value.trim(),
      description: form.description.value.trim(),
      category: form.category.value,
      image: form.image.value.trim(),
      location: (locationValue || form.location.value).trim(),
      date: form.date.value,
      time: form.time.value.trim(),
      capacity: Number(form.capacity.value),
    };

    if (!data.title || !data.description || !data.category || !data.image || !data.location || !data.date || !data.time || !data.capacity) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (new Date(data.date) <= new Date()) {
      toast.error("Event date must be in the future.");
      return;
    }
    if (data.capacity < 1) {
      toast.error("Capacity must be at least 1.");
      return;
    }

    setLoading(true);
    try {
      await api.createEvent(data);
      toast.success("Event created successfully! 🎉");
      router.push("/dashboard/events");
    } catch (err) {
      toast.error(err.message || "Failed to create event.");
    } finally {
      setLoading(false);
    }
  };

  return <>
    <div className="dash-heading">
      <div>
        <span className="eyebrow">MAKE AN IMPACT</span>
        <h1>Create an event</h1>
        <p className="muted">Organize a community activity across Sylhet, Dhaka or anywhere in Bangladesh.</p>
      </div>
    </div>
    <div className="panel" style={{maxWidth:720}}>
      <form onSubmit={handleSubmit}>
        <label style={{display:"block",fontSize:".76rem",fontWeight:700,margin:"15px 0 7px"}}>Event title</label>
        <div className="input-wrap"><input name="title" placeholder="e.g. Green City, Clean Sylhet" required/></div>

        <label style={{display:"block",fontSize:".76rem",fontWeight:700,margin:"15px 0 7px"}}>Description</label>
        <textarea name="description" placeholder="Describe your event, what volunteers will do, and what to expect..." required style={{width:"100%",minHeight:120,padding:"13px",border:"1px solid var(--line)",borderRadius:"9px",background:"var(--panel)",color:"var(--text)",fontSize:".83rem",fontFamily:"inherit",resize:"vertical",outline:"none"}}/>

        <label style={{display:"block",fontSize:".76rem",fontWeight:700,margin:"15px 0 7px"}}>Category</label>
        <select name="category" required style={{width:"100%",height:48,padding:"0 13px",border:"1px solid var(--line)",borderRadius:"9px",background:"var(--panel)",color:"var(--text)",fontSize:".83rem",outline:"none"}}>
          <option value="">Select a category</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <label style={{display:"block",fontSize:".76rem",fontWeight:700,margin:"15px 0 7px"}}>Thumbnail image URL</label>
        <div className="input-wrap"><input name="image" type="url" placeholder="https://images.unsplash.com/..." required/></div>

        <label style={{display:"block",fontSize:".76rem",fontWeight:700,margin:"15px 0 7px"}}>
          Location (Any area across Bangladesh)
        </label>
        <div className="input-wrap">
          <input 
            name="location" 
            placeholder="e.g. Metropolitan University, Sylhet or Uttara, Dhaka" 
            value={locationValue}
            onChange={(e) => setLocationValue(e.target.value)}
            required
          />
        </div>

        {/* Quick Location Presets for Sylhet & Bangladesh */}
        <div style={{ marginTop: 8, marginBottom: 16 }}>
          <span style={{ fontSize: ".7rem", color: "var(--muted)", display: "block", marginBottom: 6 }}>
            💡 Quick Select Common Volunteer Hubs (Sylhet & All Bangladesh):
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {BANGLADESH_LOCATION_PRESETS.map((preset, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setLocationValue(preset.value)}
                style={{
                  background: locationValue === preset.value ? "rgba(183, 243, 107, 0.2)" : "rgba(255,255,255,0.04)",
                  border: locationValue === preset.value ? "1px solid var(--green)" : "1px solid rgba(255,255,255,0.1)",
                  color: locationValue === preset.value ? "var(--green)" : "#cbd5e1",
                  padding: "4px 9px",
                  borderRadius: 6,
                  fontSize: ".7rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4
                }}
              >
                <MapPin size={11} color={locationValue === preset.value ? "var(--green)" : "var(--muted)"} />
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:15}}>
          <div>
            <label style={{display:"block",fontSize:".76rem",fontWeight:700,margin:"15px 0 7px"}}>Date</label>
            <div className="input-wrap"><input name="date" type="date" required style={{colorScheme:"dark"}}/></div>
          </div>
          <div>
            <label style={{display:"block",fontSize:".76rem",fontWeight:700,margin:"15px 0 7px"}}>Time</label>
            <div className="input-wrap"><input name="time" placeholder="e.g. 08:00 AM" required/></div>
          </div>
          <div>
            <label style={{display:"block",fontSize:".76rem",fontWeight:700,margin:"15px 0 7px"}}>Capacity</label>
            <div className="input-wrap"><input name="capacity" type="number" min="1" placeholder="e.g. 50" required/></div>
          </div>
        </div>

        <div style={{display:"flex",gap:12,marginTop:28}}>
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Creating..." : "Create event"} {!loading && <ArrowUpRight size={17}/>}</button>
          <button className="btn btn-ghost" type="button" onClick={() => router.back()}>Cancel</button>
        </div>
      </form>
    </div>
  </>;
}
