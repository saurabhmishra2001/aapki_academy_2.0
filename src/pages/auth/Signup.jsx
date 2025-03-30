// Signup Page Component
import { Link } from 'react-router-dom';
import SignupForm from '../../components/auth/SignupForm';
import { Box, Typography, useTheme } from '@mui/material';

export default function Signup() {
  const theme = useTheme();

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.palette.background.default,
      p: 2
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        width: '100%',
        maxWidth: 1200,
        borderRadius: 4,
        boxShadow: 6,
        overflow: 'hidden',
        backgroundColor: 'common.white'
      }}>
        {/* Left Side - Graphic Section */}
        <Box sx={{
          flex: 1,
          display: { xs: 'none', lg: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'primary.main',
          p: 4,
          position: 'relative'
        }}>
          <Box sx={{
            textAlign: 'center',
            color: 'common.white',
            maxWidth: 500
          }}>
            <img 
              src="https://cdn-icons-png.flaticon.com/512/2991/2991471.png"
              alt="Signup Illustration"
              style={{ width: '80%', margin: '0 auto 2rem' }}
            />
            <Typography variant="h3" sx={{ 
              fontWeight: 700,
              mb: 2,
              textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              Welcome Aboard!
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Join thousands of learners already growing with us
            </Typography>
          </Box>
        </Box>

        {/* Right Side - Form Section */}
        <Box sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, md: 6 }
        }}>
          <SignupForm />
        </Box>
      </Box>
    </Box>
  );
}