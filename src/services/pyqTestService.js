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
  limit,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';

export const pyqTestService = {
  async createPYQTest(testData) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      const testRef = await addDoc(collection(db, 'pyqTests'), {
        ...testData,
        createdBy: user.uid,
        createdAt: new Date().toISOString()
      });

      if (testData.questions && testData.questions.length > 0) {
        await Promise.all(testData.questions.map(question =>
          addDoc(collection(db, 'pyqQuestions'), {
            ...question,
            testId: testRef.id
          })
        ));
      }

      return { data: { id: testRef.id, ...testData }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getPYQTest(testId) {
    try {
      const testDoc = await getDoc(doc(db, 'pyqTests', testId));
      if (!testDoc.exists()) throw new Error('PYQ Test not found');

      const questionsQuery = query(
        collection(db, 'pyqQuestions'),
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

  async updatePYQTest(testId, testData) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      await updateDoc(doc(db, 'pyqTests', testId), {
        ...testData,
        updatedAt: new Date().toISOString()
      });

      if (testData.questions && testData.questions.length > 0) {
        // Delete existing questions
        const questionsQuery = query(
          collection(db, 'pyqQuestions'),
          where('testId', '==', testId)
        );
        const questionsSnapshot = await getDocs(questionsQuery);
        await Promise.all(questionsSnapshot.docs.map(doc => deleteDoc(doc.ref)));

        // Add new questions
        await Promise.all(testData.questions.map(question =>
          addDoc(collection(db, 'pyqQuestions'), {
            ...question,
            testId
          })
        ));
      }

      return { data: true, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async deletePYQTest(testId) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      // Delete questions first
      const questionsQuery = query(
        collection(db, 'pyqQuestions'),
        where('testId', '==', testId)
      );
      const questionsSnapshot = await getDocs(questionsQuery);
      await Promise.all(questionsSnapshot.docs.map(doc => deleteDoc(doc.ref)));

      // Delete the test
      await deleteDoc(doc(db, 'pyqTests', testId));

      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  async getAllPYQTests() {
    try {
      const testsQuery = query(
        collection(db, 'pyqTests'),
        orderBy('createdAt', 'desc')
      );
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

  async submitPYQTestAttempt(testId, answers) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      // Get correct answers
      const questionsQuery = query(
        collection(db, 'pyqQuestions'),
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
      const attemptRef = await addDoc(collection(db, 'pyqTestAttempts'), {
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

  async getPYQTestHistory(userId) {
    try {
      const attemptsQuery = query(
        collection(db, 'pyqTestAttempts'),
        where('userId', '==', userId),
        orderBy('submittedAt', 'desc')
      );
      const attemptsSnapshot = await getDocs(attemptsQuery);
      
      const attempts = await Promise.all(
        attemptsSnapshot.docs.map(async doc => {
          const testDoc = await getDoc(doc(db, 'pyqTests', doc.data().testId));
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
  }
};
