import React, { useState } from 'react';
import {
  // MUI Components
  Box,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
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
  Pagination,
  Paper,
  Chip
} from '@mui/material';

import {
  // MUI Icons
  Dashboard as DashboardIcon,
  Article as DocumentsIcon,
  Quiz as TestsIcon,
  VideoLibrary as VideosIcon,
  School as CoursesIcon,
  Notifications as NotificationsIcon,
  BarChart as ChartBarIcon,
  FilterList as FilterIcon,
  Search as SearchIcon
} from '@mui/icons-material';

const AdminDashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
          <Paper sx={{ padding: 2, textAlign: 'center' }}>
            <Avatar>
              <DashboardIcon />
            </Avatar>
            <Typography variant="h6">Dashboard</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ padding: 2, textAlign: 'center' }}>
            <Avatar>
              <VideosIcon />
            </Avatar>
            <Typography variant="h6">Videos</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ padding: 2, textAlign: 'center' }}>
            <Avatar>
              <CoursesIcon />
            </Avatar>
            <Typography variant="h6">Courses</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ padding: 2, textAlign: 'center' }}>
            <Avatar>
              <TestsIcon />
            </Avatar>
            <Typography variant="h6">Tests</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Notifications */}
      <Box sx={{ marginTop: 3 }}>
        <Typography variant="h6" gutterBottom>
          Notifications
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="New user signed up" secondary="2 minutes ago" />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="Course updated" secondary="10 minutes ago" />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="System maintenance scheduled" secondary="1 hour ago" />
          </ListItem>
        </List>
      </Box>

      {/* Dialog Example */}
      <Button variant="contained" color="primary" onClick={handleDialogOpen} sx={{ marginTop: 2 }}>
        Open Dialog
      </Button>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Example Dialog</DialogTitle>
        <DialogContent>
          <Typography>This is a sample dialog.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Pagination Example */}
      
    </Box>
  );
};

export default AdminDashboard;
