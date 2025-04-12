import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Button from '../../components/common/Button';
import CourseForm from '../../components/admin/forms/CourseForm';
import { useToast } from '../../hooks/useToast';
import InputField from '../../components/common/InputField';
import { Plus, Pencil, Trash } from 'lucide-react';

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editCourseId, setEditCourseId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [initialCourse, setInitialCourse] = useState(null);
  const { toast } = useToast();
  const [error, setError] = useState(null);

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
        variant: 'destructive',
      });
      setError(error.message);
      ;
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
        variant: 'destructive',
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
          variant: 'success',
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
      description: 'Course saved successfully',
      variant: 'success',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md bg-red-100 p-4">
          <h3 className="text-sm font-medium text-red-800">
            Error: {error}
          </h3>
        </div>
      </div>
    );
  }

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  return (
    <div className="p-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Courses
          </h2>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <button
            type="button"
            onClick={handleAddNewCourse}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Plus className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Add Course
          </button>
        </div>
      </div>

      {isFormOpen && (
        <div className="mt-6">
          <div className="px-4 py-6 sm:rounded-lg sm:p-8 bg-white shadow">
            <CourseForm
              onCourseCreated={handleCourseCreated}
              initialCourse={initialCourse}
              onCancel={handleCancelForm}
            />
          </div>
        </div>
      )}

      <div className="mt-8">
        <InputField
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md"
        />
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Title
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Description
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Duration
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Lessons
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredCourses.map((course) => (
              <tr key={course.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  {course.title}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{course.description}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{course.duration} hours</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{course.lessons}</td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <button
                    onClick={() => handleEdit(course.id)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    <Pencil className="h-5 w-5 inline" />
                    <span className="sr-only">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash className="h-5 w-5 inline" />
                    <span className="sr-only">Delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCourses.length === 0 && (
          <div className="py-4 text-center text-gray-500">No courses found.</div>
        )}
      </div>
    </div>
  );
}
