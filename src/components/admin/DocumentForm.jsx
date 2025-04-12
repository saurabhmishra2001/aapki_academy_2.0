import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { InputField } from '../../components/common/InputField';
import { Alert } from '../ui/alert';
import { adminService } from '../../services/adminService';
import { useToast } from '../../hooks/useToast';

export default function DocumentForm({ onDocumentCreated, initialDocument }) {
  const navigate = useNavigate();
  const [titleError, setTitleError] = useState('');
  const [subjectError, setSubjectError] = useState('');
  const [fileError, setFileError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    file: null
  });
  const [submissionError, setSubmissionError] = useState('');
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (initialDocument) {
      setFormData(initialDocument);
    }
  }, [initialDocument]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmissionError('');
    setTitleError('');
    setSubjectError('');
    setFileError('');

    // Validate form fields
    let isValid = true;
    if (!formData.title.trim()) {
      setTitleError('Title is required');
      isValid = false;
    }
    if (!formData.subject.trim()) {
      setSubjectError('Subject is required');
      isValid = false;
    }
    if (!formData.file && !initialDocument) {
      setFileError('File is required');
      isValid = false;
    }

    if (!isValid) {
      setLoading(false);
      return;
    }

    const dataToSubmit = initialDocument
      ? { ...formData, file: formData.file || initialDocument.file } // Keep existing file if not updated
      : formData;

    try {
      if (!dataToSubmit.file) {
        delete dataToSubmit.file;
      }
      if (initialDocument) {
        await adminService.updateDocument(initialDocument.id, formData);
      } else {
        await adminService.uploadDocument(formData);
      }
      toast({
        title: 'Success',
        description: 'Document saved successfully',
        type: 'success',
      });
      onDocumentCreated();

    } catch (err) {
      setSubmissionError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Upload Document</h2>

      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="text-sm font-medium">
              {error}
            </Alert>
          )}

          <InputField
            label="Title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            required
            placeholder="Enter document title"
            error={titleError}
          />

          <InputField
            label="Subject"
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
            required
            placeholder="Enter document subject"
            error={subjectError}
          />

          <InputField
            label="Description"
            type="textarea"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            rows={3}
            placeholder="Enter document description"
          />

          <InputField
            label={initialDocument ? "Replace File" : "File"}
            type="file"
            onChange={(e) => setFormData((prev) => ({ ...prev, file: e.target.files[0] }))}
            required={!initialDocument}
          />
          {fileError && <p className="text-red-500 text-sm mt-1">{fileError}</p>}

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/documents')}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Document'}
             </Button>
         </div>
        </form>
      </div>

    </div>
  );
}
            