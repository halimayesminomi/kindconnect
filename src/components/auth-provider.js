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
        // Active local/offline session
        if (demo) {
          try { setUser(JSON.parse(demo)); } catch (_) { setUser(null); }
        }
        setLoading(false);
      } else {
        // Remote JWT token from backend
        api.getUser()
          .then((data) => setUser(data.data || data.user))
          .catch(() => {
            if (demo) {
              try { setUser(JSON.parse(demo)); } catch (_) { setUser(null); }
            } else {
              localStorage.removeItem("kindconnect_token");
              setUser(null);
            }
          })
          .finally(() => setLoading(false));
      }
    } else if (demo) {
      try { setUser(JSON.parse(demo)); } catch (_) { setUser(null); }
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const data = await api.login({ email, password });
      localStorage.setItem("kindconnect_token", data.token);
      localStorage.removeItem("kindconnect_demo_user");
      setUser(data.user);
      return data;
    } catch (err) {
      if (err.isNetworkError || err.message?.includes("connect to backend server") || err.message?.includes("Failed to fetch") || err.message?.includes("unreachable")) {
        // Fallback: Check local registered users on this device
        const localUsers = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("kindconnect_local_users") || "[]") : [];
        const found = localUsers.find(u => 
          u.email?.toLowerCase() === email.toLowerCase() || 
          u.username?.toLowerCase() === email.toLowerCase()
        );

        if (found) {
          if (found.password && found.password !== password) {
            throw new Error("Invalid password. Please check your credentials.");
          }
          const { password: _, ...userSafe } = found;
          localStorage.setItem("kindconnect_demo_user", JSON.stringify(userSafe));
          localStorage.setItem("kindconnect_token", "local-token-" + Date.now());
          setUser(userSafe);
          return { success: true, user: userSafe, isLocal: true };
        }

        // Check if signing in as Lead Builder / Admin (Omi)
        if (email.toLowerCase() === "omi" || email.toLowerCase() === "omi@kindconnect.org" || email.toLowerCase().includes("halima")) {
          const omiUser = {
            _id: "demo-omi-admin",
            name: "Halima Yesmin Omi",
            username: "omi",
            email: email.includes("@") ? email : "omi@kindconnect.org",
            role: "admin",
            designation: "Platform Admin & Lead Builder",
            points: 1250,
            hoursVolunteered: 38,
            photoURL: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
          };
          localStorage.setItem("kindconnect_demo_user", JSON.stringify(omiUser));
          localStorage.setItem("kindconnect_token", "local-token-" + Date.now());
          setUser(omiUser);
          return { success: true, user: omiUser, isLocal: true };
        }

        throw new Error("No account found with this email. Please register first or use Quick Demo Admin.");
      }
      throw err;
    }
  };

  const register = async (name, email, password, photoURL) => {
    try {
      const data = await api.register({ name, email, password, photoURL });
      localStorage.setItem("kindconnect_token", data.token);
      localStorage.removeItem("kindconnect_demo_user");
      setUser(data.user);
      return data;
    } catch (err) {
      if (err.isNetworkError || err.message?.includes("connect to backend server") || err.message?.includes("Failed to fetch") || err.message?.includes("unreachable")) {
        // Fallback: Register user locally on this device
        const localUser = {
          _id: "user-" + Date.now(),
          name,
          email,
          photoURL: photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
          role: "volunteer",
          points: 150,
          hoursVolunteered: 4,
          createdAt: new Date().toISOString()
        };

        const localUsers = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("kindconnect_local_users") || "[]") : [];
        const existingIdx = localUsers.findIndex(u => u.email?.toLowerCase() === email.toLowerCase());
        const userToStore = { ...localUser, password };
        if (existingIdx >= 0) {
          localUsers[existingIdx] = userToStore;
        } else {
          localUsers.push(userToStore);
        }
        localStorage.setItem("kindconnect_local_users", JSON.stringify(localUsers));
        localStorage.setItem("kindconnect_demo_user", JSON.stringify(localUser));
        localStorage.setItem("kindconnect_token", "local-token-" + Date.now());
        setUser(localUser);
        return { success: true, user: localUser, isLocal: true };
      }
      throw err;
    }
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
    try {
      const data = await api.googleLogin(credential, userInfo);
      localStorage.setItem("kindconnect_token", data.token);
      setUser(data.user);
      return data;
    } catch (_) {
      const googleUser = {
        _id: "google-" + Date.now(),
        name: userInfo?.name || "Google Volunteer",
        email: userInfo?.email || "volunteer@gmail.com",
        photoURL: userInfo?.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        role: "volunteer",
        points: 200,
        hoursVolunteered: 6,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem("kindconnect_demo_user", JSON.stringify(googleUser));
      localStorage.setItem("kindconnect_token", "local-token-" + Date.now());
      setUser(googleUser);
      return { success: true, user: googleUser, isLocal: true };
    }
  };

  const logout = () => {
    localStorage.removeItem("kindconnect_token");
    localStorage.removeItem("kindconnect_demo_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginAsDemo, socialLogin, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
