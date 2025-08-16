// scripts/migrate-departments.js
// Migration for Department documents to align with the new schema.
//
// What it does:
// - Lowercases and trims emails, dedup precheck
// - Hashes plaintext passwords (bcrypt) if needed
// - Normalizes phone numbers to Sri Lankan pattern
// - Restructures address fields into embedded address object
// - Normalizes enums (type/status)
// - Generates departmentId if missing
// - Ensures services have ids/createdAt/updatedAt/requirements[]
// - Ensures workingHours complete with defaults
// - Fills timestamps createdAt/updatedAt if missing
// - Adds indexes after duplicate check
//
// Env:
// - MONGODB_URI (required)
// - SALT_ROUNDS=10 (optional, default 10)
// - DRY_RUN=1 (optional; 1 enables dry-run)
// - BATCH_SIZE=1000 (optional)
// - COLLECTION=departments (optional)

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

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

const {
  MONGODB_URI,
  SALT_ROUNDS = '10',
  DRY_RUN = '1',
  BATCH_SIZE = '1000',
  COLLECTION = 'departments'
} = process.env;

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI');
  process.exit(1);
}

const DRY = DRY_RUN === '1';
const BATCH = parseInt(BATCH_SIZE, 10);
const SALT = parseInt(SALT_ROUNDS, 10);

// Province/District enums (align with your app constants)
const PROVINCES = [
  'Western', 'Central', 'Southern', 'Northern', 'Eastern',
  'North Western', 'North Central', 'Uva', 'Sabaragamuwa'
];

const DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara',
  'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota',
  'Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu',
  'Batticaloa', 'Ampara', 'Trincomalee',
  'Kurunegala', 'Puttalam',
  'Anuradhapura', 'Polonnaruwa',
  'Badulla', 'Monaragala',
  'Ratnapura', 'Kegalle'
];

const DEPARTMENT_TYPES = new Set([
  'MINISTRY', 'DEPARTMENT', 'AGENCY', 'STATUTORY_BOARD', 'CORPORATION'
]);

const DEPARTMENT_STATUS = new Set([
  'ACTIVE', 'INACTIVE', 'SUSPENDED'
]);

function titleCase(str) {
  if (!str || typeof str !== 'string') return str;
  return str
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/\s+/g, ' ');
}

function normalizeProvince(raw) {
  if (!raw) return undefined;
  const t = titleCase(raw);
  if (t && PROVINCES.includes(t)) return t;
  // attempt to remove the word "Province"
  const stripped = t?.replace(/ Province$/i, '');
  if (stripped && PROVINCES.includes(stripped)) return stripped;
  return undefined;
}

function normalizeDistrict(raw) {
  if (!raw) return undefined;
  const t = titleCase(raw);
  if (t && DISTRICTS.includes(t)) return t;
  return undefined;
}

function normalizeEnumType(raw) {
  if (!raw) return undefined;
  const t = raw.trim().toUpperCase().replace(/\s+/g, '_');
  // Map common variants
  const map = {
    'STATUTORY BOARD': 'STATUTORY_BOARD',
    'STATUTORY-BOARD': 'STATUTORY_BOARD',
  };
  const candidate = map[t] || t;
  return DEPARTMENT_TYPES.has(candidate) ? candidate : undefined;
}

function normalizeEnumStatus(raw) {
  if (!raw) return undefined;
  const t = raw.trim().toUpperCase();
  return DEPARTMENT_STATUS.has(t) ? t : undefined;
}

function isBcryptHash(pw) {
  if (!pw || typeof pw !== 'string') return false;
  // $2a$, $2b$, $2y$
  return /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(pw);
}

function normalizeEmail(email) {
  if (!email || typeof email !== 'string') return undefined;
  return email.trim().toLowerCase();
}

// Sri Lankan mobile: +947XXXXXXXX or 07XXXXXXXX
function sanitizePhone(raw) {
  if (!raw || typeof raw !== 'string') return undefined;
  const cleaned = raw.replace(/[^\d+]/g, '');
  // Already valid
  if (/^(\+94|0)(7[01245678]\d{7})$/.test(cleaned)) {
    // normalize to 0xxxxxxxxx form for consistency
    if (cleaned.startsWith('+94')) {
      return '0' + cleaned.slice(3);
    }
    return cleaned;
  }
  // Try to coerce:
  // If starts with 94xxxxxxxxx
  if (/^94(7[01245678]\d{7})$/.test(cleaned)) {
    return '0' + cleaned.slice(2);
  }
  // If starts with 7xxxxxxxx
  if (/^(7[01245678]\d{7})$/.test(cleaned)) {
    return '0' + cleaned;
  }
  return undefined;
}

