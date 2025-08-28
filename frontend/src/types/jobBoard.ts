/**
 * Job Board Platform Types
 * 
 * This file contains all the TypeScript interfaces and types used throughout
 * the job board application for type safety and better development experience.
 */

/**
 * User roles in the job board platform
 */
export type UserRole = 'EMPLOYER' | 'CANDIDATE' | 'ADMIN';

/**
 * Job types available for posting
 */
export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';

/**
 * Experience levels for job requirements
 */
export type ExperienceLevel = 'ENTRY' | 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD';

/**
 * Application status for job applications
 */
export type ApplicationStatus = 'PENDING' | 'REVIEWING' | 'SHORTLISTED' | 'REJECTED' | 'ACCEPTED';

/**
 * User profile information
 */
export interface User {
  /** Unique identifier for the user */
  _id: string;
  /** User's email address */
  email: string;
  /** User's full name */
  name: string;
  /** User's role in the platform */
  role: UserRole;
  /** User's profile picture URL */
  image?: string;
  /** User's phone number */
  phone?: string;
  /** User's location */
  location?: string;
  /** User's bio/description */
  bio?: string;
  /** User's skills (for candidates) */
  skills?: string[];
  /** User's company (for employers) */
  company?: string;
  /** User's position (for employers) */
  position?: string;
  /** Date when user was created */
  createdAt: Date;
  /** Date when user was last updated */
  updatedAt: Date;
}

/**
 * Job posting information
 */
export interface Job {
  /** Unique identifier for the job */
  _id: string;
  /** Job title */
  title: string;
  /** Job description */
  description: string;
  /** Job requirements */
  requirements: string[];
  /** Job responsibilities */
  responsibilities: string[];
  /** Company name */
  company: string;
  /** Job location */
  location: string;
  /** Type of job */
  type: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
  /** Experience level required */
  experience: "ENTRY" | "JUNIOR" | "MID" | "SENIOR" | "LEAD";
  /** Salary range */
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  /** Required skills for the job */
  skills: string[];
  /** Benefits offered */
  benefits: string[];
  /** Employer who posted the job */
  employer: User;
  /** Job status */
  status: "ACTIVE" | "CLOSED" | "DRAFT";
  /** Application IDs */
  applications: string[];
  /** Application deadline */
  deadline?: Date;
  /** Whether the job is remote */
  remote: boolean;
  /** Date when job was created */
  createdAt: Date;
  /** Date when job was last updated */
  updatedAt: Date;
}

/**
 * Job application information
 */
export interface JobApplication {
  /** Unique identifier for the application */
  _id: string;
  /** Job being applied for */
  job: Job;
  /** Candidate applying for the job */
  candidate: User;
  /** Application status */
  status: ApplicationStatus;
  /** Cover letter */
  coverLetter?: string;
  /** Resume file URL */
  resume?: string;
  /** Expected salary */
  expectedSalary?: {
    amount: number;
    currency: string;
  };
  /** Availability */
  availability?: string;
  /** Additional notes */
  notes?: string;
  /** Date when application was submitted */
  appliedAt: Date;
  /** Date when application was last updated */
  updatedAt: Date;
  /** Employer's notes on the application */
  employerNotes?: string;
  /** Interview date (if scheduled) */
  interviewDate?: Date;
}

/**
 * Job search filters
 */
export interface JobFilters {
  /** Search query for job title/description */
  searchQuery?: string;
  /** Job type filter */
  jobType?: JobType[];
  /** Location filter */
  location?: string[];
  /** Skills filter */
  skills?: string[];
  /** Experience level filter */
  experienceLevel?: ExperienceLevel[];
  /** Salary range filter */
  salaryRange?: {
    min: number;
    max: number;
  };
  /** Remote work filter */
  isRemote?: boolean;
  /** Job category filter */
  category?: string[];
}

/**
 * Pagination information for API responses
 */
export interface PaginationInfo {
  /** Current page number */
  page: number;
  /** Number of items per page */
  limit: number;
  /** Total number of items */
  total: number;
  /** Total number of pages */
  totalPages: number;
  /** Total number of pages (backend uses 'pages') */
  pages?: number;
}

/**
 * API response wrapper with pagination
 */
export interface ApiResponse<T> {
  /** Response data */
  data: T;
  /** Pagination information */
  pagination?: PaginationInfo;
  /** Success status */
  success: boolean;
  /** Response message */
  message?: string;
}

/**
 * Form data for job posting
 */
export interface JobPostFormData {
  /** Job title */
  title: string;
  /** Job description */
  description: string;
  /** Job type */
  jobType: JobType;
  /** Job location */
  location: string;
  /** Required skills */
  skills: string[];
  /** Experience level */
  experienceLevel: ExperienceLevel;
  /** Salary range */
  salaryRange: {
    min: number;
    max: number;
  };
  /** Whether job is remote */
  isRemote: boolean;
  /** Job category */
  category: string;
  /** Benefits offered */
  benefits: string[];
  /** Application deadline */
  deadline?: Date;
}

/**
 * Form data for job application
 */
export interface JobApplicationFormData {
  /** Cover letter */
  coverLetter: string;
  /** Resume file */
  resume: File;
  /** Expected salary */
  expectedSalary?: number;
  /** Expected salary currency */
  expectedSalaryCurrency?: string;
  /** Availability */
  availability?: string;
  /** Additional notes */
  additionalNotes?: string;
}

/**
 * Dashboard statistics for users
 */
export interface DashboardStats {
  /** Total jobs posted (for employers) */
  totalJobsPosted?: number;
  /** Total applications received (for employers) */
  totalApplicationsReceived?: number;
  /** Total jobs applied (for candidates) */
  totalJobsApplied?: number;
  /** Active applications (for candidates) */
  activeApplications?: number;
  /** Recent activity */
  recentActivity: Array<{
    id: string;
    type: 'job_posted' | 'application_received' | 'application_submitted' | 'status_updated';
    title: string;
    timestamp: Date;
  }>;
}
