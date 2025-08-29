import mongoose from "mongoose";

export interface IApplication {
  job: mongoose.Types.ObjectId;
  candidate: mongoose.Types.ObjectId;
  employer: mongoose.Types.ObjectId;
  status: "PENDING" | "REVIEWING" | "SHORTLISTED" | "REJECTED" | "ACCEPTED";
  coverLetter: string;
  resume: string;
  mobileNumber: string;
  expectedSalary?: {
    amount: number;
    currency: string;
  };
  availability: "IMMEDIATE" | "2_WEEKS" | "1_MONTH" | "3_MONTHS" | "NEGOTIABLE";
  notes?: string;
  employerNotes?: string;
  appliedAt: Date;
  reviewedAt?: Date;
  updatedAt: Date;
}

const ApplicationSchema = new mongoose.Schema<IApplication>(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "job",
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
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
    mobileNumber: { type: String, required: true },
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
  },
  { timestamps: true }
);

// Indexes for better performance
ApplicationSchema.index({ job: 1, candidate: 1 }, { unique: true });
ApplicationSchema.index({ candidate: 1, status: 1 });
ApplicationSchema.index({ employer: 1, status: 1 });
ApplicationSchema.index({ appliedAt: -1 });

export const ApplicationModel = mongoose.model<IApplication>("application", ApplicationSchema);
export default ApplicationModel;
