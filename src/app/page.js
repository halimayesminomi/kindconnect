"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Heart, Leaf, Sparkles, Users, Globe2, Mail, Send, Camera } from "lucide-react";
import { PublicLayout, SectionHeading } from "@/components/site";
import { EventCard } from "@/components/cards";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useSite } from "@/components/site-provider";
import { FALLBACK_EVENTS } from "@/lib/fallbackData";
import toast from "react-hot-toast";

const GALLERY_ITEMS = [
  {
    title: "Tree Plantation Drive",
    location: "Hatirjheel, Dhaka",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80",
    tag: "Environment"
  },
  {
    title: "Winter Clothes Distribution",
    location: "Old Dhaka",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80",
    tag: "Relief"
  },
  {
    title: "Neighborhood Clean-Up",
    location: "Mirpur Community",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
    tag: "Civic Action"
  },
  {
    title: "Books for Brighter Futures",
    location: "Dhanmondi School",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
    tag: "Education"
  },
  {
    title: "Animal Care & Shelter Support",
    location: "Bashundhara Rescue",
    image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=800&q=80",
    tag: "Animals"
  },
  {
    title: "Health & Nutrition Day",
    location: "Banani Health Center",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    tag: "Health"
  }
];

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const { lang, t } = useSite();

  useEffect(() => {
    let isMounted = true;
    api.getRecentEvents()
      .then(res => {
        if (!isMounted) return;
        if (res?.data && res.data.length > 0) {
          setEvents(res.data);
        } else {
          setEvents(FALLBACK_EVENTS.slice(0, 6));
        }
      })
      .catch(() => {
        if (!isMounted) return;
        // Fall back gracefully to community events if backend is unreachable or starting up
        setEvents(FALLBACK_EVENTS.slice(0, 6));
      })
      .finally(() => {
        if (isMounted) setLoadingEvents(false);
      });

    return () => { isMounted = false; };
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubscribing(true);
    setTimeout(() => {
      toast.success("Thank you for joining our community newsletter! 💌");
      setNewsletterEmail("");
      setSubscribing(false);
    }, 600);
  };

  return <PublicLayout>
    <main>
      {/* Hero Banner */}
      <section className="hero container">
        <div className="hero-copy">
          <span className="eyebrow"><span className="live-dot"/> {t("heroEyebrow")}</span>
          <h1>
            {lang === "bn" ? (
              <>আপনার সময়কে করুন <br/><span className="gradient-text">অর্থপূর্ণ।</span></>
            ) : (
              <>Make your time<br/>mean <span className="gradient-text">something.</span></>
            )}
          </h1>
          <p className="hero-description">{t("heroDesc")}</p>
          <div className="hero-actions">
            <Link href="/events" className="btn btn-primary btn-large">
              {t("heroCta")} <ArrowUpRight size={18}/>
            </Link>
            <Link href="/about" className="btn btn-ghost btn-large">
              {t("heroMission")}
            </Link>
          </div>
          <div className="hero-social-proof">
            <div className="avatar-stack"><span>NJ</span><span>SH</span><span>MR</span><span>TA</span></div>
            <div>
              <b>2,400+ changemakers</b>
              <small className="muted">already making a difference in Bangladesh</small>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-photo" role="img" aria-label="Volunteers working together" />
          <div className="floating-card float-top">
            <span className="float-icon"><Heart size={17}/></span>
            <div><b>One act of kindness</b><small className="muted">can change everything</small></div>
          </div>
          <div className="floating-card float-bottom">
            <div className="mini-avatars"><span>N</span><span>A</span><span>R</span></div>
            <div><b>38 people joined</b><small className="muted">Green City, Clean City</small></div>
            <span className="float-check">✓</span>
          </div>
          <div className="hero-orbit">✳</div>
        </div>
      </section>

      {/* Impact Strip */}
      <section className="impact-strip">
        <div className="container impact-strip-grid">
          <div><span className="strip-number">2.4k<span>+</span></span><small>{t("volunteers")}</small></div>
          <div><span className="strip-number">180</span><small>{t("eventsLabel")}</small></div>
          <div><span className="strip-number">12k<span>+</span></span><small>{t("hoursLabel")}</small></div>
          <div><span className="strip-number">32</span><small>{t("communitiesLabel")}</small></div>
        </div>
      </section>

      {/* 6 Recent Upcoming Events Loaded Dynamically */}
      <section className="section container">
        <SectionHeading 
          eyebrow="FIND YOUR PURPOSE" 
          title="Upcoming Community Opportunities" 
          description="Explore dynamic volunteer initiatives across Sylhet, Dhaka and all of Bangladesh to find the cause that speaks to you." 
          action={<Link className="text-link" href="/events">View all events <ArrowRight size={16}/></Link>}
        />
        <div className="event-grid">
          {loadingEvents ? (
            [1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="event-card" style={{ minHeight: 320, display: "grid", placeItems: "center", opacity: 0.4 }}>
                <p className="muted">Loading opportunity...</p>
              </div>
            ))
          ) : events.length > 0 ? (
            events.slice(0, 6).map(e => <EventCard key={e._id || e.id} event={{ ...e, id: e._id || e.id }} />)
          ) : (
            FALLBACK_EVENTS.slice(0, 6).map(e => <EventCard key={e._id || e.id} event={{ ...e, id: e._id || e.id }} />)
          )}
        </div>
      </section>

      {/* Static Event Action Gallery */}
      <section className="section" style={{ background: "var(--panel)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", padding: "80px 0" }}>
        <div className="container">
          <SectionHeading 
            eyebrow="MOMENTS OF IMPACT" 
            title="Static Community Gallery" 
            description="A glimpse into recent grassroots drives organized by kind volunteers across neighborhoods."
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
            {GALLERY_ITEMS.map((item, idx) => (
              <div 
                key={idx} 
                style={{
                  position: "relative",
                  height: 240,
                  borderRadius: 16,
                  overflow: "hidden",
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
                }}
              >
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%)" }} />
                <span className="category-pill" style={{ position: "absolute", top: 14, left: 14 }}>
                  {item.tag}
                </span>
                <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
                  <b style={{ color: "#ffffff", fontSize: "1.05rem", display: "block" }}>{item.title}</b>
                  <small style={{ color: "rgba(255,255,255,0.75)", fontSize: ".76rem", display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
                    <Camera size={13} color="var(--green)" /> {item.location}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container mission-grid">
          <div className="mission-visual">
            <div className="mission-photo"/>
            <div className="mission-note">
              <Sparkles size={18}/>
              <span><b>Small steps.</b><br/>Big impact.</span>
            </div>
          </div>
          <div className="mission-copy">
            <span className="eyebrow">WHY KINDCONNECT</span>
            <h2>Because change<br/>starts <span className="gradient-text">together.</span></h2>
            <p className="muted">We make it easier for people who care to find each other, take action, and see the difference they make.</p>
            <div className="value-list">
              <div>
                <span className="value-icon"><Users size={18}/></span>
                <span><b>People-powered</b><small className="muted">A welcoming space for every changemaker.</small></span>
              </div>
              <div>
                <span className="value-icon"><Leaf size={18}/></span>
                <span><b>Purpose-led</b><small className="muted">Real opportunities. Real community impact.</small></span>
              </div>
              <div>
                <span className="value-icon"><Globe2 size={18}/></span>
                <span><b>Locally connected</b><small className="muted">Start where you are and grow from there.</small></span>
              </div>
            </div>
            <Link href="/about" className="btn btn-outline">Our story <ArrowUpRight size={16}/></Link>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription Design */}
      <section className="section container" style={{ paddingBottom: 40 }}>
        <div style={{
          background: "linear-gradient(135deg, #132218 0%, #17241c 60%, #0d1712 100%)",
          border: "1px solid #41553c",
          borderRadius: 22,
          padding: "50px 40px",
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          alignItems: "center",
          gap: 30
        }}>
          <div>
            <span className="eyebrow" style={{ color: "var(--green)" }}>STAY INFORMED</span>
            <h2 style={{ fontSize: "2.2rem", margin: "10px 0 8px" }}>Subscribe to Community Updates</h2>
            <p className="muted" style={{ margin: 0, fontSize: ".9rem" }}>
              Get weekly highlights on emergency relief drives, tree plantation drives, and volunteer stories in your neighborhood.
            </p>
          </div>

          <form onSubmit={handleSubscribe} style={{ display: "flex", gap: 10 }}>
            <div className="input-wrap" style={{ flex: 1, background: "rgba(0,0,0,0.3)" }}>
              <Mail size={18} />
              <input 
                type="email" 
                placeholder="Enter your email address..." 
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={subscribing} style={{ padding: "0 20px" }}>
              {subscribing ? "Subscribing..." : "Subscribe"} {!subscribing && <Send size={15}/>}
            </button>
          </form>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section container" style={{ paddingTop: 20 }}>
        <div className="cta-banner">
          <div>
            <span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
            <h2>Ready to be part of<br/>something good?</h2>
            <p>One hour, one day, one action. It all counts.</p>
          </div>
          <Link href="/register" className="btn btn-primary btn-large">
            Join the community <ArrowUpRight size={18}/>
          </Link>
          <div className="cta-spark">✳</div>
        </div>
      </section>
    </main>
  </PublicLayout>;
}
