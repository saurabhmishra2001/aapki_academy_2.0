import React from 'react';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { getTheme } from './theme';
import { useThemeContext } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Documents from './pages/Documents';
import Videos from './pages/Videos';
import PYQTests from './pages/PYQTests';
import TestPage from './pages/TestPage';
import TestResult from './pages/TestResult';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCourses from './pages/admin/Courses';
import AdminVideos from './pages/admin/Videos';
import AdminDocuments from './pages/admin/Documents';
import CreateTest from './pages/admin/CreateTest';
import AdminTests from './pages/admin/Tests';
import EditTestForm from './components/admin/forms/EditTestForm';
import ActiveTests from './pages/admin/ActiveTests';
import TotalTests from './pages/admin/TotalTests';
import TotalUsers from './pages/admin/TotalUsers';
import AdminRequests from './pages/admin/AdminRequests';

function AppContent() {
  const { darkMode } = useThemeContext();
  const theme = getTheme(darkMode);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default 
      }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/courses" element={<PrivateRoute><Courses /></PrivateRoute>} />
            <Route path="/documents" element={<PrivateRoute><Documents /></PrivateRoute>} />
            <Route path="/videos" element={<PrivateRoute><Videos /></PrivateRoute>} />
            <Route path="/pyq-tests" element={<PrivateRoute><PYQTests /></PrivateRoute>} />
            <Route path="/pyq-tests/:testId" element={<PrivateRoute><TestPage /></PrivateRoute>} />
            <Route path="/test-result/:attemptId" element={<PrivateRoute><TestResult /></PrivateRoute>} />

            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/courses" element={<AdminRoute><AdminCourses /></AdminRoute>} />
            <Route path="/admin/videos" element={<AdminRoute><AdminVideos /></AdminRoute>} />
            <Route path="/admin/documents" element={<AdminRoute><AdminDocuments /></AdminRoute>} />
            <Route path="/admin/create-test" element={<AdminRoute><CreateTest /></AdminRoute>} />
            <Route path="/admin/tests" element={<AdminRoute><AdminTests /></AdminRoute>} />
            <Route path="/admin/edit-test/:testId" element={<AdminRoute><EditTestForm /></AdminRoute>} />
            <Route path="/admin/active-tests" element={<AdminRoute><ActiveTests /></AdminRoute>} />
            <Route path="/admin/total-tests" element={<AdminRoute><TotalTests /></AdminRoute>} />
            <Route path="/admin/total-users" element={<AdminRoute><TotalUsers /></AdminRoute>} />
            <Route path="/admin/requests" element={<AdminRoute><AdminRequests /></AdminRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </MuiThemeProvider>
  );
}

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AdminAuthProvider>
            <AppContent />
          </AdminAuthProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}