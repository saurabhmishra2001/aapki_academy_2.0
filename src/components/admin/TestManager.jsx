import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { testService } from '../../services/testservice';
import { useToast } from '../../hooks/useToast';

export default function TestManager() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await testService.getAllTests();
      if (response.data) {
        setTests(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch tests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (testId) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      try {
        await testService.deleteTest(testId);
        toast({
          title: "Success",
          description: "Test deleted successfully",
        });
        fetchTests();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete test",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Test Management</h1>
        <button
          onClick={() => navigate('/admin/tests/create')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Create New Test
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading tests...</div>
      ) : (
        <div className="grid gap-4">
          {tests.map((test) => (
            <div
              key={test.id}
              className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{test.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{test.description}</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-500">
                    <span>Duration: {test.duration} min</span>
                    <span>Total Marks: {test.total_marks}</span>
                    <span>Questions: {test.questions?.length || 0}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/tests/${test.id}/preview`)}
                    className="p-2 text-gray-600 hover:text-blue-600"
                    title="Preview Test"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => navigate(`/admin/tests/${test.id}/edit`)}
                    className="p-2 text-gray-600 hover:text-green-600"
                    title="Edit Test"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(test.id)}
                    className="p-2 text-gray-600 hover:text-red-600"
                    title="Delete Test"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {tests.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No tests found. Create your first test!
            </div>
          )}
        </div>
      )}
    </div>
  );
}