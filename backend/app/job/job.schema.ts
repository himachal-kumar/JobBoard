import mongoose from "mongoose";

export interface IJob {
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  company: string;
  location: string;
  type: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
  experience: "ENTRY" | "JUNIOR" | "MID" | "SENIOR" | "LEAD";
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  skills: string[];
  benefits: string[];
  employer: mongoose.Types.ObjectId;
  status: "ACTIVE" | "CLOSED" | "DRAFT";
  applications: mongoose.Types.ObjectId[];
  deadline?: Date;
  remote: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new mongoose.Schema<IJob>(
  {
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "CLOSED", "DRAFT"],
      default: "DRAFT",
    },
    applications: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "application",
    }],
    deadline: { type: Date },
    remote: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index for better search performance
JobSchema.index({ title: "text", description: "text", skills: "text" });
JobSchema.index({ status: 1, employer: 1 });
JobSchema.index({ createdAt: -1 });

export const JobModel = mongoose.model<IJob>("job", JobSchema);
export default JobModel;
