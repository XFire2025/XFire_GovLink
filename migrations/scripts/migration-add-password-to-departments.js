// migrations/scripts/migration-add-password-to-departments.mjs
import { MongoClient } from 'mongodb';
import { genSalt, hash } from 'bcryptjs';
import 'dotenv/config';

const { MONGODB_URI } = process.env;
const DEFAULT_PASSWORD = 'TempPass123!';

async function migrate() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI environment variable is not set');
    process.exitCode = 1;
    return;
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(); // Uses the database from the connection string
    const collection = db.collection('departments');

    const departmentsWithoutPassword = await collection
      .find({ password: { $exists: false } })
      .toArray();

    console.log(`Found ${departmentsWithoutPassword.length} departments without password`);

    if (departmentsWithoutPassword.length === 0) {
      console.log('No departments need updating');
      return;
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(DEFAULT_PASSWORD, salt);

    const bulkOps = departmentsWithoutPassword.map((dept) => ({
      updateOne: {
        filter: { _id: dept._id },
        update: {
          $set: {
            password: hashedPassword,
            status: dept.status || 'active',
            tags: Array.isArray(dept.tags) ? dept.tags : [],
            code: typeof dept.code === 'string' ? dept.code.toUpperCase() : dept.code,
          },
        },
      },
    }));

    if (bulkOps.length) {
      const result = await collection.bulkWrite(bulkOps);
      console.log(`Updated ${result.modifiedCount} departments with password`);
    }

    console.log('Creating indexes...');
    await collection.createIndex({ code: 1 }, { unique: true });
    await collection.createIndex({ name: 1 });
    await collection.createIndex({ status: 1 });
    await collection.createIndex({ createdAt: -1 });
    console.log('Indexes created successfully');

    const stillMissing = await collection.countDocuments({ password: { $exists: false } });
    if (stillMissing > 0) {
      console.warn(`Warning: ${stillMissing} departments still missing password`);
    } else {
      console.log('Migration completed successfully!');
      console.log(`All departments now have a password. Default password: ${DEFAULT_PASSWORD}`);
      console.log('Please ensure users change their passwords after first login.');
    }
  } catch (error) {
    console.error('Migration failed:', error);
    process.exitCode = 1;
  } finally {
    try {
      await client.close();
      console.log('Disconnected from MongoDB');
    } catch {
      // ignore close errors
    }
  }
}

migrate();