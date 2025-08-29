import mongoose from "mongoose";
import { ApplicationModel, IApplication } from "./application.schema";
import { JobModel } from "../job/job.schema";
import { UserModel } from "../user/user.schema"; // Add UserModel import
import { CreateApplicationDto, UpdateApplicationStatusDto, ApplicationQueryDto } from "./application.dto";
import { sendEmail, applicationAcceptedEmailTemplate, applicationRejectedEmailTemplate, applicationShortlistedEmailTemplate } from "../common/services/email.service";

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

    // Get candidate details to extract mobile and location
    const candidate = await UserModel.findById(candidateId);
    if (!candidate) {
      throw new Error("Candidate not found");
    }

    const application = new ApplicationModel({
      job: applicationData.jobId, // Convert jobId to job field
      coverLetter: applicationData.coverLetter,
      resume: applicationData.resume,
      mobileNumber: candidate.mobile || candidate.phone || applicationData.mobileNumber, // Use candidate's mobile/phone, fallback to request
      location: candidate.location || applicationData.location, // Use candidate's location, fallback to request
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
    }).populate("candidate", "name email")
      .populate("job", "title company")
      .populate("employer", "name company email");

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

    const updatedApplication = await ApplicationModel.findByIdAndUpdate(
      applicationId,
      updateFields,
      { new: true, runValidators: true }
    );

    // Send email notification based on application status change
    if (updatedApplication && ["ACCEPTED", "REJECTED", "SHORTLISTED"].includes(updateData.status)) {
      console.log('=== EMAIL SENDING DEBUG ===');
      console.log('Application data:', {
        applicationId: applicationId,
        status: updateData.status,
        candidate: application.candidate,
        job: application.job,
        employer: application.employer
      });
      
      try {
        const candidateName = (application.candidate as any)?.name || "Candidate";
        const jobTitle = (application.job as any)?.title || "Job";
        const companyName = (application.job as any)?.company || (application.employer as any)?.company || "Company";
        const candidateEmail = (application.candidate as any)?.email;
        
        console.log('Extracted data for email:', {
          candidateName,
          jobTitle,
          companyName,
          candidateEmail,
          employerName: (application.employer as any)?.name,
          employerEmail: (application.employer as any)?.email
        });

        if (candidateEmail) {
          console.log('✅ Candidate email found:', candidateEmail);
          let emailHtml: string;
          let emailSubject: string;
          const employerName = (application.employer as any)?.name || "Hiring Team";
          const employerEmail = (application.employer as any)?.email;

          switch (updateData.status) {
            case "ACCEPTED":
              emailHtml = applicationAcceptedEmailTemplate(candidateName, jobTitle, companyName, employerName);
              emailSubject = "Application Accepted";
              break;
            case "REJECTED":
              emailHtml = applicationRejectedEmailTemplate(candidateName, jobTitle, companyName, employerName);
              emailSubject = "Application Update";
              break;
            case "SHORTLISTED":
              emailHtml = applicationShortlistedEmailTemplate(candidateName, jobTitle, companyName, employerName);
              emailSubject = "Application Shortlisted";
              break;
            default:
              emailHtml = "";
              emailSubject = "Application Status Update";
          }

          if (emailHtml) {
            console.log('✅ Email template generated successfully');
            const emailOptions = {
              from: `"${employerName} from ${companyName}" <${employerEmail || process.env.EMAIL_FROM || 'noreply@jobboard.com'}>`,
              to: candidateEmail,
              replyTo: employerEmail || process.env.EMAIL_FROM || 'noreply@jobboard.com',
              subject: emailSubject,
              html: emailHtml,
            };

            console.log('Sending email with options:', {
              from: emailOptions.from,
              to: emailOptions.to,
              subject: emailOptions.subject,
              applicationId: applicationId,
              status: updateData.status
            });

            try {
              const emailResult = await sendEmail(emailOptions);
              console.log(`${updateData.status} email sent successfully to ${candidateEmail}`, {
                messageId: emailResult.messageId,
                from: emailOptions.from,
                applicationId: applicationId
              });
            } catch (emailSendError) {
              console.error(`Failed to send ${updateData.status} email to ${candidateEmail}:`, {
                error: emailSendError instanceof Error ? emailSendError.message : String(emailSendError),
                applicationId: applicationId,
                candidateEmail: candidateEmail,
                employerName: employerName
              });
              // Don't fail the status update if email fails, but log the error
            }
          } else {
            console.warn(`No email template found for status: ${updateData.status}`);
          }
        } else {
          console.error('❌ Candidate email not found in application data');
          console.error('Candidate data:', application.candidate);
        }
      } catch (emailError) {
        console.error(`Failed to send ${updateData.status} email:`, emailError);
        // Don't fail the status update if email fails
      }
    }

    return updatedApplication;
  }

  /**
   * Retrieves a job application by ID with proper authorization checks.
   *
   * @param applicationId ID of the application to retrieve
   * @param userId ID of the user requesting the application
   * @param userRole Role of the user requesting the application
   * @returns The application if found and accessible, null otherwise
   */
  static async getApplicationById(applicationId: string, userId: string, userRole: string): Promise<IApplication | null> {
    const application = await ApplicationModel.findById(applicationId)
      .populate("job", "title company location type experience")
      .populate("candidate", "name email mobile phone location company position skills image")
      .populate("employer", "name company image");

    if (!application) {
      return null;
    }

    // Check if user has access to this application
    if (userRole === "CANDIDATE" && application.candidate.toString() !== userId) {
      return null;
    }

    if (userRole === "EMPLOYER" && application.employer.toString() !== userId) {
      return null;
    }

    return application;
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

    // Ensure candidateId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(candidateId)) {
      throw new Error("Invalid candidate ID");
    }

    // Convert candidateId to ObjectId for proper database comparison
    const candidateObjectId = new mongoose.Types.ObjectId(candidateId);
    
    const filter: any = { candidate: candidateObjectId };

    if (status) {
      filter.status = status;
    }

    if (jobId) {
      if (!mongoose.Types.ObjectId.isValid(jobId)) {
        throw new Error("Invalid job ID");
      }
      filter.job = new mongoose.Types.ObjectId(jobId);
    }

    try {
      // Get all applications for this candidate with proper filtering
      const applications = await ApplicationModel.find(filter)
        .sort({ appliedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("job", "title company location type experience")
        .populate("employer", "name company image")
        .populate("candidate", "name email mobile phone location company position skills image");

      // Get total count for pagination
      const total = await ApplicationModel.countDocuments(filter);

      // Ensure all returned applications belong to the candidate (double-check)
      const validatedApplications = applications.filter(app => {
        const appCandidateId = app.candidate.toString();
        return appCandidateId === candidateId;
      });

      // Log for debugging (remove in production)
      if (applications.length !== validatedApplications.length) {
        console.warn(`Filter mismatch: found ${applications.length} applications, validated ${validatedApplications.length} for candidate ${candidateId}`);
      }

      return { 
        applications: validatedApplications, 
        total: validatedApplications.length 
      };
    } catch (error) {
      console.error('Database error in getApplicationsByCandidate:', error);
      throw new Error('Failed to retrieve applications from database');
    }
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
    try {
      const { status, jobId, candidateId, page = 1, limit = 10 } = query;
      const skip = (page - 1) * limit;

      // Ensure employerId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(employerId)) {
        throw new Error('Invalid employer ID format');
      }

      const filter: any = { employer: new mongoose.Types.ObjectId(employerId) };

      if (status) {
        filter.status = status;
      }

      if (jobId && mongoose.Types.ObjectId.isValid(jobId)) {
        filter.job = new mongoose.Types.ObjectId(jobId);
      }

      if (candidateId && mongoose.Types.ObjectId.isValid(candidateId)) {
        filter.candidate = new mongoose.Types.ObjectId(candidateId);
      }

      console.log('Employer applications filter:', filter);

      const [applications, total] = await Promise.all([
        ApplicationModel.find(filter)
          .sort({ appliedAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate("job", "title company location type experience")
          .populate("candidate", "name email mobile phone location company position skills image")
          .populate("employer", "name company image"),
        ApplicationModel.countDocuments(filter)
      ]);

      console.log('Found applications:', applications.length);
      console.log('Total applications:', total);

      return { applications, total };
    } catch (error) {
      console.error('Database error in getApplicationsByEmployer:', error);
      throw new Error('Failed to retrieve applications from database');
    }
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
