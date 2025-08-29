/**
 * Resume Upload Component
 * 
 * This component handles resume file selection, validation, and upload
 * for job applications. It supports PDF and Word documents.
 */

import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  LinearProgress,
  Paper,
  IconButton,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  CheckCircle as SuccessIcon,
} from '@mui/icons-material';

interface ResumeUploadProps {
  onResumeSelect: (file: File) => void;
  onResumeRemove: () => void;
  selectedFile: File | null;
  isUploading?: boolean;
  uploadProgress?: number;
  error?: string;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({
  onResumeSelect,
  onResumeRemove,
  selectedFile,
  isUploading = false,
  uploadProgress = 0,
  error,
}) => {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onResumeSelect(file);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Resume Upload *
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Upload your resume in PDF or Word format (max 5MB)
      </Typography>

      {/* File Input */}
      <input
        accept=".pdf,.doc,.docx"
        style={{ display: 'none' }}
        id="resume-upload"
        type="file"
        onChange={handleFileSelect}
      />

      {/* Upload Area */}
      {!selectedFile && (
        <Paper
          sx={{
            p: 3,
            border: '2px dashed',
            borderColor: 'grey.300',
            backgroundColor: 'grey.50',
            textAlign: 'center',
            cursor: 'pointer',
          }}
          onClick={() => document.getElementById('resume-upload')?.click()}
        >
          <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            Click to upload resume
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Supports PDF, DOC, DOCX files up to 5MB
          </Typography>
        </Paper>
      )}

      {/* Selected File Display */}
      {selectedFile && (
        <Paper sx={{ p: 2, backgroundColor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SuccessIcon sx={{ color: 'success.main', mr: 1 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'success.main' }}>
                  {selectedFile.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Unknown type'}
                </Typography>
                <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 0.5 }}>
                  ✓ File ready for upload
                </Typography>
              </Box>
            </Box>
            <IconButton
              size="small"
              color="error"
              onClick={onResumeRemove}
              disabled={isUploading}
              title="Remove file"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
          
          {/* File validation info */}
          <Box sx={{ mt: 1, p: 1, backgroundColor: 'info.50', borderRadius: 1 }}>
            <Typography variant="caption" color="info.main">
              <strong>File attached to application:</strong> This resume will be submitted with your job application.
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Uploading resume... {uploadProgress}%
          </Typography>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default ResumeUpload;
