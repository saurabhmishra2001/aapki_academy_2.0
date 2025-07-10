import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs
} from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig';
import {
  Card, CardContent, Typography, List, ListItem,
  ListItemText, Divider, Box, CircularProgress, Chip
} from '@mui/material';
import { Assignment, Login, Update } from '@mui/icons-material';

export default function ActivityHistory() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const activityIcons = {
    test: <Assignment fontSize="small" color="primary" />,
    login: <Login fontSize="small" color="success" />,
    update: <Update fontSize="small" color="warning" />
  };

  useEffect(() => {
    if (user?.uid) fetchActivities(user.uid);
  }, [user]);

  const fetchActivities = async (uid) => {
    try {
      const q = query(
        collection(db, 'activities'),
        where('userId', '==', uid),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setActivities(data);
    } catch (err) {
      console.error('Error fetching activities:', err);
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

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Activities
        </Typography>
        <List>
          {activities.length === 0 ? (
            <ListItem><ListItemText primary="No recent activity" /></ListItem>
          ) : (
            activities.map((activity, index) => (
              <Box key={activity.id}>
                <ListItem>
                  {activityIcons[activity.type] || <Assignment fontSize="small" />}
                  <ListItemText
                    primary={
                      <div className="flex items-center justify-between">
                        <span>{activity.description}</span>
                        <Chip
                          label={activity.type}
                          size="small"
                          variant="outlined"
                          className="ml-4"
                        />
                      </div>
                    }
                    secondary={
                      activity.createdAt?.toDate
                        ? activity.createdAt.toDate().toLocaleString()
                        : 'Time not available'
                    }
                  />
                </ListItem>
                {index < activities.length - 1 && <Divider />}
              </Box>
            ))
          )}
        </List>
      </CardContent>
    </Card>
  );
}
