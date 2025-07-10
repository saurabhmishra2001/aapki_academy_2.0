import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserDetailsForm from '../components/UserDetailsForm';
import UserProfile from '../components/dashboard/UserProfile';
import ActivityHistory from '../components/dashboard/ActivityHistory';
import TestTabs from './test/TestTabs';

export default function Dashboard() {
  const { user } = useAuth();
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check local storage for form completion
  useEffect(() => {
    const completed = localStorage.getItem('isFormComplete');
    if (completed === 'true') setIsFormComplete(true);
  }, []);

  // Simulate fetch after form completion
  useEffect(() => {
    if (isFormComplete) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setError(null);
      }, 1000); // simulate delay
    }
  }, [isFormComplete]);

  const handleFormSubmit = () => {
    setIsFormComplete(true);
    localStorage.setItem('isFormComplete', 'true');
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-screen-lg">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Dashboard</h1>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-6">
          <p>Error: {error}</p>
        </div>
      )}

      {/* User Form */}
      {!isFormComplete ? (
        <div className="bg-white shadow-md p-6 rounded-lg mb-8 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">Complete Your Profile</h2>
          <UserDetailsForm onFormSubmit={handleFormSubmit} />
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* User Profile */}
          <div className="bg-white p-6 rounded-lg shadow mb-8 border border-gray-200">
            <UserProfile />
          </div>

          {/* Dashboard Content */}
          {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
            <div className="bg-white shadow p-6 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Test Overview</h2>
              <TestTabs />
            </div>

            <div className="bg-white shadow p-6 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
              <ActivityHistory />
            </div>
          </div> */}
        </>
      )}
    </div>
  );
}
