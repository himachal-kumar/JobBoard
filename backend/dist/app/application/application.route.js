"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const application_controller_1 = require("./application.controller");
const auth_middleware_1 = require("../common/middleware/auth.middleware");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_middleware_1.authenticateToken);
/**
 * @swagger
 * /applications:
 *   post:
 *     summary: Create job application
 *     description: Submit a new job application (Candidate only)
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobId:
 *                 type: string
 *                 description: ID of the job being applied for
 *                 example: "64f8a1b2c3d4e5f6a7b8c9d0"
 *               coverLetter:
 *                 type: string
 *                 description: Cover letter content
 *                 example: "I am excited to apply for this position..."
 *               resume:
 *                 type: string
 *                 description: Resume file path/URL
 *                 example: "/uploads/resumes/resume_123.pdf"
 *               expectedSalary:
 *                 type: object
 *                 properties:
 *                   amount:
 *                     type: number
 *                     description: Expected salary amount
 *                     example: 120000
 *                   currency:
 *                     type: string
 *                     description: Salary currency
 *                     example: "USD"
 *               availability:
 *                 type: string
 *                 enum: [IMMEDIATE, 2_WEEKS, 1_MONTH, 3_MONTHS, NEGOTIABLE]
 *                 description: When the candidate can start
 *                 example: "2_WEEKS"
 *               notes:
 *                 type: string
 *                 description: Additional notes from candidate
 *                 example: "I am available for interviews anytime next week"
 *             required:
 *               - jobId
 *               - coverLetter
 *               - resume
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApplicationResponse'
 *       400:
 *         description: Bad request - validation errors
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Candidate access required
 *       409:
 *         description: Application already exists for this job
 *       500:
 *         description: Internal server error
 */
router.post("/", auth_middleware_1.requireCandidate, application_controller_1.ApplicationController.createApplication);
/**
 * @swagger
 * /applications/candidate:
 *   get:
 *     summary: Get candidate's applications
 *     description: Retrieve all job applications submitted by the authenticated candidate
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of applications per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, REVIEWING, SHORTLISTED, REJECTED, ACCEPTED]
 *         description: Filter by application status
 *     responses:
 *       200:
 *         description: Applications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApplicationsResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Candidate access required
 *       500:
 *         description: Internal server error
 */
router.get("/candidate", auth_middleware_1.requireCandidate, application_controller_1.ApplicationController.getApplicationsByCandidate);
/**
 * @swagger
 * /applications/{applicationId}/withdraw:
 *   delete:
 *     summary: Withdraw application
 *     description: Withdraw a job application (Candidate only)
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application withdrawn successfully
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
 *         description: Forbidden - Candidate access required
 *       404:
 *         description: Application not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:applicationId/withdraw", auth_middleware_1.requireCandidate, application_controller_1.ApplicationController.withdrawApplication);
/**
 * @swagger
 * /applications/employer:
 *   get:
 *     summary: Get employer's applications
 *     description: Retrieve all job applications received by the authenticated employer
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of applications per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, REVIEWING, SHORTLISTED, REJECTED, ACCEPTED]
 *         description: Filter by application status
 *       - in: query
 *         name: jobId
 *         schema:
 *           type: string
 *         description: Filter by specific job ID
 *     responses:
 *       200:
 *         description: Applications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApplicationsResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Employer access required
 *       500:
 *         description: Internal server error
 */
router.get("/employer", auth_middleware_1.requireEmployer, application_controller_1.ApplicationController.getApplicationsByEmployer);
/**
 * @swagger
 * /applications/employer/stats:
 *   get:
 *     summary: Get employer application statistics
 *     description: Retrieve statistics about job applications received by the employer
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalApplications:
 *                       type: number
 *                       description: Total number of applications received
 *                     pendingApplications:
 *                       type: number
 *                       description: Number of pending applications
 *                     reviewingApplications:
 *                       type: number
 *                       description: Number of applications under review
 *                     shortlistedApplications:
 *                       type: number
 *                       description: Number of shortlisted applications
 *                     rejectedApplications:
 *                       type: number
 *                       description: Number of rejected applications
 *                     acceptedApplications:
 *                       type: number
 *                       description: Number of accepted applications
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Employer access required
 *       500:
 *         description: Internal server error
 */
router.get("/employer/stats", auth_middleware_1.requireEmployer, application_controller_1.ApplicationController.getApplicationStats);
/**
 * @swagger
 * /applications/{applicationId}/status:
 *   patch:
 *     summary: Update application status
 *     description: Update the status of a job application (Employer only)
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, REVIEWING, SHORTLISTED, REJECTED, ACCEPTED]
 *                 description: New application status
 *                 example: "SHORTLISTED"
 *               employerNotes:
 *                 type: string
 *                 description: Notes from employer about the application
 *                 example: "Strong candidate with relevant experience"
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: Application status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApplicationResponse'
 *       400:
 *         description: Bad request - validation errors
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Employer access required
 *       404:
 *         description: Application not found
 *       500:
 *         description: Internal server error
 */
router.patch("/:applicationId/status", auth_middleware_1.requireEmployer, application_controller_1.ApplicationController.updateApplicationStatus);
// Shared routes (both candidates and employers can access their own applications)
/**
 * @swagger
 * /applications/{applicationId}:
 *   get:
 *     summary: Get application by ID
 *     description: Retrieve a specific job application by ID (accessible by both candidate and employer)
 *     tags: [Applications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApplicationResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Can only access own applications
 *       404:
 *         description: Application not found
 *       500:
 *         description: Internal server error
 */
router.get("/:applicationId", application_controller_1.ApplicationController.getApplicationById);
exports.default = router;
