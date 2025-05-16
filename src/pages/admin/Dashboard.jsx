import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { adminService } from '../../services/adminService';
import { useToast } from '../../hooks/useToast';
import { Users, BookOpen, Video, FileText, Award } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalVideos: 0,
    totalDocuments: 0,
    totalTests: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load dashboard statistics',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-500' },
    { title: 'Total Courses', value: stats.totalCourses, icon: BookOpen, color: 'bg-green-500' },
    { title: 'Total Videos', value: stats.totalVideos, icon: Video, color: 'bg-purple-500' },
    { title: 'Total Documents', value: stats.totalDocuments, icon: FileText, color: 'bg-orange-500' },
    { title: 'Total Tests', value: stats.totalTests, icon: Award, color: 'bg-red-500' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((card, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className={`${card.color} text-white rounded-t-lg p-4`}>
              <div className="flex items-center justify-between">
                <card.icon className="h-8 w-8" />
                <CardTitle className="text-2xl font-bold">{card.value}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-gray-600 font-medium">{card.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add recent activities component here */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add system status component here */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}