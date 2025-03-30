import React from 'react';
import YouTube from 'react-youtube';

export default function VideoCard({ video }) {
  const opts = {
    width: '100%',
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{video.title}</h2>
        <p className="text-gray-600 mb-4">
          <span className="font-medium">{video.subject}</span> • {video.duration}
        </p>
        <div className="aspect-w-16 aspect-h-9">
          <YouTube 
            videoId={video.videoId} 
            opts={opts}
            className="w-full"
          />
        </div>
        <p className="mt-4 text-gray-700">{video.description}</p>
      </div>
    </div>
  );
}