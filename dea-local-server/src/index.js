import dotenv from "dotenv";
import multer from "multer";
dotenv.config();   // 👈 MUST be first

import express from "express";
import cors from "cors";
import mainRoute from "./routes/mainRoute.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173", // Vite dev server
        credentials: true
    })
);
app.use(cookieParser());
app.use(express.json());

app.use("/", mainRoute);

// ===============================
// ✅ GLOBAL ERROR HANDLER (LAST)
// ===============================
// app.use((err, req, res, next) => {
//   if (err instanceof multer.MulterError || err.message) {
//     return res.status(400).json({
//       ok: false,
//       error: err.message
//     });
//   }

//   next(err);
// });

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Cloud URL:", process.env.CLOUD_SERVER_URL);
    console.log(`Local server running on http://localhost:${PORT}`);
});
