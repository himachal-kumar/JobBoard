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
exports.JobController = void 0;
const job_service_1 = require("./job.service");
const job_dto_1 = require("./job.dto");
const class_validator_1 = require("class-validator");
class JobController {
    /**
     * Creates a new job posting.
     *
     * @swagger
     * /jobs:
     *   post:
     *     summary: Create job
     *     description: Create a new job posting (Employer only)
     *     tags: [Jobs]
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateJobDto'
     *     responses:
     *       201:
     *         description: Job created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 data:
     *                   $ref: '#/components/schemas/Job'
     *                 message:
     *                   type: string
     *       400:
     *         description: Bad request - validation errors
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden - Employer access required
     *       500:
     *         description: Internal server error
     */
    static createJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobData = new job_dto_1.CreateJobDto();
                Object.assign(jobData, req.body);
                const errors = yield (0, class_validator_1.validate)(jobData);
                if (errors.length > 0) {
                    res.status(400).json({
                        message: "Validation failed",
                        errors: errors.map(error => ({
                            field: error.property,
                            message: Object.values(error.constraints || {}).join(", ")
                        }))
                    });
                    return;
                }
                const job = yield job_service_1.JobService.createJob(jobData, req.user._id);
                res.status(201).json({
                    message: "Job created successfully",
                    data: job
                });
            }
            catch (error) {
                res.status(500).json({
                    message: "Failed to create job",
                    error: error.message
                });
            }
        });
    }
    static updateJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { jobId } = req.params;
                const updateData = new job_dto_1.UpdateJobDto();
                Object.assign(updateData, req.body);
                const errors = yield (0, class_validator_1.validate)(updateData);
                if (errors.length > 0) {
                    res.status(400).json({
                        message: "Validation failed",
                        errors: errors.map(error => ({
                            field: error.property,
                            message: Object.values(error.constraints || {}).join(", ")
                        }))
                    });
                    return;
                }
                const job = yield job_service_1.JobService.updateJob(jobId, updateData, req.user._id);
                if (!job) {
                    res.status(404).json({ message: "Job not found or access denied" });
                    return;
                }
                res.json({
                    message: "Job updated successfully",
                    data: job
                });
            }
            catch (error) {
                res.status(500).json({
                    message: "Failed to update job",
                    error: error.message
                });
            }
        });
    }
    /**
     * Deletes a job posting.
     *
     * @swagger
     * /jobs/{jobId}:
     *   delete:
     *     summary: Delete job
     *     description: Delete a job posting (Employer only)
     *     tags: [Jobs]
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: jobId
     *         required: true
     *         schema:
     *           type: string
     *         description: Job ID
     *     responses:
     *       200:
     *         description: Job deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 message:
     *                   type: string
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden - Employer access required
     *       404:
     *         description: Job not found
     *       500:
     *         description: Internal server error
     */
    static deleteJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { jobId } = req.params;
                const deleted = yield job_service_1.JobService.deleteJob(jobId, req.user._id);
                if (!deleted) {
                    res.status(404).json({ message: "Job not found or access denied" });
                    return;
                }
                res.json({ message: "Job deleted successfully" });
            }
            catch (error) {
                res.status(500).json({
                    message: "Failed to delete job",
                    error: error.message
                });
            }
        });
    }
    static getJobById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { jobId } = req.params;
                const job = yield job_service_1.JobService.getJobById(jobId);
                if (!job) {
                    res.status(404).json({ message: "Job not found" });
                    return;
                }
                res.json({
                    message: "Job retrieved successfully",
                    data: job
                });
            }
            catch (error) {
                res.status(500).json({
                    message: "Failed to retrieve job",
                    error: error.message
                });
            }
        });
    }
    /**
     * Retrieve all jobs posted by the authenticated employer
     * @param req Express request object
     * @param res Express response object
     * @returns Promise that resolves to nothing
     */
    static getJobsByEmployer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10 } = req.query;
                const result = yield job_service_1.JobService.getJobsByEmployer(req.user._id, Number(page), Number(limit));
                res.json({
                    message: "Jobs retrieved successfully",
                    data: result.jobs,
                    pagination: {
                        page: Number(page),
                        limit: Number(limit),
                        total: result.total,
                        pages: Math.ceil(result.total / Number(limit))
                    }
                });
            }
            catch (error) {
                res.status(500).json({
                    message: "Failed to retrieve jobs",
                    error: error.message
                });
            }
        });
    }
    static searchJobs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Pass raw query object directly to service
                const result = yield job_service_1.JobService.searchJobs(req.query);
                res.json({
                    message: "Jobs search completed",
                    data: result.jobs,
                    pagination: {
                        page: parseInt(req.query.page) || 1,
                        limit: parseInt(req.query.limit) || 10,
                        total: result.total,
                        pages: Math.ceil(result.total / (parseInt(req.query.limit) || 10))
                    }
                });
            }
            catch (error) {
                res.status(500).json({
                    message: "Failed to search jobs",
                    error: error.message
                });
            }
        });
    }
    /**
     * Test endpoint for job search functionality
     * @param req Express request object
     * @param res Express response object
     * @returns Promise that resolves to nothing
     */
    static testSearch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.json({
                    message: "Test endpoint working",
                    query: req.query,
                    page: req.query.page,
                    limit: req.query.limit
                });
            }
            catch (error) {
                res.status(500).json({
                    message: "Test failed",
                    error: error.message
                });
            }
        });
    }
    static getJobStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stats = yield job_service_1.JobService.getJobStats(req.user._id);
                res.json({
                    message: "Job statistics retrieved successfully",
                    data: stats
                });
            }
            catch (error) {
                res.status(500).json({
                    message: "Failed to retrieve job statistics",
                    error: error.message
                });
            }
        });
    }
    /**
     * Close a job posting as an employer
     * @param req Express request object with `jobId` in the URL parameters
     * @param res Express response object
     * @returns Promise that resolves to nothing
     * @throws 404 if job not found or access denied
     * @throws 500 if an internal server error occurs
     */
    static closeJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { jobId } = req.params;
                const closed = yield job_service_1.JobService.closeJob(jobId, req.user._id);
                if (!closed) {
                    res.status(404).json({ message: "Job not found or access denied" });
                    return;
                }
                res.json({ message: "Job closed successfully" });
            }
            catch (error) {
                res.status(500).json({
                    message: "Failed to close job",
                    error: error.message
                });
            }
        });
    }
    static reopenJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { jobId } = req.params;
                const reopened = yield job_service_1.JobService.reopenJob(jobId, req.user._id);
                if (!reopened) {
                    res.status(404).json({ message: "Job not found or access denied" });
                    return;
                }
                res.json({ message: "Job reopened successfully" });
            }
            catch (error) {
                res.status(500).json({
                    message: "Failed to reopen job",
                    error: error.message
                });
            }
        });
    }
}
exports.JobController = JobController;
