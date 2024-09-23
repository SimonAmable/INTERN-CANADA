import { MongoClient } from 'mongodb';

let client;
let clientPromise;

const uri = process.env.MONGODB_ATLAS_URI; // Add your MongoDB connection string in .env file

if (!uri) {
  throw new Error("Please add your MongoDB URI to the environment variables.");
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable to preserve the connection across hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. 
export default clientPromise;
