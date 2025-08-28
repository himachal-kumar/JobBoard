/**
 * JobCard Component for Job Board Platform
 * 
 * This component displays individual job listings with expandable details,
 * action buttons, and integration with the job application form.
 */

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Avatar,
  IconButton,
  useTheme,
  Collapse,
} from '@mui/material';
import {
  Work as WorkIcon,
  LocationOn as LocationIcon,
  AttachMoney as SalaryIcon,
  Schedule as ScheduleIcon,
  Bookmark as BookmarkIcon,
  Share as ShareIcon,
  Visibility as VisibilityIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Business as CompanyIcon,
  School as EducationIcon,
  Send as ApplyIcon,
} from '@mui/icons-material';
import { Job, UserRole } from '../types/jobBoard';
// import JobApplicationForm from './candidates/JobApplicationForm';

/**
 * Props for the JobCard component
 */
interface JobCardProps {
  /** Job data to display */
  job: Job;
  /** Current user's role */
  userRole?: UserRole;
  /** Whether the job has been applied to by the current user */
  isApplied?: boolean;
  /** Whether the job is bookmarked by the current user */
  isBookmarked?: boolean;
  /** Function to handle job application */
  onApply?: (jobId: string) => void;
  /** Function to handle bookmark toggle */
  onBookmarkToggle?: (jobId: string) => void;
  /** Function to handle job sharing */
  onShare?: (job: Job) => void;
  /** Function to view job details */
  onViewDetails?: (jobId: string) => void;
}

/**
 * JobCard component
 * 
 * @param job - Job data to display
 * @param userRole - Current user's role
 * @param isApplied - Whether the job has been applied to
 * @param isBookmarked - Whether the job is bookmarked
 * @param onApply - Function to handle job application
 * @param onBookmarkToggle - Function to handle bookmark toggle
 * @param onShare - Function to handle job sharing
 * @param onViewDetails - Function to view job details
 * @returns JSX element representing the job card
 */
