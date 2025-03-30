// UserProfile.js
import { useAuth } from '../../contexts/AuthContext';

export default function UserProfile() {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
          <span className="text-xl font-bold text-indigo-600">
            {user?.email?.[0].toUpperCase()}
          </span>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Welcome back!</h2>
          <p className="text-gray-600">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}
