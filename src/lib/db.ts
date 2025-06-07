import "server-only";
import mongoose from "mongoose";

export const connectToDatabase = async () => {
  if(mongoose.connection.readyState === 0){
    const uri = process.env.MONGODB_URI;
    if(!uri) throw new Error("Bad Database URI");
    await mongoose.connect(uri);
  }
};




