import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import DocumentForm from '../../components/admin/DocumentForm';
import { useToast } from '../../hooks/useToast';
import { Input } from '../../components/ui/input';

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Documents</h1>
        <Button
          onClick={handleAddNewDocument}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
        >
          Add New Document
        </Button>
      </div>

      {isFormOpen && (
        <div className="mb-8">
          <DocumentForm
            onDocumentCreated={handleDocumentCreated}
            initialDocument={initialDocument}
          />
          <Button
            onClick={handleCancelForm}
            className="mt-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-300 focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </Button>
        </div>
      )}

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((document) => (
          <Card
            key={document.id}
            className="hover:shadow-lg transition-shadow rounded-lg border border-gray-200"
          >
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">
                {document.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Subject:</strong> {document.subject}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Description:</strong> {document.description}
              </p>
              <div className="flex justify-end space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleEdit(document.id)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400"
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(document.id, document.file_path)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:ring-2 focus:ring-red-400"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
