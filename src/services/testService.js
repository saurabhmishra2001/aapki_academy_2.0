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
  }
};
