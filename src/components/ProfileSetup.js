import React, { useState } from 'react';
import { auth } from '../firebase'; // Adjust the import path

const ProfileSetup = () => {
  const [username, setUsername] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleProfileSetup = async () => {
    try {
      await auth.currentUser.updateProfile({
        displayName: username,
      });
      // Redirect to home page or another relevant page after setup
      window.location.href = '/';
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
      <div className="bg-white text-black p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-center">Profile Setup</h1>
        <input
          type="text"
          className="w-full py-2 px-4 mb-4 bg-purple-100 rounded-full text-sm"
          placeholder="Enter your username"
          value={username}
          onChange={handleUsernameChange}
        />
        <button
          className="bg-red-500 text-white px-6 py-3 rounded-lg shadow hover:bg-red-600 transition duration-300"
          onClick={handleProfileSetup}
        >
          Set Username
        </button>
      </div>
    </div>
  );
};

export default ProfileSetup;
