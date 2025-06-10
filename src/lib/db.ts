import "server-only";
import mongoose, { Connection, Mongoose } from "mongoose";

type MongooseCache = {
  conn: Connection | null,
  promise: Promise<Mongoose> | null
}

declare global {
  var mongoose: MongooseCache
}

global.mongoose = global.mongoose || {conn: null, promise: null};

export async function dbConnect(): Promise<Connection> {
  if(global.mongoose.conn?.readyState === 1) return global.mongoose.conn;
  if(global.mongoose.promise) return global.mongoose.conn ?? (await global.mongoose.promise).connection;

  try {
    const dbUrl = process.env.MONGODB_URI;
    if (!dbUrl) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    const options = {
      autoIndex: process.env.NODE_ENV !== 'production',
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000, 
      serverSelectionTimeoutMS: 5000, 
      maxPoolSize: 10, 
      minPoolSize: 1,
    }

    global.mongoose.promise = mongoose.connect(dbUrl, options);
    global.mongoose.conn = (await global.mongoose.promise).connection;

    global.mongoose.conn.on("error", (err) => {
      console.error(`Mongodb connection error: ${err}`);
      global.mongoose = {conn: null, promise: null};
    })
    
    global.mongoose.conn.on("connected", () => {
      console.log(`MongoDb connection established successfully.`);
    })

    return global.mongoose.conn;
  } catch (err) {
    global.mongoose = {conn: null, promise: null};
    console.error(`Mongodb connection failed: ${err}`);
    throw new Error(`Mongodb connection failed: ${err}`);
  }
}

export async function dbDisconnect(): Promise<void> {
  if(global.mongoose.conn){
    global.mongoose.conn.close();
    global.mongoose = {conn: null, promise: null};
    console.log(`Mongodb connection closed.`)
  }
}


