"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const JobSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    requirements: [{ type: String, required: true }],
    responsibilities: [{ type: String, required: true }],
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    type: {
        type: String,
        required: true,
        enum: ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"],
    },
    experience: {
        type: String,
        required: true,
        enum: ["ENTRY", "JUNIOR", "MID", "SENIOR", "LEAD"],
    },
    salary: {
        min: { type: Number, required: true },
        max: { type: Number, required: true },
        currency: { type: String, default: "USD" },
    },
    skills: [{ type: String }],
    benefits: [{ type: String }],
    employer: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    status: {
        type: String,
        enum: ["ACTIVE", "CLOSED", "DRAFT"],
        default: "DRAFT",
    },
    applications: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "application",
        }],
    deadline: { type: Date },
    remote: { type: Boolean, default: false },
}, { timestamps: true });
// Index for better search performance
JobSchema.index({ title: "text", description: "text", skills: "text" });
JobSchema.index({ status: 1, employer: 1 });
JobSchema.index({ createdAt: -1 });
exports.JobModel = mongoose_1.default.model("job", JobSchema);
exports.default = exports.JobModel;
