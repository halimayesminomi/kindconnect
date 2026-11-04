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
          .then((data) => {
            const u = data?.data || data?.user || null;
            setUser(u);
          })
          .catch(() => {
            try {
              localStorage.removeItem("kindconnect_token");
              localStorage.removeItem("kindconnect_demo_user");
            } catch (_) {}
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

  const register = async (nameOrPayload, email, password, photoURL, googleToken) => {
    let payload = {};
    if (typeof nameOrPayload === "object" && nameOrPayload !== null) {
      payload = nameOrPayload;
    } else {
      payload = { name: nameOrPayload, email, password, photoURL, googleToken };
    }
    const data = await api.register(payload);
    localStorage.setItem("kindconnect_token", data.token);
    localStorage.removeItem("kindconnect_demo_user");
    setUser(data.user);
    return data;
  };

  const loginAsDemo = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("kindconnect_demo_user");
      localStorage.removeItem("kindconnect_token");
    }
    throw new Error("ডেমো লগইন সম্পূর্ণরূপে বন্ধ করা হয়েছে। শুধুমাত্র আপনার আসল জিমেইল (@gmail.com) দিয়ে সাইন আপ বা সাইন ইন করুন।");
  };

  const socialLogin = async () => {
    throw new Error("অনুগ্রহ করে অফিসিয়াল গুগল সাইন-ইন বা আসল জিমেইল ব্যবহার করুন।");
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
