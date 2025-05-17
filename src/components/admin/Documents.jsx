import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../config/firebase';
import { FaTrash, FaUpload, FaSpinner } from 'react-icons/fa';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'documents'));
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDocuments(docs);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
    setLoading(false);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadProgress(true);
    try {
      // Upload file to Firebase Storage
      const storageRef = ref(storage, `documents/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Add document metadata to Firestore
      await addDoc(collection(db, 'documents'), {
        name: file.name,
        url: downloadURL,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString()
      });

      fetchDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
    }
    setUploadProgress(false);
  };

  const handleDelete = async (document) => {
    try {
      // Delete file from Storage
      const storageRef = ref(storage, `documents/${document.name}`);
      await deleteObject(storageRef);

      // Delete document metadata from Firestore
      await deleteDoc(doc(db, 'documents', document.id));

      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Documents</h2>
        <label className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 cursor-pointer">
          <FaUpload className="w-5 h-5 mr-2" />
          Upload Document
          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx"
          />
        </label>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((document) => (
            <div
              key={document.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {document.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(document.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(document)}
                  className="text-red-500 hover:text-red-600"
                >
                  <FaTrash className="w-5 h-5" />
                </button>
              </div>
              <a
                href={document.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                View Document
              </a>
            </div>
          ))}
        </div>
      )}

      {uploadProgress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 flex items-center space-x-4">
            <FaSpinner className="w-6 h-6 animate-spin text-primary-500" />
            <p className="text-gray-900 dark:text-white">Uploading document...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;