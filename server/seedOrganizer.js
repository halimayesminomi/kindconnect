import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import User from "./models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

async function seedOrganizer() {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb+srv://halimayesminomi2002_db_user:cdaabzFp3Nh55WmK@kindconnect.6ymngxp.mongodb.net/kindconnect";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB Atlas!");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("Omi@2026", salt);

    const organizerData = {
      name: "Halima Yesmin Omi",
      username: "omi",
      email: "omi@kindconnect.org",
      password: hashedPassword,
      role: "admin",
      designation: "Platform Admin & Lead Builder",
      photoURL: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    };

    // Find if user with email or username exists
    let existing = await User.findOne({
      $or: [
        { email: organizerData.email },
        { username: organizerData.username },
        { email: "halimayesminomi2002@gmail.com" },
      ]
    });

    if (existing) {
      existing.name = organizerData.name;
      existing.username = organizerData.username;
      existing.email = organizerData.email;
      existing.password = organizerData.password;
      existing.role = organizerData.role;
      existing.designation = organizerData.designation;
      existing.photoURL = organizerData.photoURL;
      await existing.save();
      console.log("Organizer updated successfully:", existing);
    } else {
      const created = await User.create(organizerData);
      console.log("Organizer created successfully:", created);
    }

    process.exit(0);
  } catch (err) {
    console.error("Error seeding organizer:", err);
    process.exit(1);
  }
}

seedOrganizer();
