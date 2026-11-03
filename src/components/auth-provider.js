"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("kindconnect_token") : null;
    const demo = typeof window !== "undefined" ? localStorage.getItem("kindconnect_demo_user") : null;

    if (token) {
      if (token.startsWith("local-token-")) {
        // Stale offline/dummy token: purge to enforce real authentication
        localStorage.removeItem("kindconnect_token");
        localStorage.removeItem("kindconnect_demo_user");
        setUser(null);
        setLoading(false);
      } else {
        // Remote JWT token from backend
        api.getUser()
          .then((data) => setUser(data.data || data.user))
          .catch(() => {
            localStorage.removeItem("kindconnect_token");
            localStorage.removeItem("kindconnect_demo_user");
            setUser(null);
          })
          .finally(() => setLoading(false));
      }
    } else {
      localStorage.removeItem("kindconnect_demo_user");
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    localStorage.setItem("kindconnect_token", data.token);
    localStorage.removeItem("kindconnect_demo_user");
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password, photoURL) => {
    const data = await api.register({ name, email, password, photoURL });
    localStorage.setItem("kindconnect_token", data.token);
    localStorage.removeItem("kindconnect_demo_user");
    setUser(data.user);
    return data;
  };

  const loginAsDemo = (role = "admin") => {
    const demoUser = role === "admin" ? {
      _id: "demo-omi-admin",
      name: "Halima Yesmin Omi",
      username: "omi",
      email: "omi@kindconnect.org",
      role: "admin",
      designation: "Platform Admin & Lead Builder",
      points: 1250,
      hoursVolunteered: 38,
      photoURL: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
    } : {
      _id: "demo-volunteer-01",
      name: "Shraboni Das",
      username: "shraboni",
      email: "shraboni@kindconnect.org",
      role: "volunteer",
      designation: "Active Community Volunteer",
      points: 620,
      hoursVolunteered: 24,
      photoURL: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"
    };

    localStorage.setItem("kindconnect_demo_user", JSON.stringify(demoUser));
    localStorage.setItem("kindconnect_token", "local-token-" + Date.now());
    setUser(demoUser);
    return demoUser;
  };

  const socialLogin = async (provider = "google") => {
    try {
      const defaultData = provider === "google" 
        ? { provider: "google", email: "google.volunteer@kindconnect.org", name: "Google Volunteer", photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" }
        : { provider: "github", email: "github.volunteer@kindconnect.org", name: "GitHub Volunteer", photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" };
      const data = await api.socialLogin(defaultData);
      localStorage.setItem("kindconnect_token", data.token);
      setUser(data.user);
      return data;
    } catch (_) {
      return loginAsDemo("volunteer");
    }
  };

  const loginWithGoogle = async (credential, userInfo) => {
    const data = await api.googleLogin(credential, userInfo);
    localStorage.setItem("kindconnect_token", data.token);
    localStorage.removeItem("kindconnect_demo_user");
    setUser(data.user);
    return data;
  };

  const updateProfile = async (body) => {
    const res = await api.updateProfile(body);
    if (res.user) {
      setUser(res.user);
    }
    return res;
  };

  const refreshUser = async () => {
    try {
      const res = await api.getUser();
      if (res.data || res.user) {
        setUser(res.data || res.user);
      }
    } catch (_) {}
  };

  const logout = () => {
    localStorage.removeItem("kindconnect_token");
    localStorage.removeItem("kindconnect_demo_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, loginAsDemo, socialLogin, loginWithGoogle, logout, updateProfile, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
