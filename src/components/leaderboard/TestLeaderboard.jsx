import React, { useEffect, useState } from 'react';
import { leaderboardServices } from '../../services/leaderboardService';
import { auth } from '../../config/firebase';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

export default function Leaderboard() {
  const [topScorers, setTopScorers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRank, setUserRank] = useState(null);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const { data: scores, error: scoreError } = await leaderboardServices.getTopScorers(10);
      if (scoreError) throw scoreError;

      setTopScorers(scores || []);

      const currentUser = auth.currentUser;
      const currentUserId = currentUser?.uid;
      if (currentUserId) {
        const { data: rank, error: rankError } = await leaderboardServices.getUserRank(currentUserId);
        if (rankError) throw rankError;
        setUserRank(rank);
      }
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
      setError(err.message || 'Could not load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">🏆 Top Scorers</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {userRank ? `You are ranked #${userRank}` : 'Check how you stack up against others'}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
            <p>{error}</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl px-6 py-8">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-6 text-center">Leaderboard Chart</h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topScorers} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="userName" />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_score" fill="#3B82F6" name="Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Updated live based on latest results
        </div>
      </div>
    </div>
  );
}
