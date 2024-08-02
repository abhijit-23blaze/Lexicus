// components/ProfileSetup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';

const ProfileSetup = () => {
  const [authorName, setAuthorName] = useState('');
  const [genre, setGenre] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (user) {
      await db.collection('users').doc(user.uid).set({
        authorName,
        genre,
        email: user.email,
      });

      navigate('/');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl mb-4">Set up your profile</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Author Name</label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full px-4 py-2 mt-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Preferred Genre</label>
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full px-4 py-2 mt-2 border rounded-lg"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg">
          Save
        </button>
      </form>
    </div>
  );
};

export default ProfileSetup;
