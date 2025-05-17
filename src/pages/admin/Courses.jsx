import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import CourseForm from '../../components/admin/forms/CourseForm';
import { useToast } from '../../hooks/useToast';
import { Input } from '../../components/ui/input';
import { Search, Plus, Clock, BookOpen, DollarSign, Users, Edit2, Trash2, ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import Dashboard from '../../components/admin/Dashboard';

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editCourseId, setEditCourseId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [initialCourse, setInitialCourse] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const { data, error } = await adminService.getCourses();
      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewCourse = () => {
    setInitialCourse(null);
    setEditCourseId(null);
    setIsFormOpen(true);
  };

  const handleEdit = async (id) => {
    setEditCourseId(id);
    try {
      const courseData = await adminService.getCourse(id);
      setInitialCourse(courseData);
      setIsFormOpen(true);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        type: 'error',
      });
    }
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditCourseId(null);
    setInitialCourse(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await adminService.deleteCourse(id);
        setCourses(courses.filter((course) => course.id !== id));
        toast({
          title: 'Success',
          description: 'Course deleted successfully',
          type: 'success',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: error.message,
          type: 'error',
        });
      }
    }
  };

  const handleCourseCreated = () => {
    loadCourses();
    setIsFormOpen(false);
    toast({
      title: 'Success',
      description: 'Course created successfully',
      type: 'success',
    });
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Dashboard />

      
      <div className="mt-8 flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Courses</h1>
          <p className="text-gray-600">Create and manage your educational content</p>
        </div>
        <Button
          onClick={handleAddNewCourse}
          size="lg"
          className="flex items-center gap-2 w-full md:w-auto"
        >
          <Plus className="w-5 h-5" />
          Add New Course
        </Button>
      </div>

      {isFormOpen && (
        <div className="mb-8">
          <CourseForm
            onCourseCreated={handleCourseCreated}
            initialCourse={initialCourse}
          />
          <Button
            onClick={handleCancelForm}
            className="mt-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-300 focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </Button>
        </div>
      )}

      <Separator className="my-6" />
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search courses by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.map((course) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="h-full overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="relative">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <Badge className="absolute top-2 right-2" variant="secondary">
                {course.category}
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-xl group-hover:text-primary transition-colors duration-200">
                {course.title}
              </CardTitle>
              <CardDescription className="line-clamp-2">{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}h</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.lessons} lessons</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span>₹{course.price}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>0 enrolled</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEdit(course.id)}
                className="flex items-center gap-1"
              >
                <Edit2 className="w-4 h-4" /> Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(course.id)}
                className="flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </Button>
            </CardFooter>
          </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
