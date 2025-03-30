import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../../services/adminService';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Alert } from '../../ui/alert';
import { useToast } from '../../../hooks/useToast';

export default function CourseForm({ onCourseCreated, initialCourse }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
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
      setFormData({
        title: '',
        description: '',
        duration: '',
        lessons: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && <Alert variant="destructive">{error}</Alert>}
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <Input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Duration (hours)</label>
          <Input
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Lessons</label>
          <Input
            type="number"
            value={formData.lessons}
            onChange={(e) => setFormData(prev => ({ ...prev, lessons: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/admin/courses')}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Course'}
        </Button>
      </div>
    </form>
  );
}