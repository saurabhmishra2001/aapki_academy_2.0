import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FaBook, FaVideo, FaClipboardList } from 'react-icons/fa';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('documents');

  const navItems = [
    { id: 'documents', label: 'Documents', icon: FaBook, path: 'documents' },
    { id: 'videos', label: 'Videos', icon: FaVideo, path: 'videos' },
    { id: 'tests', label: 'Tests', icon: FaClipboardList, path: 'tests' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-card">
          <nav className="mt-8 px-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900 ${activeTab === item.id ? 'bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400' : ''}`}
                      onClick={() => setActiveTab(item.id)}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;