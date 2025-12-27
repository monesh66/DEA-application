import express from "express";
import cors from "cors";
import mainRoute from "./routes/mainRoute.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // ✅ MUST be before using process.env

const app = express();

app.use(cors());
app.use(express.json());

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection failed", err.message);
        process.exit(1);
    }
};

connectDB();

app.use("/", mainRoute);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Cloud server running on http://localhost:${PORT}`);
});
