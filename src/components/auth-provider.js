"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("kindconnect_token");
    if (token) {
      api.getUser()
        .then((data) => setUser(data.data || data.user))
        .catch(() => {
          localStorage.removeItem("kindconnect_token");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    localStorage.setItem("kindconnect_token", data.token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password, photoURL) => {
    const data = await api.register({ name, email, password, photoURL });
    localStorage.setItem("kindconnect_token", data.token);
    setUser(data.user);
    return data;
  };

  const socialLogin = async (provider = "google") => {
    const defaultData = provider === "google" 
      ? { provider: "google", email: "google.volunteer@kindconnect.org", name: "Google Volunteer", photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" }
      : { provider: "github", email: "github.volunteer@kindconnect.org", name: "GitHub Volunteer", photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" };
    const data = await api.socialLogin(defaultData);
    localStorage.setItem("kindconnect_token", data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("kindconnect_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, socialLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
