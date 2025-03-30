import { auth, db } from '../utils/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export const adminAuthService = {
  async isAdmin() {
    try {
      const user = auth.currentUser;
      if (!user) return { data: false, error: null };

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) return { data: false, error: null };

      return { 
        data: userDoc.data().role === 'admin',
        error: null 
      };
    } catch (error) {
      return { data: false, error };
    }
  },

  async getCurrentAdmin() {
    try {
      const user = auth.currentUser;
      if (!user) return { data: null, error: 'Not authenticated' };

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) return { data: null, error: 'User not found' };
      
      const userData = userDoc.data();
      if (userData.role !== 'admin') return { data: null, error: 'Not an admin' };

      return { 
        data: {
          id: user.uid,
          email: user.email,
          ...userData
        },
        error: null 
      };
    } catch (error) {
      return { data: null, error };
    }
  }
};