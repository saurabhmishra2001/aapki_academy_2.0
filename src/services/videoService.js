import { db, storage } from '../utils/firebaseConfig';
import { collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export const videoService = {
  async createVideo(videoData, file) {
    try {
      // First upload the video file to storage
      const storageRef = ref(storage, `videos/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Then create the video record in Firestore
      const docRef = await addDoc(collection(db, 'videos'), {
        ...videoData,
        videoUrl: downloadURL,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        duration: videoData.duration || 0,
        thumbnail: videoData.thumbnail || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      return { 
        data: { 
          id: docRef.id, 
          ...videoData, 
          videoUrl: downloadURL,
          fileName: file.name 
        }, 
        error: null 
      };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getVideo(videoId) {
    try {
      const docRef = doc(db, 'videos', videoId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { data: { id: docSnap.id, ...docSnap.data() }, error: null };
      }
      return { data: null, error: 'Video not found' };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getAllVideos(filters = {}, sortOptions = {}) {
    try {
      let q = collection(db, 'videos');
      
      // Apply filters
      if (filters.category) {
        q = query(q, where('category', '==', filters.category));
      }
      if (filters.duration) {
        q = query(q, where('duration', '<=', filters.duration));
      }
      
      // Apply sorting
      if (sortOptions.field) {
        q = query(q, orderBy(sortOptions.field, sortOptions.direction || 'asc'));
      }
      
      const querySnapshot = await getDocs(q);
      const videos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { data: videos, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateVideo(videoId, updateData, newFile = null) {
    try {
      let videoUrl = updateData.videoUrl;
      
      // If there's a new file, upload it and get the new URL
      if (newFile) {
        const storageRef = ref(storage, `videos/${newFile.name}`);
        await uploadBytes(storageRef, newFile);
        videoUrl = await getDownloadURL(storageRef);

        // Delete the old file if it exists
        if (updateData.fileName) {
          const oldFileRef = ref(storage, `videos/${updateData.fileName}`);
          await deleteObject(oldFileRef).catch(error => console.log('Old file not found:', error));
        }
      }

      const docRef = doc(db, 'videos', videoId);
      const updatedData = {
        ...updateData,
        videoUrl,
        fileName: newFile ? newFile.name : updateData.fileName,
        fileType: newFile ? newFile.type : updateData.fileType,
        fileSize: newFile ? newFile.size : updateData.fileSize,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(docRef, updatedData);
      return { data: { id: videoId, ...updatedData }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async deleteVideo(videoId, fileName) {
    try {
      // Delete the file from storage
      const storageRef = ref(storage, `videos/${fileName}`);
      await deleteObject(storageRef);

      // Delete the video record from Firestore
      await deleteDoc(doc(db, 'videos', videoId));
      return { data: { id: videoId }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateThumbnail(videoId, thumbnailFile) {
    try {
      const storageRef = ref(storage, `videos/thumbnails/${videoId}_${thumbnailFile.name}`);
      await uploadBytes(storageRef, thumbnailFile);
      const thumbnailUrl = await getDownloadURL(storageRef);

      const docRef = doc(db, 'videos', videoId);
      await updateDoc(docRef, {
        thumbnail: thumbnailUrl,
        updatedAt: new Date().toISOString()
      });

      return { data: { thumbnailUrl }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};