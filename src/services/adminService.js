import { auth, db, storage } from '../utils/firebaseConfig';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export const adminService = {
  // Tests
  async createTest(testData) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      const testRef = await addDoc(collection(db, 'tests'), {
        ...testData,
        createdBy: user.uid,
        createdAt: new Date().toISOString()
      });

      const questionsPromises = testData.questions.map(question =>
        addDoc(collection(db, 'questions'), {
          ...question,
          testId: testRef.id
        })
      );

      await Promise.all(questionsPromises);
      return { data: { id: testRef.id }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateTest(testId, testData) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      await updateDoc(doc(db, 'tests', testId), {
        ...testData,
        updatedAt: new Date().toISOString()
      });

      // Delete existing questions
      const questionsSnapshot = await getDocs(
        query(collection(db, 'questions'), where('testId', '==', testId))
      );
      const deletePromises = questionsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // Add new questions
      const questionsPromises = testData.questions.map(question =>
        addDoc(collection(db, 'questions'), {
          ...question,
          testId
        })
      );
      await Promise.all(questionsPromises);

      return { data: true, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Courses
  async createCourse(courseData) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      const courseRef = await addDoc(collection(db, 'courses'), {
        ...courseData,
        createdBy: user.uid,
        createdAt: new Date().toISOString()
      });

      return { data: { id: courseRef.id }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getCourses() {
    try {
      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      const courses = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return { data: courses, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getCourse(courseId) {
    try {
      const courseRef = doc(db, 'courses', courseId);
      const courseSnapshot = await getDoc(courseRef);
      if (!courseSnapshot.exists()) throw new Error('Course not found');
      return { data: { id: courseSnapshot.id, ...courseSnapshot.data() }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateCourse(courseId, courseData) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      await updateDoc(doc(db, 'courses', courseId), {
        ...courseData,
        updatedAt: new Date().toISOString()
      });

      return { data: true, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Videos
  async createVideo(videoData) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      const videoRef = await addDoc(collection(db, 'videos'), {
        ...videoData,
        createdBy: user.uid,
        createdAt: new Date().toISOString()
      });

      return { data: { id: videoRef.id }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getVideos() {
    try {
      const videosSnapshot = await getDocs(collection(db, 'videos'));
      const videos = videosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return { data: videos, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getVideo(videoId) {
    try {
      const videoRef = doc(db, 'videos', videoId);
      const videoSnapshot = await getDoc(videoRef);
      if (!videoSnapshot.exists()) throw new Error('Video not found');
      return { data: { id: videoSnapshot.id, ...videoSnapshot.data() }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateVideo(videoId, videoData) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      await updateDoc(doc(db, 'videos', videoId), {
        ...videoData,
        updatedAt: new Date().toISOString()
      });

      return { data: true, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async uploadVideo(file, metadata) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      const storageRef = ref(storage, `videos/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const videoRef = await addDoc(collection(db, 'videos'), {
        ...metadata,
        url: downloadURL,
        fileName: file.name,
        uploadedBy: user.uid,
        uploadedAt: new Date().toISOString()
      });

      return { data: { id: videoRef.id }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async deleteVideo(videoId, fileName) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      // Delete from storage
      const storageRef = ref(storage, `videos/${fileName}`);
      await deleteObject(storageRef);

      // Delete from database
      await deleteDoc(doc(db, 'videos', videoId));

      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  // Documents
  async uploadDocument(file, metadata) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      const storageRef = ref(storage, `documents/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const docRef = await addDoc(collection(db, 'documents'), {
        ...metadata,
        url: downloadURL,
        fileName: file.name,
        uploadedBy: user.uid,
        uploadedAt: new Date().toISOString()
      });

      return { data: { id: docRef.id }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getDocuments() {
    try {
      const documentsSnapshot = await getDocs(collection(db, 'documents'));
      const documents = documentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return { data: documents, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getDocument(documentId) {
    try {
      const documentRef = doc(db, 'documents', documentId);
      const documentSnapshot = await getDoc(documentRef);
      if (!documentSnapshot.exists()) throw new Error('Document not found');
      return { data: { id: documentSnapshot.id, ...documentSnapshot.data() }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateDocument(documentId, documentData) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      await updateDoc(doc(db, 'documents', documentId), {
        ...documentData,
        updatedAt: new Date().toISOString()
      });

      return { data: true, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async deleteDocument(documentId, fileName) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      // Delete from storage
      const storageRef = ref(storage, `documents/${fileName}`);
      await deleteObject(storageRef);

      // Delete from database
      await deleteDoc(doc(db, 'documents', documentId));

      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  async getUsers() {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return { data: users, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async grantPaidAccess(userId) {
    try {
      const validUntil = new Date();
      validUntil.setMonth(validUntil.getMonth() + 1); // 1 month access

      await updateDoc(doc(db, 'users', userId), {
        subscription: {
          isActive: true,
          type: 'paid',
          validUntil: validUntil.toISOString()
        }
      });

      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  async revokePaidAccess(userId) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        subscription: {
          isActive: false,
          validUntil: new Date().toISOString()
        }
      });

      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  async deleteCourse(courseId) {
    try {
      await deleteDoc(doc(db, 'courses', courseId));
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  async deleteVideo(videoId) {
    try {
      await deleteDoc(doc(db, 'videos', videoId));
      return { error: null };
    } catch (error) {
      return { error };
    }
  }
};