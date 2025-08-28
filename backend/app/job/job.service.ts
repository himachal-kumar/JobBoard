import { JobModel, type IJob } from "./job.schema";
import { CreateJobDto, UpdateJobDto, JobQueryDto } from "./job.dto";
import { ApplicationModel } from "../application/application.schema";

export class JobService {
  /**
   * Create a new job posting.
   *
   * @param jobData - The data to create the job with.
   * @param employerId - The ID of the employer creating the job.
   * @returns The created job document.
   */
  static async createJob(jobData: CreateJobDto, employerId: string): Promise<IJob> {
    const job = new JobModel({
      ...jobData,
      salary: {
        min: jobData.salaryMin,
        max: jobData.salaryMax,
        currency: jobData.salaryCurrency || "USD",
      },
      employer: employerId,
      applications: [],
      status: "ACTIVE", // Set default status to ACTIVE
    });

    return await job.save();
  }

  /**
   * Update an existing job posting.
   *
   * @param jobId - The ID of the job to update.
   * @param updateData - The data to update the job with.
   * @param employerId - The ID of the employer updating the job.
   * @returns The updated job document, or null if the job was not found or the employer doesn't have access to it.
   */
  static async updateJob(jobId: string, updateData: UpdateJobDto, employerId: string): Promise<IJob | null> {
    const job = await JobModel.findOne({ _id: jobId, employer: employerId });
    
    if (!job) {
      return null;
    }

    // Create a clean update object
    const cleanUpdateData: any = { ...updateData };
    
    if (updateData.salaryMin !== undefined || updateData.salaryMax !== undefined) {
      cleanUpdateData.salary = {
        min: updateData.salaryMin !== undefined ? updateData.salaryMin : job.salary.min,
        max: updateData.salaryMax !== undefined ? updateData.salaryMax : job.salary.max,
        currency: updateData.salaryCurrency || job.salary.currency,
      };
    }

    // Remove the individual salary fields before updating
    const { salaryMin, salaryMax, salaryCurrency, ...finalUpdateData } = cleanUpdateData;

    return await JobModel.findByIdAndUpdate(
      jobId,
      finalUpdateData,
      { new: true, runValidators: true }
    );
  }

  /**
   * Deletes a job posting. Only the employer who created the job can delete it.
   * @param jobId The ID of the job to delete.
   * @param employerId The ID of the employer who created the job.
   * @returns `true` if the job was deleted, `false` otherwise.
   */
  static async deleteJob(jobId: string, employerId: string): Promise<boolean> {
    const result = await JobModel.deleteOne({ _id: jobId, employer: employerId });
    return result.deletedCount > 0;
  }

  static async getJobById(jobId: string): Promise<IJob | null> {
    return await JobModel.findById(jobId)
      .populate("employer", "name company image")
      .populate("applications", "status candidate appliedAt");
  }

  static async getJobsByEmployer(employerId: string, page: number = 1, limit: number = 10): Promise<{ jobs: IJob[], total: number }> {
    const skip = (page - 1) * limit;
    
    const [jobs, total] = await Promise.all([
      JobModel.find({ employer: employerId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("applications", "status candidate appliedAt"),
      JobModel.countDocuments({ employer: employerId })
    ]);

    return { jobs, total };
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
  static async searchJobs(query: any): Promise<{ jobs: IJob[], total: number }> {
    const { search, location, type, experience, remote, page = 1, limit = 10 } = query;
    
    // Convert string inputs to appropriate types
    const pageNum = typeof page === 'string' ? parseInt(page, 10) || 1 : page;
    const limitNum = typeof limit === 'string' ? parseInt(limit, 10) || 10 : limit;
    const remoteBool = typeof remote === 'string' ? remote.toLowerCase() === 'true' : remote;
    
    const skip = (pageNum - 1) * limitNum;

    const filter: any = { status: "ACTIVE" };

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

    const [jobs, total] = await Promise.all([
      JobModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate("employer", "name company image"),
      JobModel.countDocuments(filter)
    ]);

    return { jobs, total };
  }

  /**
   * Retrieves statistics about a job posting.
   * @param employerId The ID of the employer who owns the job
   * @returns An object containing the total number of jobs, the number of active jobs, the number of closed jobs, and the number of applications submitted
   */
  static async getJobStats(employerId: string): Promise<{ total: number, active: number, closed: number, applications: number }> {
    const [total, active, closed, applications] = await Promise.all([
      JobModel.countDocuments({ employer: employerId }),
      JobModel.countDocuments({ employer: employerId, status: "ACTIVE" }),
      JobModel.countDocuments({ employer: employerId, status: "CLOSED" }),
      ApplicationModel.countDocuments({ employer: employerId })
    ]);

    return { total, active, closed, applications };
  }

  /**
   * Closes a job posting.
   * @param jobId The ID of the job to close
   * @param employerId The ID of the employer who owns the job
   * @returns A boolean indicating whether the job was successfully closed
   */
  static async closeJob(jobId: string, employerId: string): Promise<boolean> {
    const result = await JobModel.updateOne(
      { _id: jobId, employer: employerId },
      { status: "CLOSED" }
    );
    return result.modifiedCount > 0;
  }

  /**
   * Reopens a job posting.
   * @param jobId The ID of the job to reopen
   * @param employerId The ID of the employer who owns the job
   * @returns A boolean indicating whether the job was successfully reopened
   */
  static async reopenJob(jobId: string, employerId: string): Promise<boolean> {
    const result = await JobModel.updateOne(
      { _id: jobId, employer: employerId },
      { status: "ACTIVE" }
    );
    return result.modifiedCount > 0;
  }
}
