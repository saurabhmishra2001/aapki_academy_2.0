import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Alert } from '../../components/ui/alert';

export default function TotalUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '' });

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
      await userService.createUser(newUser);
      setNewUser({ name: '', email: '' });
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Failed to create user. Please try again.');
    }
  };

  const handleUpdateUser = async (userId, updatedData) => {
    try {
      await userService.updateUser(userId, updatedData);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user. Please try again.');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await userService.deleteUser(userId);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Total Users</h1>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <Input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <Button onClick={handleCreateUser}>Add User</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle>{user.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Email: {user.email}</p>
              <Button onClick={() => handleUpdateUser(user.id, { name: 'Updated Name' })}>Update</Button>
              <Button variant="destructive" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 