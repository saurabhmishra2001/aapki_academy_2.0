import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from '../hooks/useToast';
import { userDetailsService } from '../services/userDetailsService';
import { useAuth } from '../contexts/AuthContext';

export default function UserDetailsForm({ onFormSubmit }) {
  const { user } = useAuth();
  const [userDetails, setUserDetails] = useState({ name: '', email: user.email, paymentstatus: '', mobile: '' });
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const data = await userDetailsService.getUserDetails(user.id);
        if (data) setUserDetails(data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [user.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userDetailsData = {
        user_id: user.id,
        name: userDetails.name,
        email: userDetails.email,
        paymentstatus: userDetails.paymentstatus,
        mobile: userDetails.mobile,
      };


      if (userDetails.id) {
        await userDetailsService.updateUserDetails(user.id, userDetailsData);
      } else {
        await userDetailsService.createUserDetails(userDetailsData);
      }
      toast({
        title: 'Details Updated',
        description: 'Your details have been updated successfully.',
        type: 'success',
      });
      onFormSubmit();
    } catch (error) {
      console.error('Error updating user details:', error);
      toast({
        title: 'Error',
        description: 'Failed to update details. Please try again.',
        type: 'error',
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">User Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Name"
          value={userDetails.name}
          onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={userDetails.email}
          onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
          required
          readOnly
        />
        <Input
          type="text"
          placeholder="Payment Status"
          value={userDetails.paymentstatus}
          onChange={(e) => setUserDetails({ ...userDetails, paymentstatus: e.target.value })}
          required
        />
        <Input
          type="text"
          placeholder="Mobile Number"
          value={userDetails.mobile}
          onChange={(e) => setUserDetails({ ...userDetails, mobile: e.target.value })}
          required
        />
        <Button type="submit">Update Details</Button>
      </form>
    </div>
  );
}