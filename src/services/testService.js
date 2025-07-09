import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { auth } from '../config/firebase';

export const testService = {
  // ✅ Create a test
  createTest: async (testData) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      const testRef = await addDoc(collection(db, 'tests'), {
        ...testData,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: testData.status || 'draft'
      });

      if (testData.questions && testData.questions.length > 0) {
        const questionsPromises = testData.questions.map(question =>
          addDoc(collection(db, 'questions'), {
            ...question,
            testId: testRef.id,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          })
        );
        await Promise.all(questionsPromises);
      }

      return { id: testRef.id, ...testData };
    } catch (error) {
      console.error('Error creating test:', error);
      throw error;
    }
  },

  

  // ✅ Get all tests
  getTests: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'tests'));
      const tests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return tests;
    } catch (error) {
      console.error('Error fetching tests:', error);
      throw error;
    }
  },

  // ✅ Get available (active/upcoming) tests
  getAvailableTests: async ({ isPaid = null, subject = null } = {}) => {
    try {
      let q = query(
        collection(db, 'tests'),
        where('status', 'in', ['active', 'upcoming']),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      let tests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (isPaid !== null) {
        tests = tests.filter(t => t.isPaid === isPaid);
      }
      if (subject) {
        tests = tests.filter(t => t.subject === subject);
      }

      return tests;
    } catch (error) {
      console.error('Error fetching available tests:', error);
      throw error;
    }
  },

  // ✅ Get test by ID (Supports both question locations)
  getTestById: async (testId) => {
    try {
      if (!testId) throw new Error('Invalid test ID');

      const testRef = doc(db, 'tests', testId);
      const testSnap = await getDoc(testRef);

      if (!testSnap.exists()) {
        throw new Error('Test not found');
      }

      const testData = testSnap.data();

      // Try global questions collection
      const questionsQuery = query(
        collection(db, 'questions'),
        where('testId', '==', testId),
        orderBy('createdAt', 'asc')
      );
      const questionsSnap = await getDocs(questionsQuery);
      let questions = questionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // If no global questions found, try subcollection
      if (questions.length === 0) {
        const subRef = collection(db, 'tests', testId, 'questions');
        const subSnap = await getDocs(subRef);
        questions = subSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }

      return {
        id: testSnap.id,
        ...testData,
        questions,
      };
    } catch (error) {
      console.error('Error fetching test by ID:', error);
      throw error;
    }
  },

  // ✅ Update test
  updateTest: async (testId, testData) => {
    try {
      const testRef = doc(db, 'tests', testId);
      const updateData = {
        ...testData,
        updatedAt: serverTimestamp()
      };
      await updateDoc(testRef, updateData);
      return { id: testId, ...testData };
    } catch (error) {
      console.error('Error updating test:', error);
      throw error;
    }
  },

  // ✅ Delete test and its questions
  deleteTest: async (testId) => {
    try {
      // Delete from global 'questions' collection
      const questionsQuery = query(collection(db, 'questions'), where('testId', '==', testId));
      const questionsSnapshot = await getDocs(questionsQuery);
      const deleteQuestionPromises = questionsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deleteQuestionPromises);

      // Optionally, also delete from subcollection if any
      const subcollectionRef = collection(db, 'tests', testId, 'questions');
      const subSnap = await getDocs(subcollectionRef);
      const subDeletePromises = subSnap.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(subDeletePromises);

      // Delete test document
      await deleteDoc(doc(db, 'tests', testId));
      return true;
    } catch (error) {
      console.error('Error deleting test:', error);
      throw error;
    }
  },

  // ✅ Create question (global collection)
  createQuestion: async (testId, questionData) => {
    try {
      const questionRef = await addDoc(collection(db, 'questions'), {
        ...questionData,
        testId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: questionRef.id, ...questionData };
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  },

  // ✅ Get questions by test ID (global only)
  getQuestions: async (testId) => {
    try {
      const questionsQuery = query(
        collection(db, 'questions'),
        where('testId', '==', testId),
        orderBy('createdAt', 'asc')
      );
      const querySnapshot = await getDocs(questionsQuery);
      const questions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return questions;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  },

  // ✅ Update question
  updateQuestion: async (questionId, questionData) => {
    try {
      const questionRef = doc(db, 'questions', questionId);
      const updateData = {
        ...questionData,
        updatedAt: serverTimestamp()
      };
      await updateDoc(questionRef, updateData);
      return { id: questionId, ...questionData };
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  },

  // ✅ Delete a question
  deleteQuestion: async (questionId) => {
    try {
      await deleteDoc(doc(db, 'questions', questionId));
      return true;
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  },

  // ✅ Get all free tests
getFreeTests: async () => {

  try {
    const q = query(
      collection(db, 'tests'),
      where('isPaid', '==', false ||'type'=='free' && 'subject'=='NTA'),
      where('status', 'in', ['published', 'upcoming']),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const tests = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log('🚀 ~ file: testService.js:160 ~ getFreeTests ~ tests:', tests)
    return tests;
  } catch (error) {
    console.error('Error fetching free tests:', error);
    throw error;
  }
},
// ✅ Get all unique subjects from paid tests
getPaidTestSubjects: async () => {
  try {
    const q = query(
      collection(db, 'tests'),
      where('isPaid', '==', true || 'type'=='paid'),
      where('status', 'in', ['published', 'upcoming'])
    );
    const querySnapshot = await getDocs(q);

    const subjectsSet = new Set();
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.subject) {
        subjectsSet.add(data.subject);
      }
    });

    return Array.from(subjectsSet);
  } catch (error) {
    console.error('Error fetching paid test subjects:', error);
    throw error;
  }
},
// ✅ Get paid tests (optionally by subject or type)
getPaidTests: async ({ subject = null } = {}) => {
  try {
    let q = query(
      collection(db, 'tests'),
      where('isPaid', '==', true ||'type'=='paid' ),
      where('status', 'in', ['published', 'upcoming']),
      orderBy('createdAt', 'desc')
    );
        console.log('🚀 ~ file: testService.js:160 ~ getFreeTests ~ tests:', tests)

    const querySnapshot = await getDocs(q);
    let tests = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (subject) {
      tests = tests.filter(t => t.subject === subject);
    }

    return tests;
  } catch (error) {
    console.error('Error fetching paid tests:', error);
    throw error;
  }
},

// ✅ Get PYQ tests with optional subject filter
getPyqTests: async () => {
  try {
    const q = query(
      collection(db, 'tests'),
      where('model', '==', 'PYQ'),
      where('status', 'in', ['published', 'upcoming'])
    );

    const querySnapshot = await getDocs(q);
    const tests = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return tests;
  } catch (error) {
    console.error('Error fetching PYQ tests:', error);
    throw error;
  }
},
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
