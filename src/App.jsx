import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
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
import MainLayout from './components/layout/MainLayout';
import Loading from './components/common/Loading'; // Create a Loading component
import ErrorBoundary from './components/ErrorBoundary'; // Create an ErrorBoundary component


function AppContent() {
  const { darkMode } = useThemeContext();
  const theme = getTheme(darkMode);

  return (
    <ErrorBoundary>
    <Suspense fallback={<Loading />}>


    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh',
      }}>
      

        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Main App Layout */}
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/courses" element={<PrivateRoute><Courses /></PrivateRoute>} />
            <Route path="/documents" element={<PrivateRoute><Documents /></PrivateRoute>} />
            <Route path="/videos" element={<PrivateRoute><Videos /></PrivateRoute>} />
            <Route path="/pyq-tests" element={<PrivateRoute><PYQTests /></PrivateRoute>} />
            <Route path="/pyq-tests/:testId" element={<PrivateRoute><TestPage /></PrivateRoute>} />
            <Route path="/test-result/:attemptId" element={<PrivateRoute><TestResult /></PrivateRoute>} />
          </Route>

          {/* Admin Routes - Assuming they also use MainLayout */}
          <Route path="/admin" element={<AdminRoute><MainLayout isAdmin={true} /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="videos" element={<AdminVideos />} />
            <Route path="documents" element={<AdminDocuments />} />
            <Route path="tests" element={<AdminTests />} />
            <Route path="tests/create" element={<CreateTest />} />
            <Route path="tests/edit/:testId" element={<EditTestForm />} />
            <Route path="active-tests" element={<ActiveTests />} />
            <Route path="total-tests" element={<TotalTests />} />
            <Route path="total-users" element={<TotalUsers />} />
            <Route path="requests" element={<AdminRequests />} />
          </Route>

          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </div>
    </MuiThemeProvider>
     </Suspense>
    </ErrorBoundary>
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
