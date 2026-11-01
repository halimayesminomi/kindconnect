"use client";

import Link from "next/link";
import { ArrowUpRight, Clock3, HeartHandshake, Sprout, Users, Shirt, BookOpen, Utensils, TreePine } from "lucide-react";
import { PublicLayout } from "@/components/site";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const monthlyData = [
  { month: "Jun", hours: 620, volunteers: 140 },
  { month: "Jul", hours: 890, volunteers: 210 },
  { month: "Aug", hours: 1240, volunteers: 320 },
  { month: "Sep", hours: 1680, volunteers: 410 },
  { month: "Oct", hours: 2150, volunteers: 520 },
  { month: "Nov", hours: 2840, volunteers: 680 },
];

const categoryData = [
  { name: "Environment", events: 48, volunteers: 620, fill: "#b7f36b" },
  { name: "Education", events: 36, volunteers: 480, fill: "#63cba4" },
  { name: "Community", events: 52, volunteers: 710, fill: "#8bd34b" },
  { name: "Health", events: 26, volunteers: 340, fill: "#ffd166" },
  { name: "Animals", events: 22, volunteers: 250, fill: "#b8b0db" },
];

export default function Impact() {
  const [eventCount, setEventCount] = useState(0);
  const [totalVolunteers, setTotalVolunteers] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    api.getEvents("all=true").then(res => {
      const events = res.data || [];
      setEventCount(events.length);
      setTotalVolunteers(events.reduce((a, e) => a + (e.volunteersCount || 0), 0));
    }).catch(() => {});
  }, []);

  const stats = [
    { icon: Users, value: totalVolunteers > 0 ? `${totalVolunteers}+` : "2,400+", label: "People taking action" },
    { icon: HeartHandshake, value: eventCount > 0 ? eventCount : "180", label: "Community events" },
    { icon: Clock3, value: "12,500+", label: "Volunteer hours" },
    { icon: Sprout, value: "32", label: "Partner communities" },
  ];

  return <PublicLayout><main className="container page-main">
    <div className="page-hero">
      <span className="eyebrow">THE DIFFERENCE WE MAKE</span>
      <h1>Impact is better<br/><span className="gradient-text">when it is shared.</span></h1>
      <p className="muted">Every hour given, every event supported, every connection made — it all adds up.</p>
    </div>

    {/* Top Summary Stats */}
    <div className="impact-stats-grid">
      {stats.map(({ icon: Icon, value, label }) => (
        <div className="impact-stat" key={label}>
          <Icon/>
          <strong>{value}</strong>
          <span className="muted">{label}</span>
        </div>
      ))}
    </div>

    {/* Verified Tangible Outcomes */}
    <section style={{ margin: "70px 0 30px" }}>
      <div style={{ textAlign: "center", marginBottom: 35 }}>
        <span className="eyebrow">COMMUNITY OUTCOMES</span>
        <h2 style={{ margin: "10px 0" }}>Real Results, Verified on the Ground.</h2>
        <p className="muted" style={{ maxWidth: 540, margin: "0 auto" }}>Direct social contributions submitted by organizers and verified by platform coordinators.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <div style={{ background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 14, padding: "24px", textAlign: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(183, 243, 107, 0.15)", color: "var(--green)", display: "grid", placeItems: "center", margin: "0 auto 14px" }}>
            <TreePine size={22} />
          </div>
          <strong style={{ fontSize: "2rem", display: "block", fontFamily: "var(--font-heading)" }}>4,250+</strong>
          <b style={{ fontSize: ".85rem", display: "block", marginTop: 4 }}>Trees Planted</b>
          <small className="muted" style={{ fontSize: ".72rem" }}>Hatirjheel, Uttara & Mirpur urban greening</small>
        </div>

        <div style={{ background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 14, padding: "24px", textAlign: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(99, 203, 164, 0.15)", color: "#63cba4", display: "grid", placeItems: "center", margin: "0 auto 14px" }}>
            <Shirt size={22} />
          </div>
          <strong style={{ fontSize: "2rem", display: "block", fontFamily: "var(--font-heading)" }}>1,840+</strong>
          <b style={{ fontSize: ".85rem", display: "block", marginTop: 4 }}>Warm Clothes & Blankets</b>
          <small className="muted" style={{ fontSize: ".72rem" }}>Distributed to families in seasonal relief drives</small>
        </div>

        <div style={{ background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 14, padding: "24px", textAlign: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255, 209, 102, 0.15)", color: "#ffd166", display: "grid", placeItems: "center", margin: "0 auto 14px" }}>
            <Utensils size={22} />
          </div>
          <strong style={{ fontSize: "2rem", display: "block", fontFamily: "var(--font-heading)" }}>6,700+</strong>
          <b style={{ fontSize: ".85rem", display: "block", marginTop: 4 }}>Nutritious Meals Served</b>
          <small className="muted" style={{ fontSize: ".72rem" }}>Community kitchens and weekend relief packs</small>
        </div>

        <div style={{ background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 14, padding: "24px", textAlign: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(184, 176, 219, 0.15)", color: "#b8b0db", display: "grid", placeItems: "center", margin: "0 auto 14px" }}>
            <BookOpen size={22} />
          </div>
          <strong style={{ fontSize: "2rem", display: "block", fontFamily: "var(--font-heading)" }}>3,120+</strong>
          <b style={{ fontSize: ".85rem", display: "block", marginTop: 4 }}>Educational Books Collected</b>
          <small className="muted" style={{ fontSize: ".72rem" }}>Shared with 14 community learning corners</small>
        </div>
      </div>
    </section>

    {/* Visual Recharts Analytics Dashboard */}
    {mounted && (
      <section style={{ margin: "60px 0" }}>
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <span className="eyebrow">VISUAL ANALYTICS</span>
          <h2 style={{ margin: "10px 0" }}>Platform Growth & Participation Insights</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
          {/* Monthly Growth Area Chart */}
          <div style={{ background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 16, padding: "24px" }}>
            <div style={{ marginBottom: 18 }}>
              <b style={{ fontSize: "0.95rem" }}>Volunteer Hours Contributed (2026)</b>
              <small className="muted" style={{ display: "block", fontSize: ".72rem" }}>Monthly cumulative volunteer hours</small>
            </div>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="hourGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#b7f36b" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#b7f36b" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#68776d" fontSize={12} tickLine={false} />
                  <YAxis stroke="#68776d" fontSize={12} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: "#111715", border: "1px solid #26312b", borderRadius: 8, color: "#fff", fontSize: "0.78rem" }}
                  />
                  <Area type="monotone" dataKey="hours" stroke="#b7f36b" strokeWidth={2.5} fillOpacity={1} fill="url(#hourGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution Bar Chart */}
          <div style={{ background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 16, padding: "24px" }}>
            <div style={{ marginBottom: 18 }}>
              <b style={{ fontSize: "0.95rem" }}>Volunteers by Cause</b>
              <small className="muted" style={{ display: "block", fontSize: ".72rem" }}>Total volunteer spots filled per category</small>
            </div>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#68776d" fontSize={11} tickLine={false} />
                  <YAxis stroke="#68776d" fontSize={12} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: "#111715", border: "1px solid #26312b", borderRadius: 8, color: "#fff", fontSize: "0.78rem" }}
                  />
                  <Bar dataKey="volunteers" radius={[6, 6, 0, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
    )}

    {/* Feature Section */}
    <div className="impact-feature">
      <div className="impact-feature-photo"/>
      <div>
        <span className="eyebrow">FROM SMALL ACTIONS</span>
        <h2>To stronger<br/>communities.</h2>
        <p className="muted">Our community brings together volunteers, organizers, and local partners to make positive action easier to find and easier to join.</p>
        <Link href="/events" className="text-link">Find your next opportunity <ArrowUpRight size={16}/></Link>
      </div>
    </div>

    <div className="center-cta">
      <h2>Your time can be part of the story.</h2>
      <Link href="/register" className="btn btn-primary">Become a volunteer <ArrowUpRight size={16}/></Link>
    </div>
  </main></PublicLayout>;
}
