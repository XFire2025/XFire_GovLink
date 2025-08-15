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
  } catch (error) {
    console.error("❌ Error loading .env file:", error);
  }
}

loadEnv();

async function addRegularAdmin() {
  try {
    console.log("🔌 Connecting to MongoDB govlink database...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to govlink database");

    const db = mongoose.connection.db;
    const adminsCollection = db.collection("admins");

    // Check if regular admin already exists
    const existingRegularAdmin = await adminsCollection.findOne({
      email: "admin@govlink.lk",
    });

    if (existingRegularAdmin) {
      console.log(
        "✅ Regular admin already exists:",
        existingRegularAdmin.email
      );
      console.log("   Role:", existingRegularAdmin.role);
    } else {
      console.log("🔧 Creating regular admin account...");

      const regularAdminPassword = await bcrypt.hash("AdminPass123", 12);

      const regularAdmin = {
        fullName: "Regular Admin",
        email: "admin@govlink.lk",
        password: regularAdminPassword,
        role: "ADMIN",
        accountStatus: "ACTIVE",
        loginAttempts: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const insertResult = await adminsCollection.insertOne(regularAdmin);
      console.log("✅ Regular admin created successfully");
      console.log("   ID:", insertResult.insertedId);
      console.log("   Email: admin@govlink.lk");
      console.log("   Password: AdminPass123");
      console.log("   Role: ADMIN");
    }

    // Final summary
    console.log("\n📊 Final Admin Summary in govlink.admins:");
    const allAdmins = await adminsCollection.find({}).toArray();

    allAdmins.forEach((admin, index) => {
      console.log(`\n   ${index + 1}. ${admin.fullName}`);
      console.log(`      - Email: ${admin.email}`);
      console.log(`      - Role: ${admin.role}`);
      console.log(`      - Status: ${admin.accountStatus}`);
    });

    console.log("\n🎯 Test Login Credentials:");
    console.log("   SUPERADMIN: superadmin@govlink.lk / ThisIsInsane");
    console.log("   ADMIN: admin@govlink.lk / AdminPass123");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

addRegularAdmin();
