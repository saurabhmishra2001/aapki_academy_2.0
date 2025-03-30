// src/services/authService.js
import { 
    signInWithEmailAndPassword,
    signOut
  } from 'firebase/auth';
  import { doc, getDoc } from 'firebase/firestore';
  import { auth, db } from '../utils/firebaseConfig';
  
  export const loginWithEmail = async (email, password) => {
    try {
      console.log('Attempting login with:', email); // Debug log
      
      // 1. First attempt Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Firebase auth success, user ID:', userCredential.user.uid);
      
      // 2. Verify admin status in Firestore
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      console.log('Firestore document:', userDoc.exists() ? userDoc.data() : 'NOT FOUND');
      
      if (!userDoc.exists()) {
        console.error('User document not found in Firestore');
        await signOut(auth);
        return { 
          user: null, 
          isAdmin: false, 
          error: new Error('Invalid email or password') 
        };
      }
      
      if (userDoc.data().role !== 'admin') {
        console.error('User is not an admin');
        await signOut(auth);
        return { 
          user: null, 
          isAdmin: false, 
          error: new Error('Admin privileges required') 
        };
      }
      
      console.log('Login successful for admin user');
      return { user: userCredential.user, isAdmin: true, error: null };
      
    } catch (error) {
      console.error('Login error:', error.code, error.message);
      
      // Specific error handling
      if (error.code === 'auth/invalid-credential' || 
          error.code === 'auth/user-not-found' ||
          error.code === 'auth/wrong-password') {
        return { 
          user: null, 
          isAdmin: false, 
          error: new Error('Invalid email or password') 
        };
      }
      
      return { 
        user: null, 
        isAdmin: false, 
        error: new Error('Login failed. Please try again.') 
      };
    }
  };