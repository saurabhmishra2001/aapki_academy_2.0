import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { testService } from '../services/testService';

const FreeTests = () => {
  const { user } = useAuth();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const testsData = await testService.getFreeTests(); // ✅ Use the correct method
        setTests(testsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching free tests:', err);
        setError('Failed to load free tests. Please try again later.');
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const handleStartTest = (testId) => {
    window.location.href = `/test/${testId}`;
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading free tests...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Free Tests
      </Typography>
      <Typography variant="body1" paragraph>
        Practice with our collection of free tests to enhance your knowledge and test your skills.
      </Typography>

      {tests.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">No free tests available at the moment.</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Please check back later or explore our other resources.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {tests.map((test) => (
            <Grid item xs={12} sm={6} md={4} key={test.id}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
                elevation={2}
              >
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {test.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {test.description}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Questions:</strong> {test.totalQuestions || 'N/A'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Duration:</strong> {test.duration || 'N/A'} minutes
                    </Typography>
                    <Typography variant="body2">
                      <strong>Subject:</strong> {test.subject || 'N/A'}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 3 }}
                  onClick={() => handleStartTest(test.id)}
                >
                  Start Test
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default FreeTests;
