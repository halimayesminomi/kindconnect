"use client";

import { Crown, Medal, Trophy, Sparkles, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { PublicLayout } from "@/components/site";
import { useAuth } from "@/components/auth-provider";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

const initialLeaders = [
  { name: "Nusrat Jahan", points: 1280, hours: 86, initials: "NJ", color: "mint", tier: "Community Champion" },
  { name: "Sakib Hasan", points: 1140, hours: 74, initials: "SH", color: "violet", tier: "Impact Builder" },
  { name: "Halima Yesmin Omi", points: 950, hours: 64, initials: "HO", color: "blue", tier: "Impact Builder" },
  { name: "Shraboni Das", points: 750, hours: 50, initials: "SD", color: "mint", tier: "Active Volunteer" },
  { name: "Maliha Rahman", points: 680, hours: 44, initials: "MR", color: "orange", tier: "Active Volunteer" },
  { name: "Tanvir Ahmed", points: 520, hours: 35, initials: "TA", color: "blue", tier: "Active Volunteer" }
];

export default function Leaderboard() {
  const { user } = useAuth();
  const [myPoints, setMyPoints] = useState(0);

  useEffect(() => {
    if (user) {
      api.getMyAttendance()
        .then(res => setMyPoints(res.data?.totalPoints || 0))
        .catch(() => {});
    }
  }, [user]);

  return <PublicLayout><main className="container page-main">
    <div className="page-hero compact">
      <span className="eyebrow">CELEBRATING CHANGEMAKERS</span>
      <h1>Kindness looks good<br/><span className="gradient-text">on everyone.</span></h1>
      <p className="muted">Meet the people dedicating their hours to positive social impact in Bangladesh.</p>
    </div>

    {/* User's Current Score Card if logged in */}
    {user && (
      <div style={{ maxWidth: 800, margin: "0 auto 24px", background: "rgba(183, 243, 107, 0.08)", border: "1px solid var(--green)", borderRadius: 16, padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span className="eyebrow" style={{ fontSize: ".64rem" }}>YOUR STANDING</span>
          <h3 style={{ margin: "4px 0" }}>{user.name}</h3>
          <p className="muted" style={{ fontSize: ".76rem", margin: 0 }}>Verified community check-in score</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <b style={{ fontSize: "1.6rem", color: "var(--green)", display: "block" }}>{myPoints} pts</b>
          <Link href="/dashboard/attendance" className="text-link" style={{ fontSize: ".72rem" }}>
            Check in to earn more <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    )}

    <div className="leaderboard-wrap">
      <div className="leaderboard-head">
        <div>
          <Trophy/>
          <span>
            <b>Community Leaderboard</b>
            <small className="muted">Live points awarded via QR check-ins</small>
          </span>
        </div>
        <span className="period-pill">All time ⌄</span>
      </div>

      {initialLeaders.map((p, i) => (
        <div className={`leader-row ${i === 0 ? "top-leader" : ""}`} key={p.name}>
          <div className="rank">
            {i === 0 ? <Crown size={18}/> : i === 1 ? <Medal size={16} color="#ffd166"/> : i === 2 ? <Medal size={16} color="#63cba4"/> : `0${i + 1}`}
          </div>
          <span className={`avatar avatar-${p.color}`}>{p.initials}</span>
          <div className="leader-name">
            <b>{p.name} {user?.name === p.name && <span style={{ color: "var(--green)", fontSize: ".7rem" }}>(You)</span>}</b>
            <small className="muted">{p.tier}</small>
          </div>
          <div className="leader-hours">
            <b>{p.hours}h</b>
            <small className="muted">Contributed</small>
          </div>
          <div className="leader-points">
            <b>{p.points.toLocaleString()}</b>
            <small className="muted">Impact points</small>
          </div>
        </div>
      ))}
      <p className="muted leaderboard-note">Points are awarded for verified attendance at KindConnect partner events.</p>
    </div>
  </main></PublicLayout>;
}
