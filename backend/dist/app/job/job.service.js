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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobService = void 0;
const job_schema_1 = require("./job.schema");
const application_schema_1 = require("../application/application.schema");
class JobService {
    /**
     * Create a new job posting.
     *
     * @param jobData - The data to create the job with.
     * @param employerId - The ID of the employer creating the job.
     * @returns The created job document.
     */
    static createJob(jobData, employerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const job = new job_schema_1.JobModel(Object.assign(Object.assign({}, jobData), { salary: {
                    min: jobData.salaryMin,
                    max: jobData.salaryMax,
                    currency: jobData.salaryCurrency || "USD",
                }, employer: employerId, applications: [], status: "ACTIVE" }));
            return yield job.save();
        });
    }
    /**
     * Update an existing job posting.
     *
     * @param jobId - The ID of the job to update.
     * @param updateData - The data to update the job with.
     * @param employerId - The ID of the employer updating the job.
     * @returns The updated job document, or null if the job was not found or the employer doesn't have access to it.
     */
    static updateJob(jobId, updateData, employerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const job = yield job_schema_1.JobModel.findOne({ _id: jobId, employer: employerId });
            if (!job) {
                return null;
            }
            // Create a clean update object
            const cleanUpdateData = Object.assign({}, updateData);
            if (updateData.salaryMin !== undefined || updateData.salaryMax !== undefined) {
                cleanUpdateData.salary = {
                    min: updateData.salaryMin !== undefined ? updateData.salaryMin : job.salary.min,
                    max: updateData.salaryMax !== undefined ? updateData.salaryMax : job.salary.max,
                    currency: updateData.salaryCurrency || job.salary.currency,
                };
            }
            // Remove the individual salary fields before updating
            const { salaryMin, salaryMax, salaryCurrency } = cleanUpdateData, finalUpdateData = __rest(cleanUpdateData, ["salaryMin", "salaryMax", "salaryCurrency"]);
            return yield job_schema_1.JobModel.findByIdAndUpdate(jobId, finalUpdateData, { new: true, runValidators: true });
        });
    }
    /**
     * Deletes a job posting. Only the employer who created the job can delete it.
     * @param jobId The ID of the job to delete.
     * @param employerId The ID of the employer who created the job.
     * @returns `true` if the job was deleted, `false` otherwise.
     */
    static deleteJob(jobId, employerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield job_schema_1.JobModel.deleteOne({ _id: jobId, employer: employerId });
            return result.deletedCount > 0;
        });
    }
    static getJobById(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield job_schema_1.JobModel.findById(jobId)
                .populate("employer", "name company image")
                .populate("applications", "status candidate appliedAt");
        });
    }
    static getJobsByEmployer(employerId_1) {
        return __awaiter(this, arguments, void 0, function* (employerId, page = 1, limit = 10) {
            const skip = (page - 1) * limit;
            const [jobs, total] = yield Promise.all([
                job_schema_1.JobModel.find({ employer: employerId })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .populate("applications", "status candidate appliedAt"),
                job_schema_1.JobModel.countDocuments({ employer: employerId })
            ]);
            return { jobs, total };
        });
    }
    /**
     * Searches for jobs based on the given query parameters.
     *
     * The following query parameters are supported:
     *
     * - `search`: Search term for job title, description, or skills
     * - `location`: Job location filter
     * - `type`: Job type filter (FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP)
     * - `experience`: Experience level filter (ENTRY, JUNIOR, MID, SENIOR, LEAD)
     * - `remote`: Remote work filter (boolean)
     * - `page`: Page number for pagination (default is 1)
     * - `limit`: Number of items per page (default is 10)
     *
     * The function returns a promise that resolves to an object with the following properties:
     *
     * - `jobs`: Array of job objects matching the search criteria
     * - `total`: Total number of jobs matching the search criteria
     */
    static searchJobs(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { search, location, type, experience, remote, page = 1, limit = 10 } = query;
            // Convert string inputs to appropriate types
            const pageNum = typeof page === 'string' ? parseInt(page, 10) || 1 : page;
            const limitNum = typeof limit === 'string' ? parseInt(limit, 10) || 10 : limit;
            const remoteBool = typeof remote === 'string' ? remote.toLowerCase() === 'true' : remote;
            const skip = (pageNum - 1) * limitNum;
            const filter = { status: "ACTIVE" };
            if (search && search.trim()) {
                filter.$text = { $search: search.trim() };
            }
            if (location && location.trim()) {
                filter.location = { $regex: location.trim(), $options: "i" };
            }
            if (type) {
                filter.type = type;
            }
            if (experience) {
                filter.experience = experience;
            }
            if (remoteBool !== undefined) {
                filter.remote = remoteBool;
            }
            const [jobs, total] = yield Promise.all([
                job_schema_1.JobModel.find(filter)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limitNum)
                    .populate("employer", "name company image"),
                job_schema_1.JobModel.countDocuments(filter)
            ]);
            return { jobs, total };
        });
    }
    /**
     * Retrieves statistics about a job posting.
     * @param employerId The ID of the employer who owns the job
     * @returns An object containing the total number of jobs, the number of active jobs, the number of closed jobs, and the number of applications submitted
     */
    static getJobStats(employerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [total, active, closed, applications] = yield Promise.all([
                job_schema_1.JobModel.countDocuments({ employer: employerId }),
                job_schema_1.JobModel.countDocuments({ employer: employerId, status: "ACTIVE" }),
                job_schema_1.JobModel.countDocuments({ employer: employerId, status: "CLOSED" }),
                application_schema_1.ApplicationModel.countDocuments({ employer: employerId })
            ]);
            return { total, active, closed, applications };
        });
    }
    /**
     * Closes a job posting.
     * @param jobId The ID of the job to close
     * @param employerId The ID of the employer who owns the job
     * @returns A boolean indicating whether the job was successfully closed
     */
    static closeJob(jobId, employerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield job_schema_1.JobModel.updateOne({ _id: jobId, employer: employerId }, { status: "CLOSED" });
            return result.modifiedCount > 0;
        });
    }
    /**
     * Reopens a job posting.
     * @param jobId The ID of the job to reopen
     * @param employerId The ID of the employer who owns the job
     * @returns A boolean indicating whether the job was successfully reopened
     */
    static reopenJob(jobId, employerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield job_schema_1.JobModel.updateOne({ _id: jobId, employer: employerId }, { status: "ACTIVE" });
            return result.modifiedCount > 0;
        });
    }
}
exports.JobService = JobService;
