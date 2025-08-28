# Job Board Backend API

A comprehensive Node.js backend API for a job board platform with user management, job posting, application handling, and modern authentication.

## 🚀 Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with access and refresh tokens
- **Role-based access control** (EMPLOYER/CANDIDATE/ADMIN)
- **Social login integration** (Google, Facebook, Apple, LinkedIn)
- **Password management** (reset, change, forgot password)
- **Secure token refresh** with automatic renewal

### 💼 Job Management
- **Job posting** with rich metadata (requirements, responsibilities, benefits)
- **Job search and filtering** by location, type, skills, salary range
- **Job status management** (Draft, Active, Closed)
- **Employer job management** (create, edit, delete, close/reopen)
- **Remote work options** and location-based filtering

### 📝 Application System
- **Job application submission** with resume upload
- **Application status tracking** (Pending, Reviewing, Shortlisted, Accepted, Rejected)
- **Employer application review** with status updates
- **Application statistics** and insights
- **Cover letter and resume management**

### 👥 User Management
- **User registration and profiles** (Candidate/Employer)
- **Profile management** with skills, experience, company info
- **Admin panel** for user management and oversight
- **User role management** and status control

### 📊 API Features
- **RESTful API design** with proper HTTP methods
- **Comprehensive validation** using class-validator
- **Error handling** with detailed error messages
- **Rate limiting** and request validation
- **Swagger/OpenAPI documentation** with interactive testing

## 🏗️ Architecture

```
backend/
├── app/
│   ├── common/              # Shared utilities and middleware
│   │   ├── config/          # Configuration files
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── helper/          # Helper functions
│   │   ├── middleware/      # Custom middleware
│   │   └── services/        # Shared services
│   ├── user/                # User management module
│   ├── job/                 # Job management module
│   ├── application/         # Application handling module
│   └── routes.ts            # Main route configuration
├── docker-compose.yml       # Development environment
├── docker-compose.prod.yml  # Production environment
├── Dockerfile               # Multi-stage Docker build
├── deploy.sh                # Deployment script
└── index.ts                 # Server entry point
```

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - Database with Mongoose ODM
- **Passport.js** - Authentication middleware
- **JWT** - JSON Web Tokens
- **Swagger/OpenAPI** - API documentation
- **Docker** - Containerization
- **Redis** - Caching and session management
- **Multer** - File upload handling
- **Nodemailer** - Email functionality
- **Yup** - Schema validation

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or pnpm
- MongoDB (local or cloud instance)
- Redis (for production)
- Docker & Docker Compose (optional)

## 🚀 Quick Start

### Using Docker (Recommended)

#### 1. Clone and Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

#### 2. Deploy with Docker Compose
```bash
# Development environment
./deploy.sh dev

# Production environment
./deploy.sh prod
```

### Manual Setup

#### 1. Install Dependencies
```bash
npm install
```

