import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { pyqTestService } from "../services/pyqTestService";

const TestResult = () => {
  const { attemptId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    loadResult();
    loadLeaderboard();
  }, [attemptId]);

  const loadResult = async () => {
    try {
      const data = await pyqTestService.getTestResults(attemptId);

      setResult(data);
    } catch (error) {
      console.error("Error loading result:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const data = await pyqTestService.getLeaderboard(attemptId);
      console.log("Leaderboard data:", data);
      setLeaderboard(data);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
    }
  };

  if (loading)
    return <div className="text-center text-xl mt-10">Loading result...</div>;
  if (!result)
    return <div className="text-center text-xl mt-10">Result not found</div>;

  const userAnswers = result.answers || {};
  const totalQuestions = result.questions.length;
  const correctAnswers = result.questions.filter(
    (q) => userAnswers[q.id] === q.correct_answer
  ).length;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const marks = correctAnswers * result.marks_per_question; // Assuming each question has equal marks
  const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
        Test Results
      </h1>

      {/* Summary Section */}
      <div className="bg-blue-50 rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">Summary</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-xl font-bold text-blue-700">{totalQuestions}</p>
            <p className="text-gray-600">Total Questions</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-green-600">{correctAnswers}</p>
            <p className="text-gray-600">Correct Answers</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-red-600">{incorrectAnswers}</p>
            <p className="text-gray-600">Incorrect Answers</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-purple-600">{percentage}%</p>
            <p className="text-gray-600">Percentage</p>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Your Performance
        </h2>
        {result.questions.map((question, index) => (
          <div key={question.id} className="mb-6 border-b pb-4">
            <p className="font-medium text-lg text-gray-700 mb-2">
              {index + 1}. {question.question_text}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <p className="bg-gray-100 p-3 rounded-md">
                <strong>Your Answer:</strong>{" "}
                <span
                  className={`font-medium ${
                    userAnswers[question.id] === question.correct_answer
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {userAnswers[question.id] || "Not Answered"}
                </span>
              </p>
              <p className="bg-gray-100 p-3 rounded-md">
                <strong>Correct Answer:</strong>{" "}
                <span className="text-green-600 font-medium">
                  {question.correct_answer}
                </span>
              </p>
              <p className="bg-gray-100 p-3 rounded-md">
                <strong>Explanation:</strong>{" "}
                <span className="text-green-600 font-medium">
                  {question.explanation || "No explanation provided"}
                </span>
              </p>
            </div>
            <p
              className={`mt-2 font-semibold ${
                userAnswers[question.id] === question.correct_answer
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {userAnswers[question.id] === question.correct_answer
                ? "Correct"
                : "Incorrect"}
            </p>
          </div>
        ))}
      </div>

      {/* Leaderboard Section */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Leaderboard</h2>
      <div className="bg-white rounded-lg shadow-lg p-6">
        {leaderboard.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {leaderboard.map((entry, index) => (
              <li
                key={entry.user_id}
                className="flex justify-between items-center py-3 px-4 hover:bg-gray-50 transition"
              >
                <span className="flex items-center space-x-4">
                  <span className="text-lg font-medium">{index + 1}</span>
                  <span className="font-semibold text-gray-700">
                    {entry.user_name}
                  </span>
                </span>
                <span className="text-blue-600 font-medium">
                  Score: {entry.score}
                </span>
                {entry.timeTaken > 0 && (
                  <span className="text-gray-500 text-sm">
                    Time: {entry.timeTaken}s
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No leaderboard data available.</p>
        )}
      </div>
    </div>
  );
};

export default TestResult;
