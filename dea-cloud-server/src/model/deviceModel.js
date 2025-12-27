import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
    deviceId: {
        type: String,
        unique: true,
        required: true
    },
    access: {
        type: String,
        enum: ["allowed", "deny"],
        default: "deny"
    },
    name: {
        type: String
    }
}, {
    timestamps: true
});

export default mongoose.model("DeviceManagement", deviceSchema);