function trimMax(s, max = 200) {
  if (typeof s !== 'string') return undefined;
  const t = s.trim();
  return t.length > max ? t.slice(0, max) : t;
}

function ensureWorkingHours(existing) {
  const d = (day, isWeekend = false) => ({
    open: typeof day?.open === 'string' ? day.open : '08:00',
    close: typeof day?.close === 'string' ? day.close : (isWeekend ? '13:00' : '17:00'),
    isWorkingDay: typeof day?.isWorkingDay === 'boolean'
      ? day.isWorkingDay
      : !isWeekend
  });
  return {
    monday: d(existing?.monday),
    tuesday: d(existing?.tuesday),
    wednesday: d(existing?.wednesday),
    thursday: d(existing?.thursday),
    friday: d(existing?.friday),
    saturday: d(existing?.saturday, true),
    sunday: d(existing?.sunday, true)
  };
}

function generateDepartmentId(type, oid) {
  const prefix = (type?.substring(0, 3) || 'DEP').toUpperCase();
  // Use ObjectId parts to avoid collisions
  let suffix = '';
  try {
    const ts = oid?.getTimestamp?.() instanceof Date ? oid.getTimestamp() : new Date();
    const tsPart = Math.floor(ts.getTime() / 1000).toString().slice(-6);
    const idTail = oid?.toString?.().slice(-3) || Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    suffix = tsPart + idTail;
  } catch {
    suffix = Date.now().toString().slice(-6);
  }
  return (prefix + suffix).toUpperCase();
}

function normalizeRequirements(reqs) {
  if (!reqs) return [];
  if (Array.isArray(reqs)) {
    return reqs
      .filter((x) => typeof x === 'string')
      .map((x) => x.trim())
      .filter(Boolean);
  }
  if (typeof reqs === 'string') {
    return reqs.split(/[,\n]/).map(s => s.trim()).filter(Boolean);
  }
  return [];
}

function normalizeServices(services) {
  if (!Array.isArray(services)) return undefined;
  let changed = false;
  const out = services.map(s => {
    const obj = s && typeof s === 'object' ? { ...s } : {};
    if (!obj.id || typeof obj.id !== 'string') {
      obj.id = uuidv4();
      changed = true;
    }
    obj.name = trimMax(obj.name, 200);
    obj.description = trimMax(obj.description, 1000);
    obj.category = trimMax(obj.category, 200);
    if (typeof obj.isActive !== 'boolean') {
      obj.isActive = true;
      changed = true;
    }
    if (typeof obj.processingTime !== 'string') {
      obj.processingTime = 'N/A';
      changed = true;
    }
    if (typeof obj.fee === 'number' && obj.fee < 0) {
      obj.fee = 0;
      changed = true;
    }
    obj.requirements = normalizeRequirements(obj.requirements);
    if (!obj.createdAt) {
      obj.createdAt = new Date();
      changed = true;
    } else {
      const d = new Date(obj.createdAt);
      if (isNaN(d.getTime())) {
        obj.createdAt = new Date();
        changed = true;
      }
    }
    if (!obj.updatedAt) {
      obj.updatedAt = new Date();
      changed = true;
    } else {
      const d = new Date(obj.updatedAt);
      if (isNaN(d.getTime())) {
        obj.updatedAt = new Date();
        changed = true;
      }
    }
    return obj;
  });
  return changed ? out : services;
}

function normalizeAddress(doc) {
  // prefer embedded address if exists
  const a = doc?.address && typeof doc.address === 'object' ? { ...doc.address } : {};

  // Try to lift any legacy root-level fields into address
  const line1 = a.addressLine1 ?? doc.addressLine1;
  const line2 = a.addressLine2 ?? doc.addressLine2;
  const city = a.city ?? doc.city;
  const district = a.district ?? doc.district;
  const province = a.province ?? doc.province;
  const postal = a.postalCode ?? doc.postalCode;

  const out = {};
  if (typeof line1 === 'string' && line1.trim()) out.addressLine1 = trimMax(line1, 200);
  if (typeof line2 === 'string' && line2.trim()) out.addressLine2 = trimMax(line2, 200);
  if (typeof city === 'string' && city.trim()) out.city = trimMax(city, 200);

  const nd = normalizeDistrict(district);
  if (nd) out.district = nd;

  const np = normalizeProvince(province);
  if (np) out.province = np;

  if (typeof postal === 'string') {
    const cleaned = postal.trim();
    // Force to 5 digits if possible
    const digits = cleaned.replace(/\D/g, '');
    if (/^\d{5}$/.test(digits)) {
      out.postalCode = digits;
    } else if (/^\d{4}$/.test(digits)) {
      // If 4 digits (legacy), prepend 0 (common in SL) — adjust if not desired
      out.postalCode = '0' + digits;
    }
  }

  // Only return address if we at least have addressLine1, city, district, province, postalCode (as per schema)
  const hasMin =
    typeof out.addressLine1 === 'string' &&
    typeof out.city === 'string' &&
    typeof out.district === 'string' &&
    typeof out.province === 'string' &&
    typeof out.postalCode === 'string';

  return hasMin ? out : undefined;
}

