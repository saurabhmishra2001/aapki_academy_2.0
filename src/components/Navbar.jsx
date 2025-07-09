import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';
import {
  AppBar, Box, Button, Container, IconButton, Menu, MenuItem, Stack, Toolbar,
  Typography, useTheme, Avatar, Chip, Divider, ListItemIcon, ListItemText
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard as DashboardIcon, School as CoursesIcon,
  VideoLibrary as VideosIcon, Article as DocumentsIcon, Quiz as TestsIcon,
  People as UsersIcon, RequestPage as RequestsIcon, Logout as LogoutIcon,
  Login as LoginIcon, PersonAdd as PersonAddIcon, Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon, AdminPanelSettings as AdminIcon,
  AccountCircle as UserIcon, Settings as SettingsIcon, ArrowRight
} from '@mui/icons-material';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const { darkMode, toggleDarkMode } = useThemeContext();

  // Multi-level menu anchors (desktop)
  const [testsAnchor, setTestsAnchor] = useState(null);
  const [proAnchor, setProAnchor] = useState(null);
  const [subjectAnchor, setSubjectAnchor] = useState(null);

  // Mobile menu
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  // User/admin menus
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [adminMenuAnchor, setAdminMenuAnchor] = useState(null);

  const isAdmin = user?.role === 'admin';

  // Desktop: open one submenu at a time!
  const handleTestsMenuOpen = (e) => {
    setTestsAnchor(e.currentTarget);
    setProAnchor(null);
    setSubjectAnchor(null);
  };
  const handleTestsMenuClose = () => {
    setTestsAnchor(null);
    setProAnchor(null);
    setSubjectAnchor(null);
  };
  const handleProMenuOpen = (e) => {
    setProAnchor(e.currentTarget);
    setSubjectAnchor(null);
  };
  const handleProMenuClose = () => {
    setProAnchor(null);
    setSubjectAnchor(null);
  };
  const handleSubjectMenuOpen = (e) => setSubjectAnchor(e.currentTarget);
  const handleSubjectMenuClose = () => setSubjectAnchor(null);

  // Mobile menu handlers
  const handleMobileMenuOpen = (e) => setMobileMenuAnchor(e.currentTarget);
  const handleMobileMenuClose = () => setMobileMenuAnchor(null);

  // User/admin menu handlers
  const handleUserMenuOpen = (e) => setUserMenuAnchor(e.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchor(null);
  const handleAdminMenuOpen = (e) => setAdminMenuAnchor(e.currentTarget);
  const handleAdminMenuClose = () => setAdminMenuAnchor(null);

  const handleLogout = async () => {
    try {
      await logout();
      handleUserMenuClose();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Navigation items
  const userNavItems = [
    { id: 'dashboard', text: 'Dashboard', icon: <DashboardIcon fontSize="small"/>, path: '/dashboard' },
    { id: 'courses', text: 'Courses', icon: <CoursesIcon fontSize="small"/>, path: '/courses' },
    { id: 'videos', text: 'Videos', icon: <VideosIcon fontSize="small"/>, path: '/videos' },
    { id: 'documents', text: 'Documents', icon: <DocumentsIcon fontSize="small"/>, path: '/documents' },
    {
      id: 'tests',
      text: 'Tests',
      icon: <TestsIcon fontSize="small"/>,
      subItems: [
        { id: 'free-tests', text: 'Free Test', icon: <TestsIcon fontSize="small"/>, path: '/free-tests' },
        {
          id: 'pro-tests',
          text: 'Pro',
          icon: <Chip label="Pro" color="secondary" size="small" sx={{ml:1}} />,
          subItems: [
            { id: 'pyq-tests', text: 'PYQs', icon: <TestsIcon fontSize="small"/>, path: '/pyq-tests' },
            {
              id: 'subject-tests',
              text: 'Subject-wise',
              icon: <ArrowRight fontSize="small"/>,
              subItems: [
                { id: 'nta-tests', text: 'NTA', icon: <TestsIcon fontSize="small"/>, path: '/nta-tests' },
                { id: 'ugc-net-tests', text: 'UGC NET', icon: <TestsIcon fontSize="small"/>, path: '/ugcnet-tests' },
                { id: 'jrf-tests', text: 'JRF', icon: <TestsIcon fontSize="small"/>, path: '/jrf-tests' }
              ]
            }
          ]
        }
      ]
    }
  ];

  const adminNavItems = [
    { id: 'admin-dashboard', text: 'Dashboard', icon: <DashboardIcon fontSize="small"/>, path: '/admin/dashboard' },
    { id: 'admin-courses', text: 'Courses', icon: <CoursesIcon fontSize="small"/>, path: '/admin/courses' },
    { id: 'admin-videos', text: 'Videos', icon: <VideosIcon fontSize="small"/>, path: '/admin/videos' },
    { id: 'admin-documents', text: 'Documents', icon: <DocumentsIcon fontSize="small"/>, path: '/admin/documents' },
    {
      id: 'admin-tests',
      text: 'Tests',
      icon: <TestsIcon fontSize="small"/>,
      subItems: [
        { id: 'all-tests', text: 'All Tests', icon: <TestsIcon fontSize="small"/>, path: '/admin/tests' },
        { id: 'create-test', text: 'Create Test', icon: <TestsIcon fontSize="small"/>, path: '/admin/create-test' }
      ]
    },
    { text: 'Users', icon: <UsersIcon fontSize="small"/>, path: '/admin/total-users' },
    { text: 'Requests', icon: <RequestsIcon fontSize="small"/>, path: '/admin/requests' },
  ];

  const currentNavItems = isAdmin ? adminNavItems : (user ? userNavItems : []);

  // Render the main "Tests" menu for desktop
  const renderTestsMenu = (item) => (
    <>
      <Button
        onClick={handleTestsMenuOpen}
        startIcon={item.icon}
        aria-controls={Boolean(testsAnchor) ? 'tests-menu' : undefined}
        aria-haspopup="true"
        sx={{
          color: 'inherit',
          px: 2,
          fontWeight: 500,
          textTransform: 'none',
          '&:hover': { backgroundColor: theme.palette.action.hover }
        }}
      >
        {item.text}
      </Button>
      <Menu
        id="tests-menu"
        anchorEl={testsAnchor}
        open={Boolean(testsAnchor)}
        onClose={handleTestsMenuClose}
        MenuListProps={{ onMouseLeave: handleTestsMenuClose }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          sx: { minWidth: 210, borderRadius: 2, boxShadow: 3, mt: 1 }
        }}
      >
        {item.subItems.map((subItem) => {
          if (subItem.id === 'pro-tests') {
            // Pro with nested
            return (
              <MenuItem
                key={subItem.id}
                onMouseEnter={handleProMenuOpen}
                onMouseLeave={handleProMenuClose}
                aria-haspopup="true"
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}
              >
                <ListItemIcon>{subItem.icon}</ListItemIcon>
                <ListItemText>{subItem.text}</ListItemText>
                <ArrowRight color="action" fontSize="small"/>
                {/* Pro submenu */}
                <Menu
                  anchorEl={proAnchor}
                  open={Boolean(proAnchor)}
                  onClose={handleProMenuClose}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                  MenuListProps={{ onMouseLeave: handleProMenuClose }}
                  PaperProps={{
                    sx: { minWidth: 200, borderRadius: 2, boxShadow: 3 }
                  }}
                >
                  {subItem.subItems.map((proSubItem) => {
                    if (proSubItem.id === 'subject-tests') {
                      // Subject-wise with nested
                      return (
                        <MenuItem
                          key={proSubItem.id}
                          onMouseEnter={handleSubjectMenuOpen}
                          onMouseLeave={handleSubjectMenuClose}
                          aria-haspopup="true"
                          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 1 }}
                        >
                          <ListItemIcon>{proSubItem.icon}</ListItemIcon>
                          <ListItemText>{proSubItem.text}</ListItemText>
                          <ArrowRight color="action" fontSize="small"/>
                          {/* Subject-wise submenu */}
                          <Menu
                            anchorEl={subjectAnchor}
                            open={Boolean(subjectAnchor)}
                            onClose={handleSubjectMenuClose}
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                            MenuListProps={{ onMouseLeave: handleSubjectMenuClose }}
                            PaperProps={{
                              sx: { minWidth: 170, borderRadius: 2, boxShadow: 3 }
                            }}
                          >
                            {proSubItem.subItems.map((subjectItem) => (
                              <MenuItem
                                key={subjectItem.id}
                                component={Link}
                                to={subjectItem.path}
                                onClick={() => {
                                  handleTestsMenuClose();
                                  navigate(subjectItem.path);
                                }}
                              >
                                <ListItemIcon>{subjectItem.icon}</ListItemIcon>
                                <ListItemText>{subjectItem.text}</ListItemText>
                              </MenuItem>
                            ))}
                          </Menu>
                        </MenuItem>
                      );
                    } else {
                      // PYQs leaf
                      return (
                        <MenuItem
                          key={proSubItem.id}
                          component={Link}
                          to={proSubItem.path}
                          onClick={() => {
                            handleTestsMenuClose();
                            navigate(proSubItem.path);
                          }}
                        >
                          <ListItemIcon>{proSubItem.icon}</ListItemIcon>
                          <ListItemText>{proSubItem.text}</ListItemText>
                        </MenuItem>
                      );
                    }
                  })}
                </Menu>
              </MenuItem>
            );
          } else {
            // Free Test leaf
            return (
              <MenuItem
                key={subItem.id}
                component={Link}
                to={subItem.path}
                onClick={() => {
                  handleTestsMenuClose();
                  navigate(subItem.path);
                }}
              >
                <ListItemIcon>{subItem.icon}</ListItemIcon>
                <ListItemText>{subItem.text}</ListItemText>
              </MenuItem>
            );
          }
        })}
      </Menu>
    </>
  );

  // Admin menu with subItems
  const renderAdminMenu = (item) => (
    <>
      <Button
        onClick={handleAdminMenuOpen}
        startIcon={item.icon}
        sx={{
          color: 'inherit',
          px: 2,
          fontWeight: 500,
          textTransform: 'none',
          '&:hover': { backgroundColor: theme.palette.action.hover }
        }}
      >
        {item.text}
      </Button>
      <Menu
        anchorEl={adminMenuAnchor}
        open={Boolean(adminMenuAnchor)}
        onClose={handleAdminMenuClose}
        PaperProps={{ sx: { minWidth: 210, borderRadius: 2, boxShadow: 3, mt: 1 } }}
      >
        {item.subItems.map((subItem) => (
          <MenuItem
            key={subItem.id || subItem.path}
            component={Link}
            to={subItem.path}
            onClick={() => {
              handleAdminMenuClose();
              navigate(subItem.path);
            }}
          >
            <ListItemIcon>{subItem.icon}</ListItemIcon>
            <ListItemText>{subItem.text}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );

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
              if (item.id === 'tests' && item.subItems) {
                return <Box key={item.id}>{renderTestsMenu(item)}</Box>;
              } else if (item.subItems) {
                return <Box key={item.id}>{renderAdminMenu(item)}</Box>;
              } else {
                return (
                  <Button
                    key={item.id}
                    component={Link}
                    to={item.path}
                    startIcon={item.icon}
                    sx={{
                      color: 'inherit',
                      px: 2,
                      fontWeight: 500,
                      textTransform: 'none',
                      '&:hover': { backgroundColor: theme.palette.action.hover }
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
                  sx={{ color: 'inherit' }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/signup"
                  startIcon={<PersonAddIcon />}
                  variant="contained"
                  color="primary"
                  sx={{ ml: 1 }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Stack>

          {/* Mobile Menu (uses indentation for nesting) */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
            <IconButton onClick={toggleDarkMode} color="inherit" sx={{ mr: 1 }}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            <IconButton color="inherit" onClick={handleMobileMenuOpen}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={mobileMenuAnchor}
              open={Boolean(mobileMenuAnchor)}
              onClose={handleMobileMenuClose}
              sx={{ display: { xs: 'block', md: 'none' } }}
              PaperProps={{
                sx: { minWidth: 220, borderRadius: 2, boxShadow: 3 }
              }}
            >
              {currentNavItems.map((item) => {
                if (item.id === 'tests' && item.subItems) {
                  return (
                    <Box key={item.id}>
                      <MenuItem disabled>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText>{item.text}</ListItemText>
                      </MenuItem>
                      {item.subItems.map((subItem) => {
                        if (subItem.id === 'pro-tests' && subItem.subItems) {
                          return (
                            <React.Fragment key={subItem.id}>
                              <MenuItem disabled sx={{ pl: 4 }}>
                                <ListItemText inset>{subItem.text}</ListItemText>
                              </MenuItem>
                              {subItem.subItems.map((proSubItem) => {
                                if (proSubItem.id === 'subject-tests' && proSubItem.subItems) {
                                  return (
                                    <React.Fragment key={proSubItem.id}>
                                      <MenuItem disabled sx={{ pl: 6 }}>
                                        <ListItemText inset>{proSubItem.text}</ListItemText>
                                      </MenuItem>
                                      {proSubItem.subItems.map((subjectItem) => (
                                        <MenuItem
                                          key={subjectItem.id}
                                          component={Link}
                                          to={subjectItem.path}
                                          sx={{ pl: 8 }}
                                          onClick={() => {
                                            handleMobileMenuClose();
                                            navigate(subjectItem.path);
                                          }}
                                        >
                                          <ListItemIcon>{subjectItem.icon}</ListItemIcon>
                                          <ListItemText inset>{subjectItem.text}</ListItemText>
                                        </MenuItem>
                                      ))}
                                    </React.Fragment>
                                  );
                                }
                                // PYQs
                                return (
                                  <MenuItem
                                    key={proSubItem.id}
                                    component={Link}
                                    to={proSubItem.path}
                                    sx={{ pl: 6 }}
                                    onClick={() => {
                                      handleMobileMenuClose();
                                      navigate(proSubItem.path);
                                    }}
                                  >
                                    <ListItemIcon>{proSubItem.icon}</ListItemIcon>
                                    <ListItemText inset>{proSubItem.text}</ListItemText>
                                  </MenuItem>
                                );
                              })}
                            </React.Fragment>
                          );
                        }
                        // Free Test
                        return (
                          <MenuItem
                            key={subItem.id}
                            component={Link}
                            to={subItem.path}
                            sx={{ pl: 4 }}
                            onClick={() => {
                              handleMobileMenuClose();
                              navigate(subItem.path);
                            }}
                          >
                            <ListItemIcon>{subItem.icon}</ListItemIcon>
                            <ListItemText inset>{subItem.text}</ListItemText>
                          </MenuItem>
                        );
                      })}
                    </Box>
                  );
                }
                // Other admin submenus
                else if (item.subItems) {
                  return (
                    <Box key={item.id}>
                      <MenuItem disabled>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText>{item.text}</ListItemText>
                      </MenuItem>
                      {item.subItems.map((subItem) => (
                        <MenuItem
                          key={subItem.id || subItem.path}
                          component={Link}
                          to={subItem.path}
                          sx={{ pl: 4 }}
                          onClick={() => {
                            handleMobileMenuClose();
                            navigate(subItem.path);
                          }}
                        >
                          <ListItemIcon>{subItem.icon}</ListItemIcon>
                          <ListItemText inset>{subItem.text}</ListItemText>
                        </MenuItem>
                      ))}
                    </Box>
                  );
                }
                // Leaf
                return (
                  <MenuItem
                    key={item.id}
                    component={Link}
                    to={item.path}
                    onClick={() => {
                      handleMobileMenuClose();
                      navigate(item.path);
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText>{item.text}</ListItemText>
                  </MenuItem>
                );
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