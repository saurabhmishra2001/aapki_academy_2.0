import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../../services/adminService';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Alert } from '../../ui/alert';
import { useToast } from '../../../hooks/useToast';

export default function VideoForm({ onVideoCreated }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    duration: '',
    video_url: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await adminService.createVideo(formData);
      toast({
        title: 'Success',
        description: 'Video created successfully',
        type: 'success',
      });
      onVideoCreated();
      setFormData({
        title: '',
        description: '',
        subject: '',
        duration: '',
        video_url: ''
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

      <div>
        <label className="block text-sm font-medium text-gray-700">Subject</label>
        <Input
          type="text"
          value={formData.subject}
          onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Duration</label>
          <Input
            type="text"
            value={formData.duration}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Video URL</label>
          <Input
            type="url"
            value={formData.video_url}
            onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/admin/videos')}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Add Video'}
        </Button>
      </div>
    </form>
  );
}