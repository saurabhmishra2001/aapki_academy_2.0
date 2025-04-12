import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import DataCard from '../../components/common/DataCard';
import PageHeader from '../../components/common/PageHeader';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTests: 0,
    totalVideos: 0,
    totalDocuments: 0,
    totalRequests: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const statsData = await adminService.getDashboardStats();
        setStats(statsData);
      } catch (err) {
        setError('Failed to fetch dashboard statistics.');
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const dataCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: 'users',
      color: 'bg-blue-500',
    },
    {
      title: 'Total Tests',
      value: stats.totalTests,
      icon: 'test',
      color: 'bg-green-500',
    },
    {
      title: 'Total Videos',
      value: stats.totalVideos,
      icon: 'video',
      color: 'bg-red-500',
    },
    {
      title: 'Total Documents',
      value: stats.totalDocuments,
      icon: 'document',
      color: 'bg-yellow-500',
    },
    {
      title: 'Total Requests',
      value: stats.totalRequests,
      icon: 'request',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <PageHeader title="Admin Dashboard" />

      {loading && (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading statistics...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong> {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dataCards.map((card, index) => (
            <DataCard
              key={index}
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
