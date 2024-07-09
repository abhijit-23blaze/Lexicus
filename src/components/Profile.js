// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const user = auth.currentUser;

  useEffect(() => {
    const fetchUsername = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(firestore, 'users', user.uid));
          if (userDoc.exists()) {
            setUsername(userDoc.data().username);
          }
        } catch (error) {
          console.error('Error fetching username:', error);
          setError('Error fetching username.');
        }
      }
    };

    fetchUsername();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/signin';
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Error signing out.');
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl mb-4">You are not logged in</h1>
        <a href="/signin" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Sign In
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        {error && <p className="text-red-500">{error}</p>}
        <p className="mb-4"><strong>Name:</strong> {user.displayName}</p>
        <p className="mb-4"><strong>Email:</strong> {user.email}</p>
        <p className="mb-4"><strong>Username:</strong> {username}</p>
        <img src={user.photoURL} alt="Profile" className="w-32 h-32 rounded-full mb-4" />
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
