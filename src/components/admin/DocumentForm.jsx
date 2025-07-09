import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Alert } from '../ui/alert';
import { documentService } from '../../services/documentService'; // ✅ Use this instead
import { useToast } from '../../hooks/useToast';

export default function DocumentForm({ onDocumentCreated, initialDocument }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    file: null
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (initialDocument) {
      setFormData({
        title: initialDocument.title || '',
        subject: initialDocument.subject || '',
        description: initialDocument.description || '',
        file: null // Don't prefill file input
      });
    }
  }, [initialDocument]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (initialDocument) {
        await documentService.updateDocument(initialDocument.id, initialDocument, formData.file);
      } else {
        const { file, title, subject, description } = formData;
        if (!file) throw new Error('Please select a file');
        await documentService.createDocument({ title, subject, description }, file);
      }

      toast({
        title: 'Success',
        description: 'Document saved successfully',
        type: 'success',
      });

      onDocumentCreated();
      setFormData({
        title: '',
        subject: '',
        description: '',
        file: null
      });
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Upload Document</h2>

      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive" className="text-sm font-medium">
              {error}
            </Alert>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <Input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">File</label>
            <Input
              type="file"
              onChange={(e) => setFormData((prev) => ({ ...prev, file: e.target.files[0] }))}
              required={!initialDocument} // Required only for new uploads
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/documents')}
              className="bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              {loading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
