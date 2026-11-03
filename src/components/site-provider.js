"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./auth-provider";

export const translations = {
  en: {
    // Navigation
    exploreEvents: "Explore Events",
    emergencyRelief: "Emergency Relief",
    about: "About",
    ourImpact: "Our Impact",
    leaderboard: "Leaderboard",
    login: "Log in",
    joinCommunity: "Join community",
    getStarted: "Get started",
    dashboard: "Dashboard",
    logout: "Logout",
    liveChat: "Live Chat",
    adminPanel: "Admin Panel",
    myEvents: "My Events",
    myJoined: "Joined Events",
    qrAttendance: "QR Attendance",
    certificates: "Certificates",
    workspace: "Workspace",
    newEvent: "New Event",
    notifications: "Notifications",
    markAllRead: "Mark all read",
    noNotifs: "No notifications yet",
    needHand: "Need a hand?",
    needHandDesc: "We're here to help you make an impact.",
    getSupport: "Get support ↗",
    backToWebsite: "Back to website",

    // Home Page Hero
    heroEyebrow: "A COMMUNITY THAT CARES",
    heroTitle: "Make your time mean something.",
    heroDesc: "Find your people. Give your time. Create real change in the communities that need it most.",
    heroCta: "Explore opportunities",
    heroMission: "Discover our mission",
    volunteers: "Active volunteers",
    eventsLabel: "Community events",
    hoursLabel: "Volunteer hours",
    communitiesLabel: "Partner communities",

    // Home Page Sections
    upcomingEyebrow: "FIND YOUR PURPOSE",
    upcomingTitle: "Upcoming Community Opportunities",
    upcomingDesc: "Explore dynamic volunteer initiatives across Sylhet, Dhaka and all of Bangladesh to find the cause that speaks to you.",
    viewAllEvents: "View all events",
    momentsImpact: "MOMENTS OF IMPACT",
    staticGallery: "Static Community Gallery",
    staticGalleryDesc: "A glimpse into recent grassroots drives organized by kind volunteers across neighborhoods.",
    smallSteps: "Small steps. Big impact.",
    togetherWeCan: "Together, we turn everyday kindness into lasting community change.",
    readyToHelp: "Ready to lend a hand?",
    joinThousands: "Join thousands of changemakers making their neighborhoods cleaner, greener, and more supportive.",
    newsletterTitle: "Stay in the loop",
    newsletterDesc: "Get weekly updates on new volunteer drives in your division.",
    subscribeBtn: "Subscribe",

    // Events Page
    eventsEyebrow: "MAKE YOUR NEXT MOVE",
    eventsTitle: "Find an opportunity across Bangladesh",
    eventsDesc: "সিলেট, ঢাকাসহ বাংলাদেশের প্রতিটি বিভাগের সামাজিক ও মানবিক উদ্যোগ এক প্ল্যাটফর্মে।",
    searchPlaceholder: "Search events by title, division or location (e.g. Sylhet, Dhaka, Zindabazar)...",
    viewGrid: "Grid",
    viewMap: "🇧🇩 Bangladesh Map Explorer",
    aiSmartTitle: "AI Recommended For You",
    aiSmartDesc: "Personalized recommendations based on community service history, location, and cause affinity.",
    realtimeSmartMatch: "⚡ Real-time Smart Match",
    viewOpportunity: "View Opportunity",
    opportunitiesFound: "opportunities found",
    acrossAllBangladesh: "Across All Bangladesh",
    filteredBy: "Filtered by",
    resetAllBangladesh: "Reset to All Bangladesh",
    noEventsFound: "No events found",
    noEventsDesc: "Try a different keyword, category, or location filter.",
    catAll: "All",
    catEnvironment: "Environment",
    catEducation: "Education",
    catCommunity: "Community",
    catHealth: "Health",
    catAnimals: "Animals",
    catEmergency: "Emergency",
    catOther: "Other",

    // Emergency Page
    emergencyEyebrow: "CRITICAL COMMUNITY AID",
    emergencyTitle: "Community Emergency Relief Hub",
    emergencyDesc: "Urgent grassroots community appeals. Respond directly or mobilize your network to provide life-saving assistance.",
    postAppeal: "Post Emergency Appeal",
    allCategories: "All Categories",
    openRequestsFound: "verified open emergency requests requiring immediate assistance",
    verifiedAppeal: "Verified Citizen Appeal",
    urgencyCritical: "CRITICAL",
    urgencyHigh: "HIGH URGENCY",
    urgencyMedium: "MODERATE",
    callDirect: "Call Directly",
    joinRelief: "Volunteer & Help",
    joinedSoFar: "volunteers responded",

    // About Page
    aboutEyebrow: "A LITTLE ABOUT US",
    aboutTitle: "Good people. Good things.",
    aboutDesc: "KindConnect brings people and purpose together — making it easier to turn good intentions into meaningful community action.",
    ourBelief: "OUR BELIEF",
    beliefTitle: "Everyone has something to give.",
    beliefDesc1: "We believe stronger communities are built when people have simple ways to show up for one another. Whether you can give an hour, share a skill, or organize a local event, your contribution matters.",
    beliefDesc2: "KindConnect is designed to make volunteering more accessible, transparent, and rewarding — from discovering opportunities to celebrating the impact created together.",
    valBelonging: "Belonging",
    valBelongingDesc: "Everyone deserves a place to contribute and feel welcome.",
    valKindness: "Kindness",
    valKindnessDesc: "We lead with empathy, respect, and care for others.",
    valImpact: "Impact",
    valImpactDesc: "We focus on actions that make a visible difference.",
    valTrust: "Trust",
    valTrustDesc: "Clear information and accountable community action.",

    // Impact Page
    impactHeroEyebrow: "MEASURING WHAT MATTERS",
    impactHeroTitle: "Real people. Real progress.",
    impactHeroDesc: "Every hour given and every event organized creates ripple effects across neighborhoods.",
    impactStats: "OUR COLLECTIVE IMPACT",
    storiesSection: "STORIES OF CHANGE",

    // Leaderboard Page
    leaderboardHeroEyebrow: "RECOGNIZING DEDICATION",
    leaderboardHeroTitle: "Top Community Leaders",
    leaderboardHeroDesc: "Celebrating the individuals whose time, energy, and commitment inspire everyone around them.",
    allTimeLeaders: "All-Time Impact Leaders",
    monthlyActive: "This Month",
    rank: "Rank",
    volunteer: "Volunteer",
    points: "Points",
    hours: "Hours",

    // Auth Pages
    signInTitle: "Welcome back.",
    signInSubtitle: "Sign in to continue making a difference.",
    signUpTitle: "Create your account.",
    signUpSubtitle: "A few details and you're ready to make a difference.",
    emailOrUsername: "Email address or Username",
    passwordLabel: "Password",
    fullNameLabel: "Full name",
    photoUrlLabel: "Photo URL (optional)",
    rememberMe: "Remember me",
    forgotPass: "Forgot password?",
    signInAction: "Sign in",
    signUpAction: "Create account",
    continueWithGoogle: "Continue with Google",
    signUpWithGoogle: "Sign up with Google",
    alreadyMember: "Already a member?",
    newToKindConnect: "New to KindConnect?",
    agreeTerms: "I agree to the Terms of Service and Privacy Policy.",

    // Footer
    footerSlogan: "Small actions. Stronger communities. A better tomorrow.",
    footerExplore: "Explore",
    footerCommunity: "Community",
    footerGetInvolved: "Get involved",
    footerIdea: "Have an idea for your community?",
    footerStart: "Start making impact",
    footerCopy: "© 2026 KindConnect. Creator : Halima Yesmin Omi",
    footerPurpose: "Made with purpose ♥"
  },
  bn: {
    // Navigation
    exploreEvents: "ইভেন্ট খুঁজুন",
    emergencyRelief: "জরুরি সেবা ও ত্রাণ",
    about: "আমাদের সম্পর্কে",
    ourImpact: "আমাদের প্রভাব",
    leaderboard: "লিডারবোর্ড",
    login: "লগইন",
    joinCommunity: "যোগ দিন",
    getStarted: "শুরু করুন",
    dashboard: "ড্যাশবোর্ড",
    logout: "লগআউট",
    liveChat: "লাইভ চ্যাট",
    adminPanel: "অ্যাডমিন প্যানেল",
    myEvents: "আমার ইভেন্ট",
    myJoined: "যুক্ত ইভেন্ট",
    qrAttendance: "কিউআর হাজিরা",
    certificates: "সার্টিফিকেট",
    workspace: "ওয়ার্কস্পেস",
    newEvent: "নতুন ইভেন্ট",
    notifications: "নোটিফিকেশন",
    markAllRead: "সব পড়া চিহ্নিত করুন",
    noNotifs: "কোনো নোটিফিকেশন নেই",
    needHand: "সাহায্য প্রয়োজন?",
    needHandDesc: "যে কোনো প্রয়োজনে আমরা আপনার পাশে আছি।",
    getSupport: "সহায়তা নিন ↗",
    backToWebsite: "ওয়েবসাইটে ফিরুন",

    // Home Page Hero
    heroEyebrow: "একটি দায়িত্বশীল সম্প্রদায়",
    heroTitle: "আপনার সময়কে করুন অর্থপূর্ণ।",
    heroDesc: "মানুষের পাশে দাঁড়ান। সময় দিন। নিজ এলাকার সুবিধাবঞ্চিত মানুষের জীবনে ইতিবাচক পরিবর্তন আনুন।",
    heroCta: "সুযোগগুলো দেখুন",
    heroMission: "আমাদের লক্ষ্য জানুন",
    volunteers: "সক্রিয় ভলান্টিয়ার",
    eventsLabel: "সামাজিক ইভেন্ট",
    hoursLabel: "সেবামূলক ঘণ্টা",
    communitiesLabel: "সহযোগী এলাকা",

    // Home Page Sections
    upcomingEyebrow: "উদ্দেশ্য খুঁজে নিন",
    upcomingTitle: "আসন্ন কমিউনিটি উদ্যোগসমূহ",
    upcomingDesc: "সিলেট, ঢাকাসহ সমগ্র বাংলাদেশের স্বেচ্ছাসেবী কার্যক্রমে অংশ নিন এবং সমাজের ইতিবাচক পরিবর্তনে ভূমিকা রাখুন।",
    viewAllEvents: "সকল ইভেন্ট দেখুন",
    momentsImpact: "আমাদের কার্যক্রমের খণ্ডচিত্র",
    staticGallery: "কমিউনিটি ফটো গ্যালারি",
    staticGalleryDesc: "দেশের বিভিন্ন প্রান্তে ভলান্টিয়ারদের বাস্তবায়িত উদ্যোগের সাম্প্রতিক মুহূর্তসমূহ।",
    smallSteps: "ছোট ছোট পদক্ষেপ। বিশাল প্রভাব।",
    togetherWeCan: "আমরা একসাথে মিলে প্রতিদিনের সহমর্মিতাকে স্থায়ী সামাজিক পরিবর্তনে রূপান্তর করি।",
    readyToHelp: "আপনি কি পাশে দাঁড়াতে প্রস্তুত?",
    joinThousands: "হাজারো সচেতন মানুষের সাথে যুক্ত হয়ে আপনার এলাকাকে পরিচ্ছন্ন, সবুজ ও মানবিক করে গড়ে তুলুন।",
    newsletterTitle: "যুক্ত থাকুন নিয়মিত",
    newsletterDesc: "আপনার এলাকার নতুন স্বেচ্ছাসেবী কার্যক্রমের সাপ্তাহিক আপডেট সরাসরি ইমেইলে পান।",
    subscribeBtn: "সাবস্ক্রাইব করুন",

    // Events Page
    eventsEyebrow: "আপনার পরবর্তী পদক্ষেপ নিন",
    eventsTitle: "সমগ্র বাংলাদেশে স্বেচ্ছাসেবার সুযোগ",
    eventsDesc: "সিলেট, ঢাকাসহ বাংলাদেশের প্রতিটি বিভাগের সামাজিক ও মানবিক উদ্যোগ এক প্ল্যাটফর্মে।",
    searchPlaceholder: "শিরোনাম, বিভাগ বা এলাকা দিয়ে খুঁজুন (যেমন: সিলেট, ঢাকা, জিন্দাবাজার)...",
    viewGrid: "গ্রিড ভিউ",
    viewMap: "🇧🇩 বাংলাদেশ ম্যাপ এক্সপ্লোরার",
    aiSmartTitle: "আপনার জন্য এআই স্মার্ট রিকমেন্ডেশন",
    aiSmartDesc: "আপনার পূর্ববর্তী স্বেচ্ছাসেবা, অবস্থান এবং আগ্রহের ভিত্তিতে স্বয়ংক্রিয়ভাবে নির্বাচিত।",
    realtimeSmartMatch: "⚡ রিয়েল-টাইম স্মার্ট ম্যাচ",
    viewOpportunity: "বিস্তারিত দেখুন",
    opportunitiesFound: "টি সুযোগ পাওয়া গেছে",
    acrossAllBangladesh: "সমগ্র বাংলাদেশ জুড়ে",
    filteredBy: "ফিল্টারকৃত এলাকা:",
    resetAllBangladesh: "সকল বাংলাদেশ রিসেট করুন",
    noEventsFound: "কোনো ইভেন্ট পাওয়া যায়নি",
    noEventsDesc: "ভিন্ন কি-ওয়ার্ড, ক্যাটাগরি বা লোকেশন দিয়ে চেষ্টা করুন।",
    catAll: "সকল",
    catEnvironment: "পরিবেশ",
    catEducation: "শিক্ষা",
    catCommunity: "সমাজসেবা",
    catHealth: "স্বাস্থ্য",
    catAnimals: "প্রাণী কল্যাণ",
    catEmergency: "জরুরি সহায়তা",
    catOther: "অন্যান্য",

    // Emergency Page
    emergencyEyebrow: "জরুরি নাগরিক সহায়তা",
    emergencyTitle: "কমিউনিটি ইমার্জেন্সি রিলিফ হাব",
    emergencyDesc: "জরুরি মানবিক আবেদনসমূহ। রক্তদান, খাদ্য বা শীতবস্ত্র পৌঁছে দিতে সরাসরি যোগাযোগ করুন অথবা ভলান্টিয়ার হিসেবে যুক্ত হোন।",
    postAppeal: "জরুরি সহায়তার আবেদন করুন",
    allCategories: "সকল ক্যাটাগরি",
    openRequestsFound: "টি যাচাইকৃত জরুরি আবেদন অবিলম্বে সহায়তা প্রত্যাশা করছে",
    verifiedAppeal: "যাচাইকৃত নাগরিক আবেদন",
    urgencyCritical: "অত্যন্ত জরুরি",
    urgencyHigh: "উচ্চ অগ্রাধিকার",
    urgencyMedium: "মাঝারি",
    callDirect: "সরাসরি ফোন করুন",
    joinRelief: "সহায়তা প্রদান করুন",
    joinedSoFar: "জন সহায়তায় এগিয়ে এসেছেন",

    // About Page
    aboutEyebrow: "আমাদের সম্পর্কে জানুন",
    aboutTitle: "ভালো মানুষ। ভালো কাজ।",
    aboutDesc: "কাইন্ডকানেক্ট মানুষকে এক সুতোয় গেঁথে মহৎ উদ্দেশ্যে সম্মিলিত কাজ করার সুযোগ করে দেয়।",
    ourBelief: "আমাদের বিশ্বাস",
    beliefTitle: "সবারই দেওয়ার মতো কিছু না কিছু আছে।",
    beliefDesc1: "আমরা বিশ্বাস করি, শক্তিশালী সমাজ তখনই গড়ে ওঠে যখন মানুষ একে অপরের পাশে দাঁড়ায়। এক ঘণ্টা সময় দেওয়া হোক কিংবা কোনো দক্ষতা ভাগ করা—আপনার প্রতিটি অবদানই মূল্যবান।",
    beliefDesc2: "কাইন্ডকানেক্ট ভলান্টিয়ারিংকে সহজ, স্বচ্ছ ও অর্থবহ করার উদ্দেশ্যে তৈরি করা হয়েছে।",
    valBelonging: "একাত্মতা",
    valBelongingDesc: "সকলের অংশগ্রহণের সমান অধিকার রয়েছে।",
    valKindness: "সহানুভূতি",
    valKindnessDesc: "আমরা সহানুভূতি ও শ্রদ্ধাশীল মানসিকতা নিয়ে কাজ করি।",
    valImpact: "বাস্তব প্রভাব",
    valImpactDesc: "আমরা এমন কাজে বিশ্বাসী যা সমাজে দৃশ্যমান উন্নয়ন ঘটায়।",
    valTrust: "আস্থা ও স্বচ্ছতা",
    valTrustDesc: "স্বচ্ছ তথ্য ও জবাবদিহিতামূলক কার্যক্রমের নিশ্চয়তা।",

    // Impact Page
    impactHeroEyebrow: "বাস্তব পরিবর্তনের খতিয়ান",
    impactHeroTitle: "প্রকৃত মানুষ। দৃশ্যমান অগ্রগতি।",
    impactHeroDesc: "প্রতিটি সেবামূলক ঘণ্টা ও সফল উদ্যোগ আমাদের এলাকাগুলোতে ইতিবাচক পরিবর্তনের ঢেউ তোলে।",
    impactStats: "আমাদের সম্মিলিত অর্জন",
    storiesSection: "পরিবর্তনের গল্পসমূহ",

    // Leaderboard Page
    leaderboardHeroEyebrow: "উৎসর্গীকৃত মানুষের স্বীকৃতি",
    leaderboardHeroTitle: "শীর্ষ সমাজসেবক ও ভলান্টিয়ার",
    leaderboardHeroDesc: "যাঁদের নিরলস পরিশ্রম ও নিষ্ঠা আমাদের সবাইকে অনুপ্রাণিত করে।",
    allTimeLeaders: "সর্বকালীন সেরা ভলান্টিয়ারবৃন্দ",
    monthlyActive: "এই মাসের সেরা",
    rank: "র‍্যাংক",
    volunteer: "ভলান্টিয়ার",
    points: "পয়েন্ট",
    hours: "ঘণ্টা",

    // Auth Pages
    signInTitle: "স্বাগতম!",
    signInSubtitle: "আপনার অ্যাকাউন্টে সাইন ইন করুন।",
    signUpTitle: "নতুন অ্যাকাউন্ট খুলুন।",
    signUpSubtitle: "কয়েকটি তথ্যে শুরু করুন আপনার সেবামূলক যাত্রা।",
    emailOrUsername: "ইমেইল অ্যাড্রেস বা ইউজারনেম",
    passwordLabel: "পাসওয়ার্ড",
    fullNameLabel: "পুরো নাম",
    photoUrlLabel: "ছবির লিংক (ঐচ্ছিক)",
    rememberMe: "মনে রাখুন",
    forgotPass: "পাসওয়ার্ড ভুলে গেছেন?",
    signInAction: "সাইন ইন করুন",
    signUpAction: "অ্যাকাউন্ট তৈরি করুন",
    continueWithGoogle: "গুগল দিয়ে সাইন ইন করুন",
    signUpWithGoogle: "গুগল দিয়ে সাইন আপ করুন",
    alreadyMember: "ইতিমধ্যে সদস্য?",
    newToKindConnect: "কাইন্ডকানেক্টে নতুন?",
    agreeTerms: "আমি ব্যবহারের শর্তাবলী ও গোপনীয়তা নীতিতে সম্মত।",

    // Footer
    footerSlogan: "ছোট ছোট পদক্ষেপ। শক্তিশালী সমাজ। একটি সুন্দর আগামী।",
    footerExplore: "অন্বেষণ",
    footerCommunity: "কমিউনিটি",
    footerGetInvolved: "যুক্ত হোন",
    footerIdea: "আপনার এলাকায় কোনো উন্নয়নমূলক আইডিয়া আছে?",
    footerStart: "উদ্যোগ শুরু করুন",
    footerCopy: "© ২০২৬ কাইন্ডকানেক্ট। প্ল্যাটফর্ম প্রতিষ্ঠাতা: হালিমা ইয়াসমিন ওমি",
    footerPurpose: "মানবতার কল্যাণে নিবেদিত ♥"
  }
};

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const [theme, setTheme] = useState("dark");
  const [lang, setLang] = useState("en");

  // Load saved theme and language
  useEffect(() => {
    const savedTheme = typeof window !== "undefined" ? localStorage.getItem("kindconnect_theme") || "dark" : "dark";
    const savedLang = typeof window !== "undefined" ? localStorage.getItem("kindconnect_lang") || "en" : "en";
    setTheme(savedTheme);
    setLang(savedLang);
  }, []);

  // Sync theme with HTML root and localStorage
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
      document.documentElement.classList.toggle("dark", theme === "dark");
      document.documentElement.classList.toggle("light", theme === "light");
      document.body.setAttribute("data-theme", theme);
      localStorage.setItem("kindconnect_theme", theme);
    }
  }, [theme]);

  // Sync language with localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("kindconnect_lang", lang);
    }
  }, [lang]);

  const toggleLang = () => setLang(prev => (prev === "en" ? "bn" : "en"));
  const toggleTheme = () => setTheme(prev => (prev === "light" ? "dark" : "light"));
  const t = (key) => translations[lang]?.[key] || translations.en?.[key] || key;

  return (
    <SiteContext.Provider value={{ theme, setTheme, toggleTheme, lang, setLang, toggleLang, t }}>
      <AuthProvider>
        <div data-theme={theme} className={theme === "light" ? "light" : "dark"} style={{ minHeight: "100vh" }}>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: theme === "dark" ? "#1a2420" : "#ffffff",
                color: theme === "dark" ? "#f2f6f2" : "#0f1712",
                border: `1px solid ${theme === "dark" ? "#26312b" : "#d1ded4"}`,
                borderRadius: "12px",
                fontSize: "0.85rem",
                fontWeight: 600,
                boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
              },
              success: { iconTheme: { primary: theme === "dark" ? "#b7f36b" : "#15803d", secondary: "#ffffff" } },
              error: { iconTheme: { primary: "#ef4444", secondary: "#ffffff" } },
            }}
          />
        </div>
      </AuthProvider>
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}
