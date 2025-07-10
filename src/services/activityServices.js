import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export const logUserActivity = async (userId, type, description) => {
  try {
    await addDoc(collection(db, 'user_activities'), {
      userId,
      type,
      description,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error logging user activity:', error);
  }
};
