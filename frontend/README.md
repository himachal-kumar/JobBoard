# Job Board Frontend

A modern React-based frontend for a job board platform with Material-UI components, Redux state management, comprehensive job application functionality, advanced theming system, and professional skeleton loaders.

## 🚀 Features

### 🔐 Authentication & User Management
- **JWT-based authentication** with automatic token refresh
- **Role-based access control** (EMPLOYER/CANDIDATE/ADMIN)
- **Social login integration** (Google, Facebook, Apple, LinkedIn)
- **User registration and login** with form validation
- **Password management** (reset, change, forgot password)
- **Protected routes** with authentication guards

### 💼 Job Management
- **Job browsing** with advanced search and filtering
- **Job posting** for employers with rich form inputs
- **Job details** with comprehensive information display
- **Job status management** (Draft, Active, Closed)
- **Remote work options** and location-based filtering

### 📝 Application System
- **Multi-step application flow**:
  1. Resume upload with validation and progress tracking
  2. Application form with cover letter and details
  3. Application submission and success confirmation
- **Resume management** (PDF, DOC, DOCX support up to 5MB)
- **Application tracking** with status updates
- **Application history** and management

### 📊 Dashboard & Analytics
- **Candidate Dashboard**: Job recommendations, application tracking, saved jobs
- **Employer Dashboard**: Job postings, application management, statistics
- **Real-time updates** with RTK Query
- **Application statistics** and insights

### 🎨 Advanced Theme System
- **Dual Theme Support**: Professional light and dark themes
- **Automatic Detection**: System preference and user choice detection
- **Theme Persistence**: Remembers user's theme selection
- **Enhanced Components**: Professional styling for all UI elements
- **Modern Color Palette**: Carefully selected colors with proper contrast
- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Accessibility First**: WCAG compliant design with focus indicators

### ⚡ Professional Skeleton Loaders
- **20+ Pre-built Skeletons**: Job cards, forms, tables, dashboards
- **Smart Loading Management**: Configurable delays and minimum display times
- **Theme Integration**: Automatically adapts to light/dark themes
- **Performance Optimized**: Efficient state management and cleanup
- **Multiple Animation Variants**: Wave, pulse, and shimmer effects
- **Easy Integration**: Simple hook-based API with TypeScript support

### 🎨 UI/UX Features
- **Material-UI (MUI)** components for modern design
- **Responsive design** for all device sizes
- **Dark/Light theme** support with automatic switching
- **Professional loading states** with skeleton screens
- **Toast notifications** for user feedback
- **Form validation** with real-time feedback
- **Smooth transitions** and micro-interactions

