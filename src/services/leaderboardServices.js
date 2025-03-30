import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';

export const leaderboardServices = {
  getTopScorers: async (count = 10) => {
    try {
      const scoresQuery = query(
        collection(db, 'user_scores'),
        orderBy('total_score', 'desc'),
        limit(count)
      );

      const querySnapshot = await getDocs(scoresQuery);
      const topScorers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: topScorers, error: null };
    } catch (error) {
      console.error('Error fetching top scorers:', error);
      return { data: null, error };
    }
  },

  getUserRank: async (userId) => {
    try {
      const scoresQuery = query(
        collection(db, 'user_scores'),
        orderBy('total_score', 'desc')
      );

      const querySnapshot = await getDocs(scoresQuery);
      const allScores = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const userIndex = allScores.findIndex(score => score.user_id === userId);
      const rank = userIndex !== -1 ? userIndex + 1 : null;

      return { data: rank, error: null };
    } catch (error) {
      console.error('Error fetching user rank:', error);
      return { data: null, error };
    }
  }
};