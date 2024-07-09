import React, { useState } from 'react';
import { auth, firestore } from '../firebase';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const ProfileSetup = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleProfileSetup = async () => {
    const user = auth.currentUser;
    if (!user) {
      setError('No user is signed in.');
      return;
    }

    try {
      // Update the user's profile
      await updateProfile(user, { displayName: username });
      
      // Save the username to Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        username,
        email: user.email,
        displayName: user.displayName,
      });

      window.location.href = '/profile';
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error updating profile.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Set Up Profile</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          onClick={handleProfileSetup}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ProfileSetup;
