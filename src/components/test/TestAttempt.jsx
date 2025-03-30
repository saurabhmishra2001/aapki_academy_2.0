import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { testService } from '../../services/testService';
import Timer from './Timer';
import QuestionNavigation from './QuestionNavigation';

export default function TestAttempt() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeTest();
  }, [testId]);

  const initializeTest = async () => {
    try {
      const testData = await testService.getTestDetails(testId);
      const attemptData = await testService.startTestAttempt(testId);
      setTest(testData);
      setAttempt(attemptData);
    } catch (error) {
      console.error('Error initializing test:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    try {
      await testService.submitQuestionResponse(
        attempt.id,
        questionId,
        answer,
        0, // time taken - implement timer logic
        flagged[questionId] || false
      );
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const handleFlag = (questionId) => {
    setFlagged(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const handleSubmit = async () => {
    try {
      await testService.completeTestAttempt(attempt.id);
      navigate(`/test-result/${attempt.id}`);
    } catch (error) {
      console.error('Error completing test:', error);
    }
  };

  if (loading) {
    return <div>Loading test...</div>;
  }

  const question = test.questions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Timer
          duration={test.duration}
          onTimeUp={handleSubmit}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Question {currentQuestion + 1} of {test.questions.length}
        </h2>
        
        <div className="mb-6">
          <p className="text-lg mb-4">{question.question_text}</p>
          
          <div className="space-y-3">
            {JSON.parse(question.options).map((option, index) => (
              <label key={index} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={() => handleAnswer(question.id, option)}
                  className="form-radio"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => handleFlag(question.id)}
            className={`px-4 py-2 rounded-md ${
              flagged[question.id]
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {flagged[question.id] ? 'Unflag' : 'Flag'} Question
          </button>
          
          <div className="space-x-4">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="px-4 py-2 bg-gray-100 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentQuestion(prev => Math.min(test.questions.length - 1, prev + 1))}
              disabled={currentQuestion === test.questions.length - 1}
              className="px-4 py-2 bg-gray-100 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <QuestionNavigation
        total={test.questions.length}
        current={currentQuestion}
        answers={answers}
        flagged={flagged}
        onChange={setCurrentQuestion}
      />

      <div className="mt-6 text-center">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Submit Test
        </button>
      </div>
    </div>
  );
}