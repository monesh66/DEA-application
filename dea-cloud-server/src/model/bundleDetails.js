import mongoose from "mongoose";

const bundleDetailsSchema = new mongoose.Schema({
    bundleName: { type: String, required: true, unique: true },
    members: { type: [String], default: [] },
    totalFiles: { type: Number, required: true },
    filesList: { type: [String], required: true }, // ["n1.json","n2.json"...]
    deadline: { type: Date },
    totalCompleted: { type: Number, default: 0 },
}, { timestamps: true });

export const BundleDetails = mongoose.model("BundleDetails", bundleDetailsSchema);