## 🏗️ Architecture

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Shared components (Header, Footer, Skeletons)
│   │   ├── candidates/      # Candidate-specific components
│   │   ├── employers/       # Employer-specific components
│   │   └── forms/           # Form components
│   ├── pages/               # Page components
│   │   ├── candidates/      # Candidate pages
│   │   ├── employers/       # Employer pages
│   │   └── auth/            # Authentication pages
│   ├── services/            # API service layer
│   ├── store/               # Redux store and reducers
│   ├── hooks/               # Custom React hooks (including skeleton loaders)
│   ├── types/               # TypeScript type definitions
│   ├── themes/              # Advanced Material-UI theme system
│   ├── contexts/            # Theme context and providers
│   └── utils/               # Utility functions
├── public/                  # Static assets
├── package.json             # Dependencies
├── vite.config.ts          # Vite configuration
├── THEME_DOCUMENTATION.md   # Comprehensive theme system guide
└── SKELETON_LOADER_DOCUMENTATION.md # Skeleton loader system guide
```

## 🛠️ Tech Stack

### Core Technologies
- **React 18** - UI library with hooks and modern features
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server

### UI Framework
- **Material-UI (MUI)** - Comprehensive component library
- **Emotion** - CSS-in-JS styling solution
- **Responsive Design** - Mobile-first approach
- **Advanced Theming** - Custom theme system with dark mode

### State Management
- **Redux Toolkit** - Modern Redux with simplified API
- **RTK Query** - Powerful data fetching and caching
- **React Redux** - React bindings for Redux
- **Context API** - Theme state management

### Routing & Navigation
- **React Router v6** - Client-side routing
- **Protected Routes** - Authentication-based access control
- **Lazy Loading** - Route-based code splitting

### Form Handling
- **React Hook Form** - Performant form management
- **Yup** - Schema validation
- **Form Validation** - Real-time validation feedback

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or pnpm
- Modern web browser
- Backend API running (see backend README)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Environment Configuration
Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Job Board
VITE_APP_VERSION=1.0.0
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:5000/api

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## 📱 Component Structure

### Common Components
- **Header**: Main navigation with user menu and theme toggle
- **Footer**: Application footer
- **LoadingSpinner**: Loading state component
- **ErrorBoundary**: Error handling wrapper

### Skeleton Components
- **JobCardSkeleton**: Professional job card loading states
- **FormSkeleton**: Form layout placeholders
- **TableSkeleton**: Data table loading states
- **DashboardSkeleton**: Dashboard layout placeholders
- **UserProfileSkeleton**: Profile page loading states
- **LoadingOverlaySkeleton**: Full-screen loading overlay

### Candidate Components
- **JobCard**: Individual job listing display
- **JobFilters**: Job search and filtering
- **ApplicationCard**: Job application display
- **ResumeUpload**: File upload with validation

### Employer Components
- **JobPostForm**: Job creation and editing
- **ApplicationCard**: Candidate application review
- **JobManagement**: Job status and management

### Form Components
- **LoginForm**: User authentication
- **SignupForm**: User registration
- **JobApplicationForm**: Job application submission
- **ProfileForm**: User profile management

## 🎨 Advanced Theme System

### Dual Theme Support
- **Light Theme**: Clean, professional design with modern blue/purple color scheme
- **Dark Theme**: Sophisticated dark mode with optimized contrast
- **Automatic Detection**: Respects system theme preference
- **Theme Persistence**: Remembers user's choice across sessions

### Enhanced Components
- **Modern Color Palette**: Professional colors with proper contrast ratios
- **Enhanced Typography**: Optimized font weights, sizes, and line heights
- **Improved Shadows**: Subtle, layered shadow system for depth
- **Smooth Animations**: Hover effects, transitions, and micro-interactions

### Theme Features
- **Theme Toggle**: Easy switching between light and dark modes
- **System Preference Sync**: Updates when system theme changes
- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Accessibility**: High contrast support and focus indicators

### Custom CSS Classes
- **Animation Classes**: Fade, slide, scale, and bounce effects
- **Effect Classes**: Gradient text, glass morphism, shimmer loading
- **Utility Classes**: Enhanced hover effects and transitions

## ⚡ Skeleton Loader System

### Comprehensive Component Library
- **Job-related Skeletons**: Job cards, application cards, job lists
- **UI Component Skeletons**: Forms, tables, navigation, search bars
- **Layout Skeletons**: Dashboards, user profiles, filters
- **Special Effects**: Loading overlays, shimmer effects, pagination

### Smart Loading Management
- **Intelligent Timing**: Configurable delays and minimum display times
- **Smooth Transitions**: Prevents flickering and jarring changes
- **Performance Optimized**: Efficient state management and cleanup

### Hook System
- **useSkeletonLoader**: Main hook for managing loading states
- **Specialized Hooks**: Optimized for different use cases
  - `useJobListLoader` - Job listing pages
  - `useFormLoader` - Form loading states
  - `useProfileLoader` - Profile page loading
  - `useDashboardLoader` - Dashboard loading
  - `useTableLoader` - Table data loading

### Easy Integration
```tsx
import { useJobListLoader } from '../hooks/useSkeletonLoader';
import { JobListSkeleton } from '../components/common/SkeletonLoader';

const loader = useJobListLoader();
const { data: jobs, isLoading } = useJobsQuery();