const JobCard: React.FC<JobCardProps> = ({
  job,
  userRole = 'candidate',
  isApplied = false,
  isBookmarked = false,
  onApply,
  onBookmarkToggle,
  onShare,
  onViewDetails,
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  /**
   * Handle expand/collapse toggle
   */
  const handleExpandToggle = () => {
    setExpanded(!expanded);
  };

  /**
   * Handle bookmark toggle
   */
  const handleBookmarkToggle = () => {
    if (onBookmarkToggle) {
      onBookmarkToggle(job._id);
    }
  };

  /**
   * Handle job sharing
   */
  const handleShare = async () => {
    if (onShare) {
      onShare(job);
    } else {
      // Default sharing behavior
      if (navigator.share) {
        try {
          await navigator.share({
            title: job.title,
            text: `Check out this job: ${job.title} at ${job.company}`,
            url: window.location.href,
          });
        } catch (error) {
          console.error('Error sharing:', error);
          // Fallback to copying to clipboard
          const shareText = `${job.title} at ${job.company} - ${window.location.href}`;
          await navigator.clipboard.writeText(shareText);
          alert('Job link copied to clipboard!');
        }
      } else {
        // Fallback for older browsers
        const shareText = `${job.title} at ${job.company} - ${window.location.href}`;
        await navigator.clipboard.writeText(shareText);
        alert('Job link copied to clipboard!');
      }
    }
  };

  /**
   * Handle job application
   */
  const handleApply = () => {
    if (userRole === 'candidate') {
      setShowApplicationForm(true);
    }
  };

  /**
   * Handle application form submission
   */
  const handleApplicationSubmit = (applicationData: any) => {
    if (onApply) {
      onApply(job._id);
    }
    // In a real app, this would submit to the API
    console.log('Application submitted:', applicationData);
  };

  /**
   * Handle view details
   */
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(job._id);
    }
  };

  /**
   * Format salary for display
   */
  const formatSalary = (min: number, max: number, currency: string) => {
    return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
  };

  /**
   * Format date for display
   */
  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      
      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        return 'Recently';
      }
      
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
      }).format(dateObj);
    } catch (error) {
      console.warn('Error formatting date:', error, 'Date value:', date);
      return 'Recently';
    }
  };

  /**
   * Get experience level color
   */
  const getExperienceColor = (level: string) => {
    const colors: Record<string, string> = {
      entry: 'success',
      junior: 'info',
      mid: 'warning',
      senior: 'error',
      lead: 'secondary',
      executive: 'primary',
    };
    return colors[level] || 'default';
  };

  /**
   * Get job type color
   */
  const getJobTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'full-time': 'primary',
      'part-time': 'secondary',
      'remote': 'success',
      'internship': 'info',
      'freelance': 'warning',
    };
    return colors[type] || 'default';
  };

  return (
    <>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease-in-out',
          border: isApplied ? '2px solid' : '1px solid',
          borderColor: isApplied ? 'success.main' : 'divider',
          backgroundColor: isApplied ? 'success.50' : 'background.paper',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[8],
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          {/* Header with company info and actions */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <Avatar
              src={job.employer?.image || undefined}
              alt={job.company || 'Company'}
              sx={{ width: 56, height: 56, mr: 2 }}
            >
              <CompanyIcon />
            </Avatar>
            
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="h3" sx={{ mb: 0.5, fontWeight: 600 }}>
                {job.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>
                {job.company}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                {job.location} {job.remote && '(Remote)'}
              </Typography>
              </Box>
            </Box>

            {/* Action buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <IconButton
                size="small"
                onClick={handleBookmarkToggle}
                color={isBookmarked ? 'primary' : 'default'}
              >
                <BookmarkIcon />
              </IconButton>
              
              <IconButton size="small" onClick={handleShare}>
                <ShareIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Job details chips */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Chip
              icon={<WorkIcon />}
              label={job.type}
              size="small"
              color={getJobTypeColor(job.type) as any}
              variant="outlined"
            />
            <Chip
              icon={<EducationIcon />}
              label={job.experience}
              size="small"
              color={getExperienceColor(job.experience) as any}
              variant="outlined"
            />
            <Chip
              icon={<SalaryIcon />}
              label={formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
              size="small"
              color="success"
              variant="outlined"
            />
            <Chip
              icon={<ScheduleIcon />}
              label={`Posted ${formatDate(job.createdAt)}`}
              size="small"
              variant="outlined"
            />
          </Box>

          {/* Skills */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Required Skills:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {job.skills?.slice(0, 4).map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  size="small"
                  variant="outlined"
                  color="default"
                />
              ))}
              {job.skills && job.skills.length > 4 && (
                <Chip
                  label={`+${job.skills.length - 4} more`}
                  size="small"
                  variant="outlined"
                  color="default"
                />
              )}
            </Box>
          </Box>

          {/* Job description preview */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {job.description ? job.description.substring(0, 120) + '...' : 'No description available'}
          </Typography>

          {/* Applied badge */}
          {isApplied && (
            <Box sx={{ mb: 2 }}>
              <Chip
                label="Applied"
                color="success"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Box>
          )}

          {/* Action buttons */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {userRole === 'candidate' && !isApplied && (
              <Button
                variant="contained"
                size="small"
                startIcon={<ApplyIcon />}
                onClick={handleApply}
                sx={{ flexGrow: 1 }}
              >
                Apply Now
              </Button>
            )}
            
            <Button
              variant="outlined"
              size="small"
              startIcon={<VisibilityIcon />}
              onClick={handleViewDetails}
              sx={{ flexGrow: 1 }}
            >
              View Details
            </Button>
          </Box>

          {/* Expandable section */}
          <Box sx={{ mt: 2 }}>
            <Button
              size="small"
              onClick={handleExpandToggle}
              endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              sx={{ textTransform: 'none' }}
            >
              {expanded ? 'Show less' : 'Show more'}
            </Button>
          </Box>

          {/* Expanded content */}
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Full Description
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {job.description || 'No description available'}
              </Typography>
              
              {job.benefits && Array.isArray(job.benefits) && job.benefits.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Benefits:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {job.benefits.map((benefit, index) => (
                      <Chip
                        key={index}
                        label={benefit}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </Collapse>
        </CardContent>
      </Card>

      {/* Job Application Form Dialog - Temporarily disabled */}
      {/* <JobApplicationForm
        job={job}
        open={showApplicationForm}
        onClose={() => setShowApplicationForm(false)}
        onSubmit={handleApplicationSubmit}
      /> */}
    </>
  );
};

export default JobCard;
