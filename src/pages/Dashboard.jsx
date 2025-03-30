import React, { useState, useEffect } from 'react';
import UserDetailsForm from '../components/UserDetailsForm';
import ActivityHistory from '../components/dashboard/ActivityHistory';
import TestTabs from '../components/test/TestTabs';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTestOverviewUnderMaintenance, setIsTestOverviewUnderMaintenance] = useState(true);

  // On component mount, check if the form has been completed
  useEffect(() => {
    const formCompletionStatus = localStorage.getItem('isFormComplete');
    if (formCompletionStatus === 'true') {
      setIsFormComplete(true);
    }
  }, []);

  const handleFormSubmit = () => {
    setIsFormComplete(true);
    localStorage.setItem('isFormComplete', 'true'); // Persist form completion status in localStorage
  };

  // Simulate loading or error when switching from form
  useEffect(() => {
    if (isFormComplete) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setError(null);
      }, 2000); // Simulate API call delay
    }
  }, [isFormComplete]);

  return (
    <div className="container mx-auto px-6 py-8 max-w-screen-lg">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Dashboard</h1>

      {/* Error Handling */}
      {error && (
        <div className="bg-red-500 text-white p-4 mb-6 rounded-md">
          <p className="text-lg font-semibold">Error: {error}</p>
        </div>
      )}

      {/* User Details Form */}
      {!isFormComplete && (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Enter Your Details</h2>
          <UserDetailsForm onFormSubmit={handleFormSubmit} />
        </div>
      )}

      {/* Welcome Message and Other Components After Form Completion */}
      {isFormComplete && (
        <div>
          {/* Loading state */}
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="bg-white shadow-lg rounded-lg p-6 mb-8 border border-gray-200">
                <p className="text-xl font-semibold text-gray-800">Welcome, <span className="text-blue-600">{user.email}</span>!</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Test Overview with Random Maintenance Image */}
                {isTestOverviewUnderMaintenance ? (
                  <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 flex justify-center items-center">
                    <div className="text-center">
                      {/* Random Maintenance Image */}
                      <img
                        src={`https://picsum.photos/400/200?random=${Math.floor(Math.random() * 1000)}`}
                        alt="Maintenance"
                        className="mb-4 rounded-md shadow-md"
                      />
                      <p className="text-xl font-semibold text-gray-600">Test Overview is currently under maintenance.</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Test Overview</h2>
                    <TestTabs />
                  </div>
                )}

                {/* Activity History */}
                <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Activity History</h2>
                  <ActivityHistory />
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
