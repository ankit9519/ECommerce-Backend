import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const DB_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(`Error Message: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
