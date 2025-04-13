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
  async createTest(testData) {
    try {
      const docRef = await addDoc(collection(db, 'tests'), {
        ...testData,
        createdAt: new Date().toISOString(),
      });
      return { data: { id: docRef.id, ...testData }, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async updateTest(testId, testData) {
    try {
      const testRef = doc(db, 'tests', testId);
      await updateDoc(testRef, {
        ...testData,
        updatedAt: new Date().toISOString(),
      });
      return { data: { id: testId, ...testData }, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async deleteTest(testId) {
    try {
      await deleteDoc(doc(db, 'tests', testId));
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  async getTest(testId) {
    try {
      const testDoc = await getDoc(doc(db, 'tests', testId));
      if (!testDoc.exists()) {
        throw new Error('Test not found');
      }
      return { data: { id: testDoc.id, ...testDoc.data() }, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async getAllTests() {
    try {
      const testsQuery = query(collection(db, 'tests'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(testsQuery);
      const tests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { data: tests, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }
};
