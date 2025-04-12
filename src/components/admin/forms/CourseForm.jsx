import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../../services/adminService';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Alert } from '../../ui/alert';
import { useToast } from '../../../hooks/useToast';
import { Label } from '../../ui/label';

export default function CourseForm({ onCourseCreated, initialCourse }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '', // Added subject
    duration: '',
    lessons: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (initialCourse) {
      setFormData(initialCourse);
    }
  }, [initialCourse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (initialCourse) {
        await adminService.updateCourse(initialCourse.id, formData);
      } else {
        await adminService.createCourse(formData);
      }
      toast({
        title: 'Success',
        description: 'Course saved successfully',
        type: 'success',
      });
      onCourseCreated();
      if (!initialCourse) {
        setFormData({
          title: '', description: '', subject: '', duration: '', lessons: ''
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && <Alert variant="destructive" className="mb-4">{error}</Alert>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <Label htmlFor="title" className="block text-sm font-medium text-gray-700">Course Title</Label>
          <Input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., Introduction to React"
            required
            className="mt-1 block w-full"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</Label>
          <Input
            type="text"
            name="subject"
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
            placeholder="e.g., Web Development"
            required
            className="mt-1 block w-full"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="description" className="block text-sm font-medium text-gray-700">Course Description</Label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe the course content and objectives"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (hours)</Label>
            <Input
              type="number"
              name="duration"
              id="duration"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
              placeholder="e.g., 40"
              required
            />
          </div>

          <div>
            <Label htmlFor="lessons" className="block text-sm font-medium text-gray-700">Number of Lessons</Label>
            <Input
              type="number"
              name="lessons"
              id="lessons"
              value={formData.lessons}
              onChange={(e) => setFormData(prev => ({ ...prev, lessons: e.target.value }))}
              placeholder="e.g., 10"
              required
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Button variant="outline" onClick={() => navigate('/admin/courses')} className="mr-2">Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Course'}</Button>
      </div>
    </form>
  );
}