useEffect(() => {
  if (isLoading) loader.startLoading();
  else loader.stopLoading();
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
```

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

## 🔐 Authentication Flow

### Login Process
1. **User Input**: Email and password
2. **API Call**: Authentication request to backend
3. **Token Storage**: JWT tokens stored in Redux
4. **Route Protection**: Protected routes become accessible
5. **User Redirect**: Role-based dashboard navigation

### Token Management
- **Access Token**: Short-lived for API requests
- **Refresh Token**: Long-lived for token renewal
- **Automatic Refresh**: RTK Query handles token refresh
- **Secure Storage**: Tokens stored in Redux state

### Protected Routes
- **Authentication Guard**: Checks user authentication status
- **Role-based Access**: Different routes for different user roles
- **Redirect Logic**: Unauthenticated users redirected to login

## 📊 State Management

### Redux Store Structure
```typescript
interface RootState {
  auth: AuthState;        // Authentication state
  api: ApiState;          // RTK Query state
}
```

### Auth State
```typescript
interface AuthState {
  accessToken: string;
  refreshToken: string;
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
}
```

### RTK Query Integration
- **API Endpoints**: Centralized API management
- **Automatic Caching**: Intelligent data caching
- **Real-time Updates**: Automatic data synchronization
- **Error Handling**: Comprehensive error management

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

## 🔧 Development Features

### Hot Reload
- **Fast Refresh**: React component hot reloading
- **TypeScript Support**: Real-time type checking
- **Error Overlay**: Clear error display during development

### Debug Tools
- **Redux DevTools**: State management debugging
- **React DevTools**: Component inspection
- **Console Logging**: Comprehensive logging system
- **Theme Inspector**: Theme system debugging

### Code Quality
- **ESLint**: Code linting and style enforcement
- **Prettier**: Automatic code formatting
- **TypeScript**: Static type checking
- **Git Hooks**: Pre-commit quality checks

## 📱 Responsive Design

### Breakpoint System
```typescript
// Material-UI breakpoints
xs: 0px      // Extra small devices
sm: 600px    // Small devices
md: 900px    // Medium devices
lg: 1200px   // Large devices
xl: 1536px   // Extra large devices
```

### Mobile Optimization
- **Touch-friendly buttons** and interactions
- **Optimized layouts** for small screens
- **Progressive disclosure** for complex information
- **Fast loading** on mobile networks
- **Skeleton loading** for mobile performance

## 🎯 User Experience

### Loading States
- **Professional Skeleton Screens**: Content placeholders during loading
- **Smart Timing**: Configurable delays and minimum display times
- **Progress Indicators**: Upload and processing progress
- **Loading Spinners**: Action feedback
- **Theme-aware Loading**: Adapts to light/dark themes

### Error Handling
- **User-friendly Messages**: Clear error explanations
- **Recovery Options**: Suggested actions for errors
- **Fallback UI**: Graceful degradation

### Accessibility
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG compliance
- **Focus Management**: Proper focus handling
- **Reduced Motion Support**: Respects user preferences

## 🔄 Recent Updates

### Advanced Theme System ✅
- **Dual Theme Support**: Professional light and dark themes
- **Automatic Detection**: System preference and user choice detection
- **Theme Persistence**: Remembers user's theme selection
- **Enhanced Components**: Professional styling for all UI elements
- **Modern Color Palette**: Carefully selected colors with proper contrast
- **Smooth Animations**: Hover effects, transitions, and micro-interactions

### Professional Skeleton Loaders ✅
- **20+ Pre-built Skeletons**: Job cards, forms, tables, dashboards
- **Smart Loading Management**: Configurable delays and minimum display times
- **Theme Integration**: Automatically adapts to light/dark themes
- **Performance Optimized**: Efficient state management and cleanup
- **Multiple Animation Variants**: Wave, pulse, and shimmer effects
- **Easy Integration**: Simple hook-based API with TypeScript support

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
- **Professional Loading States**: Skeleton screens and smooth transitions

### Performance Optimizations ✅
- **Code Splitting**: Route-based bundle splitting
- **Lazy Loading**: Component and icon lazy loading
- **Caching**: Intelligent API response caching
- **Skeleton Loading**: Performance perception optimization

## 🧪 Testing

### Testing Strategy
- **Unit Tests**: Component and utility testing
- **Integration Tests**: API integration testing
- **E2E Tests**: End-to-end user flow testing
- **Theme Testing**: Light/dark theme functionality
- **Skeleton Testing**: Loading state behavior

### Testing Tools
- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **MSW**: API mocking for testing

## 🚀 Deployment

### Build Process
```bash
npm run build        # Create production build
npm run preview      # Preview production build locally
```

### Production Build
- **Optimized Bundles**: Minified and compressed code
- **Asset Optimization**: Optimized images and fonts
- **Performance Monitoring**: Core Web Vitals tracking
- **Theme Optimization**: Efficient theme switching

### Deployment Options
- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **CDN Integration**: Global content delivery
- **Environment Configuration**: Production environment setup

## 📚 Documentation

### Comprehensive Guides
- **THEME_DOCUMENTATION.md**: Complete theme system guide
- **SKELETON_LOADER_DOCUMENTATION.md**: Skeleton loader system guide
- **Component Documentation**: Inline JSDoc comments
- **API Documentation**: Service layer documentation

### Examples and Demos
- **Theme Demo Page**: Interactive theme showcase
- **Skeleton Showcase**: All skeleton components demonstration
- **Code Examples**: Usage patterns and best practices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Update documentation
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the component documentation
- Review the theme and skeleton loader guides
- Review the code comments and JSDoc
- Open an issue on the repository

## 🔗 Links

- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:5000/api
- **API Documentation**: http://localhost:5000/api-docs
- **Theme Demo**: http://localhost:5174/theme-demo
- **GitHub Repository**: [Repository URL]