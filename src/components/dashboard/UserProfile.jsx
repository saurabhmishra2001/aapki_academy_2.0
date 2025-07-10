import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import {
  doc, getDoc, updateDoc, serverTimestamp,
  collection, query, where, orderBy, getDocs
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function UserProfile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({});
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [localImage, setLocalImage] = useState('');
  const [testAttempts, setTestAttempts] = useState([]);
  const [loadingTests, setLoadingTests] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      fetchUserProfile();
      fetchUserAttempts();

      const storedImage = localStorage.getItem(`profilePic-${user.uid}`);
      if (storedImage) setLocalImage(storedImage);
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        const baseInfo = {
          email: user.email,
          fullName: data.fullName || user.displayName || '',
          createdAt: user.metadata?.creationTime || '',
          phone: data.phone || ''
        };
        setProfileData(baseInfo);
        setFormData(baseInfo);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  const fetchUserAttempts = async () => {
    try {
      const q = query(
        collection(db, 'user_test_attempts'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      const attempts = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTestAttempts(attempts);
    } catch (err) {
      console.error('Failed to load test history:', err);
    } finally {
      setLoadingTests(false);
    }
  };

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      localStorage.setItem(`profilePic-${user.uid}`, base64);
      setLocalImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async () => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        fullName: formData.fullName,
        phone: formData.phone || '',
        updatedAt: serverTimestamp()
      });

      setProfileData(formData);
      setEditMode(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile');
    }
  };

  const chartData = testAttempts.map((attempt, index) => ({
    name: `Test ${index + 1}`,
    score: attempt.score
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Your Profile</h2>
        <button
          onClick={() => setEditMode(!editMode)}
          className="text-sm text-indigo-600 hover:underline"
        >
          {editMode ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div className="flex items-center gap-4">
        <img
          src={localImage || '/default-avatar.png'}
          alt="Profile"
          className="h-16 w-16 rounded-full object-cover"
        />
        {editMode && (
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Full Name</label>
        {editMode ? (
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="mt-1 border p-2 w-full rounded"
          />
        ) : (
          <p className="text-gray-800">{profileData.fullName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <p className="text-gray-800">{profileData.email}</p>
      </div>

      <div>
        <label className="block text-sm font-medium">Phone</label>
        {editMode ? (
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 border p-2 w-full rounded"
          />
        ) : (
          <p className="text-gray-800">{profileData.phone || 'Not Provided'}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Account Created On</label>
        <p className="text-gray-600">
          {new Date(profileData.createdAt).toLocaleString() || 'N/A'}
        </p>
      </div>

      {editMode && (
        <button
          onClick={handleUpdateProfile}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Save Changes
        </button>
      )}

      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-3">Your Test Performance</h3>
        {loadingTests ? (
          <p className="text-gray-500">Loading chart...</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#4F46E5" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
