// lib/db.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  // In CI environment or when SKIP_DB_VALIDATION is set, provide a mock URI
  if (process.env.CI === 'true' || process.env.SKIP_DB_VALIDATION === 'true') {
    console.warn('Running in CI environment or DB validation skipped - using mock database connection');
  } else {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connect = async () => {
  // In CI environment or when DB validation is skipped, don't attempt real connection
  if (process.env.CI === 'true' || process.env.SKIP_DB_VALIDATION === 'true') {
    console.log('Skipping database connection in CI environment');
    return null;
  }

  // If no MONGODB_URI in non-CI environment, throw error
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  // Check if we have a cached connection
  if (cached.conn) {
    return cached.conn;
  }

  const connectionState = mongoose.connection.readyState;
  
  // If already connected, cache and return
  if (connectionState === 1) {
    cached.conn = mongoose;
    return cached.conn;
  }
  
  // If connecting, wait for cached promise
  if (connectionState === 2 && cached.promise) {
    cached.conn = await cached.promise;
    return cached.conn;
  }

  // If disconnected, disconnecting, or uninitialized, establish a new connection
  if (connectionState === 0 || connectionState === 3) {
    if (!cached.promise) {
      const opts = {
        dbName: "govlink",
        bufferCommands: true,
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      };

      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log('Connected to MongoDB (GovLink)');
        return mongoose;
      }).catch((error) => {
        console.error('MongoDB connection error:', error);
        cached.promise = null; // Reset promise on error
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Database connection failed: ${errorMessage}`);
      });
    }

    try {
      cached.conn = await cached.promise;
      return cached.conn;
    } catch (error) {
      cached.promise = null;
      throw error;
    }
  }

  return cached.conn;
};

// Connection event handlers (only add if not in CI)
if (process.env.CI !== 'true' && process.env.SKIP_DB_VALIDATION !== 'true') {
  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to GovLink database');
  });

  mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from GovLink database');
  });

  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', async () => {
    if (cached.conn) {
      await mongoose.connection.close();
      console.log('Mongoose connection closed due to application termination');
    }
    process.exit(0);
  });
}

export default connect;