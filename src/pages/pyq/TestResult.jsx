import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { testService } from "../../services/testService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  LabelList,
} from "recharts";

const TestResult = () => {
  const { attemptId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    loadResult();
  }, [attemptId]);

  const loadResult = async () => {
    try {
      const data = await testService.getTestResults(attemptId);
      setResult(data);
      loadLeaderboard(data.testId);
    } catch (error) {
      console.error("Error loading result:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboard = async (testId) => {
    try {
      const data = await testService.getLeaderboard(testId);
      setLeaderboard(data);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <span className="text-xl text-gray-600">Loading results...</span>
      </div>
    );

  if (!result)
    return (
      <div className="text-center text-xl mt-10 text-red-500 font-medium">
        Result not found
      </div>
    );

  const userAnswers = result.answers || {};
  const totalQuestions = result.questions.length;
  const correctAnswers = result.questions.filter(
    (q) => userAnswers[q.id] === q.correct_answer
  ).length;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const marks = correctAnswers * result.marks_per_question;
  const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Page Title */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-blue-700">
        📊 Test Results
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-md p-5 text-center">
          <p className="text-2xl font-bold">{totalQuestions}</p>
          <p className="text-sm opacity-90">Total Questions</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-md p-5 text-center">
          <p className="text-2xl font-bold">{correctAnswers}</p>
          <p className="text-sm opacity-90">Correct Answers</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg shadow-md p-5 text-center">
          <p className="text-2xl font-bold">{incorrectAnswers}</p>
          <p className="text-sm opacity-90">Incorrect Answers</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-md p-5 text-center">
          <p className="text-2xl font-bold">{percentage}%</p>
          <p className="text-sm opacity-90">Accuracy</p>
        </div>
      </div>

      {/* Performance Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Your Performance
        </h2>

        <div className="space-y-6">
          {result.questions.map((question, index) => {
            const isCorrect = userAnswers[question.id] === question.correct_answer;

            return (
              <div key={question.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 transition-all hover:shadow-md">
                <p className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-3">
                  {index + 1}. {question.question_text}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div className={`p-3 rounded-md ${isCorrect ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                    <strong className="block text-sm text-gray-500 dark:text-gray-400">Your Answer:</strong>
                    <span className={`font-medium ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {userAnswers[question.id] || "Not Answered"}
                    </span>
                  </div>

                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <strong className="block text-sm text-gray-500 dark:text-gray-400">Correct Answer:</strong>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {question.correct_answer}
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <strong className="block text-sm text-gray-500 dark:text-gray-400">Explanation:</strong>
                  <p className="text-gray-700 dark:text-gray-300 mt-1">
                    {question.explanation || "No explanation provided."}
                  </p>
                </div>

                <p className={`mt-2 font-semibold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                  {isCorrect ? "✅ Correct!" : "❌ Incorrect!"}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard Chart */}
  <h2 className="text-xl font-semibold mb-4">      🏆 Leaderboard (Bar Graph)
</h2>
      <div className={`bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-md p-4 mb-8`}>

  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={leaderboard} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
      <XAxis
        dataKey="userName"
        tick={{ fill: '#6B7280', fontSize: 12 }}
        axisLine={{ stroke: '#6B7280' }}
        tickLine={{ stroke: '#6B7280' }}
      />
      <YAxis
        tick={{ fill: '#6B7280', fontSize: 12 }}
        axisLine={{ stroke: '#6B7280' }}
        tickLine={{ stroke: '#6B7280' }}
      />
      <Tooltip
        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
        itemStyle={{ color: '#fff' }}
        labelStyle={{ fontWeight: 'bold', color: '#fff' }}
      />
      <Legend />
      <Bar dataKey="score" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={30}>
        <LabelList dataKey="score" position="top" fill="#fff" fontSize={12} />
      </Bar>
    </BarChart>
  </ResponsiveContainer>
</div>

      {/* Leaderboard List */}
      <h2 className="text-xl font-semibold mb-4">🏆 Top Scorers</h2>
      <div className={`bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-md p-4 mb-8`}>
        {leaderboard.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {leaderboard.map((entry, index) => (
              <li key={entry.userId} className="flex justify-between items-center py-3 px-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition group">
                <div className="flex items-center space-x-4">
                  <span className={`font-bold w-8 h-8 flex items-center justify-center rounded-full ${
                    index === 0 ? "bg-yellow-100 text-yellow-800" :
                    index === 1 ? "bg-gray-100 text-gray-700" :
                    index === 2 ? "bg-amber-100 text-amber-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{entry.userName}</span>
                </div>
                <div className="flex items-center space-x-6">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">Score: {entry.score}</span>
                  {entry.timeTaken > 0 && (
                    <span className="text-gray-500 dark:text-gray-400 text-sm group-hover:text-gray-700 transition">
                      Time: {entry.timeTaken}s
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            No leaderboard data available.
          </p>
        )}
      </div>
    </div>
  );
};

export default TestResult;