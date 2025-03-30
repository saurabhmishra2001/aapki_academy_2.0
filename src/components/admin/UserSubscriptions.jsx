import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Button } from '../ui/button';
import { Alert } from '../ui/alert';

export default function UserSubscriptions() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGrantAccess = async (userId) => {
    try {
      await adminService.grantPaidAccess(userId);
      await loadUsers(); // Reload the list
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRevokeAccess = async (userId) => {
    try {
      await adminService.revokePaidAccess(userId);
      await loadUsers(); // Reload the list
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">User Subscriptions</h2>

      {error && <Alert variant="destructive">{error}</Alert>}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valid Until</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.has_paid_access ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.has_paid_access ? 'Paid' : 'Free'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.subscription_end ? new Date(user.subscription_end).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {user.has_paid_access ? (
                    <Button
                      variant="outline"
                      onClick={() => handleRevokeAccess(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Revoke Access
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => handleGrantAccess(user.id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Grant Access
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}