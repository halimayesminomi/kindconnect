import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user account.
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, photoURL } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      photoURL: photoURL || "",
    });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during registration.",
    });
  }
});

/**
 * POST /api/auth/login
 * Login with email and password.
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during login.",
    });
  }
});

/**
 * POST /api/auth/social
 * Social login (Google / GitHub) option per Section 4.1.
 */
router.post("/social", async (req, res) => {
  try {
    const { provider, email, name, photoURL } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required for social login.",
      });
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const randomPassword = Math.random().toString(36).slice(-10) + "A1!";
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = await User.create({
        name: name || (provider === "google" ? "Google User" : "GitHub Volunteer"),
        email: email.toLowerCase(),
        password: hashedPassword,
        photoURL: photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        role: "user",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Social login error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during social login.",
    });
  }
});

/**
 * POST /api/auth/google
 * Real Google OAuth verification endpoint.
 * Validates Google JWT ID Token via Google's tokeninfo API.
 */
router.post("/google", async (req, res) => {
  try {
    const { credential, userInfo } = req.body;
    let email, name, photoURL;

    if (credential) {
      // Cryptographically verify with Google's public tokeninfo service
      const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
      if (!googleRes.ok) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired Google token.",
        });
      }
      const payload = await googleRes.json();
      email = payload.email;
      name = payload.name;
      photoURL = payload.picture;
    } else if (userInfo && userInfo.email) {
      email = userInfo.email;
      name = userInfo.name;
      photoURL = userInfo.photoURL;
    } else {
      return res.status(400).json({
        success: false,
        message: "No Google credentials provided.",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Unable to extract email from Google account.",
      });
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const randomPass = Math.random().toString(36).slice(-10) + "A1!";
      const hashedPassword = await bcrypt.hash(randomPass, salt);

      user = await User.create({
        name: name || email.split("@")[0],
        email: email.toLowerCase(),
        password: hashedPassword,
        photoURL: photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        role: "user",
      });
    } else if (photoURL && !user.photoURL) {
      user.photoURL = photoURL;
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google auth endpoint error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during Google authentication.",
    });
  }
});

/**
 * GET /api/auth/user
 * Get currently authenticated user data (protected).
 */
router.get("/user", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get user error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error fetching user data.",
    });
  }
});

export default router;
