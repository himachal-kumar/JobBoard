"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationService = void 0;
const application_schema_1 = require("./application.schema");
const job_schema_1 = require("../job/job.schema");
class ApplicationService {
    static createApplication(applicationData, candidateId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if job exists and is active
            const job = yield job_schema_1.JobModel.findById(applicationData.jobId);
            if (!job || job.status !== "ACTIVE") {
                throw new Error("Job not found or not active");
            }
            // Check if candidate has already applied
            const existingApplication = yield application_schema_1.ApplicationModel.findOne({
                job: applicationData.jobId,
                candidate: candidateId,
            });
            if (existingApplication) {
                throw new Error("You have already applied for this job");
            }
            const application = new application_schema_1.ApplicationModel({
                job: applicationData.jobId, // Convert jobId to job field
                coverLetter: applicationData.coverLetter,
                resume: applicationData.resume,
                expectedSalary: applicationData.expectedSalary ? {
                    amount: applicationData.expectedSalary,
                    currency: applicationData.expectedSalaryCurrency || "USD",
                } : undefined,
                availability: applicationData.availability,
                notes: applicationData.notes,
                candidate: candidateId,
                employer: job.employer,
                appliedAt: new Date(),
            });
            const savedApplication = yield application.save();
            // Add application to job
            yield job_schema_1.JobModel.findByIdAndUpdate(applicationData.jobId, {
                $push: { applications: savedApplication._id }
            });
            return savedApplication;
        });
    }
    static updateApplicationStatus(applicationId, updateData, employerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const application = yield application_schema_1.ApplicationModel.findOne({
                _id: applicationId,
                employer: employerId,
            });
            if (!application) {
                return null;
            }
            const updateFields = { status: updateData.status };
            if (updateData.employerNotes) {
                updateFields.employerNotes = updateData.employerNotes;
            }
            if (updateData.status !== "PENDING") {
                updateFields.reviewedAt = new Date();
            }
            return yield application_schema_1.ApplicationModel.findByIdAndUpdate(applicationId, updateFields, { new: true, runValidators: true });
        });
    }
    static getApplicationById(applicationId, userId, userRole) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = { _id: applicationId };
            if (userRole === "CANDIDATE") {
                query.candidate = userId;
            }
            else if (userRole === "EMPLOYER") {
                query.employer = userId;
            }
            return yield application_schema_1.ApplicationModel.findOne(query)
                .populate("job", "title company location type experience")
                .populate("candidate", "name email image skills")
                .populate("employer", "name company image");
        });
    }
    static getApplicationsByCandidate(candidateId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { status, jobId, page = 1, limit = 10 } = query;
            const skip = (page - 1) * limit;
            const filter = { candidate: candidateId };
            if (status) {
                filter.status = status;
            }
            if (jobId) {
                filter.job = jobId;
            }
            const [applications, total] = yield Promise.all([
                application_schema_1.ApplicationModel.find(filter)
                    .sort({ appliedAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .populate("job", "title company location type experience")
                    .populate("employer", "name company image"),
                application_schema_1.ApplicationModel.countDocuments(filter)
            ]);
            return { applications, total };
        });
    }
    static getApplicationsByEmployer(employerId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { status, jobId, candidateId, page = 1, limit = 10 } = query;
            const skip = (page - 1) * limit;
            const filter = { employer: employerId };
            if (status) {
                filter.status = status;
            }
            if (jobId) {
                filter.job = jobId;
            }
            if (candidateId) {
                filter.candidate = candidateId;
            }
            const [applications, total] = yield Promise.all([
                application_schema_1.ApplicationModel.find(filter)
                    .sort({ appliedAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .populate("job", "title company location type experience")
                    .populate("candidate", "name email image skills")
                    .populate("employer", "name company image"),
                application_schema_1.ApplicationModel.countDocuments(filter)
            ]);
            return { applications, total };
        });
    }
    static getApplicationStats(employerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [total, pending, reviewing, shortlisted, rejected, accepted] = yield Promise.all([
                application_schema_1.ApplicationModel.countDocuments({ employer: employerId }),
                application_schema_1.ApplicationModel.countDocuments({ employer: employerId, status: "PENDING" }),
                application_schema_1.ApplicationModel.countDocuments({ employer: employerId, status: "REVIEWING" }),
                application_schema_1.ApplicationModel.countDocuments({ employer: employerId, status: "SHORTLISTED" }),
                application_schema_1.ApplicationModel.countDocuments({ employer: employerId, status: "REJECTED" }),
                application_schema_1.ApplicationModel.countDocuments({ employer: employerId, status: "ACCEPTED" })
            ]);
            return { total, pending, reviewing, shortlisted, rejected, accepted };
        });
    }
    static withdrawApplication(applicationId, candidateId) {
        return __awaiter(this, void 0, void 0, function* () {
            const application = yield application_schema_1.ApplicationModel.findOne({
                _id: applicationId,
                candidate: candidateId,
                status: "PENDING"
            });
            if (!application) {
                return false;
            }
            // Remove application from job
            yield job_schema_1.JobModel.findByIdAndUpdate(application.job, {
                $pull: { applications: applicationId }
            });
            // Delete the application
            const result = yield application_schema_1.ApplicationModel.deleteOne({ _id: applicationId });
            return result.deletedCount > 0;
        });
    }
}
exports.ApplicationService = ApplicationService;
