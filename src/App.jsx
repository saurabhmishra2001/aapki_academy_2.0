import React, { Suspense } from 'react';
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

// Lazy loaded pages
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/auth/Login'));
const Signup = React.lazy(() => import('./pages/auth/Signup'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Courses = React.lazy(() => import('./pages/Courses'));
const Documents = React.lazy(() => import('./pages/Documents'));
const Videos = React.lazy(() => import('./pages/Videos'));
const PYQTests = React.lazy(() => import('./pages/PYQTests'));
const TestPage = React.lazy(() => import('./pages/TestPage'));
const TestResult = React.lazy(() => import('./pages/TestResult'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Admin pages
const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const AdminCourses = React.lazy(() => import('./pages/admin/Courses'));
const AdminVideos = React.lazy(() => import('./pages/admin/Videos'));
const AdminDocuments = React.lazy(() => import('./pages/admin/Documents'));
const CreateTest = React.lazy(() => import('./pages/admin/CreateTest'));
const AdminTests = React.lazy(() => import('./pages/admin/Tests'));
const EditTestForm = React.lazy(() => import('./components/admin/forms/EditTestForm'));
const ActiveTests = React.lazy(() => import('./pages/admin/ActiveTests'));
const TotalTests = React.lazy(() => import('./pages/admin/TotalTests'));
const TotalUsers = React.lazy(() => import('./pages/admin/TotalUsers'));
const AdminRequests = React.lazy(() => import('./pages/admin/AdminRequests'));
const TestDetails = React.lazy(() => import('./pages/admin/TestDetails')); // ✅ New

// Fallback loader
const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <div>Loading...</div>
  </div>
);

function AppContent() {
  const { darkMode } = useThemeContext();
  const theme = getTheme(darkMode);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* User Routes */}
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/courses" element={<PrivateRoute><Courses /></PrivateRoute>} />
              <Route path="/documents" element={<PrivateRoute><Documents /></PrivateRoute>} />
              <Route path="/videos" element={<PrivateRoute><Videos /></PrivateRoute>} />
              <Route path="/pyq-tests" element={<PrivateRoute><PYQTests /></PrivateRoute>} />
              <Route path="/pyq-tests/:testId" element={<PrivateRoute><TestPage /></PrivateRoute>} />
              <Route path="/test-result/:attemptId" element={<PrivateRoute><TestResult /></PrivateRoute>} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/courses" element={<AdminRoute><AdminCourses /></AdminRoute>} />
              <Route path="/admin/videos" element={<AdminRoute><AdminVideos /></AdminRoute>} />
              <Route path="/admin/documents" element={<AdminRoute><AdminDocuments /></AdminRoute>} />
              <Route path="/admin/create-test" element={<AdminRoute><CreateTest /></AdminRoute>} />
              <Route path="/admin/tests" element={<AdminRoute><AdminTests /></AdminRoute>} />
              <Route path="/admin/edit-test" element={<AdminRoute><EditTestForm /></AdminRoute>} />
              <Route path="/admin/edit-test/:testId" element={<AdminRoute><EditTestForm /></AdminRoute>} />
              <Route path="/admin/active-tests" element={<AdminRoute><ActiveTests /></AdminRoute>} />
              <Route path="/admin/total-tests" element={<AdminRoute><TotalTests /></AdminRoute>} />
              <Route path="/admin/test-details/:testId" element={<AdminRoute><TestDetails /></AdminRoute>} /> {/* ✅ Added */}
              <Route path="/admin/total-users" element={<AdminRoute><TotalUsers /></AdminRoute>} />
              <Route path="/admin/requests" element={<AdminRoute><AdminRequests /></AdminRoute>} />
              <Route path="/admin/profile" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/settings" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
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
