import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../config/firebase';
import { FaTrash, FaUpload, FaSpinner, FaPlay } from 'react-icons/fa';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'videos'));
      const videosList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVideos(videosList);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
    setLoading(false);
  };

  const handleVideoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadProgress(true);
    try {
      // Upload video to Firebase Storage
      const storageRef = ref(storage, `videos/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Add video metadata to Firestore
      await addDoc(collection(db, 'videos'), {
        title: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
        url: downloadURL,
        thumbnail: '', // You can add thumbnail generation logic here
        duration: 0, // You can add duration extraction logic here
        uploadedAt: new Date().toISOString()
      });

      fetchVideos();
    } catch (error) {
      console.error('Error uploading video:', error);
    }
    setUploadProgress(false);
  };

  const handleDelete = async (video) => {
    try {
      // Delete video from Storage
      const storageRef = ref(storage, `videos/${video.title}`);
      await deleteObject(storageRef);

      // Delete video metadata from Firestore
      await deleteDoc(doc(db, 'videos', video.id));

      fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Videos</h2>
        <label className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 cursor-pointer">
          <FaUpload className="w-5 h-5 mr-2" />
          Upload Video
          <input
            type="file"
            className="hidden"
            onChange={handleVideoUpload}
            accept="video/*"
          />
        </label>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-card overflow-hidden"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700 relative group">
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FaPlay className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaPlay className="w-12 h-12 text-white" />
                  </a>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(video.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(video)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FaTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {uploadProgress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 flex items-center space-x-4">
            <FaSpinner className="w-6 h-6 animate-spin text-primary-500" />
            <p className="text-gray-900 dark:text-white">Uploading video...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Videos;