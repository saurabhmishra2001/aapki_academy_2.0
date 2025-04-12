import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { documentService } from '../../../services/documentService';
import { Button } from '../../common/Button';
import { Input } from '../../ui/input';
import { Alert } from '../../ui/alert';
import { useToast } from '../../../hooks/useToast';
import { Label } from '../../ui/label';

export default function DocumentForm({ onDocumentCreated, initialDocument }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState({
    title: '',
    description: '',
    file: null,
    fileUrl: '',
  });
  const { toast } = useToast();
  const [controller, setController] = useState(null);

  useEffect(() => {
    if (initialDocument) {
      setDocument({
        ...initialDocument,
      });
    }
    const abortController = new AbortController();
    setController(abortController);
    return () => abortController.abort();
  }, [initialDocument]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', document.title);
      formData.append('description', document.description);
      formData.append('file', document.file);

      await documentService.createDocument(formData, controller.signal);
      toast({
        title: 'Success',
        description: 'Document created successfully',
        type: 'success',
      });
      onDocumentCreated();
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
        toast({
          title: 'Error',
          description: err.message,
          type: 'error',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setDocument(prev => ({
        ...prev,
        file: selectedFile,
      }));
    
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <Alert variant="destructive" className="mb-6">{error}</Alert>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Document Details</h2>
          <p className="text-sm text-gray-600 mt-1">Enter details for the document</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={document.title}
                onChange={e => setDocument(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter document title"
                required
              />
            </div>

            <div>
              <Label>Description</Label>
              <textarea
                value={document.description}
                onChange={e => setDocument(prev => ({ ...prev, description: e.target.value }))}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 placeholder-gray-400"
                rows={3}
                placeholder="Describe the document content"
              />
            </div>
            <div>
                <Label>Upload File</Label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M29.25 6.75c.867 0 1.684.167 2.438.467a4.503 4.503 0 012.046 2.046c.3.754.467 1.57.467 2.438v1.298A21.536 21.536 0 0144.5 20.038v13.885a1.5 1.5 0 01-1.426 1.499c-2.29.103-4.544.315-6.75.633a21.626 21.626 0 01-4.502-.633 21.453 21.453 0 01-6.75-.633c-1.334.074-2.645.167-3.938.272a21.567 21.567 0 01-4.143-.51 21.552 21.552 0 01-6.66-.786A1.5 1.5 0 013.5 33.923V20.038c0-5.935 2.44-11.33 6.586-15.171 1.892-1.813 4.16-3.28 6.684-4.285 2.523-1.005 5.27-.97 7.711.07a1.5 1.5 0 01.973 1.298v10.112a1.5 1.5 0 01-1.5 1.5h-7.5a1.5 1.5 0 01-1.5-1.5V6.75c0-.594.247-1.168.68-1.588a3.002 3.002 0 013.537-.428h7.5zM23.25 28.5c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25-1.25.56-1.25 1.25.56 1.25 1.25 1.25zm-1.25 5.25a1.25 1.25 0 012.5 0v3c0 .69-.56 1.25-1.25 1.25s-1.25-.56-1.25-1.25v-3zM24 12.75a.75.75 0 100 1.5h10.5a.75.75 0 100-1.5H24z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, DOCX, TXT up to 10MB</p>
                    {document.file && (
                    <p className="text-sm text-gray-500 mt-2">
                        Selected File: {document.file.name}
                    </p>
                    )}
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/admin/documents')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="gap-2"
        >
          {loading && <Spinner className="h-4 w-4" />}
          {loading ? 'Saving...' : 'Save Document'}
        </Button>
      </div>
    </form>
  );
}

function Spinner(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    );
  }