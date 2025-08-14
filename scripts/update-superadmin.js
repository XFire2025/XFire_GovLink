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
    console.log(
      "📡 MongoDB URI:",
      process.env.MONGODB_URI ? "URI found" : "URI not found"
    );

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

// Admin Schema
const AdminSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ["ADMIN", "SUPERADMIN"],
      default: "ADMIN",
    },
    accountStatus: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED", "DEACTIVATED"],
      default: "ACTIVE",
    },
    lastLoginAt: { type: Date },
    loginAttempts: { type: Number, default: 0 },
    accountLockedUntil: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

async function updateSuperAdmin() {
  try {
    await connectDB();

    // Find admin with email superadmin@govlink.lk
    const superAdminEmail = "superadmin@govlink.lk";

    console.log(`🔍 Looking for admin with email: ${superAdminEmail}`);

    const existingAdmin = await Admin.findOne({ email: superAdminEmail });

    if (existingAdmin) {
      // Update existing admin to SUPERADMIN role
      existingAdmin.role = "SUPERADMIN";
      await existingAdmin.save();

      console.log("✅ Successfully updated existing admin to SUPERADMIN role");
      console.log(`   - Name: ${existingAdmin.fullName}`);
      console.log(`   - Email: ${existingAdmin.email}`);
      console.log(`   - Role: ${existingAdmin.role}`);
      console.log(`   - Status: ${existingAdmin.accountStatus}`);
    } else {
      // Create new super admin if not exists
      console.log("🔧 Admin not found, creating new Super Admin...");

      const hashedPassword = await bcrypt.hash("ThisIsInsane", 12);

      const superAdmin = new Admin({
        fullName: "Super Admin",
        email: superAdminEmail,
        password: hashedPassword,
        role: "SUPERADMIN",
        accountStatus: "ACTIVE",
      });

      await superAdmin.save();

      console.log("✅ Successfully created new Super Admin");
      console.log(`   - Name: ${superAdmin.fullName}`);
      console.log(`   - Email: ${superAdmin.email}`);
      console.log(`   - Role: ${superAdmin.role}`);
      console.log(`   - Status: ${superAdmin.accountStatus}`);
    }

    // Show all admins
    console.log("\n📋 All Admins in database:");
    const allAdmins = await Admin.find({}).select(
      "fullName email role accountStatus createdAt"
    );
    allAdmins.forEach((admin, index) => {
      console.log(
        `   ${index + 1}. ${admin.fullName} (${admin.email}) - Role: ${
          admin.role
        } - Status: ${admin.accountStatus}`
      );
    });
  } catch (error) {
    console.error("❌ Error updating super admin:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

// Run the update
updateSuperAdmin();
