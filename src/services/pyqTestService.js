import {
  collection, getDocs, query, where, orderBy, addDoc, doc, updateDoc,
  deleteDoc, getDoc, serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { auth } from '../config/firebase';

export const testService = {
  // Existing methods (getTests, createTest, etc.) ...

  async submitTestAttempt(testId, answers) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      // 1. Create new attempt
      const attemptRef = await addDoc(collection(db, 'user_test_attempts'), {
        testId,
        userId: user.uid,
        status: 'completed',
        startTime: serverTimestamp(),
        endTime: serverTimestamp(), // You can record actual time by tracking start-end separately
        createdAt: serverTimestamp()
      });

      // 2. Fetch correct answers
      const q = query(collection(db, 'questions'), where('testId', '==', testId));
      const questionSnap = await getDocs(q);
      const questions = questionSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const score = questions.reduce((total, q) => {
        return total + (answers[q.id] === q.correct_answer ? 1 : 0);
      }, 0);

      // 3. Update score
      await updateDoc(attemptRef, {
        score,
        endTime: serverTimestamp(),
      });

      // 4. Save responses
      const responses = Object.entries(answers).map(([questionId, answer]) => ({
        attemptId: attemptRef.id,
        questionId,
        selectedAnswer: answer,
        userId: user.uid,
        createdAt: serverTimestamp()
      }));

      const responsePromises = responses.map((r) =>
        addDoc(collection(db, 'user_question_responses'), r)
      );
      await Promise.all(responsePromises);

      return { id: attemptRef.id, score };
    } catch (error) {
      console.error('Error submitting test:', error);
      throw error;
    }
  },

  async getTestResults(attemptId) {
    try {
      const attemptRef = doc(db, 'user_test_attempts', attemptId);
      const attemptSnap = await getDoc(attemptRef);
      if (!attemptSnap.exists()) throw new Error('Attempt not found');
      const attemptData = attemptSnap.data();

      const responsesQuery = query(
        collection(db, 'user_question_responses'),
        where('attemptId', '==', attemptId)
      );
      const responsesSnap = await getDocs(responsesQuery);
      const answers = {};
      responsesSnap.docs.forEach((doc) => {
        const data = doc.data();
        answers[data.questionId] = data.selectedAnswer;
      });

      const questionsQuery = query(
        collection(db, 'questions'),
        where('testId', '==', attemptData.testId)
      );
      const questionsSnap = await getDocs(questionsQuery);
      const questions = questionsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { ...attemptData, questions, answers };
    } catch (error) {
      console.error('Error fetching test results:', error);
      throw error;
    }
  },

  async getLeaderboard(testId) {
    try {
      const attemptsQuery = query(
        collection(db, 'user_test_attempts'),
        where('testId', '==', testId),
        orderBy('score', 'desc')
      );
      const attemptsSnap = await getDocs(attemptsQuery);

      const leaderboard = await Promise.all(attemptsSnap.docs.map(async (docSnap) => {
        const data = docSnap.data();
        const userDoc = await getDoc(doc(db, 'users', data.userId));
        const userData = userDoc.exists() ? userDoc.data() : { name: 'Anonymous' };

        const timeTaken = data.endTime && data.startTime
          ? (data.endTime.toDate() - data.startTime.toDate()) / 1000
          : 0;

        return {
          userId: data.userId,
          userName: userData.name || 'Anonymous',
          score: data.score,
          timeTaken,
        };
      }));

      return leaderboard;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  },
};
