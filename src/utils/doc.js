// src/utils/initializeFirestore.js
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const initializeDocumentsCollection = async () => {
  const colRef = collection(db, 'documents');

  try {
    const snapshot = await getDocs(colRef);

    if (snapshot.empty) {
      // Collection doesn't exist or is empty; create a placeholder
      const docRef = await addDoc(colRef, {
        title: 'System Initialization Document',
        subject: 'System',
        description: 'This document ensures the documents collection exists.',
        fileUrl: '',
        fileName: '',
        fileType: '',
        fileSize: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log('Initialized documents collection with ID:', docRef.id);
      
      // Optionally delete the placeholder after creation
      // setTimeout(() => deleteDoc(doc(db, 'documents', docRef.id)), 2000);
    }
  } catch (error) {
    console.error('Error initializing documents collection:', error);
  }
};