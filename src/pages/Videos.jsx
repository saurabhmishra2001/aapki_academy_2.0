import React, { useEffect, useState } from 'react';
import loadingGif from '../assets/loading.gif'; // Path to your loading GIF
import noDataImage from '../assets/no_data_found.webp'; // Path to your no data image
import { fetchVideos } from '../utils/apiClient'; // Adjust the import based on your structure

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadVideosWithDelay = async () => {
      try {
        const data = await fetchVideos();

        // Artificial delay to show the loading state
        setTimeout(() => {
          setVideos(data);
          setLoading(false);
        }, 4000); // 4 seconds delay
      } catch (err) {
        console.error('Error fetching videos:', err);

        // Artificial delay for error state
        setTimeout(() => {
          setError('Failed to fetch videos. Please try again later.');
          setLoading(false);
        }, 4000); // 4 seconds delay
      }
    };

    loadVideosWithDelay();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img
          src={loadingGif}
          alt="Loading..."
          className="w-40 h-40 sm:w-60 sm:h-60" // Adjusted size
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <img
          src={noDataImage}
          alt="No Data Found"
          className="w-60 h-60 sm:w-80 sm:h-80 mb-6" // Increased size
        />
        <p className="text-gray-500 text-xl">Currently, no videos are available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Videos</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <li
            key={video.id}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between"
          >
            <h2 className="text-xl font-semibold mb-2">{video.title}</h2>
            <p className="text-gray-600 mb-4">{video.description}</p>
            <a
              href={video.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              Watch Video
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Videos;
