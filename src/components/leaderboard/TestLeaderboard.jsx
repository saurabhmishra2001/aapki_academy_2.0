import { useState, useEffect } from 'react';
import { leaderboardService } from '../../services/leaderboardService';

export default function TestLeaderboard({ testId }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLeaderboard();
  }, [testId]);

  const loadLeaderboard = async () => {
    try {
      const data = await leaderboardService.getTestLeaderboard(testId);
      setLeaderboard(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading leaderboard...</div>;
  if (error) return <div>Error loading leaderboard: {error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Leaderboard</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leaderboard.map((entry) => (
              <tr key={`${entry.user_email}-${entry.created_at}`}>
                <td className="px-6 py-4 whitespace-nowrap">{entry.rank}</td>
                <td className="px-6 py-4 whitespace-nowrap">{entry.user_email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{entry.score}%</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(entry.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}