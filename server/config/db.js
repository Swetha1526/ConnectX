const mongoose = require('mongoose');

let mongoServer = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  try {
    if (uri && uri !== 'in-memory') {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}`);
      return conn;
    }
  } catch (error) {
    console.warn(`[MongoDB] Local/Remote connection failed (${error.message}). Falling back to in-memory MongoDB for smooth local testing & development...`);
  }

  // Fallback: Start embedded in-memory MongoDB
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongoServer = await MongoMemoryServer.create();
    const memoryUri = mongoServer.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`[MongoDB] In-Memory Database connected at: ${memoryUri}`);
    return conn;
  } catch (memError) {
    console.error(`[MongoDB] Critical Error connecting to Database: ${memError.message}`);
    process.exit(1);
  }
};

const closeDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
  }
};

module.exports = { connectDB, closeDB };
