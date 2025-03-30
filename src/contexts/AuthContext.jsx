import { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  PhoneAuthProvider,
  signInWithPhoneNumber,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebaseConfig";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);

  // Function to fetch user details from Firestore
  const fetchUserDetails = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({ ...auth.currentUser, ...userData });
        setIsAdmin(userData.role === "admin");
        setIsActive(userData.isActive || false);
      } else {
        setUser(null);
        setIsAdmin(false);
        setIsActive(false);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // Handle Firebase authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await fetchUserDetails(currentUser.uid);
      } else {
        setUser(null);
        setIsAdmin(false);
        setIsActive(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Check if user is admin
  const checkIsAdmin = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      return userDoc.exists() && userDoc.data().role === "admin";
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  };

  // User Signup
  const signup = async ({ email, password, name }) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      // Store user in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role: "user",
        isActive: true, // Default active status
        created_at: new Date(),
        updated_at: new Date(),
      });

      return { user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  };

  // User Login
  const login = async (email, password) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      await fetchUserDetails(user.uid);

      if (!isActive) {
        await signOut(auth);
        return { user: null, error: new Error("Account is not active. Please contact support.") };
      }

      return { user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  };

  // Google Login
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);

      // Check if user document exists
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          role: "user",
          isActive: true,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }

      await fetchUserDetails(user.uid);
      return { user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  };

  // Phone Authentication
  const loginWithPhone = async (phoneNumber) => {
    try {
      const provider = new PhoneAuthProvider(auth);
      const verificationId = await signInWithPhoneNumber(auth, phoneNumber);
      return { verificationId, error: null };
    } catch (error) {
      return { verificationId: null, error };
    }
  };

  // OTP Verification
  const verifyOTP = async (verificationId, code) => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      const { user } = await signInWithPhoneNumber(auth, credential);
      await fetchUserDetails(user.uid);
      return { user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAdmin(false);
      setIsActive(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Context Value
  const value = {
    user,
    isAdmin,
    isActive,
    loading,
    signup,
    login,
    loginWithGoogle,
    loginWithPhone,
    verifyOTP,
    logout,
    checkIsAdmin,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

// Custom Hook for Auth
export function useAuth() {
  return useContext(AuthContext);
}
