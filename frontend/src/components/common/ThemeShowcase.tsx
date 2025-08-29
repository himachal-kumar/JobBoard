import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Chip,
  Switch,
  Checkbox,
  Radio,
  Slider,
  Rating,
  LinearProgress,
  CircularProgress,
  Alert,
  Divider,
  Grid,
  Paper,
  useTheme,
} from '@mui/material';
import { useTheme as useCustomTheme } from '../../contexts/ThemeContext';

export const ThemeShowcase: React.FC = () => {
  const theme = useTheme();
  const { themeMode } = useCustomTheme();

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4 }}>
        Theme Showcase - {themeMode.charAt(0).toUpperCase() + themeMode.slice(1)} Mode
      </Typography>

      <Grid container spacing={4}>
        {/* Typography */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>Typography</Typography>
              <Typography variant="h1" gutterBottom>Heading 1</Typography>
              <Typography variant="h2" gutterBottom>Heading 2</Typography>
              <Typography variant="h3" gutterBottom>Heading 3</Typography>
              <Typography variant="h4" gutterBottom>Heading 4</Typography>
              <Typography variant="h5" gutterBottom>Heading 5</Typography>
              <Typography variant="h6" gutterBottom>Heading 6</Typography>
              <Typography variant="body1" gutterBottom>
                Body 1: This is the main body text with good readability and proper line height.
              </Typography>
              <Typography variant="body2" gutterBottom>
                Body 2: This is secondary body text, slightly smaller but still very readable.
              </Typography>
              <Typography variant="caption" gutterBottom>
                Caption: This is caption text for additional information.
              </Typography>
              <Typography variant="overline" gutterBottom>
                Overline: This is overline text with uppercase styling.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Colors */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>Color Palette</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box sx={{ width: 60, height: 60, bgcolor: 'primary.main', borderRadius: 1, mb: 1 }} />
                  <Typography variant="caption">Primary</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box sx={{ width: 60, height: 60, bgcolor: 'secondary.main', borderRadius: 1, mb: 1 }} />
                  <Typography variant="caption">Secondary</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box sx={{ width: 60, height: 60, bgcolor: 'success.main', borderRadius: 1, mb: 1 }} />
                  <Typography variant="caption">Success</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box sx={{ width: 60, height: 60, bgcolor: 'warning.main', borderRadius: 1, mb: 1 }} />
                  <Typography variant="caption">Warning</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box sx={{ width: 60, height: 60, bgcolor: 'error.main', borderRadius: 1, mb: 1 }} />
                  <Typography variant="caption">Error</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box sx={{ width: 60, height: 60, bgcolor: 'info.main', borderRadius: 1, mb: 1 }} />
                  <Typography variant="caption">Info</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Buttons */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>Buttons</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Button variant="contained" color="primary">Primary</Button>
                <Button variant="contained" color="secondary">Secondary</Button>
                <Button variant="contained" color="success">Success</Button>
                <Button variant="contained" color="warning">Warning</Button>
                <Button variant="contained" color="error">Error</Button>
                <Button variant="contained" color="info">Info</Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Button variant="outlined" color="primary">Primary</Button>
                <Button variant="outlined" color="secondary">Secondary</Button>
                <Button variant="outlined" color="success">Success</Button>
                <Button variant="outlined" color="warning">Warning</Button>
                <Button variant="outlined" color="error">Error</Button>
                <Button variant="outlined" color="info">Info</Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Button variant="text" color="primary">Primary</Button>
                <Button variant="text" color="secondary">Secondary</Button>
                <Button variant="text" color="success">Success</Button>
                <Button variant="text" color="warning">Warning</Button>
                <Button variant="text" color="error">Error</Button>
                <Button variant="text" color="info">Info</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Form Controls */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>Form Controls</Typography>
              <TextField
                fullWidth
                label="Text Field"
                placeholder="Enter text here"
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Switch defaultChecked />
                <Typography>Switch</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Checkbox defaultChecked />
                <Typography>Checkbox</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Radio defaultChecked />
                <Typography>Radio Button</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography gutterBottom>Slider</Typography>
                <Slider defaultValue={50} />
              </Box>
              <Box>
                <Typography gutterBottom>Rating</Typography>
                <Rating defaultValue={4} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Progress Indicators */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>Progress Indicators</Typography>
              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>Linear Progress</Typography>
                <LinearProgress variant="determinate" value={75} sx={{ mb: 2 }} />
                <LinearProgress variant="indeterminate" sx={{ mb: 2 }} />
                <LinearProgress variant="buffer" value={60} valueBuffer={80} />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <CircularProgress variant="determinate" value={75} />
                  <Typography variant="caption" sx={{ mt: 1 }}>75%</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <CircularProgress variant="indeterminate" />
                  <Typography variant="caption" sx={{ mt: 1 }}>Loading</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Alerts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>Alerts</Typography>
              <Alert severity="success" sx={{ mb: 2 }}>
                This is a success alert — check it out!
              </Alert>
              <Alert severity="info" sx={{ mb: 2 }}>
                This is an info alert — check it out!
              </Alert>
              <Alert severity="warning" sx={{ mb: 2 }}>
                This is a warning alert — check it out!
              </Alert>
              <Alert severity="error">
                This is an error alert — check it out!
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* Chips */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>Chips</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label="Primary" color="primary" />
                <Chip label="Secondary" color="secondary" />
                <Chip label="Success" color="success" />
                <Chip label="Warning" color="warning" />
                <Chip label="Error" color="error" />
                <Chip label="Info" color="info" />
                <Chip label="Default" variant="outlined" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Cards and Papers */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>Cards & Papers</Typography>
              <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                <Typography variant="body2">Paper with elevation 1</Typography>
              </Paper>
              <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                <Typography variant="body2">Paper with elevation 3</Typography>
              </Paper>
              <Paper elevation={6} sx={{ p: 2 }}>
                <Typography variant="body2">Paper with elevation 6</Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        {/* Custom CSS Classes */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>Custom CSS Classes</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <Typography className="gradient-text" variant="h5">
                  Gradient Text Effect
                </Typography>
                <Box className="glass-effect" sx={{ p: 2, borderRadius: 2, minWidth: 200 }}>
                  <Typography>Glass Morphism Effect</Typography>
                </Box>
                <Box className="shimmer" sx={{ width: 200, height: 60, borderRadius: 2 }} />
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button className="bounce" variant="contained">
                  Bounce Animation
                </Button>
                <Button className="fade-in" variant="outlined">
                  Fade In Animation
                </Button>
                <Button className="slide-in-left" variant="text">
                  Slide In Left
                </Button>
                <Button className="scale-in" variant="contained" color="secondary">
                  Scale In
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ThemeShowcase;
