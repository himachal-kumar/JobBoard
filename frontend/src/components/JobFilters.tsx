/**
 * JobFilters Component for Job Board Platform
 * 
 * This component provides filtering options for job listings including
 * search, job type, location, skills, and experience level.
 */

import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { JobFilters as JobFiltersType, JobType, ExperienceLevel } from '../types/jobBoard';
import { popularSkills, popularLocations } from '../data/dummyData';

interface JobFiltersProps {
  filters: JobFiltersType;
  onFiltersChange: (filters: JobFiltersType) => void;
  onClearFilters: () => void;
}

const JobFilters: React.FC<JobFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const [localFilters, setLocalFilters] = useState<JobFiltersType>(filters);
  const [expanded, setExpanded] = useState<string | false>(false);
  
  const updateLocalFilters = (updates: Partial<JobFiltersType>) => {
    setLocalFilters(prev => ({ ...prev, ...updates }));
  };
  
  const applyFilters = () => {
    onFiltersChange(localFilters);
  };
  
  const clearFilters = () => {
    const clearedFilters: JobFiltersType = {
      searchQuery: '',
      jobType: [],
      location: [],
      skills: [],
      experienceLevel: [],
      salaryRange: undefined,
      isRemote: undefined,
      category: [],
    };
    setLocalFilters(clearedFilters);
    onClearFilters();
  };
  
  /**
   * Handle accordion expansion
   */
  const handleAccordionChange = (panel: string) => (
    _event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded ? panel : false);
  };
  
  const hasActiveFilters = () => {
    return (
      localFilters.searchQuery ||
      (localFilters.jobType && localFilters.jobType.length > 0) ||
      (localFilters.location && localFilters.location.length > 0) ||
      (localFilters.skills && localFilters.skills.length > 0) ||
      (localFilters.experienceLevel && localFilters.experienceLevel.length > 0) ||
      (localFilters.category && localFilters.category.length > 0)
    );
  };
  
  const jobTypes = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'remote', label: 'Remote' },
    { value: 'internship', label: 'Internship' },
    { value: 'freelance', label: 'Freelance' },
  ];
  
  const experienceLevels = [
    { value: 'entry', label: 'Entry Level' },
    { value: 'junior', label: 'Junior' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior' },
    { value: 'lead', label: 'Lead' },
    { value: 'executive', label: 'Executive' },
  ];
  
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">Filter Jobs</Typography>
        </Box>
        
        {hasActiveFilters() && (
          <Button
            startIcon={<ClearIcon />}
            onClick={clearFilters}
            size="small"
            color="error"
            variant="outlined"
          >
            Clear All
          </Button>
        )}
      </Box>
      
      {/* Search Query */}
      <Accordion
        expanded={expanded === 'search'}
        onChange={handleAccordionChange('search')}
        sx={{ mb: 1 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SearchIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography>Search</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            fullWidth
            placeholder="Search by job title, company, or keywords..."
            value={localFilters.searchQuery || ''}
            onChange={(e) => updateLocalFilters({ searchQuery: e.target.value })}
            size="small"
          />
        </AccordionDetails>
      </Accordion>
      
      {/* Job Type */}
      <Accordion
        expanded={expanded === 'jobType'}
        onChange={handleAccordionChange('jobType')}
        sx={{ mb: 1 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <WorkIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography>Job Type</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth size="small">
            <InputLabel>Select Job Types</InputLabel>
            <Select
              multiple
              value={localFilters.jobType || []}
              onChange={(e) => updateLocalFilters({ jobType: e.target.value as JobType[] })}
              input={<OutlinedInput label="Select Job Types" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={jobTypes.find(t => t.value === value)?.label} size="small" />
                  ))}
                </Box>
              )}
            >
              {jobTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>
      
      {/* Location */}
      <Accordion
        expanded={expanded === 'location'}
        onChange={handleAccordionChange('location')}
        sx={{ mb: 1 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography>Location</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth size="small">
            <InputLabel>Select Locations</InputLabel>
            <Select
              multiple
              value={localFilters.location || []}
              onChange={(e) => updateLocalFilters({ location: e.target.value as string[] })}
              input={<OutlinedInput label="Select Locations" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {popularLocations.map((location) => (
                <MenuItem key={location} value={location}>
                  {location}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>
      
      {/* Skills */}
      <Accordion
        expanded={expanded === 'skills'}
        onChange={handleAccordionChange('skills')}
        sx={{ mb: 1 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Skills</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth size="small">
            <InputLabel>Select Skills</InputLabel>
            <Select
              multiple
              value={localFilters.skills || []}
              onChange={(e) => updateLocalFilters({ skills: e.target.value as string[] })}
              input={<OutlinedInput label="Select Skills" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {popularSkills.map((skill) => (
                <MenuItem key={skill} value={skill}>
                  {skill}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>
      
      {/* Experience Level */}
      <Accordion
        expanded={expanded === 'experience'}
        onChange={handleAccordionChange('experience')}
        sx={{ mb: 1 }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Experience Level</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth size="small">
            <InputLabel>Select Experience Levels</InputLabel>
            <Select
              multiple
              value={localFilters.experienceLevel || []}
              onChange={(e) => updateLocalFilters({ experienceLevel: e.target.value as ExperienceLevel[] })}
              input={<OutlinedInput label="Select Experience Levels" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={experienceLevels.find(e => e.value === value)?.label} size="small" />
                  ))}
                </Box>
              )}
            >
              {experienceLevels.map((level) => (
                <MenuItem key={level.value} value={level.value}>
                  {level.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>
      
      {/* Apply Filters Button */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={applyFilters}
          disabled={!hasActiveFilters()}
        >
          Apply Filters
        </Button>
        <Button
          variant="outlined"
          onClick={clearFilters}
          disabled={!hasActiveFilters()}
        >
          Clear All
        </Button>
      </Box>
    </Paper>
  );
};

export default JobFilters;
