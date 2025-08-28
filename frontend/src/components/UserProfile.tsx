import { Avatar, Box, Card, CardContent, Typography, Chip } from "@mui/material";
import { User } from "../types/jobBoard";

type Props = {
  data: User;
};

/**
 * A component that displays user profile data.
 * 
 * @param {Props} props Component props.
 * @param {User} props.data User data to display.
 * 
 * @returns {JSX.Element} The component.
 */
function UserProfile(props: Props) {
  const { data } = props;
  
  return (
    <Box>
      <Card sx={{ maxWidth: 500, mx: "auto", mt: 4, mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Avatar
              src={data.image}
              alt={data.name}
              sx={{ width: 80, height: 80 }}
            />
            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                {data.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {data.email}
              </Typography>
              <Chip 
                label={data.role} 
                color="primary" 
                size="small" 
              />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default UserProfile;
