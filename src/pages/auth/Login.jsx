import LoginForm from '../../components/auth/LoginForm';
import { Box, Paper, useTheme,Typography } from '@mui/material';

export default function Login() {
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
      <Paper elevation={3} sx={{
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        width: '100%',
        maxWidth: 1200,
        borderRadius: 4,
        overflow: 'hidden'
      }}>
        {/* Left Side - Graphic Section */}
        <Box sx={{
          flex: 1,
          display: { xs: 'none', lg: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'primary.main',
          p: 4
        }}>
          <Box sx={{
            textAlign: 'center',
            color: 'common.white',
            maxWidth: 500
          }}>
            <img 
              src="https://cdn-icons-png.flaticon.com/512/2991/2991471.png"
              alt="Login Illustration"
              style={{ width: '80%', margin: '0 auto 2rem' }}
            />
            <Typography variant="h3" sx={{ 
              fontWeight: 700,
              mb: 2,
              textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              Welcome Back!
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Continue your learning journey with us
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
          <LoginForm />
        </Box>
      </Paper>
    </Box>
  );
}