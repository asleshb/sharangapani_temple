import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const createAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri || mongoUri === "YOUR_MONGODB_ATLAS_CONNECTION_STRING") {
      console.error("❌ Error: MONGO_URI is missing or unconfigured in backend/.env");
      process.exit(1);
    }

    const name = process.env.ADMIN_NAME || "Temple Admin";
    const email = (process.env.ADMIN_EMAIL || "admin@temple.com").toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD;

    if (!password || password === "CHANGE_THIS_PASSWORD") {
      console.error("❌ Error: Please specify a valid ADMIN_PASSWORD in backend/.env before running this script.");
      process.exit(1);
    }

    console.log(`Connecting to MongoDB...`);
    await mongoose.connect(mongoUri);

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    let admin = await Admin.findOne({ email });

    if (admin) {
      admin.name = name;
      admin.passwordHash = passwordHash;
      await admin.save();
      console.log(`✅ Admin account updated successfully!`);
      console.log(`   Email: ${email}`);
    } else {
      admin = await Admin.create({
        name,
        email,
        passwordHash,
        role: "admin",
      });
      console.log(`✅ Admin account created successfully!`);
      console.log(`   Name: ${name}`);
      console.log(`   Email: ${email}`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Admin Creation Failed:", error.message);
    process.exit(1);
  }
};

createAdmin();
