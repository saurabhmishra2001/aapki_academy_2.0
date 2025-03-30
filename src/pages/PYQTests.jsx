import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';
import { useAuth } from "../contexts/AuthContext";
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
    try {
      const testsQuery = query(
        collection(db, 'tests'),
        where('type', '==', 'pyq')
      );

      const querySnapshot = await getDocs(testsQuery);
      const testsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setTests(testsList);
      setError(null);
    } catch (err) {
      console.error('Error fetching tests:', err);
      setError('Failed to load tests');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = (testId) => {
    navigate(`/test/${testId}`);
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
              No tests available at the moment.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
