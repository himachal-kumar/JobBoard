import { ApplicationModel, type IApplication } from "./application.schema";
import { JobModel } from "../job/job.schema";
import { CreateApplicationDto, UpdateApplicationStatusDto, ApplicationQueryDto } from "./application.dto";

export class ApplicationService {
  /**
   * Creates a new job application
   * @param applicationData job application data
   * @param candidateId the ID of the candidate submitting the application
   * @throws {Error} if the job does not exist or is not active
   * @throws {Error} if the candidate has already applied for the job
   * @returns the newly created application
   */
  static async createApplication(applicationData: CreateApplicationDto, candidateId: string): Promise<IApplication> {
    // Check if job exists and is active
    const job = await JobModel.findById(applicationData.jobId);
    if (!job || job.status !== "ACTIVE") {
      throw new Error("Job not found or not active");
    }

    // Check if candidate has already applied
    const existingApplication = await ApplicationModel.findOne({
      job: applicationData.jobId,
      candidate: candidateId,
    });

    if (existingApplication) {
      throw new Error("You have already applied for this job");
    }

    const application = new ApplicationModel({
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

    const savedApplication = await application.save();

    // Add application to job
    await JobModel.findByIdAndUpdate(applicationData.jobId, {
      $push: { applications: savedApplication._id }
    });

    return savedApplication;
  }

  /**
   * Update the status of an application.
   *
   * @param applicationId - The ID of the application to update.
   * @param updateData - The data to update the application with.
   * @param employerId - The ID of the employer updating the application.
   * @returns The updated application document, or null if the application was not found or the employer doesn't have access to it.
   */
  static async updateApplicationStatus(
    applicationId: string,
    updateData: UpdateApplicationStatusDto,
    employerId: string
  ): Promise<IApplication | null> {
    const application = await ApplicationModel.findOne({
      _id: applicationId,
      employer: employerId,
    });

    if (!application) {
      return null;
    }

    const updateFields: any = { status: updateData.status };
    
    if (updateData.employerNotes) {
      updateFields.employerNotes = updateData.employerNotes;
    }

    if (updateData.status !== "PENDING") {
      updateFields.reviewedAt = new Date();
    }

    return await ApplicationModel.findByIdAndUpdate(
      applicationId,
      updateFields,
      { new: true, runValidators: true }
    );
  }

  static async getApplicationById(applicationId: string, userId: string, userRole: string): Promise<IApplication | null> {
    let query: any = { _id: applicationId };

    if (userRole === "CANDIDATE") {
      query.candidate = userId;
    } else if (userRole === "EMPLOYER") {
      query.employer = userId;
    }

    return await ApplicationModel.findOne(query)
      .populate("job", "title company location type experience")
      .populate("candidate", "name email image skills")
      .populate("employer", "name company image");
  }

  /**
   * Retrieves all job applications submitted by the given candidate.
   *
   * @param candidateId ID of the candidate whose applications are being retrieved
   * @param query Optional parameters to filter the results
   * @returns An object containing the retrieved applications and the total number of applications
   */
  static async getApplicationsByCandidate(
    candidateId: string,
    query: ApplicationQueryDto
  ): Promise<{ applications: IApplication[], total: number }> {
    const { status, jobId, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const filter: any = { candidate: candidateId };

    if (status) {
      filter.status = status;
    }

    if (jobId) {
      filter.job = jobId;
    }

    const [applications, total] = await Promise.all([
      ApplicationModel.find(filter)
        .sort({ appliedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("job", "title company location type experience")
        .populate("employer", "name company image"),
      ApplicationModel.countDocuments(filter)
    ]);

    return { applications, total };
  }

  /**
   * Retrieves all job applications submitted to the given employer.
   *
   * @param employerId ID of the employer whose applications are being retrieved
   * @param query Optional parameters to filter the results
   * @returns An object containing the retrieved applications and the total number of applications
   */
  static async getApplicationsByEmployer(
    employerId: string,
    query: ApplicationQueryDto
  ): Promise<{ applications: IApplication[], total: number }> {
    const { status, jobId, candidateId, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const filter: any = { employer: employerId };

    if (status) {
      filter.status = status;
    }

    if (jobId) {
      filter.job = jobId;
    }

    if (candidateId) {
      filter.candidate = candidateId;
    }

    const [applications, total] = await Promise.all([
      ApplicationModel.find(filter)
        .sort({ appliedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("job", "title company location type experience")
        .populate("candidate", "name email image skills")
        .populate("employer", "name company image"),
      ApplicationModel.countDocuments(filter)
    ]);

    return { applications, total };
  }

  /**
   * Retrieves statistics about the applications received by the given employer.
   *
   * @param employerId The ID of the employer whose application statistics are being retrieved
   * @returns An object containing the total number of applications, as well as the number of applications in each status
   */
  static async getApplicationStats(employerId: string): Promise<{ total: number, pending: number, reviewing: number, shortlisted: number, rejected: number, accepted: number }> {
    const [total, pending, reviewing, shortlisted, rejected, accepted] = await Promise.all([
      ApplicationModel.countDocuments({ employer: employerId }),
      ApplicationModel.countDocuments({ employer: employerId, status: "PENDING" }),
      ApplicationModel.countDocuments({ employer: employerId, status: "REVIEWING" }),
      ApplicationModel.countDocuments({ employer: employerId, status: "SHORTLISTED" }),
      ApplicationModel.countDocuments({ employer: employerId, status: "REJECTED" }),
      ApplicationModel.countDocuments({ employer: employerId, status: "ACCEPTED" })
    ]);

    return { total, pending, reviewing, shortlisted, rejected, accepted };
  }

  /**
   * Withdraws a job application submitted by the given candidate.
   *
   * @param applicationId The ID of the application to withdraw
   * @param candidateId The ID of the candidate who submitted the application
   * @returns A boolean indicating whether the application was successfully withdrawn (true) or not (false)
   */
  static async withdrawApplication(applicationId: string, candidateId: string): Promise<boolean> {
    const application = await ApplicationModel.findOne({
      _id: applicationId,
      candidate: candidateId,
      status: "PENDING"
    });

    if (!application) {
      return false;
    }

    // Remove application from job
    await JobModel.findByIdAndUpdate(application.job, {
      $pull: { applications: applicationId }
    });

    // Delete the application
    const result = await ApplicationModel.deleteOne({ _id: applicationId });
    return result.deletedCount > 0;
  }
}
