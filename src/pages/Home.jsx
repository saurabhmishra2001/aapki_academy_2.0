import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  AcademicCapIcon, 
  BookOpenIcon, 
  ChartBarIcon, 
  UserGroupIcon 
} from '@heroicons/react/24/outline';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();

  const features = [
    {
      title: 'Expert-Led Courses',
      description: 'Learn from industry professionals and experienced educators',
      icon: AcademicCapIcon,
    },
    {
      title: 'Comprehensive Study Material',
      description: 'Access detailed notes, video lectures, and practice questions',
      icon: BookOpenIcon,
    },
    {
      title: 'Progress Tracking',
      description: 'Monitor your performance with detailed analytics',
      icon: ChartBarIcon,
    },
    {
      title: 'Community Learning',
      description: 'Join study groups and discuss with fellow students',
      icon: UserGroupIcon,
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(180deg, ${theme.palette.primary.light}15, #fff)`,
          pt: { xs: 8, sm: 12, md: 16 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                  fontWeight: 'bold',
                  mb: 2,
                }}
              >
                Welcome to
                <Box component="span" sx={{ color: 'primary.main', display: 'block' }}>
                  Aapki Academy
                </Box>
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 4, maxWidth: 'sm' }}
              >
                Your gateway to academic excellence. Join us to unlock your potential with expert guidance and comprehensive study materials.
              </Typography>
              <Box sx={{ '& > :not(:last-child)': { mr: 2 } }}>
                {user ? (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/dashboard')}
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/login')}
                    >
                      Get Started
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/signup')}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: { xs: 8, sm: 12 } }} maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="overline"
            component="div"
            color="primary"
            sx={{ mb: 2 }}
          >
            Features
          </Typography>
          <Typography variant="h3" component="h2" sx={{ mb: 2 }}>
            Everything you need to succeed
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 'md', mx: 'auto' }}>
            Our platform is designed to provide you with the best learning experience
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={3} key={feature.title}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  borderRadius: 2,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <feature.icon style={{ width: 48, height: 48, color: theme.palette.primary.main }} />
                <Typography variant="h6" component="h3" sx={{ my: 2 }}>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', py: { xs: 8, sm: 12 } }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" component="h2" sx={{ mb: 2 }}>
            Ready to dive in?
          </Typography>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Start your learning journey today.
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, color: 'primary.light' }}>
            Join thousands of students who are already benefiting from our platform.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate(user ? '/dashboard' : '/signup')}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'grey.100',
              },
            }}
          >
            {user ? 'Go to Dashboard' : 'Get Started'}
          </Button>
        </Container>
      </Box>
    </Box>
  );
}
