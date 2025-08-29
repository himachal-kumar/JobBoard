import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { User, Job, JobApplication as Application, ApiResponse } from "../types/jobBoard";

export const api = createApi({
  reducerPath: "api",
  tagTypes: ["ME", "USERS", "JOBS", "APPLICATIONS"],
  baseQuery: baseQueryWithReauth,
  /**
   * API endpoints
   *
   * @typedef {Object} ApiResponse
   * @property {number} status - Response status code
   * @property {string} message - Response message
   * @property {Object} data - Response data
   *
   * @typedef {Object} User
   * @property {string} _id - User ID
   * @property {string} name - User name
   * @property {string} email - User email
   * @property {string} role - User role
   * @property {string} provider - User provider
   * @property {string} active - User active status
   * @property {string} refreshToken - User refresh token
   *
   * @typedef {Object} Job
   * @property {string} _id - Job ID
   * @property {string} title - Job title
   * @property {string} description - Job description
   * @property {string[]} requirements - Job requirements
   * @property {string[]} responsibilities - Job responsibilities
   * @property {string} company - Company name
   * @property {string} location - Job location
   * @property {string} type - Job type (FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP)
   * @property {string} experience - Experience level (ENTRY, JUNIOR, MID, SENIOR, LEAD)
   * @property {Object} salary - Salary range
   * @property {string[]} skills - Required skills
   * @property {string[]} benefits - Job benefits
   * @property {string} status - Job status (DRAFT, ACTIVE, CLOSED)
   * @property {boolean} remote - Remote work option
   * @property {Date} deadline - Application deadline
   * @property {string} employer - Employer ID
   * @property {string[]} applications - Application IDs
   *
   * @typedef {Object} Application
   * @property {string} _id - Application ID
   * @property {string} job - Job ID
   * @property {string} candidate - Candidate ID
   * @property {string} employer - Employer ID
   * @property {string} status - Application status
   * @property {string} coverLetter - Cover letter
   * @property {string} resume - Resume URL
   * @property {Object} expectedSalary - Expected salary
   * @property {string} availability - Availability
   * @property {Date} appliedAt - Application date
   *
   * @typedef {Object} LoginBody
   * @property {string} email - User email
   * @property {string} password - User password
   *
   * @typedef {Object} RegisterBody
   * @property {string} name - User name
   * @property {string} email - User email
   * @property {string} password - User password
   * @property {string} confirmPassword - User confirm password
   *
   * @typedef {Object} UpdateUserBody
   * @property {string} _id - User ID
   * @property {string} name - User name
   * @property {string} email - User email
   * @property {string} password - User password
   *
   * @typedef {Object} LoginByAppleBody
   * @property {string} id_token - Apple ID token
   *
   * @typedef {Object} LoginByGoogleBody
   * @property {string} access_token - Google access token
   *
   * @typedef {Object} LoginByLinkedInBody
   * @property {string} access_token - LinkedIn access token
   *
   * @typedef {Object} LoginByFacebookBody
   * @property {string} access_token - Facebook access token
   *
   * @typedef {Object} ChangePasswordBody
   * @property {string} confirmPassword - User confirm password
   * @property {string} password - User password
   * @property {string} currentPassword - User current password
   *
   * @typedef {Object} ResetPasswordBody
   * @property {string} confirmPassword - User confirm password
   * @property {string} password - User password
   * @property {string} token - User reset password token
   *
   * @typedef {Object} VerifyInvitationBody
   * @property {string} confirmPassword - User confirm password
   * @property {string} password - User password
   * @property {string} token - User invitation token
   *
   * @typedef {Object} ForgotPasswordBody
   * @property {string} email - User email
   */
  endpoints: (builder) => ({
    // User Management Endpoints
    me: builder.query<ApiResponse<User>, void>({
      query: () => `/users/me`,
      providesTags: ["ME"],
    }),
    login: builder.mutation<
      ApiResponse<{ 
        accessToken: string; 
        refreshToken: string;
        user: User;
      }>,
      { email: string; password: string }
    >({
      query: (body) => {
        return { url: `/users/login`, method: "POST", body };
      },
    }),
    register: builder.mutation<
      ApiResponse<User>,
      {
        name: string;
        email: string;
        password: string;
        role: 'EMPLOYER' | 'CANDIDATE';
        phone?: string;
        location?: string;
        company?: string;
        position?: string;
        skills?: string[];
      }
    >({
      query: (body) => {
        return { url: `/users/register`, method: "POST", body };
      },
    }),
    updateUser: builder.mutation<ApiResponse<User>, User>({
      query: (body) => {
        return { url: `/users/${body._id}`, method: "PUT", body };
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => {
        return { url: `/users/logout`, method: "POST" };
      },
    }),
    loginByApple: builder.mutation<
      ApiResponse<{ accessToken: string; refreshToken: string }>,
      { id_token: string }
    >({
      query: (body) => {
        return { url: `/users/social/apple`, method: "POST", body };
      },
    }),
    loginByGoogle: builder.mutation<
      ApiResponse<{ accessToken: string; refreshToken: string }>,
      { access_token: string }
    >({
      query: (body) => {
        return { url: `/users/social/google`, method: "POST", body };
      },
    }),
    loginByLinkedIn: builder.mutation<
      ApiResponse<{ accessToken: string; refreshToken: string }>,
      { access_token: string }
    >({
      query: (body) => {
        return { url: `/users/social/linkedin`, method: "POST", body };
      },
    }),
    loginByFacebook: builder.mutation<
      ApiResponse<{ accessToken: string; refreshToken: string }>,
      { access_token: string }
    >({
      query: (body) => {
        return { url: `/users/social/facebook`, method: "POST", body };
      },
    }),
    changePassword: builder.mutation<
      ApiResponse<{}>,
      {
        confirmPassword: string;
        password: string;
        currentPassword?: string | null;
      }
    >({
      query: (body) => {
        return { url: `/users/change-password`, method: "POST", body };
      },
    }),
    resetPassword: builder.mutation<
      ApiResponse<{}>,
      {
        confirmPassword: string;
        password: string;
        token: string;
      }
    >({
      query: (body) => {
        return { url: `/users/reset-password`, method: "POST", body };
      },
    }),
    verfiyInvitation: builder.mutation<
      ApiResponse<{}>,
      {
        confirmPassword: string;
        password: string;
        token: string;
      }
    >({
      query: (body) => {
        return { url: `/users/verify-invitation`, method: "POST", body };
      },
    }),
    forgotPassword: builder.mutation<
      ApiResponse<{}>,
      {
        email: string;
      }
    >({
      query: (body) => {
        return { url: `/users/forgot-password`, method: "POST", body };
      },
    }),
    getAllUsers: builder.query<ApiResponse<User[]>, void>({
      query: () => `/users`,
      providesTags: ["USERS"],
    }),
    deleteUser: builder.mutation<ApiResponse<{}>, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["USERS"],
    }),

    // Job Management Endpoints
    searchJobs: builder.query<
      ApiResponse<Job[]>,
      {
        search?: string;
        location?: string;
        type?: string;
        experience?: string;
        remote?: boolean;
        page?: number;
        limit?: number;
      }
    >({
      query: (params) => ({
        url: `/jobs/search`,
        params,
      }),
      providesTags: ["JOBS"],
    }),
    getJobById: builder.query<ApiResponse<Job>, string>({
      query: (jobId) => `/jobs/${jobId}`,
      providesTags: ["JOBS"],
    }),
    createJob: builder.mutation<ApiResponse<Job>, {
      title: string;
      description: string;
      requirements: string[];
      responsibilities: string[];
      company: string;
      location: string;
      type: string;
      experience: string;
      salaryMin: number;
      salaryMax: number;
      salaryCurrency?: string;
      skills?: string[];
      benefits?: string[];
      remote?: boolean;
      deadline?: string;
    }>({
      query: (body) => ({
        url: `/jobs`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["JOBS"],
    }),
    updateJob: builder.mutation<ApiResponse<Job>, {
      jobId: string;
      data: Partial<Job>;
    }>({
      query: ({ jobId, data }) => ({
        url: `/jobs/${jobId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["JOBS"],
    }),
    deleteJob: builder.mutation<ApiResponse<{}>, string>({
      query: (jobId) => ({
        url: `/jobs/${jobId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["JOBS"],
    }),
    getEmployerJobs: builder.query<
      ApiResponse<{ jobs: Job[]; pagination: any }>,
      { page?: number; limit?: number }
    >({
      query: (params) => ({
        url: `/jobs/employer/jobs`,
        params,
      }),
      providesTags: ["JOBS"],
    }),
    getJobStats: builder.query<ApiResponse<any>, void>({
      query: () => `/jobs/employer/stats`,
      providesTags: ["JOBS"],
    }),
    closeJob: builder.mutation<ApiResponse<{}>, string>({
      query: (jobId) => ({
        url: `/jobs/${jobId}/close`,
        method: "PATCH",
      }),
      invalidatesTags: ["JOBS"],
    }),
    reopenJob: builder.mutation<ApiResponse<{}>, string>({
      query: (jobId) => ({
        url: `/jobs/${jobId}/reopen`,
        method: "PATCH",
      }),
      invalidatesTags: ["JOBS"],
    }),

    // Application Management Endpoints
    submitApplication: builder.mutation<ApiResponse<Application>, {
      jobId: string;
      coverLetter: string;
      resume: string;
      mobileNumber: string;
      expectedSalary?: number;
      expectedSalaryCurrency?: string;
      availability?: string;
      notes?: string;
    }>({
      query: (body) => ({
        url: `/applications`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["APPLICATIONS", "JOBS"],
    }),
    getCandidateApplications: builder.query<
      ApiResponse<{ applications: Application[]; pagination: any }>,
      {
        status?: string;
        jobId?: string;
        page?: number;
        limit?: number;
      }
    >({
      query: (params) => ({
        url: `/applications/candidate`,
        params,
      }),
      providesTags: ["APPLICATIONS"],
    }),
    getEmployerApplications: builder.query<
      ApiResponse<{ applications: Application[]; pagination: any }>,
      {
        status?: string;
        jobId?: string;
        candidateId?: string;
        page?: number;
        limit?: number;
      }
    >({
      query: (params) => ({
        url: `/applications/employer`,
        params,
      }),
      providesTags: ["APPLICATIONS"],
    }),
    getApplicationById: builder.query<ApiResponse<Application>, string>({
      query: (applicationId) => `/applications/${applicationId}`,
      providesTags: ["APPLICATIONS"],
    }),
    updateApplicationStatus: builder.mutation<ApiResponse<Application>, {
      applicationId: string;
      status: string;
      employerNotes?: string;
      statusReason?: string;
    }>({
      query: ({ applicationId, ...body }) => ({
        url: `/applications/${applicationId}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["APPLICATIONS"],
    }),
    withdrawApplication: builder.mutation<ApiResponse<{}>, string>({
      query: (applicationId) => ({
        url: `/applications/${applicationId}/withdraw`,
        method: "DELETE",
      }),
      invalidatesTags: ["APPLICATIONS", "JOBS"],
    }),
    getApplicationStats: builder.query<ApiResponse<any>, void>({
      query: () => `/applications/employer/stats`,
      providesTags: ["APPLICATIONS"],
    }),
  }),
});

export const {
  // User Management
  useMeQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useLoginByAppleMutation,
  useLoginByFacebookMutation,
  useLoginByGoogleMutation,
  useLoginByLinkedInMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerfiyInvitationMutation,
  useGetAllUsersQuery,
  useDeleteUserMutation,

  // Job Management
  useSearchJobsQuery,
  useGetJobByIdQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useGetEmployerJobsQuery,
  useGetJobStatsQuery,
  useCloseJobMutation,
  useReopenJobMutation,

  // Application Management
  useSubmitApplicationMutation,
  useGetCandidateApplicationsQuery,
  useGetEmployerApplicationsQuery,
  useGetApplicationByIdQuery,
  useUpdateApplicationStatusMutation,
  useWithdrawApplicationMutation,
  useGetApplicationStatsQuery,
} = api;
