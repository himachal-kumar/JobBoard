import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Theme,
  Typography,
  useTheme,
  Container,
  Divider,
  Grid,
  Chip,
  Collapse,
  FormHelperText,
} from "@mui/material";
import { createStyles } from "@mui/styles";
import { CSSProperties } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useRegisterMutation } from "../services/api";
import PasswordInput from "./PasswordInput";

const validation = yup.object({
  email: yup.string().email("Email is invalid").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(5, "Minimum 5 chars are required")
    .max(16, "Maximum 16 chars allowed"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  name: yup.string().required("Full name is required"),
  role: yup.string().oneOf(['EMPLOYER', 'CANDIDATE']).required("Role is required"),
  // Employer-specific fields
  company: yup.string().when('role', {
    is: 'EMPLOYER',
    then: (schema) => schema.required("Company name is required"),
    otherwise: (schema) => schema.optional(),
  }),
  position: yup.string().when('role', {
    is: 'EMPLOYER',
    then: (schema) => schema.required("Position is required"),
    otherwise: (schema) => schema.optional(),
  }),
  // Candidate-specific fields
  skills: yup.array().when('role', {
    is: 'CANDIDATE',
    then: (schema) => schema.min(1, "At least one skill is required"),
    otherwise: (schema) => schema.optional(),
  }),
  phone: yup.string().required("Phone number is required"),
  location: yup.string().required("Location is required"),
});

const useStyle = (theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 600,
      width: '100%',
      mx: "auto",
      position: 'relative',
      zIndex: 1,
    },
    input: {
      mt: 3,
      '& .MuiOutlinedInput-root': {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
      },
    },
    button: {
      mt: 4,
      mb: 3,
      height: 56,
      fontSize: '1.1rem',
      fontWeight: 600,
    },
    link: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      fontWeight: 600,
      '&:hover': {
        color: theme.palette.primary.dark,
      },
    },
    floatingShapes: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      zIndex: -1,
    },
    shape: {
      position: 'absolute',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.1)',
      animation: 'float 6s ease-in-out infinite',
    },
    shape1: {
      width: 80,
      height: 80,
      top: '10%',
      left: '10%',
      animationDelay: '0s',
    },
    shape2: {
      width: 120,
      height: 120,
      top: '20%',
      right: '10%',
      animationDelay: '2s',
    },
    shape3: {
      width: 60,
      height: 60,
      bottom: '20%',
      left: '20%',
      animationDelay: '4s',
    },
    divider: {
      my: 3,
      '&::before, &::after': {
        borderColor: 'rgba(255, 255, 255, 0.3)',
      },
    },
    dividerText: {
      color: 'rgba(255, 255, 255, 0.8)',
      px: 2,
    },
    roleCard: {
      cursor: 'pointer',
      transition: 'all 0.3s ease-in-out',
      border: '2px solid transparent',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[8],
      },
    },
    roleCardSelected: {
      borderColor: theme.palette.primary.main,
      backgroundColor: 'rgba(99, 102, 241, 0.05)',
    },
  });

type FormData = typeof validation.__outputType;

/**
 * Enhanced SignupForm component with role-based registration
 * 
 * This component allows users to register as either an Employer or Candidate
 * with different fields based on their selected role.
 */
