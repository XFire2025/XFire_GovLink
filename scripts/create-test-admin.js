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

async function createRegularAdmin() {
  try {
    await connectDB();

    // Create regular admin for testing
    const regularAdminEmail = "admin@govlink.lk";

    console.log(`🔍 Checking if regular admin exists: ${regularAdminEmail}`);

    const existingAdmin = await Admin.findOne({ email: regularAdminEmail });

    if (!existingAdmin) {
      console.log("🔧 Creating regular admin for testing...");

      const hashedPassword = await bcrypt.hash("TestAdmin123", 12);

      const regularAdmin = new Admin({
        fullName: "Regular Admin",
        email: regularAdminEmail,
        password: hashedPassword,
        role: "ADMIN",
        accountStatus: "ACTIVE",
      });

      await regularAdmin.save();

      console.log("✅ Successfully created regular admin");
      console.log(`   - Name: ${regularAdmin.fullName}`);
      console.log(`   - Email: ${regularAdmin.email}`);
      console.log(`   - Role: ${regularAdmin.role}`);
      console.log(`   - Status: ${regularAdmin.accountStatus}`);
    } else {
      console.log("ℹ️ Regular admin already exists");
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

    console.log("\n🔑 Login Credentials:");
    console.log("   Super Admin:");
    console.log("     Email: superadmin@govlink.lk");
    console.log("     Password: ThisIsInsane");
    console.log("   Regular Admin:");
    console.log("     Email: admin@govlink.lk");
    console.log("     Password: TestAdmin123");
  } catch (error) {
    console.error("❌ Error creating regular admin:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

// Run the script
createRegularAdmin();
