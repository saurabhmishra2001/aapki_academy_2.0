import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import VideoForm from '../../components/admin/forms/VideoForm';
import { useToast } from '../../hooks/useToast';
import { Input } from '../../components/ui/input';

export default function AdminVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editVideoId, setEditVideoId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [initialVideo, setInitialVideo] = useState(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const data = await adminService.getVideos();
      setVideos(data);
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

  const handleAddNewVideo = () => {
    setInitialVideo(null);
    setEditVideoId(null);
    setIsFormOpen(true);
  };

  const handleEdit = async (id) => {
    setEditVideoId(id);
    try {
      const videoData = await adminService.getVideo(id);
      setInitialVideo(videoData);
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
    setEditVideoId(null);
    setInitialVideo(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await adminService.deleteVideo(id);
        setVideos(videos.filter((video) => video.id !== id));
        toast({
          title: 'Success',
          description: 'Video deleted successfully',
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

  const handleVideoCreated = () => {
    loadVideos();
    setIsFormOpen(false);
    toast({
      title: 'Success',
      description: 'Video created successfully',
      type: 'success',
    });
  };

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Videos</h1>
        <Button
          onClick={handleAddNewVideo}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
        >
          Add New Video
        </Button>
      </div>

      {isFormOpen && (
        <div className="mb-8">
          <VideoForm
            onVideoCreated={handleVideoCreated}
            initialVideo={initialVideo}
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
          placeholder="Search videos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <Card
            key={video.id}
            className="hover:shadow-lg transition-shadow rounded-lg border border-gray-200"
          >
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">
                {video.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">{video.description}</p>
              <div className="text-sm text-gray-500 mb-4">
                <p><strong>Subject:</strong> {video.subject}</p>
                <p><strong>Duration:</strong> {video.duration}</p>
              </div>
              <a
                href={video.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-indigo-600 hover:text-indigo-800"
              >
                Watch Video
              </a>
              <div className="flex justify-end space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleEdit(video.id)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400"
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(video.id)}
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