function normalizeHeadOfDepartment(doc) {
  if (doc?.headOfDepartment && typeof doc.headOfDepartment === 'object') {
    const h = { ...doc.headOfDepartment };
    const phone = sanitizePhone(h.phone);
    const email = normalizeEmail(h.email);
    const name = trimMax(h.name, 200);
    const position = trimMax(h.position, 200);
    if (name && position && email && phone) {
      return { name, position, email, phone };
    }
  }
  // Try legacy fields if present (adjust these keys to match your old schema)
  const name = trimMax(doc.hodName, 200);
  const position = trimMax(doc.hodPosition || 'Head of Department', 200);
  const email = normalizeEmail(doc.hodEmail || doc.email);
  const phone = sanitizePhone(doc.hodPhone || doc.phoneNumber);
  if (name && position && email && phone) {
    return { name, position, email, phone };
  }
  return undefined;
}

// Use synchronous bcryptjs methods (fine for a migration script)
async function hashIfNeeded(pw) {
  if (typeof pw !== 'string' || !pw) return undefined;
  if (isBcryptHash(pw)) return pw;
  const salt = bcrypt.genSaltSync(SALT);
  return bcrypt.hashSync(pw, salt);
}

async function main() {
  console.log(`Connecting to MongoDB...`);
  await mongoose.connect(MONGODB_URI, { autoIndex: false });
  const db = mongoose.connection;
  const col = db.collection(COLLECTION);

  // Pre-flight: duplicate emails after lowercasing
  console.log('Checking for duplicate emails (case-insensitive)...');
  const dupEmails = await col.aggregate([
    { $project: { emailLower: { $toLower: '$email' } } },
    { $group: { _id: '$emailLower', count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 }, _id: { $ne: null } } }
  ]).toArray();

  if (dupEmails.length > 0) {
    console.warn('Duplicate emails detected (case-insensitive). Resolve before creating unique index:');
    dupEmails.forEach(d => console.warn(` - ${d._id} (count: ${d.count})`));
  } else {
    console.log('No duplicate emails detected.');
  }

  // Migration
  const total = await col.countDocuments({});
  console.log(`Found ${total} ${COLLECTION} documents.`);
  const cursor = col.find({});
  let processed = 0;
  let modified = 0;
  let errors = 0;

  const bulk = [];

  // Use async iterator for compatibility with newer drivers
  for await (const doc of cursor) {
    try {
      const set = {};
      const unset = {};

      // Required/important fields
      if (typeof doc.name === 'string') set.name = trimMax(doc.name, 200);
      if (typeof doc.shortName === 'string') set.shortName = trimMax(doc.shortName, 50);
      if (typeof doc.description === 'string') set.description = trimMax(doc.description, 1000);

      // Type/Status normalization
      const type = normalizeEnumType(doc.type) ?? 'DEPARTMENT';
      set.type = type;

      const status = normalizeEnumStatus(doc.status) ?? 'ACTIVE';
      set.status = status;

      // Email
      const email = normalizeEmail(doc.email);
      if (email) set.email = email;

      // Password (hash if plaintext)
      if (doc.password) {
        const hashed = await hashIfNeeded(doc.password);
        if (hashed && hashed !== doc.password) {
          set.password = hashed;
        }
      }

      // Phone
      const phone = sanitizePhone(doc.phoneNumber);
      if (phone) set.phoneNumber = phone;

      if (typeof doc.faxNumber === 'string') set.faxNumber = doc.faxNumber.trim();
      if (typeof doc.website === 'string') set.website = doc.website.trim();

      // Address (merge legacy fields)
      const addr = normalizeAddress(doc);
      if (addr) set.address = addr;
      // Remove legacy root-level address fields if present
      ['addressLine1', 'addressLine2', 'city', 'district', 'province', 'postalCode'].forEach(k => {
        if (doc[k] !== undefined) unset[k] = '';
      });

      // Head of Department
      const hod = normalizeHeadOfDepartment(doc);
      if (hod) set.headOfDepartment = hod;

      // Contact persons (ensure array of proper objects)
      if (Array.isArray(doc.contactPersons)) {
        const contacts = doc.contactPersons
          .map((c) => {
            const name = trimMax(c?.name, 200);
            const position = trimMax(c?.position, 200);
            const email = normalizeEmail(c?.email);
            const phone = sanitizePhone(c?.phone);
            if (name && position && email && phone) {
              return { name, position, email, phone };
            }
            return null;
          })
          .filter(Boolean);
        set.contactPersons = contacts;
      }

      // Services
      if (Array.isArray(doc.services)) {
        const normalizedServices = normalizeServices(doc.services);
        if (normalizedServices) {
          set.services = normalizedServices;
        }
      }

      // Agents counts
      if (typeof doc.totalAgents !== 'number') set.totalAgents = 0;
      if (typeof doc.activeAgents !== 'number') set.activeAgents = 0;

      // Working hours
      set.workingHours = ensureWorkingHours(doc.workingHours);

      // Config flags
      if (typeof doc.allowOnlineServices !== 'boolean') set.allowOnlineServices = true;
      if (typeof doc.requiresAppointment !== 'boolean') set.requiresAppointment = false;
      if (doc.requiresAppointment === true && typeof doc.maxAppointmentsPerDay !== 'number') {
        // Optional: set a sensible default if required
        // set.maxAppointmentsPerDay = 50;
      }

      // Auth/Security defaults
      if (typeof doc.loginAttempts !== 'number') set.loginAttempts = 0;

      // departmentId
      if (!doc.departmentId || typeof doc.departmentId !== 'string') {
        set.departmentId = generateDepartmentId(type, doc._id);
      } else {
        set.departmentId = String(doc.departmentId).toUpperCase().trim();
      }

      // Timestamps
      if (!doc.createdAt) set.createdAt = doc._id?.getTimestamp?.() || new Date();
      set.updatedAt = new Date();

      // Build update op only if anything to change
      const update = {};
      if (Object.keys(set).length > 0) update.$set = set;
      if (Object.keys(unset).length > 0) update.$unset = unset;
      if (Object.keys(update).length > 0) {
        bulk.push({
          updateOne: {
            filter: { _id: doc._id },
            update
          }
        });
      }

      processed++;

      if (bulk.length >= BATCH) {
        if (!DRY) {
          const res = await col.bulkWrite(bulk, { ordered: false });
          modified += res.modifiedCount || 0;
        } else {
          console.log(`DRY RUN: would apply ${bulk.length} updates...`);
        }
        bulk.length = 0;
      }
    } catch (e) {
      errors++;
      console.error(`Error transforming _id=${doc?._id}:`, e);
      processed++;
    }
  }

  if (bulk.length > 0) {
    if (!DRY) {
      const res = await col.bulkWrite(bulk, { ordered: false });
      modified += res.modifiedCount || 0;
    } else {
      console.log(`DRY RUN: would apply ${bulk.length} updates...`);
    }
  }

  console.log(`Processed: ${processed}, Modified: ${modified}, Errors: ${errors}`);

  // Indexes: only create unique indexes after fixing duplicates
  if (!DRY) {
    if (dupEmails.length === 0) {
      console.log('Creating indexes...');
      // Unique
      await col.createIndex({ departmentId: 1 }, { unique: true, name: 'uniq_departmentId' });
      await col.createIndex({ email: 1 }, { unique: true, name: 'uniq_email' });
      // Non-unique helpful indexes
      await col.createIndex({ name: 1 }, { name: 'idx_name' });
      await col.createIndex({ status: 1 }, { name: 'idx_status' });
      await col.createIndex({ type: 1 }, { name: 'idx_type' });
      await col.createIndex({ 'address.district': 1 }, { name: 'idx_address_district' });
      await col.createIndex({ 'address.province': 1 }, { name: 'idx_address_province' });
      console.log('Indexes created.');
    } else {
      console.warn('Skipped unique index creation due to duplicate emails. Resolve and re-run index creation.');
    }
  } else {
    console.log('DRY RUN: Skipped index creation.');
  }

  await mongoose.disconnect();
  console.log('Done.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});