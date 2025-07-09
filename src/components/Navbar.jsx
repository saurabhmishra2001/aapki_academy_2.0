import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  useTheme,
  Avatar,
  Badge,
  Chip,
  Divider,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  School as CoursesIcon,
  VideoLibrary as VideosIcon,
  Article as DocumentsIcon,
  Quiz as TestsIcon,
  AddCircle as CreateTestIcon,
  Edit as EditTestIcon,
  PlaylistAddCheck as ActiveTestsIcon,
  FormatListNumbered as TotalTestsIcon,
  People as UsersIcon,
  RequestPage as RequestsIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  AdminPanelSettings as AdminIcon,
  AccountCircle as UserIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const { darkMode, toggleDarkMode } = useThemeContext();
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [adminMenuAnchor, setAdminMenuAnchor] = useState(null);
  const [testsMenuAnchor, setTestsMenuAnchor] = useState(null);
  const [proTestsMenuAnchor, setProTestsMenuAnchor] = useState(null);
  const [subjectTestsMenuAnchor, setSubjectTestsMenuAnchor] = useState(null);

  const isAdmin = user?.role === 'admin';


  const handleMobileMenuOpen = (event) => setMobileMenuAnchor(event.currentTarget);
  const handleMobileMenuClose = () => setMobileMenuAnchor(null);
  const handleUserMenuOpen = (event) => setUserMenuAnchor(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchor(null);
  const handleAdminMenuOpen = (event) => setAdminMenuAnchor(event.currentTarget);
  const handleAdminMenuClose = () => setAdminMenuAnchor(null);
  
  // Test menu handlers
  const handleTestsMenuOpen = (event) => setTestsMenuAnchor(event.currentTarget);
  const handleTestsMenuClose = () => setTestsMenuAnchor(null);
  const handleProTestsMenuOpen = (event) => {
    setProTestsMenuAnchor(event.currentTarget);
  };
  const handleProTestsMenuClose = () => setProTestsMenuAnchor(null);
  const handleSubjectTestsMenuOpen = (event) => {
    setSubjectTestsMenuAnchor(event.currentTarget);
  };
  const handleSubjectTestsMenuClose = () => setSubjectTestsMenuAnchor(null);
  
  // Close all test menus
  const closeAllTestMenus = () => {
    handleTestsMenuClose();
    handleProTestsMenuClose();
    handleSubjectTestsMenuClose();
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleUserMenuClose();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Navigation items for regular users
  const userNavItems = [
    { id: 'dashboard', text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { id: 'courses', text: 'Courses', icon: <CoursesIcon />, path: '/courses' },
    { id: 'videos', text: 'Videos', icon: <VideosIcon />, path: '/videos' },
    { id: 'documents', text: 'Documents', icon: <DocumentsIcon />, path: '/documents' },
    { 
      id: 'tests',
      text: 'Tests', 
      icon: <TestsIcon />,
      subItems: [
        { id: 'free-tests', text: 'Free Test', path: '/free-tests' },
        { 
          id: 'pro-tests', 
          text: 'Pro', 
          subItems: [
            { id: 'mcq-tests', text: 'MCQs', path: '/mcq-tests' },
            { id: 'pyq-tests', text: 'PYQs', path: '/pyq-tests' },
            { 
              id: 'subject-tests', 
              text: 'Subject-wise',
              subItems: [
                { id: 'nta-tests', text: 'NTA', path: '/nta-tests' },
                { id: 'ugc-net-tests', text: 'UGC NET', path: '/ugc-net-tests' },
                { id: 'jrf-tests', text: 'JRF', path: '/jrf-tests' }
              ]
            }
          ]
        }
      ]
    },
  ];

  // Navigation items for admin users
  const adminNavItems = [
    { id: 'admin-dashboard', text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { id: 'admin-courses', text: 'Courses', icon: <CoursesIcon />, path: '/admin/courses' },
    { id: 'admin-videos', text: 'Videos', icon: <VideosIcon />, path: '/admin/videos' },
    { id: 'admin-documents', text: 'Documents', icon: <DocumentsIcon />, path: '/admin/documents' },
    { 
      id: 'admin-tests',
      text: 'Tests', 
      icon: <TestsIcon />,
      subItems: [
        { id: 'all-tests', text: 'All Tests', path: '/admin/tests' },
        { id: 'create-test', text: 'Create Test', path: '/admin/create-test' },
        // { id: 'edit-test', text: 'Edit Test', path: '/admin/edit-test' },
        // { id: 'active-tests', text: 'Active Tests', path: '/admin/active-tests' },
        // { id: 'total-tests', text: 'Total Tests', path: '/admin/total-tests' },
      ]
    },
    { text: 'Users', icon: <UsersIcon />, path: '/admin/total-users' },
    { text: 'Requests', icon: <RequestsIcon />, path: '/admin/requests' },
  ];

  const currentNavItems = isAdmin ? adminNavItems : (user ? userNavItems : []);

  return (
    <AppBar position="sticky" elevation={1} color="default">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Logo and Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              component={Link}
              to={isAdmin ? '/admin/dashboard' : '/'}
              size="large"
              edge="start"
              color="inherit"
              sx={{ mr: 1 }}
            >
              <Box
                component="img"
                src="/favicon.png"
                alt="Logo"
                sx={{ height: 32, width: 32 }}
              />
            </IconButton>
            <Typography
              variant="h6"
              component={Link}
              to={isAdmin ? '/admin/dashboard' : '/'}
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 700,
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Aapki Academy
              {isAdmin && (
                <Chip 
                  label="Admin" 
                  size="small" 
                  color="secondary" 
                  icon={<AdminIcon fontSize="small" />}
                  sx={{ ml: 1, verticalAlign: 'middle' }}
                />
              )}
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Stack
            direction="row"
            spacing={1}
            sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}
          >
            {currentNavItems.map((item) => {
              // Handle Tests menu with nested structure
              if (item.id === 'tests' && item.subItems) {
                return (
                  <Box key={item.id}>
                    <Button
                      onClick={handleTestsMenuOpen}
                      startIcon={item.icon}
                      sx={{
                        color: 'inherit',
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    >
                      {item.text}
                    </Button>
                    
                    {/* First level menu: Free Test and Pro */}
                    <Menu
                      anchorEl={testsMenuAnchor}
                      open={Boolean(testsMenuAnchor)}
                      onClose={handleTestsMenuClose}
                    >
                      {item.subItems.map((subItem) => {
                        if (subItem.id === 'pro-tests' && subItem.subItems) {
                          // Pro tests with nested options
                          return (
                            <MenuItem
                              key={subItem.id}
                              onClick={handleProTestsMenuOpen}
                              sx={{ position: 'relative' }}
                            >
                              <ListItemText>{subItem.text}</ListItemText>
                              
                              {/* Second level menu: MCQs, PYQs, Subject-wise */}
                              <Menu
                                anchorEl={proTestsMenuAnchor}
                                open={Boolean(proTestsMenuAnchor)}
                                onClose={handleProTestsMenuClose}
                                anchorOrigin={{
                                  vertical: 'top',
                                  horizontal: 'right',
                                }}
                                transformOrigin={{
                                  vertical: 'top',
                                  horizontal: 'left',
                                }}
                              >
                                {subItem.subItems.map((proSubItem) => {
                                  if (proSubItem.id === 'subject-tests' && proSubItem.subItems) {
                                    // Subject-wise with nested options
                                    return (
                                      <MenuItem
                                        key={proSubItem.id}
                                        onClick={handleSubjectTestsMenuOpen}
                                        sx={{ position: 'relative' }}
                                      >
                                        <ListItemText>{proSubItem.text}</ListItemText>
                                        
                                        {/* Third level menu: NTA, UGC NET, JRF */}
                                        <Menu
                                          anchorEl={subjectTestsMenuAnchor}
                                          open={Boolean(subjectTestsMenuAnchor)}
                                          onClose={handleSubjectTestsMenuClose}
                                          anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                          }}
                                          transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                          }}
                                        >
                                          {proSubItem.subItems.map((subjectItem) => (
                                            <MenuItem
                                              key={subjectItem.id}
                                              component={Link}
                                              to={subjectItem.path}
                                              onClick={closeAllTestMenus}
                                            >
                                              <ListItemText>{subjectItem.text}</ListItemText>
                                            </MenuItem>
                                          ))}
                                        </Menu>
                                      </MenuItem>
                                    );
                                  } else {
                                    // Regular MCQs and PYQs items
                                    return (
                                      <MenuItem
                                        key={proSubItem.id}
                                        component={Link}
                                        to={proSubItem.path}
                                        onClick={closeAllTestMenus}
                                      >
                                        <ListItemText>{proSubItem.text}</ListItemText>
                                      </MenuItem>
                                    );
                                  }
                                })}
                              </Menu>
                            </MenuItem>
                          );
                        } else {
                          // Free Test item
                          return (
                            <MenuItem
                              key={subItem.id}
                              component={Link}
                              to={subItem.path}
                              onClick={closeAllTestMenus}
                            >
                              <ListItemText>{subItem.text}</ListItemText>
                            </MenuItem>
                          );
                        }
                      })}
                    </Menu>
                  </Box>
                );
              }
              // Handle Admin menu with subItems
              else if (item.subItems) {
                return (
                  <Box key={item.id}>
                    <Button
                      onClick={handleAdminMenuOpen}
                      startIcon={item.icon}
                      sx={{
                        color: 'inherit',
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    >
                      {item.text}
                    </Button>
                    <Menu
                      anchorEl={adminMenuAnchor}
                      open={Boolean(adminMenuAnchor)}
                      onClose={handleAdminMenuClose}
                    >
                      {item.subItems.map((subItem) => (
                        <MenuItem
                          key={subItem.id || subItem.path}
                          component={Link}
                          to={subItem.path}
                          onClick={handleAdminMenuClose}
                        >
                          <ListItemText>{subItem.text}</ListItemText>
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>
                );
              } 
              // Regular menu items
              else {
                return (
                  <Button
                    key={item.id}
                    component={Link}
                    to={item.path}
                    startIcon={item.icon}
                    sx={{
                      color: 'inherit',
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                );
              }
            })}

            {/* Dark Mode Toggle */}
            <IconButton
              onClick={toggleDarkMode}
              color="inherit"
              sx={{ ml: 1 }}
            >
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            {/* User Section */}
            {user ? (
              <Box>
                {/* User Menu */}
                <IconButton
                  onClick={handleUserMenuOpen}
                  sx={{ p: 0, ml: 1 }}
                >
                  <Avatar
                    alt={user.displayName}
                    src={user.photoURL}
                    sx={{ width: 32, height: 32 }}
                  >
                    {user.displayName?.[0]}
                  </Avatar>
                </IconButton>

                {/* User Menu Dropdown */}
                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={handleUserMenuClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={() => {
                    handleUserMenuClose();
                    navigate(isAdmin ? '/admin/profile' : '/profile');
                  }}>
                    <Avatar /> Profile
                  </MenuItem>
                  {isAdmin && (
                    <MenuItem onClick={() => {
                      handleUserMenuClose();
                      navigate('/admin/settings');
                    }}>
                      <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                      <ListItemText>Admin Settings</ListItemText>
                    </MenuItem>
                  )}
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Box>
                <Button
                  component={Link}
                  to="/login"
                  startIcon={<LoginIcon />}
                  sx={{
                    color: 'inherit',
                  }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/signup"
                  startIcon={<PersonAddIcon />}
                  variant="contained"
                  color="primary"
                  sx={{
                    ml: 1,
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Stack>

          {/* Mobile Menu */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
            {/* Dark Mode Toggle */}
            <IconButton
              onClick={toggleDarkMode}
              color="inherit"
              sx={{ mr: 1 }}
            >
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            {/* Mobile Menu Button */}
            <IconButton
              color="inherit"
              onClick={handleMobileMenuOpen}
            >
              <MenuIcon />
            </IconButton>

            {/* Mobile Menu Dropdown */}
            <Menu
              anchorEl={mobileMenuAnchor}
              open={Boolean(mobileMenuAnchor)}
              onClose={handleMobileMenuClose}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {currentNavItems.map((item) => {
                // Handle Tests menu with nested structure
                if (item.id === 'tests' && item.subItems) {
                  return (
                    <div key={item.id}>
                      <MenuItem onClick={handleTestsMenuOpen}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText>{item.text}</ListItemText>
                      </MenuItem>
                      
                      {/* First level menu: Free Test and Pro */}
                      <Menu
                        anchorEl={testsMenuAnchor}
                        open={Boolean(testsMenuAnchor)}
                        onClose={handleTestsMenuClose}
                      >
                        {item.subItems.map((subItem) => {
                          if (subItem.id === 'pro-tests' && subItem.subItems) {
                            // Pro tests with nested options
                            return (
                              <MenuItem
                                key={subItem.id}
                                onClick={handleProTestsMenuOpen}
                              >
                                <ListItemText inset>{subItem.text}</ListItemText>
                                
                                {/* Second level menu: MCQs, PYQs, Subject-wise */}
                                <Menu
                                  anchorEl={proTestsMenuAnchor}
                                  open={Boolean(proTestsMenuAnchor)}
                                  onClose={handleProTestsMenuClose}
                                >
                                  {subItem.subItems.map((proSubItem) => {
                                    if (proSubItem.id === 'subject-tests' && proSubItem.subItems) {
                                      // Subject-wise with nested options
                                      return (
                                        <MenuItem
                                          key={proSubItem.id}
                                          onClick={handleSubjectTestsMenuOpen}
                                        >
                                          <ListItemText inset>{proSubItem.text}</ListItemText>
                                          
                                          {/* Third level menu: NTA, UGC NET, JRF */}
                                          <Menu
                                            anchorEl={subjectTestsMenuAnchor}
                                            open={Boolean(subjectTestsMenuAnchor)}
                                            onClose={handleSubjectTestsMenuClose}
                                          >
                                            {proSubItem.subItems.map((subjectItem) => (
                                              <MenuItem
                                                key={subjectItem.id}
                                                component={Link}
                                                to={subjectItem.path}
                                                onClick={() => {
                                                  handleMobileMenuClose();
                                                  closeAllTestMenus();
                                                }}
                                              >
                                                <ListItemText inset>{subjectItem.text}</ListItemText>
                                              </MenuItem>
                                            ))}
                                          </Menu>
                                        </MenuItem>
                                      );
                                    } else {
                                      // Regular MCQs and PYQs items
                                      return (
                                        <MenuItem
                                          key={proSubItem.id}
                                          component={Link}
                                          to={proSubItem.path}
                                          onClick={() => {
                                            handleMobileMenuClose();
                                            closeAllTestMenus();
                                          }}
                                        >
                                          <ListItemText inset>{proSubItem.text}</ListItemText>
                                        </MenuItem>
                                      );
                                    }
                                  })}
                                </Menu>
                              </MenuItem>
                            );
                          } else {
                            // Free Test item
                            return (
                              <MenuItem
                                key={subItem.id}
                                component={Link}
                                to={subItem.path}
                                onClick={() => {
                                  handleMobileMenuClose();
                                  closeAllTestMenus();
                                }}
                              >
                                <ListItemText inset>{subItem.text}</ListItemText>
                              </MenuItem>
                            );
                          }
                        })}
                      </Menu>
                    </div>
                  );
                }
                // Handle Admin menu with subItems
                else if (item.subItems) {
                  return (
                    <div key={item.id}>
                      <MenuItem onClick={handleAdminMenuOpen}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText>{item.text}</ListItemText>
                      </MenuItem>
                      <Menu
                        anchorEl={adminMenuAnchor}
                        open={Boolean(adminMenuAnchor)}
                        onClose={handleAdminMenuClose}
                      >
                        {item.subItems.map((subItem) => (
                          <MenuItem
                            key={subItem.id || subItem.path}
                            component={Link}
                            to={subItem.path}
                            onClick={() => {
                              handleMobileMenuClose();
                              handleAdminMenuClose();
                            }}
                          >
                            <ListItemText inset>{subItem.text}</ListItemText>
                          </MenuItem>
                        ))}
                      </Menu>
                    </div>
                  );
                } 
                // Regular menu items
                else {
                  return (
                    <MenuItem
                      key={item.id}
                      component={Link}
                      to={item.path}
                      onClick={handleMobileMenuClose}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText>{item.text}</ListItemText>
                    </MenuItem>
                  );
                }
              })}

              {user ? (
                <Box>
                  <MenuItem
                    onClick={() => {
                      handleMobileMenuClose();
                      navigate(isAdmin ? '/admin/profile' : '/profile');
                    }}
                  >
                    <ListItemIcon><UserIcon /></ListItemIcon>
                    <ListItemText>Profile</ListItemText>
                  </MenuItem>
                  {isAdmin && (
                    <MenuItem
                      onClick={() => {
                        handleMobileMenuClose();
                        navigate('/admin/settings');
                      }}
                    >
                      <ListItemIcon><SettingsIcon /></ListItemIcon>
                      <ListItemText>Admin Settings</ListItemText>
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon><LogoutIcon /></ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                  </MenuItem>
                </Box>
              ) : (
                <Box>
                  <MenuItem
                    component={Link}
                    to="/login"
                    onClick={handleMobileMenuClose}
                  >
                    <ListItemIcon><LoginIcon /></ListItemIcon>
                    <ListItemText>Login</ListItemText>
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to="/signup"
                    onClick={handleMobileMenuClose}
                  >
                    <ListItemIcon><PersonAddIcon /></ListItemIcon>
                    <ListItemText>Sign Up</ListItemText>
                  </MenuItem>
                </Box>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}