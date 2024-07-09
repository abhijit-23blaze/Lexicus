import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const Profile = () => {
  const [username, setUsername] = useState('');
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/signin';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const fetchUsername = async () => {
      if (user) {
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data().username);
        }
      }
    };
    fetchUsername();
  }, [user]);

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
        <p className="mb-4"><strong>Username:</strong> {username}</p>
        <p className="mb-4"><strong>Name:</strong> {user.displayName}</p>
        <p className="mb-4"><strong>Email:</strong> {user.email}</p>
        {user.photoURL && (
          <img src={user.photoURL} alt="Profile" className="w-32 h-32 rounded-full mb-4" />
        )}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Profile;
