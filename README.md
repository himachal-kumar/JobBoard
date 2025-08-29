# Job Board Platform

A comprehensive full-stack job board application with role-based access control, job posting, application management, modern UI/UX, advanced theming system, and professional skeleton loaders.
## swagger api test
https://drive.google.com/file/d/1jQw8Ll_jEj9DZxeAmMKQn2CtAV7dmMzs/view?usp=sharing
## video full
https://drive.google.com/file/d/1LavUXlc6010ZnNVgI5Gl-GGu2lzaa6Ld/view?usp=sharing
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

### 🎨 Advanced Theme System
- **Dual Theme Support**: Professional light and dark themes with automatic switching
- **System Preference Detection**: Automatically detects and respects user's system theme preference
- **Theme Persistence**: Remembers user's theme selection across sessions
- **Enhanced Components**: Professional styling for all UI elements with modern color palette
- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Accessibility First**: WCAG compliant design with focus indicators and high contrast support
- **Custom CSS Classes**: Animation effects, glass morphism, gradient text, and utility classes

### ⚡ Professional Skeleton Loaders
- **20+ Pre-built Skeletons**: Job cards, forms, tables, dashboards, user profiles
- **Smart Loading Management**: Configurable delays and minimum display times to prevent flickering
- **Theme Integration**: Automatically adapts to light/dark themes with consistent styling
- **Performance Optimized**: Efficient state management and cleanup for smooth user experience
- **Multiple Animation Variants**: Wave, pulse, and shimmer effects for engaging loading states
- **Easy Integration**: Simple hook-based API with TypeScript support and specialized hooks
- **Professional Loading States**: Content placeholders that match actual component layouts

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
├── frontend/               # React + TypeScript + Material-UI + Advanced Theming
│   ├── src/
│   │   ├── components/     # Reusable UI components including skeleton loaders
│   │   │   ├── common/     # Shared components (Header, Footer, Skeletons)
│   │   │   ├── candidates/ # Candidate-specific components
│   │   │   └── employers/  # Employer-specific components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── store/          # Redux store and reducers
│   │   ├── hooks/          # Custom React hooks including skeleton loaders
│   │   ├── themes/         # Advanced Material-UI theme system
│   │   ├── contexts/       # Theme context and providers
│   │   └── types/          # TypeScript type definitions
│   ├── THEME_DOCUMENTATION.md   # Comprehensive theme system guide
│   ├── SKELETON_LOADER_DOCUMENTATION.md # Skeleton loader system guide
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
- **React 18** - UI library with hooks and modern features
- **TypeScript** - Type-safe JavaScript development
- **Material-UI (MUI)** - Comprehensive component library with advanced theming
- **Redux Toolkit** - Modern Redux with simplified API
- **RTK Query** - Powerful data fetching and caching
- **React Router v6** - Client-side routing with protected routes
- **Vite** - Fast build tool and development server
- **React Hook Form** - Performant form management
- **Context API** - Theme state management
- **Advanced CSS** - Custom animations, effects, and utility classes

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
- **Theme Demo:** http://localhost:5174/theme-demo

## 🎨 Theme System Features

