import { Request, Response } from "express";
import { JobService } from "./job.service";
import { CreateJobDto, UpdateJobDto, JobQueryDto } from "./job.dto";
import { AuthRequest } from "../common/middleware/auth.middleware";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

export class JobController {
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
  static async createJob(req: AuthRequest, res: Response): Promise<void> {
    try {
      const jobData = new CreateJobDto();
      Object.assign(jobData, req.body);

      const errors = await validate(jobData);
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

      const job = await JobService.createJob(jobData, req.user!._id);
      
      res.status(201).json({
        message: "Job created successfully",
        data: job
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Failed to create job",
        error: error.message
      });
    }
  }

  static async updateJob(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { jobId } = req.params;
      const updateData = new UpdateJobDto();
      Object.assign(updateData, req.body);

      const errors = await validate(updateData);
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

      const job = await JobService.updateJob(jobId, updateData, req.user!._id);
      
      if (!job) {
        res.status(404).json({ message: "Job not found or access denied" });
        return;
      }

      res.json({
        message: "Job updated successfully",
        data: job
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Failed to update job",
        error: error.message
      });
    }
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
  static async deleteJob(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { jobId } = req.params;
      const deleted = await JobService.deleteJob(jobId, req.user!._id);
      
      if (!deleted) {
        res.status(404).json({ message: "Job not found or access denied" });
        return;
      }

      res.json({ message: "Job deleted successfully" });
    } catch (error: any) {
      res.status(500).json({
        message: "Failed to delete job",
        error: error.message
      });
    }
  }

  static async getJobById(req: Request, res: Response): Promise<void> {
    try {
      const { jobId } = req.params;
      const job = await JobService.getJobById(jobId);
      
      if (!job) {
        res.status(404).json({ message: "Job not found" });
        return;
      }

      res.json({
        message: "Job retrieved successfully",
        data: job
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Failed to retrieve job",
        error: error.message
      });
    }
  }

  /**
   * Retrieve all jobs posted by the authenticated employer
   * @param req Express request object
   * @param res Express response object
   * @returns Promise that resolves to nothing
   */
  static async getJobsByEmployer(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await JobService.getJobsByEmployer(
        req.user!._id,
        Number(page),
        Number(limit)
      );

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
    } catch (error: any) {
      res.status(500).json({
        message: "Failed to retrieve jobs",
        error: error.message
      });
    }
  }

  static async searchJobs(req: Request, res: Response): Promise<void> {
    try {
      // Pass raw query object directly to service
      const result = await JobService.searchJobs(req.query as any);

      res.json({
        message: "Jobs search completed",
        data: result.jobs,
        pagination: {
          page: parseInt(req.query.page as string) || 1,
          limit: parseInt(req.query.limit as string) || 10,
          total: result.total,
          pages: Math.ceil(result.total / (parseInt(req.query.limit as string) || 10))
        }
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Failed to search jobs",
        error: error.message
      });
    }
  }

  /**
   * Test endpoint for job search functionality
   * @param req Express request object
   * @param res Express response object
   * @returns Promise that resolves to nothing
   */
  static async testSearch(req: Request, res: Response): Promise<void> {
    try {
      res.json({
        message: "Test endpoint working",
        query: req.query,
        page: req.query.page,
        limit: req.query.limit
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Test failed",
        error: error.message
      });
    }
  }

  static async getJobStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const stats = await JobService.getJobStats(req.user!._id);
      
      res.json({
        message: "Job statistics retrieved successfully",
        data: stats
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Failed to retrieve job statistics",
        error: error.message
      });
    }
  }

  /**
   * Close a job posting as an employer
   * @param req Express request object with `jobId` in the URL parameters
   * @param res Express response object
   * @returns Promise that resolves to nothing
   * @throws 404 if job not found or access denied
   * @throws 500 if an internal server error occurs
   */
  static async closeJob(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { jobId } = req.params;
      const closed = await JobService.closeJob(jobId, req.user!._id);
      
      if (!closed) {
        res.status(404).json({ message: "Job not found or access denied" });
        return;
      }

      res.json({ message: "Job closed successfully" });
    } catch (error: any) {
      res.status(500).json({
        message: "Failed to close job",
        error: error.message
      });
    }
  }

  static async reopenJob(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { jobId } = req.params;
      const reopened = await JobService.reopenJob(jobId, req.user!._id);
      
      if (!reopened) {
        res.status(404).json({ message: "Job not found or access denied" });
        return;
      }

      res.json({ message: "Job reopened successfully" });
    } catch (error: any) {
      res.status(500).json({
        message: "Failed to reopen job",
        error: error.message
      });
    }
  }
}
