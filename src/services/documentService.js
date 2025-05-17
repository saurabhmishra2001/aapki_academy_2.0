import { db, storage } from '../utils/firebaseConfig';
import { collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export const documentService = {
  async createDocument(documentData, file) {
    try {
      // First upload the file to storage
      const storageRef = ref(storage, `documents/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Then create the document record in Firestore
      const docRef = await addDoc(collection(db, 'documents'), {
        ...documentData,
        fileUrl: downloadURL,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      return { 
        data: { 
          id: docRef.id, 
          ...documentData, 
          fileUrl: downloadURL,
          fileName: file.name 
        }, 
        error: null 
      };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getDocument(documentId) {
    try {
      const docRef = doc(db, 'documents', documentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { data: { id: docSnap.id, ...docSnap.data() }, error: null };
      }
      return { data: null, error: 'Document not found' };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getAllDocuments(filters = {}, sortOptions = {}) {
    try {
      let q = collection(db, 'documents');
      
      // Apply filters
      if (filters.category) {
        q = query(q, where('category', '==', filters.category));
      }
      if (filters.type) {
        q = query(q, where('fileType', '==', filters.type));
      }
      
      // Apply sorting
      if (sortOptions.field) {
        q = query(q, orderBy(sortOptions.field, sortOptions.direction || 'asc'));
      }
      
      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { data: documents, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateDocument(documentId, updateData, newFile = null) {
    try {
      let fileUrl = updateData.fileUrl;
      
      // If there's a new file, upload it and get the new URL
      if (newFile) {
        const storageRef = ref(storage, `documents/${newFile.name}`);
        await uploadBytes(storageRef, newFile);
        fileUrl = await getDownloadURL(storageRef);

        // Delete the old file if it exists
        if (updateData.fileName) {
          const oldFileRef = ref(storage, `documents/${updateData.fileName}`);
          await deleteObject(oldFileRef).catch(error => console.log('Old file not found:', error));
        }
      }

      const docRef = doc(db, 'documents', documentId);
      const updatedData = {
        ...updateData,
        fileUrl,
        fileName: newFile ? newFile.name : updateData.fileName,
        fileType: newFile ? newFile.type : updateData.fileType,
        fileSize: newFile ? newFile.size : updateData.fileSize,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(docRef, updatedData);
      return { data: { id: documentId, ...updatedData }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async deleteDocument(documentId, fileName) {
    try {
      // Delete the file from storage
      const storageRef = ref(storage, `documents/${fileName}`);
      await deleteObject(storageRef);

      // Delete the document record from Firestore
      await deleteDoc(doc(db, 'documents', documentId));
      return { data: { id: documentId }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};