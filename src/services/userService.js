import { auth, db } from '../utils/firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export const userService = {
  async signUp(email, password, userDetails) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        ...userDetails,
        email,
        role: 'user',
        createdAt: new Date().toISOString()
      });
      return { data: userCredential.user, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      return { data: { user: userCredential.user, profile: userDoc.data() }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getUserProfile(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      return { data: userDoc.data(), error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async signOutUser() {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { data: true, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateUserProfile(userId, updates) {
    try {
      await setDoc(doc(db, 'users', userId), updates, { merge: true });
      return { data: true, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
};