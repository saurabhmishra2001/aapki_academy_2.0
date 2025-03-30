import { auth, db } from '../utils/firebaseConfig';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  query, 
  where,
  orderBy,
  limit 
} from 'firebase/firestore';

export const testService = {
  async createTest(testData, signal) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      const testRef = await addDoc(collection(db, 'tests'), {
        title: testData.title,
        description: testData.description,
        duration: testData.duration,
        totalMarks: testData.totalMarks,
        passingMarks: testData.passingMarks,
        startTime: testData.startTime ? new Date(testData.startTime).toISOString() : null,
        endTime: testData.endTime ? new Date(testData.endTime).toISOString() : null,
        createdById: user.uid,
      });

      if (testData.questions && testData.questions.length > 0) {
        const questions = testData.questions.map((q) => ({
          ...q,
          testId: testRef.id, // Link each question to the created test
        }));

        await Promise.all(questions.map(async (question) => {
          await addDoc(collection(db, 'questions'), question);
        }));
      }

      return {
        data: {
          id: testRef.id,
          ...testData,
        },
        error: null
      };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getTests() {
    try {
      const testsQuery = query(collection(db, 'tests'));
      const testsSnapshot = await getDocs(testsQuery);
      
      const tests = testsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: tests, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getTest(testId) {
    try {
      const testDoc = await getDoc(doc(db, 'tests', testId));
      if (!testDoc.exists()) throw new Error('Test not found');

      // Get questions for this test
      const questionsQuery = query(
        collection(db, 'questions'),
        where('testId', '==', testId)
      );
      const questionsSnapshot = await getDocs(questionsQuery);
      const questions = questionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return {
        data: {
          id: testDoc.id,
          ...testDoc.data(),
          questions
        },
        error: null
      };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getTestWithQuestions(testId) {
    try {
      const testDoc = await getDoc(doc(db, 'tests', testId));
      if (!testDoc.exists()) throw new Error('Test not found');

      // Get questions for this test
      const questionsQuery = query(
        collection(db, 'questions'),
        where('testId', '==', testId)
      );
      const questionsSnapshot = await getDocs(questionsQuery);
      const questions = questionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return {
        data: {
          id: testDoc.id,
          ...testDoc.data(),
          questions
        },
        error: null
      };
    } catch (error) {
      return { data: null, error };
    }
  },

  async submitTest(attemptData) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      const attemptRef = await addDoc(collection(db, 'testAttempts'), {
        ...attemptData,
        userId: user.uid,
      });

      return {
        data: {
          id: attemptRef.id,
          ...attemptData,
        },
        error: null
      };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getTestAttempts(testId) {
    try {
      const attemptsQuery = query(
        collection(db, 'testAttempts'),
        where('testId', '==', testId),
        orderBy('createdAt', 'desc')
      );
      const attemptsSnapshot = await getDocs(attemptsQuery);
      
      const attempts = attemptsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: attempts, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getTestAttempt(attemptId) {
    try {
      const attemptDoc = await getDoc(doc(db, 'testAttempts', attemptId));
      if (!attemptDoc.exists()) throw new Error('Test attempt not found');

      return {
        data: {
          id: attemptDoc.id,
          ...attemptDoc.data(),
        },
        error: null
      };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getTestAttemptWithUser(attemptId) {
    try {
      const attemptDoc = await getDoc(doc(db, 'testAttempts', attemptId));
      if (!attemptDoc.exists()) throw new Error('Test attempt not found');

      const userDoc = await getDoc(doc(db, 'users', attemptDoc.data().userId));
      if (!userDoc.exists()) throw new Error('User not found');

      return {
        data: {
          id: attemptDoc.id,
          ...attemptDoc.data(),
          user: {
            id: userDoc.id,
            ...userDoc.data(),
          },
        },
        error: null
      };
    } catch (error) {
      return { data: null, error };
    }
  },

  async deleteTest(testId) {
    try {
      await deleteDoc(doc(db, 'tests', testId));
      return { data: null, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateTest(testId, testData) {
    try {
      const testRef = doc(db, 'tests', testId);
      await updateDoc(testRef, {
        title: testData.title,
        description: testData.description,
        duration: testData.duration,
        totalMarks: testData.totalMarks,
        passingMarks: testData.passingMarks,
        startTime: testData.startTime ? new Date(testData.startTime).toISOString() : null,
        endTime: testData.endTime ? new Date(testData.endTime).toISOString() : null,
      });

      if (testData.questions && testData.questions.length > 0) {
        // Delete existing questions
        const questionsQuery = query(
          collection(db, 'questions'),
          where('testId', '==', testId)
        );
        const questionsSnapshot = await getDocs(questionsQuery);
        await Promise.all(questionsSnapshot.docs.map(async (doc) => {
          await deleteDoc(doc.ref);
        }));

        // Insert updated questions
        await Promise.all(testData.questions.map(async (question) => {
          await addDoc(collection(db, 'questions'), {
            ...question,
            testId: testId, // Link each question to the test
          });
        }));
      }

      return {
        data: {
          id: testId,
          ...testData,
        },
        error: null
      };
    } catch (error) {
      return { data: null, error };
    }
  },

  async submitTestAttempt(testId, answers) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      // Get correct answers
      const questionsQuery = query(
        collection(db, 'questions'),
        where('testId', '==', testId)
      );
      const questionsSnapshot = await getDocs(questionsQuery);
      const questions = questionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Calculate score
      let score = 0;
      let correctAnswers = 0;
      questions.forEach(question => {
        if (answers[question.id] === question.correctAnswer) {
          score += question.points || 1;
          correctAnswers++;
        }
      });

      // Save attempt
      const attemptRef = await addDoc(collection(db, 'testAttempts'), {
        testId,
        userId: user.uid,
        answers,
        score,
        totalQuestions: questions.length,
        correctAnswers,
        submittedAt: new Date().toISOString()
      });

      return {
        data: {
          id: attemptRef.id,
          score,
          totalQuestions: questions.length,
          correctAnswers
        },
        error: null
      };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getUserTestHistory(userId) {
    try {
      const attemptsQuery = query(
        collection(db, 'testAttempts'),
        where('userId', '==', userId),
        orderBy('submittedAt', 'desc')
      );
      const attemptsSnapshot = await getDocs(attemptsQuery);
      
      const attempts = await Promise.all(
        attemptsSnapshot.docs.map(async doc => {
          const testDoc = await getDoc(doc(db, 'tests', doc.data().testId));
          return {
            id: doc.id,
            ...doc.data(),
            test: testDoc.exists() ? { id: testDoc.id, ...testDoc.data() } : null
          };
        })
      );

      return { data: attempts, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getLeaderboard(testId) {
    try {
      const attemptsQuery = query(
        collection(db, 'testAttempts'),
        where('testId', '==', testId),
        orderBy('score', 'desc'),
        limit(10)
      );
      const attemptsSnapshot = await getDocs(attemptsQuery);
      
      const leaderboard = await Promise.all(
        attemptsSnapshot.docs.map(async doc => {
          const userDoc = await getDoc(doc(db, 'users', doc.data().userId));
          return {
            id: doc.id,
            ...doc.data(),
            user: userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null
          };
        })
      );

      return { data: leaderboard, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};
