import { createBrowserRouter, Navigate } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import AdminRoute from '../components/AdminRoute';

// Auth Pages
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';

// User Pages
import UserDashboard from '../pages/user/Dashboard';
import Courses from '../pages/Courses';
import Videos from '../pages/Videos';
import Documents from '../pages/Documents';
import TestPage from '../pages/pyq/TestPage';
import TestResult from '../pages/pyq/TestResult';
import PYQTests from '../pages/pyq/PYQTests';
import FreeTests from '../pages/FreeTests';
import MCQTests from '../pages/MCQTests';
import NTATests from '../pages/SubjectsWiseTest/NTATests';
import UGCNETTests from '../pages/SubjectsWiseTest/UGCNETTests';
import JRFTests from '../pages/SubjectsWiseTest/JRFTests';

// Admin Pages
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/Dashboard';
import AdminUsers from '../pages/admin/Users';
import AdminCourses from '../pages/admin/Courses';
import CreateCourse from '../pages/admin/CreateCourse';
import AdminVideos from '../pages/admin/Videos';
import AdminDocuments from '../pages/admin/Documents';
import AdminTests from '../pages/admin/Tests';
import CreateTest from '../pages/admin/CreateTest';
import AdminSettings from '../pages/admin/Settings';

export const router = createBrowserRouter([
  // Public Routes
  {
    path: '/',
    element: <Navigate to="/login" replace />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/admin/login',
    element: <AdminLogin />
  },

  // Protected User Routes
  {
    path: '/dashboard',
    element: <PrivateRoute><UserDashboard /></PrivateRoute>
  },
  {
    path: '/courses',
    element: <PrivateRoute><Courses /></PrivateRoute>
  },
  {
    path: '/videos',
    element: <PrivateRoute><Videos /></PrivateRoute>
  },
  {
    path: '/documents',
    element: <PrivateRoute><Documents /></PrivateRoute>
  },
  {
    path: '/test/:testId',
    element: <PrivateRoute><TestPage /></PrivateRoute>
  },
  {
    path: '/test-result/:testId',
    element: <PrivateRoute><TestResult /></PrivateRoute>
  },
  {
    path: '/pyq-tests',
    element: <PrivateRoute><PYQTests /></PrivateRoute>
  },
  {
    path: '/free-tests',
    element: <PrivateRoute><FreeTests /></PrivateRoute>
  },
  {
    path: '/mcq-tests',
    element: <PrivateRoute><MCQTests /></PrivateRoute>
  },
  {
    path: '/nta-tests',
    element: <PrivateRoute><NTATests /></PrivateRoute>
  },
  {
    path: '/ugc-net-tests',
    element: <PrivateRoute><UGCNETTests /></PrivateRoute>
  },
  {
    path: '/jrf-tests',
    element: <PrivateRoute><JRFTests /></PrivateRoute>
  },

  // Protected Admin Routes
  {
    path: '/admin',
    element: <AdminRoute><AdminDashboard /></AdminRoute>
  },
  {
    path: '/admin/users',
    element: <AdminRoute><AdminUsers /></AdminRoute>
  },
  {
    path: '/admin/courses',
    element: <AdminRoute><AdminCourses /></AdminRoute>
  },
  {
    path: '/admin/courses/create',
    element: <AdminRoute><CreateCourse /></AdminRoute>
  },
  {
    path: '/admin/videos',
    element: <AdminRoute><AdminVideos /></AdminRoute>
  },
  {
    path: '/admin/documents',
    element: <AdminRoute><AdminDocuments /></AdminRoute>
  },
  {
    path: '/admin/tests',
    element: <AdminRoute><AdminTests /></AdminRoute>
  },
  {
    path: '/admin/tests/create',
    element: <AdminRoute><CreateTest /></AdminRoute>
  },
  {
    path: '/admin/settings',
    element: <AdminRoute><AdminSettings /></AdminRoute>
  }
]);