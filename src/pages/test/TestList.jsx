import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { testService } from '../../services/testService';

export default function TestList() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      const data = await testService.getAvailableTests();
      setTests(data);
    } catch (error) {
      console.error('Error loading tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = (testId) => {
    navigate(`/test/${testId}`);
  };

  if (loading) {
    return <div>Loading tests...</div>;
  }

  return (
    <div className="space-y-4">
      {tests.map((test) => (
        <div key={test.id} className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">{test.title}</h3>
          <p className="text-gray-600 mb-4">{test.description}</p>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">
                Duration: {test.duration} minutes
              </p>
              <p className="text-sm text-gray-500">
                Total Marks: {test.total_marks}
              </p>
            </div>
            <button
              onClick={() => handleStartTest(test.id)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Start Test
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}