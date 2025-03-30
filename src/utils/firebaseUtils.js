import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { db, storage } from './firebaseConfig';

// Generic CRUD operations
export const createDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

export const getDocument = async (collectionName, id) => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
  }
};

export const updateDocument = async (collectionName, id, data) => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updated_at: serverTimestamp()
    });
    return { id, ...data };
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

export const deleteDocument = async (collectionName, id) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
    return true;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

export const queryDocuments = async (collectionName, conditions = [], sortBy = null) => {
  try {
    let q = collection(db, collectionName);
    
    if (conditions.length > 0) {
      q = query(q, ...conditions.map(c => where(c.field, c.operator, c.value)));
    }
    
    if (sortBy) {
      q = query(q, orderBy(sortBy.field, sortBy.direction));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error querying documents:', error);
    throw error;
  }
};

// File storage operations
export const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const deleteFile = async (path) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// Specific collection operations
export const getCourses = async () => {
  return queryDocuments('courses', [], { field: 'created_at', direction: 'desc' });
};

export const getDocuments = async () => {
  return queryDocuments('documents', [], { field: 'created_at', direction: 'desc' });
};

export const getTests = async () => {
  return queryDocuments('tests', [], { field: 'created_at', direction: 'desc' });
};

export const getTestQuestions = async (testId) => {
  return queryDocuments('questions', [
    { field: 'test_id', operator: '==', value: testId }
  ]);
};
