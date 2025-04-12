import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Button from '../../components/common/Button';
import DocumentForm from '../../components/admin/DocumentForm';
import { useToast } from '../../hooks/useToast';
import InputField from '../../components/common/InputField';
import PageHeader from '../../components/common/PageHeader';

export default function AdminDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editDocumentId, setEditDocumentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [initialDocument, setInitialDocument] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const data = await adminService.getDocuments();
      setDocuments(data);
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

  const handleAddNewDocument = () => {
    setInitialDocument(null);
    setEditDocumentId(null);
    setIsFormOpen(true);
  };

  const handleEdit = async (id) => {
    setEditDocumentId(id);
    try {
      const documentData = await adminService.getDocument(id);
      setInitialDocument(documentData);
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
    setEditDocumentId(null);
    setInitialDocument(null);
  };

  const handleDelete = async (id, filePath) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await adminService.deleteDocument(id, filePath);
        setDocuments(documents.filter((doc) => doc.id !== id));
        toast({
          title: 'Success',
          description: 'Document deleted successfully',
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

  const handleDocumentCreated = () => {
    loadDocuments();
    setIsFormOpen(false);
    toast({
      title: 'Success',
      description: 'Document saved successfully',
      type: 'success',
    });
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="py-6">
      <PageHeader title="Manage Documents" />

      <div className="mt-6 flex justify-between items-center">
        <InputField
          type="text"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="primary" onClick={handleAddNewDocument}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Document
        </Button>
      </div>

      {isFormOpen && (
        <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">
            {editDocumentId ? 'Edit Document' : 'Add New Document'}
          </h2>
          <DocumentForm
            onDocumentCreated={handleDocumentCreated}
            initialDocument={initialDocument}
          />
          <div className="flex justify-end mt-4">
            <Button variant="secondary" onClick={handleCancelForm}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDocuments.map((document) => (
              <tr key={document.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{document.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{document.subject}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{document.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button variant="secondary" size="sm" onClick={() => handleEdit(document.id)}>Edit</Button>
                  <Button variant="destructive" size="sm" className="ml-2" onClick={() => handleDelete(document.id, document.file_path)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PlusIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}
