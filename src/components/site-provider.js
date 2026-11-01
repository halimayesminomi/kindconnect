"use client";

import { createContext, useContext, useState } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./auth-provider";

const translations = {
  en: {
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
    heroEyebrow: "A COMMUNITY THAT CARES",
    heroTitle: "Make your time mean something.",
    heroDesc: "Find your people. Give your time. Create real change in the communities that need it most.",
    heroCta: "Explore opportunities",
    heroMission: "Discover our mission",
    volunteers: "Active volunteers",
    eventsLabel: "Community events",
    hoursLabel: "Volunteer hours",
    communitiesLabel: "Partner communities",
  },
  bn: {
    exploreEvents: "ইভেন্ট খুঁজুন",
    emergencyRelief: "জরুরি সেবা",
    about: "আমাদের সম্পর্কে",
    ourImpact: "আমাদের প্রভাব",
    leaderboard: "লিডারবোর্ড",
    login: "লগইন",
    joinCommunity: "যোগ দিন",
    getStarted: "শুরু করুন",
    dashboard: "ড্যাশবোর্ড",
    logout: "লগআউট",
    heroEyebrow: "একটি দায়িত্বশীল সম্প্রদায়",
    heroTitle: "আপনার সময়কে করুন অর্থপূর্ণ।",
    heroDesc: "মানুষের পাশে দাঁড়ান। সময় দিন। নিজ এলাকার সুবিধাবঞ্চিত মানুষের জীবনে ইতিবাচক পরিবর্তন আনুন।",
    heroCta: "সুযোগগুলো দেখুন",
    heroMission: "আমাদের লক্ষ্য জানুন",
    volunteers: "সক্রিয় ভলান্টিয়ার",
    eventsLabel: "সামাজিক ইভেন্ট",
    hoursLabel: "সেবামূলক ঘণ্টা",
    communitiesLabel: "সহযোগী এলাকা",
  }
};

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const [theme, setTheme] = useState("dark");
  const [lang, setLang] = useState("en");

  const t = (key) => translations[lang]?.[key] || translations.en[key] || key;

  return (
    <SiteContext.Provider value={{ theme, setTheme, lang, setLang, t }}>
      <AuthProvider>
        <div data-theme={theme}>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: theme === "dark" ? "#1a2420" : "#fff",
                color: theme === "dark" ? "#f2f6f2" : "#17221a",
                border: `1px solid ${theme === "dark" ? "#26312b" : "#dce5dc"}`,
                borderRadius: "12px",
                fontSize: "0.85rem",
                fontWeight: 600,
              },
              success: { iconTheme: { primary: "#b7f36b", secondary: "#14200f" } },
              error: { iconTheme: { primary: "#ff6b6b", secondary: "#fff" } },
            }}
          />
        </div>
      </AuthProvider>
    </SiteContext.Provider>
  );
}

export function useSite() {
  return useContext(SiteContext);
}
