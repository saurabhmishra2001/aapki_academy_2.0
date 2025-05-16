import { db, storage } from '../config/firebase';
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const COURSES_COLLECTION = 'courses';
const COURSE_THUMBNAILS_PATH = 'course-thumbnails';

export const courseService = {
  // Get all courses
  getCourses: async () => {
    try {
      const coursesRef = collection(db, COURSES_COLLECTION);
      const snapshot = await getDocs(coursesRef);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error('Failed to fetch courses: ' + error.message);
    }
  },

  // Get a single course by ID
  getCourse: async (id) => {
    try {
      const courseRef = doc(db, COURSES_COLLECTION, id);
      const courseDoc = await getDoc(courseRef);
      if (!courseDoc.exists()) {
        throw new Error('Course not found');
      }
      return {
        id: courseDoc.id,
        ...courseDoc.data()
      };
    } catch (error) {
      throw new Error('Failed to fetch course: ' + error.message);
    }
  },

  // Create a new course
  createCourse: async (courseData) => {
    try {
      let thumbnailUrl = null;
      
      // Upload thumbnail if provided
      if (courseData.thumbnail) {
        const thumbnailRef = ref(storage, `${COURSE_THUMBNAILS_PATH}/${Date.now()}_${courseData.thumbnail.name}`);
        await uploadBytes(thumbnailRef, courseData.thumbnail);
        thumbnailUrl = await getDownloadURL(thumbnailRef);
      }

      // Create course document
      const courseRef = collection(db, COURSES_COLLECTION);
      const docRef = await addDoc(courseRef, {
        ...courseData,
        thumbnail: thumbnailUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      return docRef.id;
    } catch (error) {
      throw new Error('Failed to create course: ' + error.message);
    }
  },

  // Update an existing course
  updateCourse: async (id, courseData) => {
    try {
      const courseRef = doc(db, COURSES_COLLECTION, id);
      const courseDoc = await getDoc(courseRef);
      
      if (!courseDoc.exists()) {
        throw new Error('Course not found');
      }

      let thumbnailUrl = courseDoc.data().thumbnail;

      // Handle thumbnail update
      if (courseData.thumbnail && courseData.thumbnail instanceof File) {
        // Delete old thumbnail if exists
        if (thumbnailUrl) {
          const oldThumbnailRef = ref(storage, thumbnailUrl);
          await deleteObject(oldThumbnailRef);
        }

        // Upload new thumbnail
        const thumbnailRef = ref(storage, `${COURSE_THUMBNAILS_PATH}/${Date.now()}_${courseData.thumbnail.name}`);
        await uploadBytes(thumbnailRef, courseData.thumbnail);
        thumbnailUrl = await getDownloadURL(thumbnailRef);
      }

      // Update course document
      await updateDoc(courseRef, {
        ...courseData,
        thumbnail: thumbnailUrl,
        updatedAt: new Date().toISOString()
      });

      return id;
    } catch (error) {
      throw new Error('Failed to update course: ' + error.message);
    }
  },

  // Delete a course
  deleteCourse: async (id) => {
    try {
      const courseRef = doc(db, COURSES_COLLECTION, id);
      const courseDoc = await getDoc(courseRef);
      
      if (!courseDoc.exists()) {
        throw new Error('Course not found');
      }

      // Delete thumbnail if exists
      const thumbnailUrl = courseDoc.data().thumbnail;
      if (thumbnailUrl) {
        const thumbnailRef = ref(storage, thumbnailUrl);
        await deleteObject(thumbnailRef);
      }

      // Delete course document
      await deleteDoc(courseRef);
    } catch (error) {
      throw new Error('Failed to delete course: ' + error.message);
    }
  }
};