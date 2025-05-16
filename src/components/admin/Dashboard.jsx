import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Video,
  Users,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '../ui/button';

export default function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Courses', href: '/admin/courses', icon: BookOpen },
    { name: 'Documents', href: '/admin/documents', icon: FileText },
    { name: 'Videos', href: '/admin/videos', icon: Video },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="flex justify-between items-center md:hidden mb-6">
        <h1 className="text-xl font-bold">Aapki Academy</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      {/* Mobile navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white rounded-lg shadow-lg p-4 mb-6">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5 text-gray-500" />
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="pt-2 mt-2 border-t border-gray-200">
              <Link
                to="/logout"
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-red-600 hover:bg-red-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Link>
            </div>
          </nav>
        </div>
      )}

      {/* Desktop navigation */}
      <div className="hidden md:block mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <nav className="flex items-center justify-between px-4">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-1 px-4 py-3 text-sm font-medium transition-colors hover:text-blue-600",
                    window.location.pathname === item.href
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
            <Link
              to="/logout"
              className="flex items-center space-x-1 px-4 py-3 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}