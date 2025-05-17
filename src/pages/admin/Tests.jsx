import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { testService } from '../../services/testService';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useToast } from '../../hooks/useToast';
import { Input } from '../../components/ui/input';

export default function AdminTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadTests();
    document.body.classList.add('admin-sidebar-open');
    return () => document.body.classList.remove('admin-sidebar-open');
  }, []);

  const loadTests = async () => {
    try {
      const data = await testService.getTests();
      // Sort tests by creation date
      data.sort((a, b) => b.createdAt - a.createdAt);
      setTests(data);
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

  const handleEdit = (id) => {
    navigate(`/admin/edit-test/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      try {
        await testService.deleteTest(id);
        setTests(tests.filter((test) => test.id !== id));
        toast({
          title: 'Success',
          description: 'Test deleted successfully',
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

  const filteredTests = tests.filter((test) =>
    test.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
   
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tests</h1>
          <Button onClick={() => navigate('/admin/create-test')}>
            Create New Test
          </Button>
        </div>

        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search tests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <Card key={test.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {test.title}
                  <span className={`text-sm font-normal ${test.status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
                    {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{test.description}</p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>Duration: {test.duration} minutes</p>
                  <p>Total Marks: {test.total_marks}</p>
                  <p>Passing Marks: {test.passing_marks}</p>
                  {test.start_time && (
                    <p>Start: {new Date(test.start_time).toLocaleString()}</p>
                  )}
                  {test.end_time && (
                    <p>End: {new Date(test.end_time).toLocaleString()}</p>
                  )}
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(test.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(test.id)}
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