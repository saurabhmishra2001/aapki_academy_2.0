import { useState, useEffect } from 'react';
import { testService } from '../../services/testService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function TotalTests() {
  const [totalTests, setTotalTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTotalTests = async () => {
      try {
        const data = await testService.getTests();
        setTotalTests(data);
      } catch (error) {
        console.error('Error fetching total tests:', error);
        setError('Failed to load total tests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTotalTests();
  }, []);

  if (loading) {
    return <div className="text-center text-lg font-medium">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Total Tests</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {totalTests.map((test) => (
          <Card key={test.id} className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">{test.title || 'Untitled Test'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>{test.description || 'No description available.'}</p>
              <p>Duration: {test.duration || 0} minutes</p>
              <p>Total Marks: {test.total_marks || 0}</p>
              <Button onClick={() => navigate(`/admin/tests/${test.id}`)} className="mt-2">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