#### 2. Environment Configuration
Create a `.env` file:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/jobboard
DATABASE_NAME=jobboard

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Social Login (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
APPLE_CLIENT_ID=your-apple-client-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
APPLE_PRIVATE_KEY=your-apple-private-key
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:5174
```

#### 3. Start the Server
```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

## 🐳 Docker Deployment

### Development Environment
```bash
./deploy.sh dev
```

### Production Environment
```bash
# Create production environment file
cp .env.example .env.prod
# Edit .env.prod with production values
./deploy.sh prod
```

### Docker Compose Services
- **Backend**: Node.js API server with health checks
- **MongoDB**: Database with authentication
- **Redis**: Caching and session management
- **Nginx**: Reverse proxy (production)

## 📚 API Endpoints

### Authentication
```
POST   /api/users/login              # User login
POST   /api/users/register           # User registration
POST   /api/users/logout             # User logout
POST   /api/users/refresh-token      # Refresh access token
POST   /api/users/change-password    # Change password
POST   /api/users/forgot-password    # Request password reset
POST   /api/users/reset-password     # Reset password
```

### User Management
```
GET    /api/users/me                 # Get current user info
PUT    /api/users/:id                # Update user profile
GET    /api/users                    # Get all users (Admin only)
DELETE /api/users/:id                # Delete user (Admin only)
```

### Jobs
```
GET    /api/jobs/search              # Search and filter jobs
POST   /api/jobs                     # Create new job (Employer only)
GET    /api/jobs/:id                 # Get job details
PUT    /api/jobs/:id                 # Update job (Employer only)
DELETE /api/jobs/:id                 # Delete job (Employer only)
GET    /api/jobs/employer/jobs       # Get employer's jobs
GET    /api/jobs/employer/stats      # Get employer statistics
PATCH  /api/jobs/:id/close          # Close job (Employer only)
PATCH  /api/jobs/:id/reopen         # Reopen job (Employer only)
```

### Applications
```
POST   /api/applications             # Submit job application (Candidate only)
GET    /api/applications/candidate   # Get candidate's applications
GET    /api/applications/employer    # Get employer's applications
GET    /api/applications/:id         # Get application details
PATCH  /api/applications/:id/status # Update application status
DELETE /api/applications/:id/withdraw # Withdraw application
GET    /api/applications/employer/stats # Get application statistics
```

### Social Login
```
POST   /api/users/social/google      # Google OAuth login
POST   /api/users/social/facebook    # Facebook OAuth login
POST   /api/users/social/apple       # Apple Sign In
POST   /api/users/social/linkedin    # LinkedIn OAuth login
```

## 🔐 Authentication

### JWT Token System
- **Access Token**: Short-lived (15 minutes) for API requests
- **Refresh Token**: Long-lived (7 days) for token renewal
- **Automatic Refresh**: RTK Query handles token refresh automatically

### Role-Based Access Control
- **EMPLOYER**: Can post jobs, manage applications, view statistics
- **CANDIDATE**: Can apply for jobs, manage applications, view job listings
- **ADMIN**: Can manage users, view system statistics

### Protected Routes
All sensitive endpoints require valid JWT tokens in the Authorization header:
```
Authorization: Bearer <access_token>
```

## 📊 Database Schema

### Users Collection
```typescript
interface User {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'EMPLOYER' | 'CANDIDATE' | 'ADMIN';
  company?: string;
  position?: string;
  location?: string;
  skills: string[];
  active: boolean;
  blocked: boolean;
  provider: 'manual' | 'google' | 'facebook' | 'apple' | 'linkedin';
  createdAt: Date;
  updatedAt: Date;
}
```

### Jobs Collection
```typescript
interface Job {
  _id: ObjectId;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  company: string;
  location: string;
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  experience: 'ENTRY' | 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD';
  salary: { min: number; max: number; currency: string };
  skills: string[];
  benefits: string[];
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED';
  remote: boolean;
  deadline: Date;
  employer: ObjectId;
  applications: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Applications Collection
```typescript
interface JobApplication {
  _id: ObjectId;
  job: ObjectId;
  candidate: ObjectId;
  employer: ObjectId;
  status: 'PENDING' | 'REVIEWING' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED';
  coverLetter: string;
  resume: string;
  expectedSalary?: { amount: number; currency: string };
  availability?: string;
  notes?: string;
  appliedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run tests
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Code Quality
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Swagger** for API documentation

### Environment Variables
- **Development**: `.env` file
- **Production**: `.env.prod` file
- **Docker**: Environment variables in docker-compose files

## 🚨 Security Features

- **JWT tokens** with secure refresh mechanism
- **Password hashing** using bcrypt
- **Input validation** and sanitization using class-validator
- **Role-based access control** for all endpoints
- **CORS** properly configured
- **Environment variables** for sensitive data
- **Rate limiting** and request validation
- **File upload validation** (type, size, security)

## 📝 API Documentation

Interactive API documentation is available at `/api-docs` when the server is running. The documentation includes:

- All available endpoints with detailed descriptions
- Request/response schemas
- Authentication requirements
- Example requests and responses
- Try-it-out functionality for testing endpoints

## 🐳 Docker Features

### Multi-Stage Builds
- **Builder stage**: Dependencies and build process
- **Production stage**: Optimized runtime image
- **Development stage**: Development-friendly configuration

### Health Checks
- **Backend**: `/health` endpoint monitoring
- **MongoDB**: Connection status monitoring
- **Redis**: Service availability monitoring

### Environment Management
- **Development**: Local development setup
- **Production**: Production-optimized configuration
- **Secrets**: Environment-based configuration

## 🔄 Recent Updates

### Multi-Step Application Flow ✅
- **Resume Upload**: File validation and progress tracking
- **Application Form**: Cover letter, salary expectations, availability
- **Success Flow**: Complete application submission and tracking

### Enhanced API Features ✅
- **Comprehensive Validation**: Input validation for all endpoints
- **Error Handling**: Detailed error messages and status codes
- **File Upload**: Resume upload with validation
- **Real-time Updates**: Application status tracking

### Docker & Deployment ✅
- **Multi-stage Builds**: Optimized production images
- **Health Checks**: Container health monitoring
- **Environment Management**: Dev/prod configurations
- **Deployment Scripts**: Automated deployment process

### Security Enhancements ✅
- **JWT Refresh**: Secure token renewal system
- **Role-based Access**: Comprehensive permission system
- **Input Validation**: Protection against malicious input
- **File Security**: Safe file upload handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the API documentation at `/api-docs`
- Review the code comments and JSDoc
- Open an issue on the repository

## 🔗 Links

- **API Base URL**: http://localhost:5000/api
- **API Documentation**: http://localhost:5000/api-docs
- **Health Check**: http://localhost:5000/health
- **Frontend**: http://localhost:5174
