import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { testService } from "../../services/testService";

export default function PYQTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    try {
      // ✅ Fetch tests where model is 'PYQ'
      const pyqTests = await testService.getPyqTests();
      setTests(pyqTests);
      setError(null);
    } catch (err) {
      console.error('Error fetching PYQ tests:', err);
      setError('Failed to load tests');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = (testId) => {
    navigate(`/pyq-tests/${testId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Previous Year Question Papers
      </Typography>

      <Grid container spacing={3}>
        {tests.map((test) => (
          <Grid item xs={12} sm={6} md={4} key={test.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {test.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Duration: {test.duration} minutes
                </Typography>
                <Typography variant="body2" paragraph>
                  {test.description}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleStartTest(test.id)}
                  fullWidth
                >
                  Start Test
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {tests.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body1" align="center">
              No PYQ tests available at the moment.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
