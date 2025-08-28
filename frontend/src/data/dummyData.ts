/**
 * Dummy Data for Job Board Platform
 * 
 * This file contains mock data used throughout the application for development
 * and demonstration purposes. In a production environment, this would be
 * replaced with real API calls.
 */

import { User, Job, JobApplication, DashboardStats } from '../types/jobBoard';

/**
 * Mock users for the platform
 */
export const mockUsers: User[] = [
  {
    _id: '1',
    email: 'john.doe@techcorp.com',
    name: 'John Doe',
    role: 'EMPLOYER',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    company: 'TechCorp Inc.',
    position: 'Senior HR Manager',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    _id: '2',
    email: 'jane.smith@techcorp.com',
    name: 'Jane Smith',
    role: 'EMPLOYER',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    company: 'TechCorp Inc.',
    position: 'Engineering Manager',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    _id: '3',
    email: 'mike.johnson@example.com',
    name: 'Mike Johnson',
    role: 'CANDIDATE',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    phone: '+1 (555) 345-6789',
    location: 'New York, NY',
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
    createdAt: new Date('2023-03-05'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    _id: '4',
    email: 'sarah.wilson@example.com',
    name: 'Sarah Wilson',
    role: 'CANDIDATE',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    phone: '+1 (555) 456-7890',
    location: 'Austin, TX',
    skills: ['Python', 'Django', 'PostgreSQL', 'AWS'],
    createdAt: new Date('2023-04-12'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    _id: '5',
    email: 'david.brown@example.com',
    name: 'David Brown',
    role: 'CANDIDATE',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    phone: '+1 (555) 567-8901',
    location: 'Seattle, WA',
    skills: ['Java', 'Spring Boot', 'MySQL', 'Docker'],
    createdAt: new Date('2023-05-20'),
    updatedAt: new Date('2024-01-10'),
  },
];

/**
 * Mock jobs posted on the platform
 */
export const dummyJobs: Job[] = [
  {
    _id: '1',
    title: 'Senior Frontend Developer',
    description: 'We are looking for a talented Senior Frontend Developer to join our team. You will be responsible for building modern, responsive web applications using React and TypeScript. The ideal candidate should have strong experience with modern frontend technologies and a passion for creating excellent user experiences.',
    requirements: ['React', 'TypeScript', '5+ years experience'],
    responsibilities: ['Develop user interfaces', 'Lead frontend architecture'],
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    type: 'FULL_TIME',
    experience: 'SENIOR',
    salary: {
      min: 120000,
      max: 150000,
      currency: 'USD'
    },
    skills: ['React', 'TypeScript', 'CSS', 'JavaScript'],
    benefits: ['Health insurance', 'Remote work', '401k'],
    employer: {
      _id: '1',
      name: 'John Doe',
      email: 'hr@techcorp.com',
      role: 'EMPLOYER',
      company: 'TechCorp Inc.',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    status: 'ACTIVE',
    applications: [],
    remote: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    _id: '2',
    title: 'Product Manager',
    description: 'Join our product team to drive innovation and user experience...',
    requirements: ['Product management', 'Agile methodology', '3+ years experience'],
    responsibilities: ['Define product strategy', 'Work with cross-functional teams'],
    company: 'InnovateTech',
    location: 'Remote',
    type: 'FULL_TIME',
    experience: 'MID',
    salary: {
      min: 130000,
      max: 160000,
      currency: 'USD'
    },
    skills: ['Product Management', 'Agile', 'User Research'],
    benefits: ['Health insurance', 'Remote work', 'Stock options'],
    employer: {
      _id: '2',
      name: 'InnovateTech',
      email: 'hr@innovatetech.com',
      role: 'EMPLOYER',
      company: 'InnovateTech',
      image: 'https://images.unsplash.com/photo-1551434678-e076d2239b8a?w=40&h=40&fit=crop',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    status: 'ACTIVE',
    applications: [],
    remote: true,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    _id: '3',
    title: 'UX Designer',
    description: 'Create beautiful and intuitive user experiences...',
    requirements: ['UI/UX design', 'Figma proficiency', '2+ years experience'],
    responsibilities: ['Design user interfaces', 'Conduct user research'],
    company: 'DesignStudio',
    location: 'New York, NY',
    type: 'CONTRACT',
    experience: 'JUNIOR',
    salary: {
      min: 80000,
      max: 100000,
      currency: 'USD'
    },
    skills: ['Figma', 'UI/UX Design', 'User Research'],
    benefits: ['Flexible hours', 'Creative environment'],
    employer: {
      _id: '3',
      name: 'DesignStudio',
      email: 'hr@designstudio.com',
      role: 'EMPLOYER',
      company: 'DesignStudio',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    status: 'ACTIVE',
    applications: [],
    remote: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    _id: '4',
    title: 'Backend Developer',
    description: 'Build scalable backend systems and APIs...',
    requirements: ['Node.js', 'MongoDB', '4+ years experience'],
    responsibilities: ['Develop APIs', 'Database design'],
    company: 'DataFlow Systems',
    location: 'Austin, TX',
    type: 'FULL_TIME',
    experience: 'MID',
    salary: {
      min: 100000,
      max: 130000,
      currency: 'USD'
    },
    skills: ['Node.js', 'MongoDB', 'Express', 'REST APIs'],
    benefits: ['Health insurance', 'Remote work', 'Professional development'],
    employer: {
      _id: '4',
      name: 'DataFlow Systems',
      email: 'hr@dataflow.com',
      role: 'EMPLOYER',
      company: 'DataFlow Systems',
      image: 'https://images.unsplash.com/photo-1551434678-e076d2239b8a?w=40&h=40&fit=crop',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    status: 'ACTIVE',
    applications: [],
    remote: false,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  },
  {
    _id: '5',
    title: 'Full Stack Developer',
    description: 'Join our team to build end-to-end solutions...',
    requirements: ['React', 'Node.js', 'Full-stack experience'],
    responsibilities: ['Frontend and backend development', 'Database design'],
    company: 'WebSolutions',
    location: 'Seattle, WA',
    type: 'FULL_TIME',
    experience: 'MID',
    salary: {
      min: 110000,
      max: 140000,
      currency: 'USD'
    },
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
    benefits: ['Health insurance', 'Remote work', '401k'],
    employer: {
      _id: '5',
      name: 'WebSolutions',
      email: 'hr@websolutions.com',
      role: 'EMPLOYER',
      company: 'WebSolutions',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    status: 'ACTIVE',
    applications: [],
    remote: true,
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22')
  },
  {
    _id: '6',
    title: 'DevOps Engineer',
    description: 'Manage our cloud infrastructure and deployment pipelines...',
    requirements: ['AWS', 'Docker', 'CI/CD experience'],
    responsibilities: ['Infrastructure management', 'Automation'],
    company: 'CloudTech',
    location: 'Denver, CO',
    type: 'FULL_TIME',
    experience: 'SENIOR',
    salary: {
      min: 120000,
      max: 150000,
      currency: 'USD'
    },
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
    benefits: ['Health insurance', 'Remote work', 'Professional development'],
    employer: {
      _id: '6',
      name: 'CloudTech',
      email: 'hr@cloudtech.com',
      role: 'EMPLOYER',
      company: 'CloudTech',
      image: 'https://images.unsplash.com/photo-1551434678-e076d2239b8a?w=40&h=40&fit=crop',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    status: 'ACTIVE',
    applications: [],
    remote: true,
    createdAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-21')
  }
];

/**
 * Mock job applications
 */
export const mockApplications: JobApplication[] = [
  {
    id: '1',
    job: dummyJobs[0],
    candidate: mockUsers[3],
    status: 'shortlisted',
    coverLetter: 'I am excited to apply for the Senior Frontend Developer position. With my 3 years of experience in React and modern web technologies, I believe I can contribute significantly to your team.',
    resumeUrl: '/resumes/emma-rodriguez-resume.pdf',
    appliedAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-20'),
    employerNotes: 'Strong technical skills, good communication. Schedule interview.',
  },
  {
    id: '2',
    job: dummyJobs[0],
    candidate: mockUsers[4],
    status: 'applied',
    coverLetter: 'As a Data Scientist, I have strong analytical skills that I believe can translate well to frontend development. I am passionate about learning new technologies.',
    resumeUrl: '/resumes/alex-kumar-resume.pdf',
    appliedAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
  },
  {
    id: '3',
    job: dummyJobs[2],
    candidate: mockUsers[3],
    status: 'interviewing',
    coverLetter: 'I am very interested in this remote backend position. My experience with Node.js and cloud technologies aligns perfectly with your requirements.',
    resumeUrl: '/resumes/emma-rodriguez-resume.pdf',
    appliedAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-22'),
    interviewDate: new Date('2024-01-25'),
  },
  {
    id: '4',
    job: dummyJobs[4],
    candidate: mockUsers[5],
    status: 'applied',
    coverLetter: 'I am a passionate UX Designer with a strong portfolio. I would love to bring my creativity and user-centered approach to your team.',
    resumeUrl: '/resumes/lisa-thompson-resume.pdf',
    appliedAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11'),
  },
  {
    id: '5',
    job: dummyJobs[3],
    candidate: mockUsers[4],
    status: 'rejected',
    coverLetter: 'I am interested in this marketing internship opportunity. While my background is in data science, I am eager to learn about marketing.',
    resumeUrl: '/resumes/alex-kumar-resume.pdf',
    appliedAt: new Date('2024-01-23'),
    updatedAt: new Date('2024-01-24'),
    employerNotes: 'Not a good fit for marketing role. Background too technical.',
  },
];

/**
 * Mock dashboard statistics
 */
export const mockDashboardStats: DashboardStats[] = [
  {
    totalJobsPosted: 3,
    totalApplicationsReceived: 67,
    recentActivity: [
      {
        id: '1',
        type: 'application_received',
        title: 'New application for Senior Frontend Developer',
        timestamp: new Date('2024-01-22'),
      },
      {
        id: '2',
        type: 'job_posted',
        title: 'Posted: UX Designer',
        timestamp: new Date('2024-01-10'),
      },
      {
        id: '3',
        type: 'application_received',
        title: 'New application for Healthcare Administrator',
        timestamp: new Date('2024-01-19'),
      },
    ],
  },
  {
    totalJobsApplied: 2,
    activeApplications: 1,
    recentActivity: [
      {
        id: '1',
        type: 'application_submitted',
        title: 'Applied to Backend Engineer (Remote)',
        timestamp: new Date('2024-01-21'),
      },
      {
        id: '2',
        type: 'status_updated',
        title: 'Application shortlisted for Senior Frontend Developer',
        timestamp: new Date('2024-01-20'),
      },
      {
        id: '3',
        type: 'application_submitted',
        title: 'Applied to Senior Frontend Developer',
        timestamp: new Date('2024-01-16'),
      },
    ],
  },
];

/**
 * Popular job categories for filtering
 */
export const jobCategories = [
  'Technology',
  'Healthcare',
  'Marketing',
  'Design',
  'Data & Analytics',
  'Finance',
  'Education',
  'Sales',
  'Customer Service',
  'Engineering',
  'Human Resources',
  'Legal',
];

/**
 * Popular skills for filtering
 */
export const popularSkills = [
  'React',
  'Node.js',
  'Python',
  'JavaScript',
  'TypeScript',
  'Java',
  'SQL',
  'AWS',
  'Docker',
  'Machine Learning',
  'UI/UX Design',
  'Project Management',
  'Marketing',
  'Sales',
  'Customer Service',
];

/**
 * Popular locations for filtering
 */
export const popularLocations = [
  'Remote',
];
