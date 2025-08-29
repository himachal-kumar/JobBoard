import { Request, Response } from "express";
import { ApplicationService } from "./application.service";
import { CreateApplicationDto, UpdateApplicationStatusDto, ApplicationQueryDto } from "./application.dto";
import { AuthRequest } from "../common/middleware/auth.middleware";
import { validate } from "class-validator";

export class ApplicationController {
  /**
   * Creates a new job application
   * @summary Create job application
   * @description Submit a new job application (Candidate only)
   * @tags [Applications]
   * @security BearerAuth
   * @param {CreateApplicationDto} applicationData - Application data
   * @param {AuthRequest} req - Express request
   * @param {Response} res - Express response
   * @returns {Promise<void>}
   */
  static async createApplication(req: AuthRequest, res: Response): Promise<void> {
    try {
      const applicationData = new CreateApplicationDto();
      Object.assign(applicationData, req.body);

      const errors = await validate(applicationData);
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

      const application = await ApplicationService.createApplication(applicationData, req.user!._id);
      
      res.status(201).json({
        message: "Application submitted successfully",
        data: application
      });
    } catch (error: any) {
      res.status(400).json({
        message: "Failed to submit application",
        error: error.message
      });
    }
  }

  static async updateApplicationStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { applicationId } = req.params;
      const updateData = new UpdateApplicationStatusDto();
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

      const application = await ApplicationService.updateApplicationStatus(
        applicationId,
        updateData,
        req.user!._id
      );
      
      if (!application) {
        res.status(404).json({ message: "Application not found or access denied" });
        return;
      }

      res.json({
        message: "Application status updated successfully",
        data: application
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Failed to update application status",
        error: error.message
      });
    }
  }

  static async getApplicationById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { applicationId } = req.params;
      const application = await ApplicationService.getApplicationById(
        applicationId,
        req.user!._id,
        req.user!.role
      );
      
      if (!application) {
        res.status(404).json({ message: "Application not found or access denied" });
        return;
      }

      res.json({
        message: "Application retrieved successfully",
        data: application
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Failed to retrieve application",
        error: error.message
      });
    }
  }

  static async getApplicationsByCandidate(req: AuthRequest, res: Response): Promise<void> {
    try {
      const query = new ApplicationQueryDto();
      Object.assign(query, req.query);

      // Validate user ID
      if (!req.user || !req.user._id) {
        res.status(401).json({ message: "User not authenticated" });
        return;
      }

      // Ensure user ID is a string
      const userId = req.user._id.toString();
      if (!userId) {
        res.status(401).json({ message: "Invalid user ID" });
        return;
      }

      const errors = await validate(query);
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

      const result = await ApplicationService.getApplicationsByCandidate(userId, query);

      res.json({
        message: "Applications retrieved successfully",
        data: result.applications,
        pagination: {
          page: query.page || 1,
          limit: query.limit || 10,
          total: result.total,
          pages: Math.ceil(result.total / (query.limit || 10))
        }
      });
    } catch (error: any) {
      console.error('Error in getApplicationsByCandidate:', error);
      res.status(500).json({
        message: "Failed to retrieve applications",
        error: error.message
      });
    }
  }

  static async getApplicationsByEmployer(req: AuthRequest, res: Response): Promise<void> {
    try {
      const query = new ApplicationQueryDto();
      Object.assign(query, req.query);

      // Debug logging
      console.log('getApplicationsByEmployer - User:', req.user);
      console.log('getApplicationsByEmployer - User ID:', req.user?._id);
      console.log('getApplicationsByEmployer - User ID type:', typeof req.user?._id);

      if (!req.user || !req.user._id) {
        res.status(400).json({
          message: "User not authenticated or user ID missing"
        });
        return;
      }

      const errors = await validate(query);
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

      // Ensure user ID is converted to string
      const userId = req.user._id.toString();
      console.log('getApplicationsByEmployer - Converted User ID:', userId);

      const result = await ApplicationService.getApplicationsByEmployer(userId, query);

      res.json({
        message: "Applications retrieved successfully",
        data: result.applications,
        pagination: {
          page: query.page || 1,
          limit: query.limit || 10,
          total: result.total,
          pages: Math.ceil(result.total / (query.limit || 10))
        }
      });
    } catch (error: any) {
      console.error('Error in getApplicationsByEmployer:', error);
      res.status(500).json({
        message: "Failed to retrieve applications",
        error: error.message
      });
    }
  }

  static async getApplicationStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const stats = await ApplicationService.getApplicationStats(req.user!._id);
      
      res.json({
        message: "Application statistics retrieved successfully",
        data: stats
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Failed to retrieve application statistics",
        error: error.message
      });
    }
  }

  static async withdrawApplication(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { applicationId } = req.params;
      const withdrawn = await ApplicationService.withdrawApplication(applicationId, req.user!._id);
      
      if (!withdrawn) {
        res.status(404).json({ message: "Application not found or cannot be withdrawn" });
        return;
      }

      res.json({ message: "Application withdrawn successfully" });
    } catch (error: any) {
      res.status(500).json({
        message: "Failed to withdraw application",
        error: error.message
      });
    }
  }
}
