const mongoose = require("mongoose");
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
    console.log(
      "🌐 Connection URI Database:",
      process.env.MONGODB_URI ? "Found" : "Not found"
    );

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Log the actual database name being used
    const dbName = mongoose.connection.name;
    console.log(`📁 Connected to database: "${dbName}"`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

async function migrateGovlinkAdmins() {
  try {
    await connectDB();

    console.log("\n🎯 Targeting govlink.admins collection specifically...");

    // Force connection to govlink database and admins collection
    const db = mongoose.connection.db;
    const dbName = db.databaseName;
    console.log(`📊 Current database name: "${dbName}"`);

    // Get the admins collection specifically
    const adminsCollection = db.collection("admins");
    console.log("📁 Working with collection: admins");

    // List all collections to verify
    const collections = await db.listCollections().toArray();
    console.log("\n📋 All collections in this database:");
    collections.forEach((col, index) => {
      console.log(`   ${index + 1}. ${col.name}`);
    });

    // Check current admin documents
    const existingAdmins = await adminsCollection.find({}).toArray();
    console.log(
      `\n🔍 Found ${existingAdmins.length} existing admin document(s) in govlink.admins`
    );

    if (existingAdmins.length === 0) {
      console.log(
        "\n🔧 No existing admins found. Creating initial admin accounts..."
      );

      // Create the admins with proper schema
      const bcrypt = require("bcryptjs");

      const superAdminPassword = await bcrypt.hash("ThisIsInsane", 12);
      const regularAdminPassword = await bcrypt.hash("TestAdmin123", 12);

      const adminsToCreate = [
        {
          fullName: "Super Admin",
          email: "superadmin@govlink.lk",
          password: superAdminPassword,
          role: "SUPERADMIN",
          accountStatus: "ACTIVE",
          loginAttempts: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullName: "Regular Admin",
          email: "admin@govlink.lk",
          password: regularAdminPassword,
          role: "ADMIN",
          accountStatus: "ACTIVE",
          loginAttempts: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      console.log("\n⚡ Inserting admin documents...");
      const insertResult = await adminsCollection.insertMany(adminsToCreate);
      console.log(
        `✅ Successfully inserted ${insertResult.insertedCount} admin documents`
      );
    } else {
      // Update existing admins to add role field if missing
      console.log("\n📋 Existing admin documents:");

      for (let i = 0; i < existingAdmins.length; i++) {
        const admin = existingAdmins[i];
        console.log(`\n   ${i + 1}. Admin Document:`);
        console.log(`      - ID: ${admin._id}`);
        console.log(`      - Name: ${admin.fullName || admin.name || "N/A"}`);
        console.log(`      - Email: ${admin.email || "N/A"}`);
        console.log(`      - Role: ${admin.role || "NOT SET"}`);
        console.log(`      - Status: ${admin.accountStatus || "N/A"}`);
        console.log(`      - All fields: ${Object.keys(admin).join(", ")}`);

        // Check if role field is missing
        if (
          !admin.hasOwnProperty("role") ||
          admin.role === null ||
          admin.role === undefined
        ) {
          console.log(`      🔧 Missing role field - will update...`);

          // Determine role based on email
          let newRole = "ADMIN";
          const emailLower = (admin.email || "").toLowerCase();
          if (
            emailLower.includes("superadmin") ||
            emailLower === "superadmin@govlink.lk"
          ) {
            newRole = "SUPERADMIN";
          }

          // Update the document
          const updateResult = await adminsCollection.updateOne(
            { _id: admin._id },
            {
              $set: {
                role: newRole,
                updatedAt: new Date(),
              },
            }
          );

          if (updateResult.modifiedCount === 1) {
            console.log(`      ✅ Updated role to: ${newRole}`);
          } else {
            console.log(`      ❌ Failed to update role`);
          }
        } else {
          console.log(`      ✅ Role already set: ${admin.role}`);
        }
      }
    }

    // Final verification
    console.log("\n🔍 Final verification of govlink.admins collection...");
    const finalAdmins = await adminsCollection.find({}).toArray();

    console.log(`\n📊 Total admins in govlink.admins: ${finalAdmins.length}`);
    finalAdmins.forEach((admin, index) => {
      console.log(`\n   ${index + 1}. ${admin.fullName || "Unknown"}`);
      console.log(`      - Email: ${admin.email}`);
      console.log(`      - Role: ${admin.role}`);
      console.log(`      - Status: ${admin.accountStatus}`);
      console.log(`      - Database: govlink`);
      console.log(`      - Collection: admins`);
    });

    console.log("\n🎯 Login Credentials for testing:");
    const superAdmin = finalAdmins.find((a) => a.role === "SUPERADMIN");
    const regularAdmin = finalAdmins.find((a) => a.role === "ADMIN");

    if (superAdmin) {
      console.log(`   Super Admin: ${superAdmin.email} / ThisIsInsane`);
    }
    if (regularAdmin) {
      console.log(`   Regular Admin: ${regularAdmin.email} / TestAdmin123`);
    }
  } catch (error) {
    console.error("❌ Migration error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

// Run the migration
console.log("🎯 Govlink Admins Collection Migration");
console.log("=====================================");
console.log("Target: govlink.admins collection");
console.log("Purpose: Add role field to existing admins or create new ones");
console.log("");

migrateGovlinkAdmins();
