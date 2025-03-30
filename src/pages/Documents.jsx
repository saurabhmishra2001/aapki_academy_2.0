import React, { useState, useEffect } from 'react';
import loadingGif from '../assets/loading.gif'; // Path to your loading GIF
import noDataImage from '../assets/no_data_found.webp'; // Path to your no data image
import { fetchDocuments } from '../utils/apiClient'; // Adjust the import based on your structure

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDocumentsWithDelay = async () => {
      try {
        const data = await fetchDocuments();

        // Artificial delay to show the loading state
        setTimeout(() => {
          setDocuments(data || []);
          setLoading(false);
        }, 4000); // 4 seconds delay
      } catch (err) {
        console.error('Error fetching documents:', err);

        // Artificial delay for error state
        setTimeout(() => {
          setError('Failed to load documents. Please try again later.');
          setLoading(false);
        }, 4000); // 4 seconds delay
      }
    };

    loadDocumentsWithDelay();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img
          src={loadingGif}
          alt="Loading documents..."
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

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <img
          src={noDataImage}
          alt="No documents available"
          className="w-60 h-60 sm:w-80 sm:h-80 mb-6" // Increased size
        />
        <p className="text-gray-500 text-xl">Currently, no documents are available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Study Materials</h1>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documents.map(doc => (
                <tr key={doc.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doc.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.size}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <a href={doc.url} download className="text-indigo-600 hover:text-indigo-900">Download</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
