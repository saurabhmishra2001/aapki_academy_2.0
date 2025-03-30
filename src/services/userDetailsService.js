import { auth, db } from '../utils/firebaseConfig';
import { doc, getDoc, setDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

export const userDetailsService = {
  async getUserDetails(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) throw new Error('User not found');
      return { data: userDoc.data(), error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateUserDetails(userId, details) {
    try {
      await setDoc(doc(db, 'users', userId), details, { merge: true });
      return { data: true, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async createUserRequest(requestData) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      await addDoc(collection(db, 'userRequests'), {
        ...requestData,
        userId: user.uid,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      return { data: true, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getUserRequests(userId) {
    try {
      const requestsQuery = query(
        collection(db, 'userRequests'),
        where('userId', '==', userId)
      );
      const requestsSnapshot = await getDocs(requestsQuery);
      const requests = requestsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { data: requests, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};