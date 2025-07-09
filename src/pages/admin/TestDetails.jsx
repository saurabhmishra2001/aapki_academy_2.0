import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { testService } from '../../services/testService';
import { Card } from '../../components/ui/card';
import { Alert } from '../../components/ui/alert';

export default function TestDetails() {
  const { testId } = useParams();
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const testData = await testService.getTestById(testId);
        const questionsData = await testService.getQuestions(testId);
        setTest(testData);
        setQuestions(questionsData);
      } catch (err) {
        console.error(err);
        setError('Failed to load test details.');
      }
    };
    fetchDetails();
  }, [testId]);

  if (error) return <Alert variant="destructive">{error}</Alert>;
  if (!test) return <div>Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">{test.title}</h1>
      <p className="mb-2">Duration: {test.duration} minutes</p>
      <p className="mb-2">Total Marks: {test.total_marks}</p>
      <p className="mb-4">Description: {test.description}</p>

      <Card className="p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Questions ({questions.length})</h2>
        {questions.map((q, i) => (
          <div key={q.id} className="mb-4">
            <p><strong>Q{i + 1}:</strong> {q.question_text}</p>
            <ul className="list-disc pl-6">
              {q.options.map((opt, j) => (
                <li key={j} className={opt === q.correct_answer ? "font-semibold text-green-600" : ""}>
                  {opt}
                </li>
              ))}
            </ul>
            <p className="text-sm text-gray-600 mt-1">Marks: {q.marks}</p>
            {q.explanation && <p className="text-sm mt-1 text-blue-600">Explanation: {q.explanation}</p>}
          </div>
        ))}
      </Card>
    </div>
  );
}
