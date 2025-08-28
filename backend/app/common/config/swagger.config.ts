import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Job Board API',
      version: '1.0.0',
      description: 'A comprehensive API for job board platform including job management, applications, user authentication, and social login',
      contact: {
        name: 'API Support',
        email: 'support@jobboard.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server',
      },
      {
        url: 'https://your-production-domain.com/api',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for authentication',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Unique identifier for the user',
            },
            name: {
              type: 'string',
              description: 'Full name of the user',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address of the user',
            },
            role: {
              type: 'string',
              enum: ['EMPLOYER', 'CANDIDATE', 'ADMIN'],
              description: 'Role of the user',
            },
            isEmailVerified: {
              type: 'boolean',
              description: 'Whether the user email is verified',
            },
            image: {
              type: 'string',
              description: 'Profile image URL',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'User last update timestamp',
            },
          },
          required: ['name', 'email', 'role'],
        },
        Job: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Unique identifier for the job',
            },
            title: {
              type: 'string',
              description: 'Job title',
            },
            description: {
              type: 'string',
              description: 'Detailed job description',
            },
            requirements: {
              type: 'array',
              items: { type: 'string' },
              description: 'Job requirements',
            },
            responsibilities: {
              type: 'array',
              items: { type: 'string' },
              description: 'Job responsibilities',
            },
            company: {
              type: 'string',
              description: 'Company name',
            },
            location: {
              type: 'string',
              description: 'Job location',
            },
            type: {
              type: 'string',
              enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'],
              description: 'Job type',
            },
            experience: {
              type: 'string',
              enum: ['ENTRY', 'JUNIOR', 'MID', 'SENIOR', 'LEAD'],
              description: 'Required experience level',
            },
            salary: {
              type: 'object',
              properties: {
                min: { type: 'number', description: 'Minimum salary' },
                max: { type: 'number', description: 'Maximum salary' },
                currency: { type: 'string', description: 'Salary currency', default: 'USD' },
              },
              required: ['min', 'max'],
            },
            skills: {
              type: 'array',
              items: { type: 'string' },
              description: 'Required skills',
            },
            benefits: {
              type: 'array',
              items: { type: 'string' },
              description: 'Job benefits',
            },
            employer: {
              $ref: '#/components/schemas/User',
              description: 'Employer who posted the job',
            },
            status: {
              type: 'string',
              enum: ['ACTIVE', 'CLOSED', 'DRAFT'],
              description: 'Job status',
              default: 'DRAFT',
            },
            deadline: {
              type: 'string',
              format: 'date-time',
              description: 'Application deadline',
            },
            remote: {
              type: 'boolean',
              description: 'Whether the job is remote',
              default: false,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Job creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Job last update timestamp',
            },
          },
          required: ['title', 'description', 'company', 'location', 'type', 'experience'],
        },
        JobApplication: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Unique identifier for the application',
            },
            job: {
              $ref: '#/components/schemas/Job',
              description: 'Job being applied for',
            },
            candidate: {
              $ref: '#/components/schemas/User',
              description: 'Candidate applying for the job',
            },
            employer: {
              $ref: '#/components/schemas/User',
              description: 'Employer who posted the job',
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'REVIEWING', 'SHORTLISTED', 'REJECTED', 'ACCEPTED'],
              description: 'Application status',
              default: 'PENDING',
            },
            coverLetter: {
              type: 'string',
              description: 'Cover letter content',
            },
            resume: {
              type: 'string',
              description: 'Resume file path/URL',
            },
            expectedSalary: {
              type: 'object',
              properties: {
                amount: { type: 'number', description: 'Expected salary amount' },
                currency: { type: 'string', description: 'Salary currency', default: 'USD' },
              },
            },
            availability: {
              type: 'string',
              enum: ['IMMEDIATE', '2_WEEKS', '1_MONTH', '3_MONTHS', 'NEGOTIABLE'],
              description: 'When the candidate can start',
              default: 'NEGOTIABLE',
            },
            notes: {
              type: 'string',
              description: 'Additional notes from candidate',
            },
            employerNotes: {
              type: 'string',
              description: 'Notes from employer',
            },
            appliedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Application submission timestamp',
            },
            reviewedAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the application was reviewed',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Application creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Application last update timestamp',
            },
          },
          required: ['job', 'candidate', 'employer', 'coverLetter', 'resume'],
        },
        LoginRequest: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            password: {
              type: 'string',
              minLength: 5,
              maxLength: 16,
              description: 'User password',
            },
          },
          required: ['email', 'password'],
        },
        RegisterRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Full name of the user',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address of the user',
            },
            password: {
              type: 'string',
              minLength: 5,
              maxLength: 16,
              description: 'User password',
            },
            confirmPassword: {
              type: 'string',
              description: 'Password confirmation',
            },
            role: {
              type: 'string',
              enum: ['EMPLOYER', 'CANDIDATE'],
              description: 'User role',
            },
          },
          required: ['name', 'email', 'password', 'confirmPassword', 'role'],
        },
        ChangePasswordRequest: {
          type: 'object',
          properties: {
            currentPassword: {
              type: 'string',
              description: 'Current password',
            },
            newPassword: {
              type: 'string',
              minLength: 5,
              maxLength: 16,
              description: 'New password',
            },
            confirmPassword: {
              type: 'string',
              description: 'New password confirmation',
            },
          },
          required: ['currentPassword', 'newPassword', 'confirmPassword'],
        },
        ForgotPasswordRequest: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address for password reset',
            },
          },
          required: ['email'],
        },
        ResetPasswordRequest: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'Password reset token',
            },
            newPassword: {
              type: 'string',
              minLength: 5,
              maxLength: 16,
              description: 'New password',
            },
            confirmPassword: {
              type: 'string',
              description: 'New password confirmation',
            },
          },
          required: ['token', 'newPassword', 'confirmPassword'],
        },
        SocialLoginRequest: {
          type: 'object',
          properties: {
            access_token: {
              type: 'string',
              description: 'Social platform access token',
            },
            id_token: {
              type: 'string',
              description: 'Apple ID token',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Operation success status',
            },
            message: {
              type: 'string',
              description: 'Response message',
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User',
                },
                token: {
                  type: 'string',
                  description: 'JWT access token',
                },
                refreshToken: {
                  type: 'string',
                  description: 'JWT refresh token',
                },
              },
            },
          },
        },
        JobSearchResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Operation success status',
            },
            message: {
              type: 'string',
              description: 'Response message',
            },
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Job',
              },
              description: 'Array of jobs matching the search criteria',
            },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'number', description: 'Current page number' },
                limit: { type: 'number', description: 'Number of items per page' },
                total: { type: 'number', description: 'Total number of jobs' },
                totalPages: { type: 'number', description: 'Total number of pages' },
                hasNext: { type: 'boolean', description: 'Whether there is a next page' },
                hasPrev: { type: 'boolean', description: 'Whether there is a previous page' },
              },
            },
          },
        },
        ApplicationResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Operation success status',
            },
            message: {
              type: 'string',
              description: 'Response message',
            },
            data: {
              type: 'object',
              properties: {
                application: {
                  $ref: '#/components/schemas/JobApplication',
                },
              },
            },
          },
        },
        ApplicationsResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Operation success status',
            },
            message: {
              type: 'string',
              description: 'Response message',
            },
            data: {
              type: 'object',
              properties: {
                applications: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/JobApplication',
                  },
                  description: 'Array of applications',
                },
                pagination: {
                  type: 'object',
                  properties: {
                    page: { type: 'number', description: 'Current page number' },
                    limit: { type: 'number', description: 'Number of items per page' },
                    total: { type: 'number', description: 'Total number of applications' },
                    totalPages: { type: 'number', description: 'Total number of pages' },
                  },
                },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Operation success status',
            },
            message: {
              type: 'string',
              description: 'Error message',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                    description: 'Field name with error',
                  },
                  msg: {
                    type: 'string',
                    description: 'Error message for the field',
                  },
                },
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints',
      },
      {
        name: 'User Management',
        description: 'User CRUD operations',
      },
      {
        name: 'Social Login',
        description: 'Social media authentication',
      },
      {
        name: 'Password Management',
        description: 'Password reset and change operations',
      },
      {
        name: 'Jobs',
        description: 'Job posting and management',
      },
      {
        name: 'Applications',
        description: 'Job application management',
      },
      {
        name: 'Admin',
        description: 'Admin-only operations',
      },
    ],
  },
  apis: ['./app/**/*.ts'], // Path to the API docs
};

export const specs = swaggerJsdoc(options);
