import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signInWithPopup,
    signOut,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../utils/firebaseConfig';

const googleProvider = new GoogleAuthProvider();

// Admin verification function (reusable)
export const verifyAdmin = async (uid) => {
    if (!uid) return false;
    try {
        const userDoc = await getDoc(doc(db, "users", uid));
        return userDoc.exists() && userDoc.data().role === 'admin';
    } catch (error) {
        console.error("Admin verification error:", error);
        return false;
    }
};

// User Profile Management
export const createUserProfile = async (user, additionalData = {}) => {
    try {
        if (!user?.uid) throw new Error('No user UID available');
        
        const userRef = doc(db, 'users', user.uid);
        const snapshot = await getDoc(userRef);

        const baseData = {
            email: user.email,
            displayName: additionalData.displayName || user.displayName || '',
            photoURL: user.photoURL || '',
            lastLogin: new Date(),
            ...additionalData
        };

        if (!snapshot.exists()) {
            await setDoc(userRef, {
                ...baseData,
                uid: user.uid,
                createdAt: new Date(),
                // Default role for new users
                role: additionalData.role || 'user' 
            });
        } else {
            await setDoc(userRef, baseData, { merge: true });
        }
        
        return { success: true, error: null, isAdmin: await verifyAdmin(user.uid) };
    } catch (error) {
        console.error("Error handling user profile:", error);
        return { success: false, error };
    }
};

// Enhanced authentication methods with admin verification
export const loginWithEmail = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const profileResult = await createUserProfile(userCredential.user);
        return { 
            user: userCredential.user, 
            isAdmin: profileResult.isAdmin,
            error: null 
        };
    } catch (error) {
        return { user: null, isAdmin: false, error };
    }
};

export const signupWithEmail = async (email, password, additionalData = {}) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const profileResult = await createUserProfile(userCredential.user, additionalData);
        return { 
            user: userCredential.user, 
            isAdmin: profileResult.isAdmin,
            error: null 
        };
    } catch (error) {
        return { user: null, isAdmin: false, error };
    }
};

export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
        
        const profileResult = await createUserProfile(result.user, {
            displayName: result.user.displayName,
            isGoogleSignIn: true,
            role: isNewUser ? 'user' : undefined // Maintain existing role for returning users
        });
        
        return { 
            user: result.user, 
            isAdmin: profileResult.isAdmin,
            error: null 
        };
    } catch (error) {
        return { user: null, isAdmin: false, error };
    }
};

// Admin-specific functions
export const createAdminUser = async (email, password) => {
    try {
        const { user, error } = await signupWithEmail(email, password, { role: 'admin' });
        if (error) throw error;
        return { user, error: null };
    } catch (error) {
        return { user: null, error };
    }
};

export const elevateToAdmin = async (userId) => {
    try {
        await setDoc(doc(db, "users", userId), { role: 'admin' }, { merge: true });
        return { success: true, error: null };
    } catch (error) {
        return { success: false, error };
    }
};

// Existing functions with admin awareness
export const getCurrentUser = async () => {
    const user = await new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        });
    });
    
    if (user) {
        const isAdmin = await verifyAdmin(user.uid);
        return { user, isAdmin };
    }
    return { user: null, isAdmin: false };
};

export const onAuthChanged = (callback) => {
    return onAuthStateChanged(auth, async (user) => {
        if (user) {
            const profileResult = await createUserProfile(user);
            callback({ 
                user, 
                isAdmin: profileResult.isAdmin 
            });
        } else {
            callback({ user: null, isAdmin: false });
        }
    });
};

// Password Reset and Logout (unchanged)
export const sendPasswordReset = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return { error: null };
    } catch (error) {
        return { error };
    }
};

export const logout = async () => {
    try {
        await signOut(auth);
        return { error: null };
    } catch (error) {
        return { error };
    }
};