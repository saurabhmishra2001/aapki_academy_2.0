import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  CircularProgress,
  Alert,
  Avatar,
  TextField,
  InputAdornment,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

import {
  Dashboard as DashboardIcon,
  People as StudentsIcon,
  Quiz as TestsIcon,
  VideoLibrary as VideosIcon,
  School as CoursesIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as RevenueIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Person as UserIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock data - Replace with actual API calls
  const stats = {
    totalStudents: 1250,
    totalCourses: 45,
    activeTests: 12,
    totalRevenue: 52000
  };

  const recentActivities = [
    { type: 'user', text: 'New student enrollment', time: '5 minutes ago', icon: <UserIcon /> },
    { type: 'course', text: 'Course "Advanced React" updated', time: '30 minutes ago', icon: <CoursesIcon /> },
    { type: 'test', text: 'New test results available', time: '1 hour ago', icon: <TestsIcon /> },
    { type: 'video', text: 'New lecture uploaded', time: '2 hours ago', icon: <VideosIcon /> }
  ];

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Student Enrollments',
        data: [65, 75, 90, 82, 95, 120],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Course Completions',
        data: [40, 55, 45, 58, 62, 85],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Search & Filter Section */}
      <Box sx={{ display: 'flex', gap: '10px', marginBottom: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" startIcon={<FilterIcon />} onClick={handleMenuOpen}>
          Filter
        </Button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>Filter Option 1</MenuItem>
          <MenuItem onClick={handleMenuClose}>Filter Option 2</MenuItem>
        </Menu>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ padding: 3, textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
            <Avatar sx={{ bgcolor: 'primary.main', margin: '0 auto', mb: 2 }}>
              <StudentsIcon />
            </Avatar>
            <Typography variant="h4" sx={{ mb: 1 }}>{stats.totalStudents}</Typography>
            <Typography variant="subtitle1">Total Students</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ padding: 3, textAlign: 'center', bgcolor: 'success.light', color: 'white' }}>
            <Avatar sx={{ bgcolor: 'success.main', margin: '0 auto', mb: 2 }}>
              <CoursesIcon />
            </Avatar>
            <Typography variant="h4" sx={{ mb: 1 }}>{stats.totalCourses}</Typography>
            <Typography variant="subtitle1">Active Courses</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ padding: 3, textAlign: 'center', bgcolor: 'warning.light', color: 'white' }}>
            <Avatar sx={{ bgcolor: 'warning.main', margin: '0 auto', mb: 2 }}>
              <TestsIcon />
            </Avatar>
            <Typography variant="h4" sx={{ mb: 1 }}>{stats.activeTests}</Typography>
            <Typography variant="subtitle1">Active Tests</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ padding: 3, textAlign: 'center', bgcolor: 'info.light', color: 'white' }}>
            <Avatar sx={{ bgcolor: 'info.main', margin: '0 auto', mb: 2 }}>
              <RevenueIcon />
            </Avatar>
            <Typography variant="h4" sx={{ mb: 1 }}>₹{stats.totalRevenue}</Typography>
            <Typography variant="subtitle1">Total Revenue</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Performance Charts */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Performance Overview</Typography>
            <Line data={chartData} options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: false }
              }
            }} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Recent Activities</Typography>
            <List>
              {recentActivities.map((activity, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: activity.type === 'user' ? 'primary.main' :
                                           activity.type === 'course' ? 'success.main' :
                                           activity.type === 'test' ? 'warning.main' : 'info.main' }}>
                        {activity.icon}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={activity.text}
                      secondary={
                        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TimeIcon fontSize="small" />
                          {activity.time}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < recentActivities.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Quick Stats Cards */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Course Progress</Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Advanced React Course</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Box sx={{ flexGrow: 1, mr: 1 }}>
                  <LinearProgress variant="determinate" value={75} color="success" />
                </Box>
                <Typography variant="body2" color="text.secondary">75%</Typography>
              </Box>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Python Fundamentals</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Box sx={{ flexGrow: 1, mr: 1 }}>
                  <LinearProgress variant="determinate" value={60} color="primary" />
                </Box>
                <Typography variant="body2" color="text.secondary">60%</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Test Performance</Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">React Assessment</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Box sx={{ flexGrow: 1, mr: 1 }}>
                  <LinearProgress variant="determinate" value={85} color="warning" />
                </Box>
                <Typography variant="body2" color="text.secondary">85%</Typography>
              </Box>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">Python Quiz</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Box sx={{ flexGrow: 1, mr: 1 }}>
                  <LinearProgress variant="determinate" value={92} color="info" />
                </Box>
                <Typography variant="body2" color="text.secondary">92%</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
    </Box>
  );
};

export default AdminDashboard;
