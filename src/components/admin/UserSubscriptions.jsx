import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Button } from '../common/Button';
import { Alert } from '../ui/alert';
import { PageHeader } from '../common/PageHeader';

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
      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRevokeAccess = async (userId) => {
    try {
      await adminService.revokePaidAccess(userId);
      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-4">Loading users...</div>;

  return (
    <div className="p-4 space-y-6">
      <PageHeader title="User Subscriptions" />

      {error && <Alert variant="destructive">{error}</Alert>}

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Until</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.has_paid_access ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {user.has_paid_access ? 'Paid' : 'Free'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.subscription_end ? new Date(user.subscription_end).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {user.has_paid_access ? (
                      <Button
                        variant="destructive"
                        onClick={() => handleRevokeAccess(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Revoke
                      </Button>
                    ) : (
                      <Button
                        variant="success"
                        onClick={() => handleGrantAccess(user.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Grant
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}