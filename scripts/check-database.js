const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

// Load environment variables from .env file
function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env");
  try {
    const envContent = fs.readFileSync(envPath, "utf8");
    const envLines = envContent.split("\n");

    envLines.forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith("#")) {
        const [key, ...valueParts] = trimmedLine.split("=");
        if (key && valueParts.length > 0) {
          const value = valueParts.join("=");
          process.env[key.trim()] = value.trim();
        }
      }
    });

    console.log("✅ Environment variables loaded");
  } catch (error) {
    console.error("❌ Error loading .env file:", error);
  }
}

// Load environment variables
loadEnv();

// Connect to MongoDB
async function connectDB() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

async function checkDatabase() {
  try {
    await connectDB();

    // First, let's see what collections exist
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log("\n📁 Available collections:");
    collections.forEach((collection, index) => {
      console.log(`   ${index + 1}. ${collection.name}`);
    });

    // Check if there's an 'admins' collection
    const adminCollection = collections.find((c) => c.name === "admins");

    if (adminCollection) {
      console.log("\n🔍 Found admins collection, checking documents...");

      // Get all documents from admins collection
      const admins = await mongoose.connection.db
        .collection("admins")
        .find({})
        .toArray();

      console.log(`\n📋 Found ${admins.length} admin(s) in database:`);
      admins.forEach((admin, index) => {
        console.log(`\n   ${index + 1}. Admin Document:`);
        console.log(`      - ID: ${admin._id}`);
        console.log(`      - Name: ${admin.fullName || admin.name || "N/A"}`);
        console.log(`      - Email: ${admin.email || "N/A"}`);
        console.log(`      - Role: ${admin.role || "N/A"}`);
        console.log(`      - Status: ${admin.accountStatus || "N/A"}`);
        console.log(`      - Created: ${admin.createdAt || "N/A"}`);
        console.log(`      - All fields:`, Object.keys(admin));
      });
    } else {
      console.log("\n❌ No admins collection found in database");
    }

    // Let's also check for any other admin-related collections
    const adminRelated = collections.filter(
      (c) =>
        c.name.toLowerCase().includes("admin") ||
        c.name.toLowerCase().includes("user")
    );

    if (adminRelated.length > 0) {
      console.log("\n🔍 Admin/User related collections found:");
      for (const collection of adminRelated) {
        const count = await mongoose.connection.db
          .collection(collection.name)
          .countDocuments();
        console.log(`   - ${collection.name}: ${count} documents`);
      }
    }
  } catch (error) {
    console.error("❌ Error checking database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

// Run the check
checkDatabase();
