import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pyqTestService } from '../services/pyqTestService';

export default function TestPage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    loadTest();
  }, [testId]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          // Show warning when time is 10% left
          if (!showWarning && newTime <= test.duration * 6) {
            setShowWarning(true);
          }
          return newTime;
        });
      }, 1000);

      return () => clearInterval(timer); // Clear the timer on component unmount
    } else if (timeLeft === 0 && test) {
      handleSubmit(); // Auto-submit when time runs out
    }
  }, [timeLeft, showWarning, test]);

  const loadTest = async () => {
    try {
      const data = await pyqTestService.getTestWithQuestions(testId);
      setTest(data);
      setTimeLeft(data.duration * 60); // Convert duration to seconds
    } catch (error) {
      console.error('Error loading test:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    try {
      const attempt = await pyqTestService.submitTestAttempt(testId, answers);
      navigate(`/test-result/${attempt.id}`);
    } catch (error) {
      console.error('Error submitting test:', error);
    }
  };

  if (loading) return <div className="text-center mt-10 text-xl">Loading test...</div>;
  if (!test) return <div className="text-center mt-10 text-xl">Test not found</div>;

  const question = test.questions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 shadow-lg rounded-lg relative">
      {/* Warning Modal */}
      {showWarning && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Time is running out!</h2>
            <p className="text-gray-700 mb-4">You have less than 10% of the time left. Please complete the test soon.</p>
            <button
              onClick={() => setShowWarning(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Timer */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">{test.title}</h1>
        <div className="text-lg font-semibold text-red-600">
          Time Left: <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Question */}
      <div className="mb-6 p-4 border rounded-lg shadow-lg bg-white">
        <p className="text-lg font-semibold mb-4 text-gray-800">{question.question_text}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {question.options.map((option, index) => (
            <label
              key={index}
              className={`block p-4 border rounded-lg text-center cursor-pointer transition duration-200 ease-in-out 
                ${
                  answers[question.id] === option
                    ? 'bg-blue-500 text-white border-blue-700 font-bold shadow-lg'
                    : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-blue-100 hover:border-blue-400'
                }`}
            >
              <input
                type="radio"
                name={question.id}
                value={option}
                checked={answers[question.id] === option}
                onChange={() => handleAnswer(question.id, option)}
                className="hidden"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>

        {currentQuestion === test.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Submit Test
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestion((prev) => Math.min(test.questions.length - 1, prev + 1))}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
