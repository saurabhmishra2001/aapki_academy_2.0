import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { Button } from '../../components/ui/button';
import { InputField } from '../../components/common/InputField';
import { MainLayout } from '../../components/layout/MainLayout';
import { Pencil, Trash, Eye } from 'lucide-react';

export default function TotalUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({ displayName: '', email: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      // Basic validation
      if (!newUser.displayName || !newUser.email) {
        setError('Please fill in all fields.');
        return;
      }
      await userService.registerUserByAdmin(newUser); // Assuming you have a registerUserByAdmin function
      setNewUser({ displayName: '', email: '' });
      setShowCreateForm(false);
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error.message || 'Failed to create user. Please try again.');
    }
  };

  const handleUpdateUser = async (userId, updatedData) => { // Placeholder for update action
    try {
      await userService.updateUser(userId, updatedData);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user. Please try again.');
    }
  };

  const handleDeleteUser = async (userId) => { // Placeholder for delete action
    try {
      await userService.deleteUser(userId);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user. Please try again.');
    }
  };

  return (
    <MainLayout>
      <div className="px-4 py-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Manage Users</h1>
        <div className="mb-4 flex justify-between items-center">
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? 'Hide Form' : 'Create New User'}
          </Button>
        </div>

        {showCreateForm && (
          <div className="mb-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Create User</h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Display Name"
                type="text"
                placeholder="Enter display name"
                value={newUser.displayName}
                onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })}
                required
              />
              <InputField
                label="Email"
                type="email"
                placeholder="Enter email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
              />
            </div>
            <div className="mt-4">
              <Button onClick={handleCreateUser} disabled={loading}>
                {loading ? 'Creating...' : 'Create User'}
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading users...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.displayName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          // Handle view action here
                          console.log(`View user ${user.id}`);
                        }}
                        className="mr-2"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Handle edit action here
                          handleUpdateUser(user.id, { name: 'Updated Name' }); // Example update
                          console.log(`Edit user ${user.id}`);
                        }}
                        className="mr-2"
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          // Handle delete action here
                          handleDeleteUser(user.id);
                          console.log(`Delete user ${user.id}`);
                        }}
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
}