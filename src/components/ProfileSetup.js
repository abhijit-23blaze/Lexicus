// components/ProfileSetup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore, auth } from '../firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

const ProfileSetup = () => {
  const [authorName, setAuthorName] = useState('');
  const [genre, setGenre] = useState('');
  const [bio, setBio] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (user) {
      await setDoc(doc(collection(firestore, 'profiles'), user.uid), {
        authorName,
        genre: genre.split(',').map((g) => g.trim()).join(', '), // Store genres as comma-separated string
        bio,
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
          <label className="block text-gray-700">Preferred Genres (separate by commas)</label>
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full px-4 py-2 mt-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Bio</label>
          <textarea
            rows="4"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
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
