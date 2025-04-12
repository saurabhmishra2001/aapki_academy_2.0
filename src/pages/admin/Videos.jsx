import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import VideoForm from '../../components/admin/forms/VideoForm';
import { useToast } from '../../hooks/useToast';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/InputField';
import {
  PageHeader,
  PageTitle,
  PageBreadcrumbs,
  BreadcrumbItem,
} from '../../components/common/PageHeader';
import { MainLayout } from '../../components/layout/MainLayout';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

export default function AdminVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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

  const handleAddVideo = () => {
    setInitialVideo(null);
    setIsFormOpen(true);
  };

  const handleEditVideo = async (id) => {
    try {
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

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setInitialVideo(null);
  }

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
    <MainLayout>
      <PageHeader>
        <PageTitle>Manage Videos</PageTitle>
        <PageBreadcrumbs>
          <BreadcrumbItem to="/admin/dashboard">Dashboard</BreadcrumbItem>
          <BreadcrumbItem>Videos</BreadcrumbItem>
        </PageBreadcrumbs>
      </PageHeader>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <Input
            type="text"
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3"
          />
          <Button variant="primary" onClick={handleAddVideo} className="gap-2">
            <FaPlus className="h-4 w-4" />
            Add Video
          </Button>
        </div>

        {isFormOpen && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <VideoForm
              onVideoCreated={handleVideoCreated}
              initialVideo={initialVideo}
            />
            <div className="flex justify-end mt-4">
              <Button variant="secondary" onClick={handleCloseForm}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-10">Loading videos...</div>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center py-10">No videos found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVideos.map((video) => (
                  <tr key={video.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {video.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {video.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {video.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <a
                          href={video.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Watch
                        </a>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEditVideo(video.id)}
                          className="gap-1"
                        >
                          <FaEdit className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(video.id)}
                          className="gap-1"
                        >
                          <FaTrash className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
}