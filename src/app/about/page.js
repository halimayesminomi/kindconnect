"use client";

import Link from "next/link";
import { ArrowUpRight, HeartHandshake, Users, Leaf, Compass, GraduationCap } from "lucide-react";
import { PublicLayout } from "@/components/site";
import { useSite } from "@/components/site-provider";

export default function About() {
  const { lang, t } = useSite();

  return <PublicLayout><main className="container page-main">
    <div className="page-hero">
      <span className="eyebrow">{t("aboutEyebrow")}</span>
      <h1>
        {lang === "bn" ? (
          <>ভালো মানুষ। <br/><span className="gradient-text">ভালো কাজ।</span></>
        ) : (
          <>Good people.<br/><span className="gradient-text">Good things.</span></>
        )}
      </h1>
      <p className="muted">{t("aboutDesc")}</p>
    </div>

    <div className="about-image"/>

    <section className="about-story">
      <div>
        <span className="eyebrow">{t("ourBelief")}</span>
        <h2>
          {lang === "bn" ? (
            <>সবারই দেওয়ার মতো<br/>কিছু না কিছু আছে।</>
          ) : (
            <>Everyone has<br/>something to give.</>
          )}
        </h2>
      </div>
      <div>
        <p className="muted">{t("beliefDesc1")}</p>
        <p className="muted">{t("beliefDesc2")}</p>
      </div>
    </section>

    {/* Platform Values */}
    <div className="values-grid">
      <div className="value-card">
        <Users/>
        <h3>{t("valBelonging")}</h3>
        <p className="muted">{t("valBelongingDesc")}</p>
      </div>
      <div className="value-card">
        <HeartHandshake/>
        <h3>{t("valKindness")}</h3>
        <p className="muted">{t("valKindnessDesc")}</p>
      </div>
      <div className="value-card">
        <Leaf/>
        <h3>{t("valImpact")}</h3>
        <p className="muted">{t("valImpactDesc")}</p>
      </div>
      <div className="value-card">
        <Compass/>
        <h3>{t("valTrust")}</h3>
        <p className="muted">{t("valTrustDesc")}</p>
      </div>
    </div>

    {/* Academic Assessment & Team Credit Section */}
    <section style={{ margin: "80px 0 20px", background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 20, padding: "40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <GraduationCap size={20} color="var(--green)" />
        <span className="eyebrow" style={{ margin: 0 }}>
          {lang === "bn" ? "একাডেমিক প্রকল্প" : "ACADEMIC PROJECT"}
        </span>
      </div>
      <h2 style={{ fontSize: "1.9rem", margin: "8px 0 16px" }}>CSE 36 (EVE) Metropolitan University</h2>
      <p className="muted" style={{ maxWidth: 650, lineHeight: 1.8, fontSize: ".9rem" }}>
        {lang === "bn" 
          ? "কাইন্ডকানেক্ট একটি আধুনিক ফুল-স্ট্যাক সোশ্যাল ডেভেলপমেন্ট ও ভলান্টিয়ার ম্যানেজমেন্ট প্ল্যাটফর্ম হিসেবে উদ্ভাবিত ও বাস্তবায়িত হয়েছে।"
          : "KindConnect was conceptualized and developed as a comprehensive full-stack social development and volunteer management platform."}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginTop: 28 }}>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--line)", borderRadius: 12, padding: "20px" }}>
          <small className="muted" style={{ display: "block", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: "1px" }}>
            {lang === "bn" ? "টিম সদস্য" : "Team Members"}
          </small>
          <b style={{ fontSize: ".9rem", display: "block", marginTop: 6 }}>Halima Yesmin Omi</b>
          <span className="muted" style={{ fontSize: ".76rem" }}>ID: 251-112-001</span>
          <b style={{ fontSize: ".9rem", display: "block", marginTop: 10 }}>Shraboni Das</b>
          <span className="muted" style={{ fontSize: ".76rem" }}>ID: 251-112-006</span>
        </div>

        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--line)", borderRadius: 12, padding: "20px" }}>
          <small className="muted" style={{ display: "block", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: "1px" }}>
            {lang === "bn" ? "প্রতিষ্ঠান ও শিক্ষক" : "Institution & Instructor"}
          </small>
          <b style={{ fontSize: ".9rem", display: "block", marginTop: 6 }}>Metropolitan University</b>
          <span className="muted" style={{ fontSize: ".76rem" }}>CSE 36 (EVE)</span>
          <b style={{ fontSize: ".9rem", display: "block", marginTop: 10 }}>Mr. Abu Jafar Md. Jakaria</b>
          <span className="muted" style={{ fontSize: ".76rem" }}>{lang === "bn" ? "কোর্স ইনস্ট্রাক্টর" : "Course Instructor"}</span>
        </div>

        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--line)", borderRadius: 12, padding: "20px" }}>
          <small className="muted" style={{ display: "block", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: "1px" }}>
            {lang === "bn" ? "প্রকল্প বিস্তারিত" : "Project Details"}
          </small>
          <b style={{ fontSize: ".9rem", display: "block", marginTop: 6 }}>{lang === "bn" ? "নির্মাতা" : "Creator"}</b>
          <span className="muted" style={{ fontSize: ".76rem" }}>Halima Yesmin Omi</span>
          <b style={{ fontSize: ".9rem", display: "block", marginTop: 10 }}>{lang === "bn" ? "প্রযুক্তি স্ট্যাক" : "Technology Stack"}</b>
          <span className="muted" style={{ fontSize: ".76rem" }}>Next.js 15, Express.js, MongoDB Atlas</span>
        </div>
      </div>
    </section>

    <div className="center-cta">
      <h2>{lang === "bn" ? "আজই যুক্ত হয়ে সমাজে ইতিবাচক ভূমিকা রাখুন।" : "Find your way to make a difference."}</h2>
      <Link href="/events" className="btn btn-primary">{t("exploreEvents")} <ArrowUpRight size={16}/></Link>
    </div>
  </main></PublicLayout>;
}