### Dual Theme Support
- **Light Theme**: Clean, professional design with modern blue (#2563eb) and purple (#7c3aed) color scheme
- **Dark Theme**: Sophisticated dark mode with optimized contrast and readability
- **Automatic Detection**: Respects user's system theme preference using `prefers-color-scheme` media query
- **Theme Persistence**: Remembers user's choice across sessions using localStorage

### Enhanced Components
- **Modern Color Palette**: Professional colors with proper contrast ratios meeting WCAG standards
- **Enhanced Typography**: Optimized font weights, sizes, and line heights using Inter font family
- **Improved Shadows**: Subtle, layered shadow system for depth and visual hierarchy
- **Smooth Animations**: 0.2s cubic-bezier transitions for hover effects and micro-interactions

### Theme Features
- **Theme Toggle**: Easy switching between light and dark modes with animated icons
- **System Preference Sync**: Updates when system theme changes automatically
- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Accessibility**: High contrast support, focus indicators, and reduced motion preferences

### Custom CSS Classes
- **Animation Classes**: `.fade-in`, `.slide-in-left`, `.slide-in-right`, `.scale-in`, `.bounce`
- **Effect Classes**: `.gradient-text`, `.glass-effect`, `.shimmer`, `.card-hover`
- **Utility Classes**: Enhanced hover effects, transitions, and responsive utilities

## ⚡ Skeleton Loader System

### Comprehensive Component Library
- **Job-related Skeletons**: `JobCardSkeleton`, `ApplicationCardSkeleton`, `JobListSkeleton`
- **UI Component Skeletons**: `FormSkeleton`, `TableSkeleton`, `NavigationSkeleton`
- **Layout Skeletons**: `DashboardSkeleton`, `UserProfileSkeleton`, `FilterSkeleton`
- **Special Effects**: `LoadingOverlaySkeleton`, `ShimmerSkeleton`, `PaginationSkeleton`

### Smart Loading Management
- **Intelligent Timing**: Configurable delays (200-1000ms) and minimum display times (500-1000ms)
- **Smooth Transitions**: Prevents flickering and jarring changes with smart state management
- **Performance Optimized**: Efficient state management and cleanup for optimal performance

### Hook System
- **useSkeletonLoader**: Main hook for managing loading states with full configuration options
- **Specialized Hooks**: Optimized for different use cases
  - `useJobListLoader` - Job listing pages (200ms delay, 800ms min display)
  - `useFormLoader` - Form loading states (100ms delay, 600ms min display)
  - `useProfileLoader` - Profile page loading (150ms delay, 700ms min display)
  - `useDashboardLoader` - Dashboard loading (100ms delay, 1000ms min display)
  - `useTableLoader` - Table data loading (250ms delay, 900ms min display)

### Easy Integration Example
```tsx
import { useJobListLoader } from '../hooks/useSkeletonLoader';
import { JobListSkeleton } from '../components/common/SkeletonLoader';

const JobsPage = () => {
  const loader = useJobListLoader();
  const { data: jobs, isLoading } = useJobsQuery();

  useEffect(() => {
    if (isLoading) {
      loader.startLoading();
    } else {
      loader.stopLoading();
    }
  }, [isLoading, loader]);

  return (
    <div>
      {loader.renderConditionally(
        jobs,
        (jobs) => jobs.map(job => <JobCard key={job.id} job={job} />),
        () => <JobListSkeleton count={6} />
      )}
    </div>
  );
};
```

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
2. **Browse Jobs** → Search and filter available positions with skeleton loading states
3. **Apply for Job** → Upload resume → Fill application form → Submit
4. **Track Applications** → View status and updates with real-time updates
5. **Manage Profile** → Update skills, experience, preferences
6. **Theme Customization** → Switch between light/dark themes based on preference

### For Employers
1. **Register/Login** → Access employer dashboard
2. **Post Jobs** → Create detailed job listings with form skeletons
3. **Review Applications** → View candidate submissions with loading states
4. **Manage Applications** → Update status, shortlist, accept/reject
5. **Job Management** → Edit, close, or reopen job postings
6. **Dashboard Analytics** → View statistics with skeleton loading

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
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Theme Development
```bash
cd frontend
# Theme system is automatically loaded
# Use theme toggle in header to switch between light/dark modes
# Visit /theme-demo for comprehensive theme showcase
```

### Skeleton Loader Development
```bash
cd frontend
# Skeleton components are available in components/common/SkeletonLoader.tsx
# Use specialized hooks for different loading scenarios
# Visit /theme-demo and switch to "Skeleton Loaders" tab for showcase
```

### Code Quality
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Swagger** for API documentation
- **Theme System** for consistent UI/UX
- **Skeleton Loaders** for professional loading states

## 📊 Database Schema

### Users
- **Basic Info**: name, email, password, role
- **Profile**: skills, experience, location, company
- **Authentication**: tokens, social login providers
- **Preferences**: theme preference, notification settings

### Jobs
- **Details**: title, description, requirements, responsibilities
- **Specifications**: type, experience level, salary range
- **Metadata**: status, deadline, remote option, skills
- **Employer Info**: company details, contact information

### Applications
- **Content**: cover letter, resume, expected salary
- **Status**: pending, reviewing, shortlisted, accepted, rejected
- **Timestamps**: applied date, updated date
- **Files**: resume uploads, supporting documents

## 🚨 Security Features

- **JWT tokens** with secure refresh mechanism
- **Password hashing** using bcrypt
- **Input validation** and sanitization
- **Role-based access control** for all endpoints
- **CORS** properly configured
- **Environment variables** for sensitive data
- **Rate limiting** and request validation
- **Secure file uploads** with validation and size limits

## 🔄 Recent Updates

### Advanced Theme System ✅
- **Dual Theme Support**: Professional light and dark themes with automatic switching
- **System Preference Detection**: Automatically detects and respects user's system theme preference
- **Theme Persistence**: Remembers user's theme selection across sessions
- **Enhanced Components**: Professional styling for all UI elements with modern color palette
- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Accessibility Features**: WCAG compliance, focus indicators, reduced motion support

### Professional Skeleton Loaders ✅
- **20+ Pre-built Skeletons**: Job cards, forms, tables, dashboards, user profiles
- **Smart Loading Management**: Configurable delays and minimum display times to prevent flickering
- **Theme Integration**: Automatically adapts to light/dark themes with consistent styling
- **Performance Optimized**: Efficient state management and cleanup for smooth user experience
- **Multiple Animation Variants**: Wave, pulse, and shimmer effects for engaging loading states
- **Easy Integration**: Simple hook-based API with TypeScript support and specialized hooks

### Multi-Step Application Flow ✅
- **Resume Upload**: File validation and progress tracking with skeleton loading states
- **Application Form**: Cover letter, salary expectations, availability with form skeletons
- **Success Flow**: Complete application submission and tracking

### Enhanced Dashboards ✅
- **Candidate Dashboard**: Job recommendations, application tracking with loading states
- **Employer Dashboard**: Application management, job statistics with skeleton loading
- **Real-time Updates**: Live data synchronization

### API Integration ✅
- **RTK Query**: Efficient API data fetching with automatic caching
- **Real-time Updates**: Automatic data refresh and synchronization
- **Error Handling**: Comprehensive error management and user feedback

### UI/UX Improvements ✅
- **Material-UI Components**: Modern, responsive design with advanced theming
- **Navigation**: Clean, intuitive navigation structure with theme-aware styling
- **Responsive Design**: Mobile-friendly interface with touch-optimized interactions
- **Professional Loading States**: Skeleton screens and smooth transitions for better UX

### Docker & Deployment ✅
- **Multi-stage Builds**: Optimized production images
- **Health Checks**: Container health monitoring
- **Environment Management**: Dev/prod configurations
- **Deployment Scripts**: Automated deployment process

## 📚 Documentation

### Comprehensive Guides
- **THEME_DOCUMENTATION.md**: Complete theme system guide with customization options
- **SKELETON_LOADER_DOCUMENTATION.md**: Skeleton loader system guide with integration examples
- **Component Documentation**: Inline JSDoc comments and usage examples
- **API Documentation**: Service layer documentation with Swagger integration

### Examples and Demos
- **Theme Demo Page**: Interactive theme showcase at `/theme-demo`
- **Skeleton Showcase**: All skeleton components demonstration with controls
- **Code Examples**: Usage patterns, best practices, and integration guides
- **Live Demonstrations**: Real-time theme switching and skeleton loading examples

## 🧪 Testing

### Testing Strategy
- **Unit Tests**: Component and utility testing
- **Integration Tests**: API integration testing
- **E2E Tests**: End-to-end user flow testing
- **Theme Testing**: Light/dark theme functionality and switching
- **Skeleton Testing**: Loading state behavior and timing

### Testing Tools
- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **MSW**: API mocking for testing
- **Theme Testing**: Theme system validation and accessibility testing

## 🚀 Performance Optimizations

### Code Splitting
- **Route-based Splitting**: Each route loads independently
- **Component Lazy Loading**: Components loaded on-demand
- **Icon Lazy Loading**: Material-UI icons loaded as needed

### Bundle Optimization
- **Tree Shaking**: Unused code elimination
- **Minification**: Code compression for production
- **Chunk Splitting**: Optimal bundle sizes

### Caching Strategy
- **API Response Caching**: RTK Query intelligent caching
- **Static Asset Caching**: Efficient asset delivery
- **Browser Caching**: Optimized caching headers

### Skeleton Loading
- **Smart Timing**: Prevents unnecessary skeleton flashing
- **Performance Perception**: App feels faster with smooth transitions
- **Efficient Rendering**: Optimized skeleton component rendering

## 🎨 Theme & Styling

### Material-UI Theme
- **Custom color palette** for brand consistency
- **Typography system** with proper hierarchy
- **Spacing system** for consistent layouts
- **Component variants** for different use cases
- **Enhanced shadows** and elevation system

### Responsive Design
- **Mobile-first approach** with progressive enhancement
- **Breakpoint system** for different screen sizes
- **Touch-friendly interactions** for mobile devices
- **Accessibility features** for inclusive design

### Animation System
- **Smooth Transitions**: 0.2s cubic-bezier transitions
- **Hover Effects**: Elevation changes and transforms
- **Loading Animations**: Wave, pulse, and shimmer effects
- **Micro-interactions**: Subtle feedback for user actions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Update documentation (including theme and skeleton guides)
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the API documentation at `/api-docs`
- Review the theme and skeleton loader guides
- Review the code comments and JSDoc
- Open an issue on the repository

## 🔗 Links

- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:5000/api
- **API Docs**: http://localhost:5000/api-docs
- **Health Check**: http://localhost:5000/health
- **Theme Demo**: http://localhost:5174/theme-demo
- **GitHub Repository**: [Repository URL]
