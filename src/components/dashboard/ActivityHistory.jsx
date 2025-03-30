// ActivityHistory.js
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  CircularProgress
} from '@mui/material';

export default function ActivityHistory() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchActivities();
    }
  }, [user]);

  const fetchActivities = async () => {
    try {
      const activitiesQuery = query(
        collection(db, 'activities'),
        where('user_id', '==', user.uid),
        orderBy('created_at', 'desc'),
        limit(10)
      );

      const querySnapshot = await getDocs(activitiesQuery);
      const activityList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setActivities(activityList);
      setError(null);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to load activity history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        <List>
          {activities.map((activity, index) => (
            <Box key={activity.id}>
              <ListItem>
                <ListItemText
                  primary={activity.description}
                  secondary={new Date(activity.created_at).toLocaleString()}
                />
              </ListItem>
              {index < activities.length - 1 && <Divider />}
            </Box>
          ))}
          {activities.length === 0 && (
            <ListItem>
              <ListItemText primary="No recent activity" />
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  );
}