export default function SignupForm() {
  const theme = useTheme();
  const style = useStyle(theme);
  const [registerUser] = useRegisterMutation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      role: undefined,
      company: "",
      position: "",
      skills: [],
      phone: "",
      location: "",
    },
    resolver: yupResolver(validation),
    mode: "onChange",
  });

  const selectedRole = watch("role");
  const selectedSkills = watch("skills") || [];

  // Available skills for candidates
  const availableSkills = [
    'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'Java', 'SQL',
    'AWS', 'Docker', 'Machine Learning', 'UI/UX Design', 'Project Management',
    'Marketing', 'Sales', 'Customer Service', 'Data Analysis', 'DevOps',
    'Mobile Development', 'Cloud Computing', 'Cybersecurity'
  ];

  /**
   * Submits the signup form data to the server.
   * 
   * If the response is successful, the user is redirected to the home page and
   * a success message is displayed to the user.
   * 
   * If the response is not successful, an error message is displayed to the user.
   * 
   * @param data The signup form data.
   */
  const onSubmit = async (data: FormData) => {
    try {
      // Transform data for API
      const signupData = {
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword, // Add this field
        name: data.name,
        role: data.role,
        phone: data.phone,
        location: data.location,
        ...(data.role === 'EMPLOYER' && {
          company: data.company,
          position: data.position,
        }),
        ...(data.role === 'CANDIDATE' && {
          skills: data.skills,
        }),
      };

      await registerUser(signupData).unwrap();
      toast.success("User registered successfully!");
      navigate("/");
    } catch (error: any) {
      const validationError = error?.data?.data?.errors?.[0].msg;
      toast.error(
        validationError ?? error?.data?.message ?? "Something went wrong!"
      );
    }
  };

  /**
   * Handle skill selection for candidates
   */
  const handleSkillToggle = (skill: string) => {
    const currentSkills = selectedSkills;
    if (currentSkills.includes(skill)) {
      const newSkills = currentSkills.filter(s => s !== skill);
      setValue('skills', newSkills);
    } else {
      const newSkills = [...currentSkills, skill];
      setValue('skills', newSkills);
    }
  };

  return (
    <Box
      minHeight="100vh"
      width="100vw"
      display="flex"
      justifyContent="center"
      alignItems="center"
      position="relative"
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Floating shapes */}
      <Box sx={style.floatingShapes}>
        <Box sx={{ ...style.shape, ...style.shape1 }} />
        <Box sx={{ ...style.shape, ...style.shape2 }} />
        <Box sx={{ ...style.shape, ...style.shape3 }} />
      </Box>

      <Container maxWidth="md">
        <Card sx={style.root}>
          <CardContent sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Box textAlign="center" mb={4}>
                <Typography 
                  variant="h3" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1,
                  }}
                >
                  Create Account
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: '1.1rem',
                  }}
                >
                  Join us and start your journey today
                </Typography>
              </Box>

              {/* Role Selection */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                  I want to join as:
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Card
                      sx={{
                        ...style.roleCard,
                        ...(selectedRole === 'EMPLOYER' && style.roleCardSelected),
                        p: 3,
                        textAlign: 'center',
                      }}
                      onClick={() => {
                        setValue('role', 'EMPLOYER');
                      }}
                    >
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        🏢 Employer
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Post jobs and hire talent
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card
                      sx={{
                        ...style.roleCard,
                        ...(selectedRole === 'CANDIDATE' && style.roleCardSelected),
                        p: 3,
                        textAlign: 'center',
                      }}
                      onClick={() => {
                        setValue('role', 'CANDIDATE');
                      }}
                    >
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        👤 Job Seeker
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Find jobs and apply
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>
                {errors.role && (
                  <FormHelperText error sx={{ mt: 1 }}>
                    {errors.role.message}
                  </FormHelperText>
                )}
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    sx={style.input}
                    fullWidth
                    type="text"
                    placeholder="Enter your full name"
                    label="Full Name"
                    {...register("name")}
                    error={Boolean(errors.name?.message)}
                    helperText={errors.name?.message}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    sx={style.input}
                    fullWidth
                    type="email"
                    placeholder="Enter your email"
                    label="Email Address"
                    {...register("email")}
                    error={Boolean(errors.email?.message)}
                    helperText={errors.email?.message}
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    sx={style.input}
                    fullWidth
                    type="tel"
                    placeholder="Enter your phone number"
                    label="Phone Number"
                    {...register("phone")}
                    error={Boolean(errors.phone?.message)}
                    helperText={errors.phone?.message}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    sx={style.input}
                    fullWidth
                    type="text"
                    placeholder="Enter your location"
                    label="Location"
                    {...register("location")}
                    error={Boolean(errors.location?.message)}
                    helperText={errors.location?.message}
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              {/* Employer-specific fields */}
              <Collapse in={selectedRole === 'EMPLOYER'}>
                <Box sx={{ mt: 3, p: 3, backgroundColor: 'rgba(99, 102, 241, 0.05)', borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                    Company Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        sx={style.input}
                        fullWidth
                        type="text"
                        placeholder="Enter company name"
                        label="Company Name"
                        {...register("company")}
                        error={Boolean(errors.company?.message)}
                        helperText={errors.company?.message}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        sx={style.input}
                        fullWidth
                        type="text"
                        placeholder="Enter your position"
                        label="Your Position"
                        {...register("position")}
                        error={Boolean(errors.position?.message)}
                        helperText={errors.position?.message}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Collapse>

              {/* Candidate-specific fields */}
              <Collapse in={selectedRole === 'CANDIDATE'}>
                <Box sx={{ mt: 3, p: 3, backgroundColor: 'rgba(16, 185, 129, 0.05)', borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'success.main' }}>
                    Skills & Expertise
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Select your skills (click to toggle):
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {availableSkills.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        onClick={() => handleSkillToggle(skill)}
                        color={selectedSkills.includes(skill) ? "primary" : "default"}
                        variant={selectedSkills.includes(skill) ? "filled" : "outlined"}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                  {errors.skills && (
                    <FormHelperText error sx={{ mt: 1 }}>
                      {errors.skills.message}
                    </FormHelperText>
                  )}
                </Box>
              </Collapse>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <PasswordInput
                    sx={style.input}
                    fullWidth
                    type="password"
                    placeholder="Create a password"
                    label="Password"
                    error={Boolean(errors.password?.message)}
                    helperText={errors.password?.message}
                    {...register("password")}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <PasswordInput
                    sx={style.input}
                    fullWidth
                    type="password"
                    placeholder="Confirm your password"
                    label="Confirm Password"
                    error={Boolean(errors.confirmPassword?.message)}
                    helperText={errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                sx={style.button}
                variant="contained"
                fullWidth
                disabled={!isValid || !selectedRole}
                size="large"
              >
                Create Account
              </Button>

              <Divider sx={style.divider}>
                <Typography variant="body2" sx={style.dividerText}>
                  Already have an account?
                </Typography>
              </Divider>

              <Box textAlign="center">
                <Typography variant="body2">
                  <NavLink style={style.link as CSSProperties} to="/login">
                    Sign in to your account
                  </NavLink>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-20px) rotate(120deg); }
            66% { transform: translateY(-10px) rotate(240deg); }
          }
        `}
      </style>
    </Box>
  );
}
