import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { testService } from '../../services/testService';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function TestResult() {
  const { attemptId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, [attemptId]);

  const loadResults = async () => {
    try {
      const data = await testService.getTestResults(attemptId);
      setResult(data);
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading results...</div>;
  }

  const performanceData = [
    {
      name: 'Correct',
      value: result.correct_answers
    },
    {
      name: 'Incorrect',
      value: result.incorrect_answers
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Test Results</h2>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">Score</p>
            <p className="text-2xl font-bold">{result.score}%</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">Time Taken</p>
            <p className="text-2xl font-bold">
              {Math.round((new Date(result.end_time) - new Date(result.start_time)) / 60000)} mins
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">Status</p>
            <p className="text-2xl font-bold capitalize">{result.status}</p>
          </div>
        </div>

        <div className="mb-8 h-64">
          <h3 className="text-lg font-semibold mb-4">Performance Analysis</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Question Analysis</h3>
          <div className="space-y-6">
            {result.responses.map((response, index) => (
              <div
                key={response.id}
                className={`p-4 rounded-md ${
                  response.is_correct ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                <p className="font-medium mb-2">
                  Question {index + 1}: {response.question.question_text}
                </p>
                <p className="text-sm mb-1">
                  Your Answer: {response.selected_answer}
                </p>
                <p className="text-sm mb-1">
                  Correct Answer: {response.question.correct_answer}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {response.question.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}