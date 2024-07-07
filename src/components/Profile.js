import React from 'react';
import { auth } from '../firebase';

const Profile = () => {
  const user = auth.currentUser;

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
        <p className="mb-4"><strong>Name:</strong> {user.displayName}</p>
        <p className="mb-4"><strong>Email:</strong> {user.email}</p>
        <img src={user.photoURL} alt="Profile" className="w-32 h-32 rounded-full mb-4" />
      </div>
    </div>
  );
};

export default Profile;
