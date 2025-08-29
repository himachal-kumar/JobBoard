# Job Board Platform

A comprehensive full-stack job board application with role-based access control, job posting, application management, and modern UI/UX.
## video of swagger
https://drive.google.com/file/d/1jQw8Ll_jEj9DZxeAmMKQn2CtAV7dmMzs/view?usp=sharing

## video of project
[https://drive.google.com/file/d/1oEFSsYtOsdpCoXtpwmGHUdZM7fv969on/view?usp=sharing](https://drive.google.com/file/d/1LavUXlc6010ZnNVgI5Gl-GGu2lzaa6Ld/view?usp=sharing)
## 🚀 Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with access and refresh tokens
- **Role-based access control** (EMPLOYER/CANDIDATE/ADMIN)
- **Social login integration** (Google, Facebook, Apple, LinkedIn)
- **Password management** (reset, change, forgot password)
- **Secure token refresh** system

### 💼 Job Management
- **Job posting** for employers
- **Job search and filtering** by location, type, skills, salary
- **Job status management** (Draft, Active, Closed)
- **Rich job details** including requirements, responsibilities, benefits
- **Remote work options** and location-based filtering

### 📝 Application System
- **Multi-step application flow**:
  1. Resume upload with validation
  2. Application form with cover letter
  3. Application submission and tracking
- **Resume management** (PDF, DOC, DOCX support)
- **Application status tracking** (Pending, Reviewing, Shortlisted, Accepted, Rejected)
- **Employer review system** with status updates

### 👥 User Management
- **Candidate profiles** with skills, experience, location
- **Employer profiles** with company information
- **Admin panel** for user management
- **User role management** and status control

### 📊 Dashboard & Analytics
- **Candidate Dashboard**: Applications, saved jobs, recommendations
- **Employer Dashboard**: Job postings, applications, statistics
- **Real-time updates** and data synchronization
- **Application statistics** and insights

## 🏗️ Architecture

```
Final project/
├── backend/                 # Node.js + Express + TypeScript API
│   ├── app/
│   │   ├── common/         # Shared utilities, middleware, services
│   │   ├── user/           # User management
│   │   ├── job/            # Job posting and management
│   │   ├── application/    # Job applications
│   │   └── routes.ts       # Main route configuration
│   ├── docker-compose.yml  # Development environment
│   ├── docker-compose.prod.yml # Production environment
│   ├── Dockerfile          # Multi-stage Docker build
│   └── deploy.sh           # Deployment script
├── frontend/               # React + TypeScript + Material-UI
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── store/          # Redux store and reducers
│   │   └── themes/         # Material-UI theme configuration
│   └── package.json
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - Database with Mongoose ODM
- **Passport.js** - Authentication middleware
- **JWT** - JSON Web Tokens
- **Swagger/OpenAPI** - API documentation
- **Docker** - Containerization
- **Redis** - Caching and session management

### Frontend
- **React 18** - UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Material-UI (MUI)** - Component library
- **Redux Toolkit** - State management
- **RTK Query** - API data fetching
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server
- **React Hook Form** - Form management

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or pnpm
- MongoDB (local or cloud instance)
- Redis (for production)
- Docker & Docker Compose (optional)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "Final project"
```

### 2. Backend Setup

#### Using Docker (Recommended)
```bash
cd backend
# Copy environment file
cp .env.example .env
# Edit .env with your configuration
# Deploy with Docker Compose
./deploy.sh dev
```

#### Manual Setup
```bash
cd backend
npm install
```

#### Environment Variables
Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jobboard
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5174
```

#### Start Backend Server
```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

#### Start Frontend Development Server
```bash
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:5174
- **Backend API:** http://localhost:5000/api
- **API Documentation:** http://localhost:5000/api-docs

## 🐳 Docker Deployment

### Development Environment
```bash
cd backend
./deploy.sh dev
```

### Production Environment
```bash
cd backend
# Create production environment file
cp .env.example .env.prod
# Edit .env.prod with production values
./deploy.sh prod
```

### Docker Compose Services
- **Backend**: Node.js API server
- **MongoDB**: Database with authentication
- **Redis**: Caching and session management
- **Nginx**: Reverse proxy (production)

## 📚 API Endpoints

### Authentication
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration
- `POST /api/users/logout` - User logout
- `POST /api/users/refresh-token` - Refresh access token

### Jobs
- `GET /api/jobs/search` - Search and filter jobs
- `POST /api/jobs` - Create new job (Employer only)
- `GET /api/jobs/:id` - Get job details
- `PUT /api/jobs/:id` - Update job (Employer only)
- `DELETE /api/jobs/:id` - Delete job (Employer only)
- `GET /api/jobs/employer/jobs` - Get employer's jobs

### Applications
- `POST /api/applications` - Submit job application (Candidate only)
- `GET /api/applications/candidate` - Get candidate's applications
- `GET /api/applications/employer` - Get employer's applications
- `PATCH /api/applications/:id/status` - Update application status
- `DELETE /api/applications/:id/withdraw` - Withdraw application

### User Management
- `GET /api/users/me` - Get current user info
- `PUT /api/users/:id` - Update user profile
- `POST /api/users/change-password` - Change password

## 🎯 User Flows

### For Candidates
1. **Register/Login** → Access candidate dashboard
2. **Browse Jobs** → Search and filter available positions
3. **Apply for Job** → Upload resume → Fill application form → Submit
4. **Track Applications** → View status and updates
5. **Manage Profile** → Update skills, experience, preferences

### For Employers
1. **Register/Login** → Access employer dashboard
2. **Post Jobs** → Create detailed job listings
3. **Review Applications** → View candidate submissions
4. **Manage Applications** → Update status, shortlist, accept/reject
5. **Job Management** → Edit, close, or reopen job postings

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server
```

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Quality
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Swagger** for API documentation

## 📊 Database Schema

### Users
- **Basic Info**: name, email, password, role
- **Profile**: skills, experience, location, company
- **Authentication**: tokens, social login providers

### Jobs
- **Details**: title, description, requirements, responsibilities
- **Specifications**: type, experience level, salary range
- **Metadata**: status, deadline, remote option, skills

### Applications
- **Content**: cover letter, resume, expected salary
- **Status**: pending, reviewing, shortlisted, accepted, rejected
- **Timestamps**: applied date, updated date

## 🚨 Security Features

- **JWT tokens** with secure refresh mechanism
- **Password hashing** using bcrypt
- **Input validation** and sanitization
- **Role-based access control** for all endpoints
- **CORS** properly configured
- **Environment variables** for sensitive data
- **Rate limiting** and request validation

## 🔄 Recent Updates

### Multi-Step Application Flow ✅
- **Resume Upload**: File validation and progress tracking
- **Application Form**: Cover letter, salary expectations, availability
- **Success Flow**: Complete application submission and tracking

### Enhanced Dashboards ✅
- **Candidate Dashboard**: Job recommendations, application tracking
- **Employer Dashboard**: Application management, job statistics
- **Real-time Updates**: Live data synchronization

### API Integration ✅
- **RTK Query**: Efficient API data fetching
- **Real-time Updates**: Automatic data refresh
- **Error Handling**: Comprehensive error management

### UI/UX Improvements ✅
- **Material-UI Components**: Modern, responsive design
- **Navigation**: Clean, intuitive navigation structure
- **Responsive Design**: Mobile-friendly interface

### Docker & Deployment ✅
- **Multi-stage Builds**: Optimized production images
- **Health Checks**: Container health monitoring
- **Environment Management**: Dev/prod configurations
- **Deployment Scripts**: Automated deployment process

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

- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:5000/api
- **API Docs**: http://localhost:5000/api-docs
- **Health Check**: http://localhost:5000/health
