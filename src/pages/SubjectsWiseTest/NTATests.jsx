
import React, { useState, useEffect } from 'react'; 
import { Container, Typography, Box, Paper, Grid, Button, CircularProgress, Chip } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { testService } from '../../services/testService';

const NTATests = () => {
  const { user } = useAuth();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        // ✅ Fetch only NTA subject tests of type "paid"
        const testsData = await testService.getTests();
        // Filter for NTA subject tests that are paid
        const filteredTests = testsData.filter(test => test.subject === 'NTA' && test.type === 'paid');
        setTests(filteredTests);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching NTA tests:', err);
        setError('Failed to load NTA tests. Please try again later.');
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
          Loading NTA tests...
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            NTA Subject Tests
          </Typography>
          <Typography variant="body1" paragraph>
            Prepare for NTA exams with our specialized subject-wise tests designed to match the actual exam pattern.
          </Typography>
        </Box>
        <Chip label="Pro" color="secondary" sx={{ fontSize: '1rem', py: 2, px: 1 }} />
      </Box>

      {tests.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">No NTA tests available at the moment.</Typography>
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
                  position: 'relative',
                  overflow: 'hidden',
                }}
                elevation={3}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: -30,
                    transform: 'rotate(45deg)',
                    bgcolor: 'secondary.main',
                    color: 'white',
                    px: 4,
                    py: 0.5,
                    zIndex: 1,
                  }}
                >
                  Pro
                </Box>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {test.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {test.description}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Questions:</strong> {test.totalQuestions}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Duration:</strong> {test.duration} minutes
                    </Typography>
                    <Typography variant="body2">
                      <strong>Subject:</strong> {test.subject}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Type:</strong> {test.type}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Difficulty:</strong> {test.difficulty || 'Intermediate'}
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

export default NTATests;
