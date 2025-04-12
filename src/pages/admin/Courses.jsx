import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import CourseForm from '../../components/admin/forms/CourseForm';
import { useToast } from '../../hooks/useToast';
import { Input } from '../../components/ui/input';

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
      const data = await adminService.getCourses();
      setCourses(data);
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Courses</h1>
        <Button
          onClick={handleAddNewCourse}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
        >
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

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card
            key={course.id}
            className="hover:shadow-lg transition-shadow rounded-lg border border-gray-200"
          >
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">
                {course.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">{course.description}</p>
              <div className="text-sm text-gray-500 mb-4">
                <p><strong>Duration:</strong> {course.duration} hours</p>
                <p><strong>Lessons:</strong> {course.lessons}</p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleEdit(course.id)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400"
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(course.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:ring-2 focus:ring-red-400"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
