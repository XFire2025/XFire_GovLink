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
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

async function runMigration() {
  try {
    await connectDB();

    console.log("🚀 Starting Admin Schema Migration...");
    console.log("📋 This migration will:");
    console.log("   1. Check existing admin documents");
    console.log('   2. Add "role" field to admins without it');
    console.log('   3. Set default role as "ADMIN"');
    console.log("   4. Identify potential super admin accounts");
    console.log("");

    // Get the admins collection directly
    const adminCollection = mongoose.connection.db.collection("admins");

    // Check if collection exists
    const collections = await mongoose.connection.db
      .listCollections({ name: "admins" })
      .toArray();

    if (collections.length === 0) {
      console.log('❌ No "admins" collection found in database');
      console.log("   Creating new collection...");

      // Create the collection by inserting a temporary document and removing it
      await adminCollection.insertOne({ temp: true });
      await adminCollection.deleteOne({ temp: true });

      console.log("✅ Empty admins collection created");
      return;
    }

    // Get all existing admin documents
    const existingAdmins = await adminCollection.find({}).toArray();

    console.log(`🔍 Found ${existingAdmins.length} existing admin document(s)`);

    if (existingAdmins.length === 0) {
      console.log("ℹ️  No existing admin documents to migrate");
      return;
    }

    // Display existing admins
    console.log("\n📋 Existing admin documents:");
    existingAdmins.forEach((admin, index) => {
      console.log(`\n   ${index + 1}. Admin Document:`);
      console.log(`      - ID: ${admin._id}`);
      console.log(`      - Name: ${admin.fullName || admin.name || "N/A"}`);
      console.log(`      - Email: ${admin.email || "N/A"}`);
      console.log(`      - Current Role: ${admin.role || "NOT SET"}`);
      console.log(`      - Status: ${admin.accountStatus || "N/A"}`);
      console.log(
        `      - Has role field: ${admin.hasOwnProperty("role") ? "YES" : "NO"}`
      );
    });

    // Find admins without role field
    const adminsWithoutRole = existingAdmins.filter(
      (admin) =>
        !admin.hasOwnProperty("role") ||
        admin.role === null ||
        admin.role === undefined
    );

    console.log(
      `\n🔧 Found ${adminsWithoutRole.length} admin(s) without role field`
    );

    if (adminsWithoutRole.length > 0) {
      console.log("\n⚡ Starting migration process...");

      for (let i = 0; i < adminsWithoutRole.length; i++) {
        const admin = adminsWithoutRole[i];

        // Determine role based on email or other criteria
        let newRole = "ADMIN"; // Default role

        // Check if this might be a super admin based on email patterns
        const emailLower = (admin.email || "").toLowerCase();
        if (
          emailLower.includes("superadmin") ||
          emailLower.includes("super.admin") ||
          emailLower.includes("super_admin") ||
          emailLower === "admin@govlink.lk" ||
          emailLower === "superadmin@govlink.lk"
        ) {
          newRole = "SUPERADMIN";
        }

        console.log(
          `\n   Processing admin ${i + 1}/${adminsWithoutRole.length}:`
        );
        console.log(`      - Email: ${admin.email}`);
        console.log(`      - Assigning role: ${newRole}`);

        // Update the document
        const result = await adminCollection.updateOne(
          { _id: admin._id },
          {
            $set: {
              role: newRole,
              updatedAt: new Date(),
            },
          }
        );

        if (result.modifiedCount === 1) {
          console.log(`      ✅ Successfully updated`);
        } else {
          console.log(`      ❌ Failed to update`);
        }
      }
    }

    // Verify migration results
    console.log("\n🔍 Verifying migration results...");
    const updatedAdmins = await adminCollection.find({}).toArray();

    console.log("\n📋 Final admin documents after migration:");
    updatedAdmins.forEach((admin, index) => {
      console.log(`\n   ${index + 1}. Admin Document:`);
      console.log(`      - ID: ${admin._id}`);
      console.log(`      - Name: ${admin.fullName || admin.name || "N/A"}`);
      console.log(`      - Email: ${admin.email || "N/A"}`);
      console.log(`      - Role: ${admin.role || "STILL NOT SET"}`);
      console.log(`      - Status: ${admin.accountStatus || "N/A"}`);
      console.log(`      - Updated: ${admin.updatedAt || "N/A"}`);
    });

    // Summary
    const rolesCount = {
      ADMIN: updatedAdmins.filter((a) => a.role === "ADMIN").length,
      SUPERADMIN: updatedAdmins.filter((a) => a.role === "SUPERADMIN").length,
      UNDEFINED: updatedAdmins.filter((a) => !a.role).length,
    };

    console.log("\n📊 Migration Summary:");
    console.log(`   - Total admins: ${updatedAdmins.length}`);
    console.log(`   - Super Admins: ${rolesCount.SUPERADMIN}`);
    console.log(`   - Regular Admins: ${rolesCount.ADMIN}`);
    console.log(`   - Without role: ${rolesCount.UNDEFINED}`);

    if (rolesCount.UNDEFINED > 0) {
      console.log(
        "\n⚠️  WARNING: Some admins still don't have roles assigned!"
      );
    } else {
      console.log("\n✅ Migration completed successfully!");
    }

    console.log("\n📝 Next steps:");
    console.log("   1. Review the role assignments above");
    console.log("   2. Run the admin creation script if needed");
    console.log("   3. Test login with existing admin accounts");
  } catch (error) {
    console.error("❌ Migration error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

// Run the migration
console.log("🔄 Admin Role Migration Script");
console.log("================================");
runMigration();
