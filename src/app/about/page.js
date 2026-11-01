import Link from "next/link";
import { ArrowUpRight, HeartHandshake, Users, Leaf, Compass, GraduationCap, Award, Calendar } from "lucide-react";
import { PublicLayout } from "@/components/site";

export default function About() {
  return <PublicLayout><main className="container page-main">
    <div className="page-hero">
      <span className="eyebrow">A LITTLE ABOUT US</span>
      <h1>Good people.<br/><span className="gradient-text">Good things.</span></h1>
      <p className="muted">KindConnect brings people and purpose together — making it easier to turn good intentions into meaningful community action.</p>
    </div>

    <div className="about-image"/>

    <section className="about-story">
      <div>
        <span className="eyebrow">OUR BELIEF</span>
        <h2>Everyone has<br/>something to give.</h2>
      </div>
      <div>
        <p className="muted">We believe stronger communities are built when people have simple ways to show up for one another. Whether you can give an hour, share a skill, or organize a local event, your contribution matters.</p>
        <p className="muted">KindConnect is designed to make volunteering more accessible, transparent, and rewarding — from discovering opportunities to celebrating the impact created together.</p>
      </div>
    </section>

    {/* Platform Values */}
    <div className="values-grid">
      <div className="value-card">
        <Users/>
        <h3>Belonging</h3>
        <p className="muted">Everyone deserves a place to contribute and feel welcome.</p>
      </div>
      <div className="value-card">
        <HeartHandshake/>
        <h3>Kindness</h3>
        <p className="muted">We lead with empathy, respect, and care for others.</p>
      </div>
      <div className="value-card">
        <Leaf/>
        <h3>Impact</h3>
        <p className="muted">We focus on actions that make a visible difference.</p>
      </div>
      <div className="value-card">
        <Compass/>
        <h3>Trust</h3>
        <p className="muted">Clear information and accountable community action.</p>
      </div>
    </div>

    {/* Academic Assessment & Team Credit Section */}
    <section style={{ margin: "80px 0 20px", background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 20, padding: "40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <GraduationCap size={20} color="var(--green)" />
        <span className="eyebrow" style={{ margin: 0 }}>ACADEMIC PROJECT ASSESSMENT</span>
      </div>
      <h2 style={{ fontSize: "1.9rem", margin: "8px 0 16px" }}>Web Programming Lab · CSE 35+36</h2>
      <p className="muted" style={{ maxWidth: 650, lineHeight: 1.8, fontSize: ".9rem" }}>
        KindConnect was conceptualized and developed as a comprehensive full-stack social development and volunteer management platform for the Web Programming Lab course assessment.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginTop: 28 }}>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--line)", borderRadius: 12, padding: "20px" }}>
          <small className="muted" style={{ display: "block", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: "1px" }}>Team Members</small>
          <b style={{ fontSize: ".9rem", display: "block", marginTop: 6 }}>1. Halima Yesmin Omi</b>
          <span className="muted" style={{ fontSize: ".76rem" }}>ID: 251-112-001</span>
          <b style={{ fontSize: ".9rem", display: "block", marginTop: 10 }}>2. Shraboni Das</b>
          <span className="muted" style={{ fontSize: ".76rem" }}>ID: 251-112-006</span>
        </div>

        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--line)", borderRadius: 12, padding: "20px" }}>
          <small className="muted" style={{ display: "block", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: "1px" }}>Course & Instructor</small>
          <b style={{ fontSize: ".9rem", display: "block", marginTop: 6 }}>Web Programming Lab</b>
          <span className="muted" style={{ fontSize: ".76rem" }}>Section: CSE 35+36</span>
          <b style={{ fontSize: ".9rem", display: "block", marginTop: 10 }}>Mr. Abu Jafar Md. Jakaria</b>
          <span className="muted" style={{ fontSize: ".76rem" }}>Course Instructor</span>
        </div>

        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--line)", borderRadius: 12, padding: "20px" }}>
          <small className="muted" style={{ display: "block", fontSize: ".7rem", textTransform: "uppercase", letterSpacing: "1px" }}>Project Timeline</small>
          <b style={{ fontSize: ".9rem", display: "block", marginTop: 6 }}>Submission Date</b>
          <span className="muted" style={{ fontSize: ".76rem" }}>06 November 2026</span>
          <b style={{ fontSize: ".9rem", display: "block", marginTop: 10 }}>Technology Stack</b>
          <span className="muted" style={{ fontSize: ".76rem" }}>Next.js 15, Express.js, MongoDB Atlas</span>
        </div>
      </div>
    </section>

    <div className="center-cta">
      <h2>Find your way to make a difference.</h2>
      <Link href="/events" className="btn btn-primary">Explore events <ArrowUpRight size={16}/></Link>
    </div>
  </main></PublicLayout>;
}
