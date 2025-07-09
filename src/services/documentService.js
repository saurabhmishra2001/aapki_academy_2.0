import { db, storage } from '../utils/firebaseConfig';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';

export const documentService = {
  async createDocument(documentData, file) {
    try {
      const storageRef = ref(storage, `documents/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

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

      if (filters.category) {
        q = query(q, where('category', '==', filters.category));
      }
      if (filters.type) {
        q = query(q, where('fileType', '==', filters.type));
      }

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
      let fileName = updateData.fileName;
      let fileType = updateData.fileType;
      let fileSize = updateData.fileSize;

      if (newFile) {
        const newStorageRef = ref(storage, `documents/${newFile.name}`);
        await uploadBytes(newStorageRef, newFile);
        fileUrl = await getDownloadURL(newStorageRef);
        fileName = newFile.name;
        fileType = newFile.type;
        fileSize = newFile.size;

        if (updateData.fileName) {
          const oldFileRef = ref(storage, `documents/${updateData.fileName}`);
          await deleteObject(oldFileRef).catch(err => console.log('Old file not found:', err));
        }
      }

      const docRef = doc(db, 'documents', documentId);
      const updatedData = {
        ...updateData,
        fileUrl,
        fileName,
        fileType,
        fileSize,
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
      const storageRef = ref(storage, `documents/${fileName}`);
      await deleteObject(storageRef);

      await deleteDoc(doc(db, 'documents', documentId));
      return { data: { id: documentId }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};
