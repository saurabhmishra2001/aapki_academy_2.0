import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  IconButton,
  Link as MuiLink,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

export default function Footer() {
  const theme = useTheme();
  const year = new Date().getFullYear();

  const quickLinks = [
    { text: 'About', path: '/about' },
    { text: 'Terms of Service', path: '/terms' },
    { text: 'Privacy Policy', path: '/privacy' },
    { text: 'Contact Us', path: '/contact' },
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, url: '#', label: 'Facebook' },
    { icon: <TwitterIcon />, url: '#', label: 'Twitter' },
    { icon: <InstagramIcon />, url: '#', label: 'Instagram' },
    { icon: <LinkedInIcon />, url: '#', label: 'LinkedIn' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.dark',
        color: 'common.white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              About Us
            </Typography>
            <Typography variant="body2" color="grey.300">
              Aapki Academy is a leading online learning platform that provides high-quality courses,
              study materials, and video lectures to help students prepare for competitive exams.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Quick Links
            </Typography>
            <Stack spacing={1}>
              {quickLinks.map((link) => (
                <MuiLink
                  key={link.path}
                  component={Link}
                  to={link.path}
                  color="grey.300"
                  sx={{
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'secondary.main',
                    },
                  }}
                >
                  {link.text}
                </MuiLink>
              ))}
            </Stack>
          </Grid>

          {/* Contact Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Contact
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon fontSize="small" />
                <Typography variant="body2" color="grey.300">
                  connect.aapkiacademy@gmail.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon fontSize="small" />
                <Typography variant="body2" color="grey.300">
                  +91 7052653137
                </Typography>
              </Box>
            </Stack>
          </Grid>

          {/* Social Media Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Follow Us
            </Typography>
            <Stack direction="row" spacing={1}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.label}
                  component="a"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  sx={{
                    color: 'grey.300',
                    '&:hover': {
                      color: 'secondary.main',
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Typography
          variant="body2"
          color="grey.300"
          align="center"
          sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'grey.800' }}
        >
          &copy; {year} Aapki Academy. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
