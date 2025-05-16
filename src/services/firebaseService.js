import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Initialize Firebase
const firebaseConfig = {
  // Your Firebase config here
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export const firebaseService = {
  // Auth Methods
  signIn: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  signUp: async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        ...userData,
        createdAt: new Date().toISOString(),
        role: 'user'
      });
      return userCredential.user;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  signOut: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(auth, callback);
  },

  // User Methods
  getUserData: async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  updateUserData: async (userId, data) => {
    try {
      await updateDoc(doc(db, 'users', userId), data);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Course Methods
  createCourse: async (courseData) => {
    try {
      const courseRef = doc(collection(db, 'courses'));
      await setDoc(courseRef, {
        ...courseData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return courseRef.id;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getCourse: async (courseId) => {
    try {
      const courseDoc = await getDoc(doc(db, 'courses', courseId));
      return courseDoc.exists() ? { id: courseDoc.id, ...courseDoc.data() } : null;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  updateCourse: async (courseId, data) => {
    try {
      await updateDoc(doc(db, 'courses', courseId), {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      throw new Error(error.message);
    }
  },

  deleteCourse: async (courseId) => {
    try {
      await deleteDoc(doc(db, 'courses', courseId));
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // File Upload Methods
  uploadFile: async (file, path) => {
    try {
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Helper Methods
  generateId: () => doc(collection(db, 'temp')).id
};