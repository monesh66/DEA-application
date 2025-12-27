// dea-cloud-server/models/loginCred.js
import mongoose from "mongoose";

const loginCredSchema = new mongoose.Schema({
  sno: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  device: {
    type: String,
    required: true
    // "any" OR specific deviceId
  }
}, { timestamps: true });

export default mongoose.model("LoginCred", loginCredSchema);
