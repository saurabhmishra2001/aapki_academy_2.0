import { useState, useEffect } from 'react';
import { testService } from '../../services/testService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

export default function ActiveTests() {
  const [activeTests, setActiveTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActiveTests = async () => {
      try {
        const data = await testService.getActiveTests(); // Implement this function in testService
        setActiveTests(data);
      } catch (error) {
        console.error('Error fetching active tests:', error);
        setError('Failed to load active tests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchActiveTests();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Active Tests</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTests.map((test) => (
          <Card key={test.id}>
            <CardHeader>
              <CardTitle>{test.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{test.description}</p>
              <p>Duration: {test.duration} minutes</p>
              <p>Total Marks: {test.total_marks}</p>
              <Button>View Details</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 