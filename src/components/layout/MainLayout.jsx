import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../utils/firebaseConfig'; // Assuming this is your Firebase config
import { signOut } from 'firebase/auth'; // Assuming you are using Firebase auth
import { Menu, X, Home, Book, FileText, File, User, LogOut } from 'lucide-react'; // Using Lucide icons

const menuItems = [
  { text: 'Home', icon: <Home />, path: '/' },
  { text: 'Courses', icon: <Book />, path: '/courses' },
  { text: 'Tests', icon: <FileText />, path: '/tests' },
  { text: 'Documents', icon: <File />, path: '/documents' },
  { text: 'Profile', icon: <User />, path: '/profile' },
];

export const MainLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const closeDrawer = () => {
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const drawer = (
    <div className="w-64 bg-white h-full">
      <div className="p-6 flex justify-between items-center">
        <span className="text-lg font-bold">Aapki Academy</span>
        <button onClick={closeDrawer} className="md:hidden">
          <XIcon className="h-6 w-6" />
        </button>
      </div>
      <nav className="p-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.text} className="mb-2">
              <Link
                to={item.path}
                onClick={closeDrawer}
                className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <span className="mr-3">{React.cloneElement(item.icon, { size: 20 })}</span> {/* Apply consistent size */}
                <span>{item.text}</span>
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center w-full py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <LogOut className="mr-3" size={20} /> {/* Apply consistent size */}
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-20 bg-black bg-opacity-25 transition-opacity duration-300 md:hidden ${
          mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={closeDrawer}
      />
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {drawer}
      </div>

      {/* Desktop Drawer */}
      <div className="hidden md:block w-64 flex-shrink-0 bg-white border-r">
        {drawer}
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="bg-white shadow-md py-4 px-6 md:hidden">
          <div className="flex items-center justify-between">
            <button onClick={handleDrawerToggle}>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 py-12 px-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer (optional) */}
        <footer className="bg-gray-100 py-4 px-6 mt-12">
          <div className="max-w-7xl mx-auto text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} Aapki Academy. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};
 export default MainLayout;
