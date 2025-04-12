import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../../services/adminService';
import Button from '../../common/Button';
import { Alert } from '../../ui/alert';
import { useToast } from '../../../hooks/useToast';
import InputField from '../../common/InputField';

export default function VideoForm({ onVideoCreated }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [duration, setDuration] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [titleError, setTitleError] = useState('');
  const [subjectError, setSubjectError] = useState('');
  const [durationError, setDurationError] = useState('');
  const [videoUrlError, setVideoUrlError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const validateForm = () => {
    let isValid = true;
    setTitleError('');
    setSubjectError('');
    setDurationError('');
    setVideoUrlError('');

    if (!title.trim()) {
      setTitleError('Title is required');
      isValid = false;
    }
    if (!subject.trim()) {
      setSubjectError('Subject is required');
      isValid = false;
    }
    if (!duration.trim()) {
      setDurationError('Duration is required');
      isValid = false;
    }
    if (!videoUrl.trim()) {
      setVideoUrlError('Video URL is required');
      isValid = false;
    } else if (!isValidUrl(videoUrl)) {
      setVideoUrlError('Invalid URL');
      isValid = false;
    }

    return isValid;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      setGeneralError('');

      try {
        await adminService.createVideo({ title, description, subject, duration, video_url: videoUrl });
        toast({
          title: 'Success',
          description: 'Video created successfully',
          type: 'success',
        });
        onVideoCreated();
        setTitle('');
        setDescription('');
        setSubject('');
        setDuration('');
        setVideoUrl('');
      } catch (err) {
        setGeneralError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {generalError && <Alert variant="destructive" className="mb-4">{generalError}</Alert>}

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Video Details</h2>
        <div className="space-y-4">
          <InputField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={titleError}
          />

          <InputField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
          />

          <InputField
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            error={subjectError}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Duration (e.g., '1h 30m')"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              error={durationError}
            />
            <InputField
              label="Video URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              error={videoUrlError}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={() => navigate('/admin/videos')}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading} variant="primary">
          {loading ? 'Creating...' : 'Add Video'}
        </Button>
      </div>
    </form>
  );
}