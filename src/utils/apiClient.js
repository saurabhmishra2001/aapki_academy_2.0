import { db, storage } from './firebaseConfig';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

export const getAllDocuments = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'documents'));
    const documents = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { data: documents, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getAllCourses = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'courses'));
    const courses = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { data: courses, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getAllTests = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'tests'));
    const tests = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { data: tests, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getAllVideos = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'videos'));
    const videos = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { data: videos, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const fetchCourses = async () => {
  try {
    const coursesRef = collection(db, 'courses');
    const q = query(coursesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const fetchDocuments = async () => {
  try {
    const documentsRef = collection(db, 'documents');
    const q = query(documentsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return Promise.all(querySnapshot.docs.map(async doc => {
      const data = doc.data();
      if (data.fileUrl) {
        const url = await getDownloadURL(ref(storage, data.fileUrl));
        return {
          id: doc.id,
          ...data,
          fileUrl: url
        };
      }
      return {
        id: doc.id,
        ...data
      };
    }));
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

export const fetchVideos = async () => {
  try {
    const videosRef = collection(db, 'videos');
    const q = query(videosRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return Promise.all(querySnapshot.docs.map(async doc => {
      const data = doc.data();
      if (data.videoUrl) {
        const url = await getDownloadURL(ref(storage, data.videoUrl));
        return {
          id: doc.id,
          ...data,
          videoUrl: url
        };
      }
      return {
        id: doc.id,
        ...data
      };
    }));
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};