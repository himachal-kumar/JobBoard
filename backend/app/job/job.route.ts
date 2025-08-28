import express from "express";
import { JobController } from "./job.controller";
import { authenticateToken, requireEmployer } from "../common/middleware/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * /jobs/search:
 *   get:
 *     summary: Search jobs
 *     description: Search and filter jobs with pagination support
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for job title, description, or skills
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Job location filter
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP]
 *         description: Job type filter
 *       - in: query
 *         name: experience
 *         schema:
 *           type: string
 *           enum: [ENTRY, JUNIOR, MID, SENIOR, LEAD]
 *         description: Experience level filter
 *       - in: query
 *         name: remote
 *         schema:
 *           type: boolean
 *         description: Remote work filter
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
 *         description: Number of jobs per page
 *     responses:
 *       200:
 *         description: Jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobSearchResponse'
 *       400:
 *         description: Bad request - invalid parameters
 *       500:
 *         description: Internal server error
 */
router.get("/search", JobController.searchJobs);

/**
 * @swagger
 * /jobs/test:
 *   get:
 *     summary: Test job search
 *     description: Test endpoint for job search functionality
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: Test successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.get("/test", JobController.testSearch);

/**
 * @swagger
 * /jobs/{jobId}:
 *   get:
 *     summary: Get job by ID
 *     description: Retrieve a specific job by its ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job retrieved successfully
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
 *       404:
 *         description: Job not found
 *       500:
 *         description: Internal server error
 */
router.get("/:jobId", JobController.getJobById);

// Protected routes (authentication required)
router.use(authenticateToken);

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Create new job
 *     description: Create a new job posting (Employer only)
 *     tags: [Jobs]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Job title
 *                 example: "Senior Frontend Developer"
 *               description:
 *                 type: string
 *                 description: Detailed job description
 *                 example: "We are looking for an experienced frontend developer..."
 *               requirements:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Job requirements
 *                 example: ["5+ years of experience", "React expertise", "TypeScript knowledge"]
 *               responsibilities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Job responsibilities
 *                 example: ["Develop user interfaces", "Collaborate with design team", "Code review"]
 *               company:
 *                 type: string
 *                 description: Company name
 *                 example: "TechCorp"
 *               location:
 *                 type: string
 *                 description: Job location
 *                 example: "San Francisco, CA"
 *               type:
 *                 type: string
 *                 enum: [FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP]
 *                 description: Job type
 *                 example: "FULL_TIME"
 *               experience:
 *                 type: string
 *                 enum: [ENTRY, JUNIOR, MID, SENIOR, LEAD]
 *                 description: Required experience level
 *                 example: "SENIOR"
 *               salary:
 *                 type: object
 *                 properties:
 *                   min:
 *                     type: number
 *                     description: Minimum salary
 *                     example: 120000
 *                   max:
 *                     type: number
 *                     description: Maximum salary
 *                     example: 180000
 *                   currency:
 *                     type: string
 *                     description: Salary currency
 *                     example: "USD"
 *                 required: [min, max]
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Required skills
 *                 example: ["React", "TypeScript", "CSS", "Git"]
 *               benefits:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Job benefits
 *                 example: ["Health insurance", "Remote work", "Stock options"]
 *               deadline:
 *                 type: string
 *                 format: date
 *                 description: Application deadline
 *                 example: "2024-12-31"
 *               remote:
 *                 type: boolean
 *                 description: Whether the job is remote
 *                 example: true
 *             required:
 *               - title
 *               - description
 *               - company
 *               - location
 *               - type
 *               - experience
 *               - salary
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
router.post("/", requireEmployer, JobController.createJob);

/**
 * @swagger
 * /jobs/{jobId}:
 *   put:
 *     summary: Update job
 *     description: Update an existing job posting (Employer only)
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       200:
 *         description: Job updated successfully
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
 *       404:
 *         description: Job not found
 *       500:
 *         description: Internal server error
 */
router.put("/:jobId", requireEmployer, JobController.updateJob);

/**
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
router.delete("/:jobId", requireEmployer, JobController.deleteJob);

/**
 * @swagger
 * /jobs/employer/jobs:
 *   get:
 *     summary: Get employer's jobs
 *     description: Retrieve all jobs posted by the authenticated employer
 *     tags: [Jobs]
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
 *         description: Number of jobs per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, CLOSED, DRAFT]
 *         description: Filter by job status
 *     responses:
 *       200:
 *         description: Jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobSearchResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Employer access required
 *       500:
 *         description: Internal server error
 */
router.get("/employer/jobs", requireEmployer, JobController.getJobsByEmployer);

/**
 * @swagger
 * /jobs/employer/stats:
 *   get:
 *     summary: Get employer job statistics
 *     description: Retrieve statistics about the employer's job postings
 *     tags: [Jobs]
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
 *                     totalJobs:
 *                       type: number
 *                       description: Total number of jobs posted
 *                     activeJobs:
 *                       type: number
 *                       description: Number of active jobs
 *                     closedJobs:
 *                       type: number
 *                       description: Number of closed jobs
 *                     draftJobs:
 *                       type: number
 *                       description: Number of draft jobs
 *                     totalApplications:
 *                       type: number
 *                       description: Total number of applications received
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Employer access required
 *       500:
 *         description: Internal server error
 */
router.get("/employer/stats", requireEmployer, JobController.getJobStats);

/**
 * @swagger
 * /jobs/{jobId}/close:
 *   patch:
 *     summary: Close job
 *     description: Close a job posting (Employer only)
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
 *         description: Job closed successfully
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Employer access required
 *       404:
 *         description: Job not found
 *       500:
 *         description: Internal server error
 */
router.patch("/:jobId/close", requireEmployer, JobController.closeJob);

/**
 * @swagger
 * /jobs/{jobId}/reopen:
 *   patch:
 *     summary: Reopen job
 *     description: Reopen a closed job posting (Employer only)
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
 *         description: Job reopened successfully
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Employer access required
 *       404:
 *         description: Job not found
 *       500:
 *         description: Internal server error
 */
router.patch("/:jobId/reopen", requireEmployer, JobController.reopenJob);

export default router;
