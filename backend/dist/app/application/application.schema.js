"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ApplicationSchema = new mongoose_1.default.Schema({
    job: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "job",
        required: true,
    },
    candidate: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    employer: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    status: {
        type: String,
        enum: ["PENDING", "REVIEWING", "SHORTLISTED", "REJECTED", "ACCEPTED"],
        default: "PENDING",
    },
    coverLetter: { type: String, required: true },
    resume: { type: String, required: true },
    expectedSalary: {
        amount: { type: Number },
        currency: { type: String, default: "USD" },
    },
    availability: {
        type: String,
        enum: ["IMMEDIATE", "2_WEEKS", "1_MONTH", "3_MONTHS", "NEGOTIABLE"],
        default: "NEGOTIABLE",
    },
    notes: { type: String },
    employerNotes: { type: String },
    appliedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date },
}, { timestamps: true });
// Indexes for better performance
ApplicationSchema.index({ job: 1, candidate: 1 }, { unique: true });
ApplicationSchema.index({ candidate: 1, status: 1 });
ApplicationSchema.index({ employer: 1, status: 1 });
ApplicationSchema.index({ appliedAt: -1 });
exports.ApplicationModel = mongoose_1.default.model("application", ApplicationSchema);
exports.default = exports.ApplicationModel;
