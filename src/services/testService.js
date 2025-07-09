import { collection, getDocs, query, where, orderBy, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { auth } from '../config/firebase';

export const testService = {
  // Test CRUD Operations
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

  getAvailableTests: async () => {
    try {
      const testsQuery = query(
        collection(db, 'tests'),
        where('status', 'in', ['active', 'upcoming']),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(testsQuery);
      const tests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return tests;
    } catch (error) {
      console.error('Error fetching available tests:', error);
      throw error;
    }
  },

  getTestById: async (testId) => {
    try {
      const testsQuery = query(
        collection(db, 'tests'),
        where('id', '==', testId)
      );
      const querySnapshot = await getDocs(testsQuery);
      if (querySnapshot.empty) {
        throw new Error('Test not found');
      }
      const test = {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data()
      };
      return test;
    } catch (error) {
      console.error('Error fetching test by ID:', error);
      throw error;
    }
  },

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

  deleteTest: async (testId) => {
    try {
      // Delete associated questions first
      const questionsQuery = query(collection(db, 'questions'), where('testId', '==', testId));
      const questionsSnapshot = await getDocs(questionsQuery);
      const deleteQuestionPromises = questionsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deleteQuestionPromises);

      // Delete the test
      await deleteDoc(doc(db, 'tests', testId));
      return true;
    } catch (error) {
      console.error('Error deleting test:', error);
      throw error;
    }
  },

  // Question CRUD Operations
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